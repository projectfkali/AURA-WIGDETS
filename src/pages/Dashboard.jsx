import { useEffect, useState, useRef } from 'react'

const colorMap = {
  white: 'bg-white text-white',
  blue: 'bg-blue-400 text-blue-400',
  green: 'bg-green-400 text-green-400',
  purple: 'bg-purple-400 text-purple-400',
  red: 'bg-red-400 text-red-400'
}

export default function Dashboard() {
  const [config, setConfig] = useState({ widgets: [] })
  const [activeMenu, setActiveMenu] = useState('gallery') // 'gallery', 'active', 'themes', 'settings'
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState('basic')
  const fileInputRef = useRef(null)
  
  useEffect(() => {
    document.body.className = 'bg-[#0a0a0a] text-white antialiased'
    if (window.electronAPI) {
      window.electronAPI.getConfig().then(setConfig)
      const cleanup = window.electronAPI.onConfigUpdated(setConfig)
      return cleanup
    }
  }, [])

  const saveConfig = (newConfig) => {
    setConfig(newConfig)
    if (window.electronAPI) window.electronAPI.saveConfig(newConfig)
  }

  const addWidget = (type) => {
    const newConfig = { ...config }
    const defaultSettings = { scale: 1.0, opacity: 0.4, blur: 24, radius: 32, borderWidth: 1, fontFamily: 'inherit', color: 'white' }
    
    if (type === 'clock') defaultSettings.format = '24h'
    if (type === 'crypto') defaultSettings.coin = 'solana'
    if (type === 'custom') {
      defaultSettings.htmlContent = `<style>\nbody { color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }\nh1 { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }\n</style>\n<h1>Kendi Widget'ım</h1>`
      defaultSettings.width = 300
      defaultSettings.height = 200
    }
    if (type === 'smart') {
      defaultSettings.smartType = 'text'
      defaultSettings.textContent = 'Yeni Akıllı Widget'
    }

    const snap = 20
    const x = Math.round((window.innerWidth / 2 - 100) / snap) * snap
    const y = Math.round((window.innerHeight / 2 - 100) / snap) * snap

    newConfig.widgets.push({
      id: `w_${Date.now()}`,
      type,
      position: { x, y },
      settings: defaultSettings
    })
    saveConfig(newConfig)
    setActiveMenu('active') // Ekleme sonrası aktif widgetlar sayfasına geç
  }

  const removeWidget = (id) => {
    const newConfig = { ...config }
    newConfig.widgets = newConfig.widgets.filter(w => w.id !== id)
    saveConfig(newConfig)
  }

  const updateSetting = (id, key, value) => {
    const newConfig = { ...config }
    const widget = newConfig.widgets.find(w => w.id === id)
    if (widget) {
      widget.settings = { ...widget.settings, [key]: value }
      saveConfig(newConfig)
    }
  }

  const applyTheme = (theme) => {
    const newConfig = { ...config }
    newConfig.widgets.forEach(w => {
      w.settings = w.settings || {}
      if (theme === 'cyberpunk') {
        w.settings.color = 'purple'
        w.settings.blur = 0
        w.settings.opacity = 0.9
        w.settings.radius = 0
        w.settings.borderWidth = 2
        w.settings.fontFamily = 'monospace'
      } else if (theme === 'minimalist') {
        w.settings.color = 'white'
        w.settings.blur = 40
        w.settings.opacity = 0.1
        w.settings.radius = 32
        w.settings.borderWidth = 0
        w.settings.fontFamily = 'sans-serif'
      } else if (theme === 'darkmode') {
        w.settings.color = 'white'
        w.settings.blur = 10
        w.settings.opacity = 0.8
        w.settings.radius = 16
        w.settings.borderWidth = 1
        w.settings.fontFamily = 'inherit'
      }
    })
    saveConfig(newConfig)
  }

  const exportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "widget-engine-config.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const importConfig = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedConfig = JSON.parse(event.target.result)
        if (importedConfig && Array.isArray(importedConfig.widgets)) {
          saveConfig(importedConfig)
          alert("Düzen başarıyla içe aktarıldı!")
        } else {
          alert("Geçersiz yapılandırma dosyası.")
        }
      } catch (err) {
        alert("Dosya okuma hatası.")
      }
    }
    reader.readAsText(file)
  }

  // Sidebar Menu Item Component
  const MenuItem = ({ id, icon, label, badge }) => (
    <button 
      onClick={() => setActiveMenu(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        activeMenu === id 
          ? 'bg-white/10 text-white font-medium shadow-[0_4px_16px_rgba(0,0,0,0.4)]' 
          : 'text-white/50 hover:bg-white/5 hover:text-white/80'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  )

  return (
    <div className="min-h-screen flex selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#111] border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Widget Engine</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Dashboard V2</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <MenuItem 
            id="gallery" 
            label="Galeri & Mağaza" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>} 
          />
          <MenuItem 
            id="active" 
            label="Aktif Masaüstü" 
            badge={config.widgets.length}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>} 
          />
          <MenuItem 
            id="themes" 
            label="Küresel Temalar" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>} 
          />
          <MenuItem 
            id="settings" 
            label="Yedekleme & İçe Aktar" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>} 
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 max-w-5xl overflow-y-auto">
        
        {activeMenu === 'gallery' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-2">Widget Galerisi</h2>
            <p className="text-white/50 mb-8">İstediğiniz modülü tek tıkla masaüstünüze gönderin.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <GalleryItem title="Akıllı (Smart) Widget" desc="Kodsuz veri ve metin oluşturucu" onClick={() => addWidget('smart')} highlight color="green" />
              <GalleryItem title="Özel Kod (Custom)" desc="HTML/CSS/JS yazın" onClick={() => addWidget('custom')} highlight color="blue" />
              <GalleryItem title="Medya Oynatıcı" desc="Spotify / Sistem Sesi" onClick={() => addWidget('media')} highlight color="purple" />
              <GalleryItem title="Ağ ve Batarya" desc="PC donanım izleyici" onClick={() => addWidget('hardware')} />
              <GalleryItem title="Saat" desc="Modern dijital saat" onClick={() => addWidget('clock')} />
              <GalleryItem title="Sistem Monitörü" desc="CPU & RAM durumu" onClick={() => addWidget('sysmon')} />
              <GalleryItem title="Crypto Tracker" desc="Canlı Kripto fiyatları" onClick={() => addWidget('crypto')} />
              <GalleryItem title="Hava Durumu" desc="Anlık sıcaklık durumu" onClick={() => addWidget('weather')} />
              <GalleryItem title="Yapışkan Not" desc="Masaüstü not defteri" onClick={() => addWidget('notes')} />
              <GalleryItem title="Pomodoro" desc="Odaklanma zamanlayıcısı" onClick={() => addWidget('pomodoro')} />
            </div>
          </div>
        )}

        {activeMenu === 'active' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-3xl font-bold mb-2">Aktif Masaüstü</h2>
             <p className="text-white/50 mb-8">Şu anda ekranda olan widget'ları yönetin ve düzenleyin.</p>

             {config.widgets.length === 0 && (
               <div className="p-10 border border-dashed border-white/20 rounded-2xl text-center">
                 <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                   <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 </div>
                 <p className="text-white/60">Henüz masaüstünüzde hiçbir widget yok.</p>
                 <button onClick={() => setActiveMenu('gallery')} className="mt-4 px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">Galeriye Git</button>
               </div>
             )}

             <div className="space-y-6">
               {config.widgets.map(w => (
                 <div key={w.id} className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${editingId === w.id ? 'ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'hover:border-white/20'}`}>
                   
                   {/* Card Header */}
                   <div className="flex items-center justify-between p-5 bg-black/20">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 uppercase font-bold text-xs">
                         {w.type.substring(0,2)}
                       </div>
                       <div>
                         <div className="font-semibold capitalize text-lg tracking-wide">{w.type}</div>
                         <div className="text-xs text-white/40 font-mono">ID: {w.id}</div>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           if (editingId === w.id) {
                             setEditingId(null)
                           } else {
                             setEditingId(w.id)
                             setActiveTab('basic')
                           }
                         }}
                         className="px-4 py-2 bg-blue-500/10 text-blue-400 font-medium rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
                       >
                         {editingId === w.id ? 'Paneli Kapat' : 'Ayarlar'}
                       </button>
                       <button 
                         onClick={() => removeWidget(w.id)}
                         className="px-4 py-2 bg-red-500/10 text-red-400 font-medium rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                       >
                         Sil
                       </button>
                     </div>
                   </div>

                   {/* Editor Body */}
                   {editingId === w.id && (
                     <div className="border-t border-white/5">
                       
                       {/* Tabs */}
                       <div className="flex px-5 pt-4 gap-4">
                         <button 
                           className={`pb-3 text-sm font-medium transition-all border-b-2 ${activeTab === 'basic' ? 'border-blue-500 text-blue-400' : 'border-transparent text-white/50 hover:text-white'}`}
                           onClick={() => setActiveTab('basic')}
                         >
                           Temel Ayarlar
                         </button>
                         <button 
                           className={`pb-3 text-sm font-medium transition-all border-b-2 ${activeTab === 'appearance' ? 'border-purple-500 text-purple-400' : 'border-transparent text-white/50 hover:text-white'}`}
                           onClick={() => setActiveTab('appearance')}
                         >
                           Görünüm (Cam Efekti)
                         </button>
                       </div>

                       <div className="p-6 bg-black/10">
                         {/* === TEMEL AYARLAR === */}
                         {activeTab === 'basic' && (
                            <div className="space-y-6 max-w-2xl">
                              {w.type !== 'custom' && w.type !== 'smart' && w.type !== 'notes' && (
                                <div>
                                  <label className="block text-xs font-semibold text-white/50 uppercase mb-3">Vurgu Rengi</label>
                                  <div className="flex gap-3">
                                    {Object.keys(colorMap).map(color => (
                                      <button
                                        key={color}
                                        onClick={() => updateSetting(w.id, 'color', color)}
                                        className={`w-8 h-8 rounded-full border-[3px] transition-transform ${w.settings?.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'} ${colorMap[color].split(' ')[0]}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {w.type === 'smart' && (
                                <div className="space-y-5">
                                  <div>
                                    <label className="block text-xs font-semibold text-white/50 uppercase mb-2">Widget Görevi</label>
                                    <select value={w.settings?.smartType || 'text'} onChange={(e) => updateSetting(w.id, 'smartType', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-colors">
                                      <option value="text">Statik Metin</option>
                                      <option value="image">Statik Görsel</option>
                                      <option value="api">Dinamik API Verisi</option>
                                    </select>
                                  </div>
                                  
                                  {w.settings?.smartType === 'api' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                      <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-white/50 uppercase mb-2">API URL (GET)</label>
                                        <input type="text" value={w.settings?.apiUrl || ''} onChange={e => updateSetting(w.id, 'apiUrl', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="https://api.ornek.com/veri" />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-white/50 uppercase mb-2">JSON Veri Yolu</label>
                                        <input type="text" value={w.settings?.jsonPath || ''} onChange={e => updateSetting(w.id, 'jsonPath', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="data.price" />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-white/50 uppercase mb-2">Yenilenme Hızı</label>
                                        <select value={w.settings?.refreshRate || 60000} onChange={e => updateSetting(w.id, 'refreshRate', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500">
                                          <option value="10000">10 Saniye</option>
                                          <option value="60000">1 Dakika</option>
                                        </select>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Diğer smart inputs... */}
                                </div>
                              )}

                              {w.type === 'custom' && (
                                <div>
                                  <label className="block text-xs font-semibold text-white/50 uppercase mb-2">HTML / CSS / JS Kodu</label>
                                  <textarea value={w.settings?.htmlContent || ''} onChange={(e) => updateSetting(w.id, 'htmlContent', e.target.value)} className="w-full h-48 bg-[#0a0a0a] text-green-400 font-mono text-sm border border-white/10 rounded-xl p-4 outline-none resize-y focus:border-blue-500 transition-colors" spellCheck="false" />
                                </div>
                              )}

                            </div>
                         )}

                         {/* === GÖRÜNÜM AYARLARI === */}
                         {activeTab === 'appearance' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
                              
                              <div className="space-y-6">
                                <div>
                                  <div className="flex justify-between text-xs font-semibold text-white/50 uppercase mb-3"><span>Büyüklük (Scale)</span><span className="text-blue-400">{w.settings?.scale || 1.0}x</span></div>
                                  <input type="range" min="0.5" max="3.0" step="0.1" value={w.settings?.scale || 1.0} onChange={(e) => updateSetting(w.id, 'scale', parseFloat(e.target.value))} className="w-full accent-blue-500" />
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs font-semibold text-white/50 uppercase mb-3"><span>Arkaplan Koyuluğu (Opacity)</span><span className="text-blue-400">{Math.round((w.settings?.opacity ?? 0.4) * 100)}%</span></div>
                                  <input type="range" min="0.0" max="1.0" step="0.05" value={w.settings?.opacity ?? 0.4} onChange={(e) => updateSetting(w.id, 'opacity', parseFloat(e.target.value))} className="w-full accent-blue-500" />
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <div className="flex justify-between text-xs font-semibold text-white/50 uppercase mb-3"><span>Bulanıklık (Blur)</span><span className="text-purple-400">{w.settings?.blur ?? 24}px</span></div>
                                  <input type="range" min="0" max="50" step="1" value={w.settings?.blur ?? 24} onChange={(e) => updateSetting(w.id, 'blur', parseInt(e.target.value))} className="w-full accent-purple-500" />
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs font-semibold text-white/50 uppercase mb-3"><span>Köşe Yuvarlaklığı (Radius)</span><span className="text-purple-400">{w.settings?.radius ?? 32}px</span></div>
                                  <input type="range" min="0" max="100" step="2" value={w.settings?.radius ?? 32} onChange={(e) => updateSetting(w.id, 'radius', parseInt(e.target.value))} className="w-full accent-purple-500" />
                                </div>
                              </div>

                           </div>
                         )}

                       </div>
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeMenu === 'themes' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <h2 className="text-3xl font-bold mb-2">Küresel Temalar</h2>
            <p className="text-white/50 mb-8">Tek bir tıklamayla masaüstünüzün tüm estetiğini baştan yaratın.</p>

            <div className="space-y-4">
              <div onClick={() => applyTheme('minimalist')} className="group p-6 bg-white/5 border border-white/10 hover:border-white/30 rounded-2xl cursor-pointer transition-all hover:bg-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Minimalist Cam</h3>
                  <p className="text-white/50 text-sm">Yüksek bulanıklık, ince çizgiler ve zarif bir görünüm.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
              </div>

              <div onClick={() => applyTheme('cyberpunk')} className="group p-6 bg-purple-500/5 border border-purple-500/20 hover:border-purple-500/50 rounded-2xl cursor-pointer transition-all hover:bg-purple-500/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-1">Cyberpunk</h3>
                  <p className="text-purple-400/50 text-sm">Keskin köşeler, kod fontları ve neon mor detaylar.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
              </div>

              <div onClick={() => applyTheme('darkmode')} className="group p-6 bg-black border border-white/10 hover:border-white/30 rounded-2xl cursor-pointer transition-all hover:bg-black/80 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Klasik Dark Mode</h3>
                  <p className="text-white/50 text-sm">Siyah ağırlıklı arka plan, belirgin sınırlar ve yüksek okunabilirlik.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <h2 className="text-3xl font-bold mb-2">Yedekleme & Paylaşım</h2>
            <p className="text-white/50 mb-8">Kurduğunuz düzeni arkadaşlarınızla paylaşın veya yedek alın.</p>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl mx-auto flex items-center justify-center text-blue-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">Düzeni Dışa Aktar</h3>
                <p className="text-blue-400/60 text-sm mb-6">Mevcut tüm widget'larınızı ve ayarlarınızı bir JSON dosyası olarak indirin.</p>
                <button onClick={exportConfig} className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                  Dosyayı İndir
                </button>
              </div>

              <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-2xl text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl mx-auto flex items-center justify-center text-green-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Düzeni İçe Aktar</h3>
                <p className="text-green-400/60 text-sm mb-6">Daha önceden indirilmiş bir JSON dosyasını yükleyerek masaüstünüzü anında değiştirin.</p>
                <button onClick={() => fileInputRef.current.click()} className="px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">
                  Dosya Seç (.json)
                </button>
                <input type="file" accept=".json" ref={fileInputRef} onChange={importConfig} className="hidden" />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

function GalleryItem({ title, desc, onClick, highlight, color = 'blue' }) {
  const bgColors = {
    blue: 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/5 border-green-500/20 hover:border-green-500/50 hover:bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400'
  }
  const btnColors = {
    blue: 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/40',
    green: 'bg-green-500/20 text-green-400 group-hover:bg-green-500/40',
    purple: 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/40'
  }
  
  const isHigh = highlight ? true : false
  const wrapperClass = isHigh ? bgColors[color] : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 text-white'
  const btnClass = isHigh ? btnColors[color] : 'bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white'

  return (
    <div className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${wrapperClass}`} onClick={onClick}>
      <div>
        <div className="font-bold text-lg mb-1">{title}</div>
        <div className="text-xs opacity-70 leading-relaxed">{desc}</div>
      </div>
      <div className="mt-auto pt-2">
         <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${btnClass}`}>
           Masaüstüne Ekle
         </button>
      </div>
    </div>
  )
}
