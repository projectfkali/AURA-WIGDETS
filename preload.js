const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getSysStats: () => ipcRenderer.invoke('get-sys-stats'),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('set-ignore-mouse-events', ignore),
  onConfigUpdated: (callback) => {
    const listener = (event, config) => callback(config);
    ipcRenderer.on('config-updated', listener);
    return () => ipcRenderer.removeListener('config-updated', listener);
  },
  mediaControl: (action) => ipcRenderer.invoke('media-control', action),
  getMediaInfo: () => ipcRenderer.invoke('get-media-info'),
  getWindowsAccent: () => ipcRenderer.invoke('get-windows-accent'),
  onExposeToggled: (callback) => {
    const listener = (event, isExposed) => callback(isExposed);
    ipcRenderer.on('expose-toggled', listener);
    return () => ipcRenderer.removeListener('expose-toggled', listener);
  }
});
