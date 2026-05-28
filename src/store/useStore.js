import { create } from 'zustand'

const useStore = create((set, get) => ({
  config: { widgets: [] },
  appContext: 'normal',
  activeMenu: 'gallery',
  editingId: null,
  storeWidgets: [],
  loadingStore: false,

  setConfig: (newConfig) => {
    set({ config: newConfig })
    if (window.electronAPI) window.electronAPI.saveConfig(newConfig)
  },

  setAppContext: (ctx) => set({ appContext: ctx }),
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  setEditingId: (id) => set({ editingId: id }),
  setStoreWidgets: (widgets) => set({ storeWidgets: widgets }),
  setLoadingStore: (loading) => set({ loadingStore: loading }),

  // Widget Actions
  addWidget: (type, defaultSettings) => {
    const { config, setConfig, setActiveMenu } = get()
    const newConfig = { ...config }
    
    const snap = 20
    const x = Math.round((window.innerWidth / 2 - 100) / snap) * snap
    const y = Math.round((window.innerHeight / 2 - 100) / snap) * snap

    newConfig.widgets.push({
      id: `w_${Date.now()}`,
      type,
      position: { x, y },
      settings: defaultSettings
    })
    
    setConfig(newConfig)
    setActiveMenu('active')
  },

  removeWidget: (id) => {
    const { config, setConfig } = get()
    const newConfig = { ...config }
    newConfig.widgets = newConfig.widgets.filter(w => w.id !== id)
    setConfig(newConfig)
  },

  updateWidgetPosition: (id, x, y) => {
    const { config, setConfig } = get()
    const newConfig = { ...config }
    const widget = newConfig.widgets.find(w => w.id === id)
    if (widget) {
      widget.position = { x, y }
      setConfig(newConfig)
    }
  },

  updateWidgetSettings: (id, newSettings) => {
    const { config, setConfig } = get()
    const newConfig = { ...config }
    const widget = newConfig.widgets.find(w => w.id === id)
    if (widget) {
      widget.settings = { ...widget.settings, ...newSettings }
      setConfig(newConfig)
    }
  },

  applyGlobalTheme: (theme, globalAccent = null) => {
    const { config, setConfig } = get()
    const newConfig = { ...config, theme }
    
    newConfig.widgets = newConfig.widgets.map(w => {
      let wSet = { ...w.settings }
      // Dashboard'daki eski tema mantığı buraya entegre edildi
      if (theme === 'glass') { wSet.bgOpacity = 10; wSet.blur = 16; wSet.borderColor = 'rgba(255,255,255,0.1)'; }
      if (theme === 'dark') { wSet.bgOpacity = 60; wSet.blur = 24; wSet.borderColor = 'rgba(0,0,0,0.5)'; }
      if (theme === 'cyberpunk') { wSet.bgOpacity = 20; wSet.blur = 4; wSet.borderColor = '#eab308'; wSet.color = 'purple'; wSet.opacity = 0.9; wSet.radius = 0; wSet.borderWidth = 2; wSet.fontFamily = 'monospace'; }
      if (theme === 'neon') { wSet.bgOpacity = 40; wSet.blur = 30; wSet.borderColor = '#a855f7'; }
      if (theme === 'os') { 
        wSet.bgOpacity = 30; wSet.blur = 20; 
        if (globalAccent) {
           wSet.borderColor = globalAccent;
           wSet.textColor = globalAccent;
        } else {
           wSet.borderColor = 'rgba(255,255,255,0.3)';
        }
      }
      if (theme === 'minimalist') { wSet.color = 'white'; wSet.blur = 40; wSet.opacity = 0.1; wSet.radius = 32; wSet.borderWidth = 0; wSet.fontFamily = 'sans-serif'; }
      if (theme === 'darkmode') { wSet.color = 'white'; wSet.blur = 10; wSet.opacity = 0.8; wSet.radius = 16; wSet.borderWidth = 1; wSet.fontFamily = 'inherit'; }
      if (theme === 'sunset') { wSet.color = 'white'; wSet.blur = 24; wSet.opacity = 0.5; wSet.radius = 24; wSet.bgColorHex = '#ff7b00'; }
      if (theme === 'ocean') { wSet.color = 'white'; wSet.blur = 32; wSet.opacity = 0.4; wSet.radius = 40; wSet.bgColorHex = '#00aeff'; }
      if (theme === 'aurora') { wSet.color = 'white'; wSet.blur = 20; wSet.opacity = 0.3; wSet.radius = 32; wSet.bgColorHex = '#00ff88'; wSet.animatedGradient = true; }
      
      return { ...w, settings: wSet }
    })
    
    setConfig(newConfig)
  }
}))

export default useStore
