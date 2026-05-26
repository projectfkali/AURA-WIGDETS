import { app, BrowserWindow, screen, ipcMain, Tray, Menu, globalShortcut, nativeImage, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let widgetWindow = null;
let dashboardWindow = null;
let tray = null;

const configPath = path.join(__dirname, 'config.json');

// Yardımcı Fonksiyonlar
function getConfig() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return { widgets: [] };
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  // Güncellemeyi Widget Penceresine anında bildir (Real-time sync)
  if (widgetWindow && !widgetWindow.isDestroyed()) {
    widgetWindow.webContents.send('config-updated', config);
  }
  // Dashboard penceresini de güncelle
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('config-updated', config);
  }
}

function createWidgetWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  widgetWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    type: 'desktop', // Windows masaüstü seviyesinde kalması için
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  widgetWindow.setIgnoreMouseEvents(true, { forward: true });

  // Vite dev server varsa ona git, yoksa build dosyasına
  const devUrl = 'http://localhost:5173/#/';
  const prodUrl = `file://${path.join(__dirname, 'dist', 'index.html')}#/`;
  
  if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
      widgetWindow.loadURL(prodUrl); // Production build kullanılacak bu testte
  } else {
      widgetWindow.loadURL(prodUrl);
  }
  // Biz npm run start ile vite build && electron . çalıştıracağımız için prod url garanti olacak.
  widgetWindow.loadURL(prodUrl);
}

function createDashboardWindow() {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.show();
    dashboardWindow.focus();
    return;
  }

  dashboardWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Widget Engine Dashboard',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const prodUrl = `file://${path.join(__dirname, 'dist', 'index.html')}#/dashboard`;
  dashboardWindow.loadURL(prodUrl);

  dashboardWindow.on('closed', () => {
    dashboardWindow = null;
  });
}

function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Ayarlar (Dashboard)', click: createDashboardWindow },
    { type: 'separator' },
    { label: 'Çıkış', click: () => {
        app.isQuiting = true;
        app.quit();
      } 
    }
  ]);
  
  tray.setToolTip('Widget Engine');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', createDashboardWindow);
}

app.whenReady().then(() => {
  createWidgetWindow();
  createDashboardWindow();
  createTray();
  
  let isExposed = false;
  globalShortcut.register('CommandOrControl+Space', () => {
    if (widgetWindow && !widgetWindow.isDestroyed()) {
      isExposed = !isExposed;
      widgetWindow.setAlwaysOnTop(isExposed, 'screen-saver');
      if (isExposed) {
        widgetWindow.focus();
      }
      widgetWindow.webContents.send('expose-toggled', isExposed);
    }
  });

  let currentContext = 'normal';
  
  setInterval(() => {
    const psScript = path.join(__dirname, 'get-active-window.ps1');
    exec(`powershell -ExecutionPolicy Bypass -NoProfile -File "${psScript}"`, (error, stdout) => {
      if (error) return;
      try {
        const info = JSON.parse(stdout);
        const processName = info.ProcessName.toLowerCase();
        const title = info.Title.toLowerCase();
        
        let newContext = 'normal';
        
        const games = ['valorant', 'league of legends', 'csgo', 'dota2', 'steam', 'epicgameslauncher', 'cyberpunk', 'eldenring'];
        const devTools = ['code', 'devenv', 'idea64', 'windowsterminal', 'powershell', 'cmd', 'postman'];
        
        if (games.some(g => processName.includes(g) || title.includes(g))) {
          newContext = 'gaming';
        } else if (devTools.some(d => processName.includes(d) || title.includes(d))) {
          newContext = 'developer';
        }

        if (newContext !== currentContext) {
          currentContext = newContext;
          if (widgetWindow && !widgetWindow.isDestroyed()) {
             widgetWindow.webContents.send('context-changed', currentContext);
          }
        }
      } catch (e) {}
    });
  }, 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWidgetWindow();
  });
});

// Dashboard kapatılsa bile app arka planda kalsın
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Sadece widget penceresi de kapanırsa quit et, normalde widget hep açık kalır.
  }
});

// --- IPC HANDLERS ---
ipcMain.handle('get-config', () => getConfig());

ipcMain.handle('save-config', (event, config) => {
  saveConfig(config);
  return true;
});

ipcMain.handle('media-control', (event, action) => {
  const scriptPath = path.join(__dirname, 'media-keys.ps1');
  exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}" -action ${action}`);
  return true;
});

ipcMain.handle('get-media-info', async () => {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, 'get-media-info.ps1');
    exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout) => {
      try {
        if (stdout) {
           const json = JSON.parse(stdout.trim());
           resolve(json);
        } else resolve(null);
      } catch(e) { resolve(null); }
    });
  });
});

ipcMain.handle('get-windows-accent', async () => {
  return new Promise((resolve) => {
    exec('powershell -Command "(Get-ItemProperty -Path HKCU:\\SOFTWARE\\Microsoft\\Windows\\DWM).ColorizationColor"', (error, stdout) => {
      if (error || !stdout) return resolve(null);
      const dec = parseInt(stdout.trim(), 10);
      if (isNaN(dec)) return resolve(null);
      // Convert ABGR to RGB Hex
      let hex = (dec & 0x00FFFFFF).toString(16).padStart(6, '0');
      resolve('#' + hex);
    });
  });
});

ipcMain.on('set-ignore-mouse-events', (event, ignore) => {
  if (widgetWindow && !widgetWindow.isDestroyed()) {
    if (ignore) {
      widgetWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      widgetWindow.setIgnoreMouseEvents(false);
    }
  }
});

ipcMain.handle('get-sys-stats', () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsage = ((usedMem / totalMem) * 100).toFixed(1);
  
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  cpus.forEach(core => {
    for (const type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });
  
  const uptime = os.uptime();
  const netInterfaces = os.networkInterfaces();
  let activeNet = false;
  // Basitçe aktif bir bağlantı olup olmadığını kontrol et
  for (const name of Object.keys(netInterfaces)) {
    for (const net of netInterfaces[name]) {
      if (!net.internal && net.mac !== '00:00:00:00:00:00') {
        activeNet = true;
        break;
      }
    }
  }

  return {
    memUsage,
    usedMem: (usedMem / 1024 / 1024 / 1024).toFixed(2),
    totalMem: (totalMem / 1024 / 1024 / 1024).toFixed(2),
    cpuIdle: idle,
    cpuTotal: total,
    uptime,
    activeNet,
    cpuModel: cpus[0].model.replace('(R)', '').replace('(TM)', '').trim()
  };
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});
