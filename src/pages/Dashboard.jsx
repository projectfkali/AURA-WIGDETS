import { useEffect, useState, useRef } from 'react'
import LivePreview from '../components/dashboard/LivePreview'
import FloatingNav from '../components/dashboard/FloatingNav'
import WidgetSettingsSidebar from '../components/dashboard/WidgetSettingsSidebar'

const colorMap = {
  white: 'bg-white text-white',
  blue: 'bg-blue-400 text-blue-400',
  green: 'bg-green-400 text-green-400',
  purple: 'bg-purple-400 text-purple-400',
  red: 'bg-red-400 text-red-400'
}

export default function Dashboard() {
  const [config, setConfig] = useState({ widgets: [] })
  const [activeMenu, setActiveMenu] = useState('gallery')
  const [editingCustomId, setEditingCustomId] = useState(null)
  const [customCode, setCustomCode] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState('basic')
  const [storeWidgets, setStoreWidgets] = useState([])
  const [loadingStore, setLoadingStore] = useState(false)
  const fileInputRef = useRef(null)
  
  useEffect(() => {
    document.body.className = 'bg-[#0a0a0a] text-white antialiased'
    if (window.electronAPI) {
      window.electronAPI.getConfig().then(setConfig)
      const cleanup = window.electronAPI.onConfigUpdated(setConfig)
      return cleanup
    }
  }, [])

  useEffect(() => {
    if (activeMenu === 'store' && storeWidgets.length === 0) {
      setLoadingStore(true)
      fetch('https://jsonblob.com/api/jsonBlob/019e6603-2cb0-72ca-8ab7-2898eace8c5c')
        .then(res => res.json())
        .then(data => {
          setStoreWidgets(data.widgets || [])
          setLoadingStore(false)
        })
        .catch(err => {
          console.error("Store error:", err)
          setLoadingStore(false)
        })
    }
  }, [activeMenu])

  const publishWidget = async (widget) => {
    try {
      const widgetName = prompt("Widget için kısa bir isim girin:", "Yeni Modül");
      if (!widgetName) return;
      const widgetAuthor = prompt("Yazar isminiz (Mağazada görünecek):", "Aura Geliştiricisi");
      if (!widgetAuthor) return;

      alert("Buluta yükleniyor, lütfen bekleyin...");
      const url = 'https://jsonblob.com/api/jsonBlob/019e6603-2cb0-72ca-8ab7-2898eace8c5c';
      const getRes = await fetch(url);
      const data = await getRes.json();
      
      const newWidget = {
        id: `custom_${Date.now()}`,
        name: widgetName,
        author: widgetAuthor,
        description: "Topluluk tarafından oluşturuldu ve yüklendi.",
        downloads: 0,
        htmlContent: widget.settings.htmlContent
      };
      
      data.widgets.push(newWidget);
      
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Update local state so store is fresh
      setStoreWidgets(data.widgets);
      alert("✅ Harika! Widget'ınız başarıyla Aura Bulut Mağazasına yayınlandı. Tüm dünyadaki kullanıcılar artık bunu indirebilir!");
      setActiveMenu('store');
    } catch (e) {
      alert("❌ Yayınlama başarısız oldu: " + e.message);
    }
  }

  const saveConfig = (newConfig) => {
    setConfig(newConfig)
    if (window.electronAPI) window.electronAPI.saveConfig(newConfig)
  }

  const addWidget = (type) => {
    const newConfig = { ...config }
    const defaultSettings = { scale: 1.0, opacity: 0.4, blur: 24, radius: 32, borderWidth: 1, padding: 24, bgColorHex: '#000000', fontFamily: 'inherit', color: 'white' }
    
    if (type === 'clock') {
      defaultSettings.format = '24h'
      defaultSettings.width = 300
      defaultSettings.height = 160
    }
    if (type === 'crypto') {
      defaultSettings.coin = 'solana'
      defaultSettings.width = 240
      defaultSettings.height = 140
    }
    if (type === 'weather') {
      defaultSettings.width = 200
      defaultSettings.height = 160
    }
    if (type === 'sysmon') {
      defaultSettings.width = 300
      defaultSettings.height = 180
    }
    if (type === 'stock') {
      defaultSettings.width = 280
      defaultSettings.height = 200
      defaultSettings.stockSymbol = 'AAPL'
      defaultSettings.basePrice = 175.50
    }
    if (type === 'github') {
      defaultSettings.width = 320
      defaultSettings.height = 140
    }
    if (type === 'calendar') {
      defaultSettings.width = 240
      defaultSettings.height = 240
    }
    if (type === 'news') {
      defaultSettings.width = 300
      defaultSettings.height = 160
    }
    if (type === 'shortcuts') {
      defaultSettings.width = 300
      defaultSettings.height = 100
      defaultSettings.isTransparent = true
    }
    if (type === 'countdown') {
      defaultSettings.width = 280
      defaultSettings.height = 140
    }
    if (type === 'worldclock') {
      defaultSettings.width = 220
      defaultSettings.height = 180
    }
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

  const themes = [
    { id: 'glass', name: 'Premium Glass', color: 'bg-white/10' },
    { id: 'dark', name: 'Dark Mode', color: 'bg-black/60' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-yellow-500/20', border: 'border-yellow-500' },
    { id: 'neon', name: 'Neon Purple', color: 'bg-purple-900/40', border: 'border-purple-500' },
    { id: 'os', name: 'Sistem Teması (OS)', color: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20', border: 'border-white/30' }
  ]

  const handleThemeChange = async (themeId) => {
    let globalAccent = null;
    if (themeId === 'os' && window.electronAPI?.getWindowsAccent) {
       globalAccent = await window.electronAPI.getWindowsAccent();
    }
    const newConfig = { ...config, theme: themeId }
    newConfig.widgets = newConfig.widgets.map(w => {
      let wSet = { ...w.settings };
      if (themeId === 'glass') { wSet.bgOpacity = 10; wSet.blur = 16; wSet.borderColor = 'rgba(255,255,255,0.1)'; }
      if (themeId === 'dark') { wSet.bgOpacity = 60; wSet.blur = 24; wSet.borderColor = 'rgba(0,0,0,0.5)'; }
      if (themeId === 'cyberpunk') { wSet.bgOpacity = 20; wSet.blur = 4; wSet.borderColor = '#eab308'; }
      if (themeId === 'neon') { wSet.bgOpacity = 40; wSet.blur = 30; wSet.borderColor = '#a855f7'; }
      if (themeId === 'os') { 
        wSet.bgOpacity = 30; wSet.blur = 20; 
        if (globalAccent) {
           wSet.borderColor = globalAccent;
           wSet.textColor = globalAccent;
        } else {
           wSet.borderColor = 'rgba(255,255,255,0.3)';
        }
      }
      return { ...w, settings: wSet }
    });
    saveConfig(newConfig)
  }

  const removeWidget = (id) => {
    const newConfig = { ...config }
    newConfig.widgets = newConfig.widgets.filter(w => w.id !== id)
    saveConfig(newConfig)
  }

  const updateSetting = (id, key, value) => {
    const newConfig = { ...config }
    newConfig.widgets = newConfig.widgets.map(w => 
      w.id === id ? { ...w, settings: { ...w.settings, [key]: value } } : w
    )
    saveConfig(newConfig)
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
    <div className="flex h-screen overflow-hidden text-white font-sans bg-[#0a0a0a] selection:bg-white/30 relative">
      <FloatingNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      {/* Mesh Gradient Arkaplan */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto z-10 mx-auto w-full pt-28">
        
        {activeMenu === 'gallery' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-6">
            <h2 className="text-4xl font-bold mb-2 tracking-tight">Widget Galerisi</h2>
            <p className="text-white/50 mb-10 text-lg">Masaüstünüzü kişiselleştirmek için modülleri seçin.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[200px]">
              <GalleryBento title="Borsa Grafiği" desc="Canlı Hisse" onClick={() => addWidget('stock')} colSpan="md:col-span-2 lg:col-span-2" color="from-teal-500/20 to-green-500/5" icon="📈" />
              <GalleryBento title="GitHub Heatmap" desc="Commit Haritası" onClick={() => addWidget('github')} colSpan="md:col-span-2 lg:col-span-2" color="from-emerald-500/20 to-teal-500/5" icon="🐙" />
              <GalleryBento title="Haberler / RSS" desc="Son Dakika Akışı" onClick={() => addWidget('news')} colSpan="md:col-span-1 lg:col-span-2" color="from-red-500/20 to-orange-500/5" icon="📰" />
              <GalleryBento title="Aura AI" desc="Akıllı Asistan" onClick={() => addWidget('ai')} colSpan="md:col-span-1 lg:col-span-2" color="from-purple-500/20 to-blue-500/5" icon="🤖" />
              
              <GalleryBento title="Minimal Takvim" desc="Aylık Ajanda" onClick={() => addWidget('calendar')} colSpan="md:col-span-1 lg:col-span-1" color="from-blue-500/20 to-cyan-500/5" icon="📅" />
              <GalleryBento title="Masaüstü Dock" desc="Kısayollar" onClick={() => addWidget('shortcuts')} colSpan="md:col-span-2 lg:col-span-1" color="from-purple-500/20 to-pink-500/5" icon="🚀" />
              <GalleryBento title="Geri Sayım" desc="Sayaç" onClick={() => addWidget('countdown')} colSpan="md:col-span-1 lg:col-span-1" color="from-yellow-500/20 to-amber-500/5" icon="⏳" />
              <GalleryBento title="Dünya Saatleri" desc="Çoklu Bölge" onClick={() => addWidget('worldclock')} colSpan="md:col-span-1 lg:col-span-1" color="from-indigo-500/20 to-purple-500/5" icon="🌍" />
              
              <GalleryBento title="Donanım" desc="Sensörler" onClick={() => addWidget('hardware')} colSpan="md:col-span-1 lg:col-span-1" color="from-orange-500/20 to-red-500/5" icon="⚙️" />
              <GalleryBento title="Pomodoro" desc="Odaklanma" onClick={() => addWidget('pomodoro')} colSpan="md:col-span-1 lg:col-span-1" color="from-red-500/20 to-rose-500/5" icon="🍅" />
              <GalleryBento title="Notlar" desc="Hızlı Not" onClick={() => addWidget('notes')} colSpan="md:col-span-1 lg:col-span-1" color="from-yellow-400/20 to-yellow-600/5" icon="📝" />
              
              <GalleryBento title="Akıllı Modül" desc="Veri/AI odaklı" onClick={() => addWidget('smart')} colSpan="md:col-span-1 lg:col-span-1" color="from-green-500/20 to-emerald-500/5" icon="✨" />
              <GalleryBento title="Özel Kod" desc="HTML/CSS/JS" onClick={() => addWidget('custom')} colSpan="md:col-span-1 lg:col-span-1" color="from-blue-500/20 to-indigo-500/5" icon="👨‍💻" />
              <GalleryBento title="Medya" desc="Spotify Player" onClick={() => addWidget('media')} colSpan="md:col-span-1 lg:col-span-1" color="from-pink-500/20 to-purple-500/5" icon="🎵" />
              <GalleryBento title="3D Core" desc="Aura WebGL" onClick={() => addWidget('threed')} colSpan="md:col-span-2 lg:col-span-1" color="from-orange-500/20 to-red-500/5" icon="🧊" />
              <GalleryBento title="Sistem" desc="CPU/RAM" onClick={() => addWidget('sysmon')} colSpan="1" color="from-zinc-500/20 to-zinc-800/5" icon="💻" />
              <GalleryBento title="Saat" desc="Zaman" onClick={() => addWidget('clock')} colSpan="1" color="from-zinc-500/20 to-zinc-800/5" icon="⏰" />
              <GalleryBento title="Hava Durumu" desc="Sıcaklık" onClick={() => addWidget('weather')} colSpan="1" color="from-zinc-500/20 to-zinc-800/5" icon="🌤️" />
              <GalleryBento title="Kripto" desc="Market" onClick={() => addWidget('crypto')} colSpan="1" color="from-zinc-500/20 to-zinc-800/5" icon="🪙" />
            </div>
          </div>
        )}

        {activeMenu === 'store' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Aura Mağazası (Topluluk)</h2>
                <p className="text-white/50">Diğer kullanıcılar tarafından kodlanmış gelişmiş modülleri (Blueprints) indirin.</p>
              </div>
              <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Bulut Senkronizasyonu Aktif
              </div>
            </div>
            
            {loadingStore ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storeWidgets.map(widget => (
                  <div key={widget.id} className="bg-black/40 border border-white/5 hover:border-blue-500/30 transition-colors rounded-2xl overflow-hidden flex flex-col group">
                    <div className="h-32 bg-gradient-to-br from-blue-900/40 to-black relative overflow-hidden flex items-center justify-center border-b border-white/5">
                      <div className="text-blue-500 font-mono text-xl opacity-50 tracking-widest">{widget.name}</div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-xl">{widget.name}</h3>
                        <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-md">Yazar: {widget.author}</span>
                      </div>
                      <p className="text-sm text-white/50 mb-6">{widget.description}</p>
                      <button onClick={() => {
                        const newConfig = { ...config };
                        newConfig.widgets.push({
                          id: `w_${Date.now()}`, type: 'custom', position: { x: 200, y: 200 },
                          settings: { scale: 1.0, opacity: 0.1, blur: 0, radius: 16, htmlContent: widget.htmlContent, width: 400, height: 400, borderWidth: 0 }
                        });
                        saveConfig(newConfig);
                        setActiveMenu('active');
                      }} className="mt-auto w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                        İndir ve Ekle ({widget.downloads} İndirme)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeMenu === 'ai' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Aura AI Asistan</h2>
                <p className="text-white/50">Masaüstünüzde yaşayan kişisel yapay zekanız ve kodsuz widget üreticiniz.</p>
              </div>
              <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-medium">Beta V3.0</div>
            </div>

            <div className="space-y-6">
              {/* Masaüstü Asistanı */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Masaüstü AI Asistanı</h3>
                  <p className="text-white/50 text-sm mb-4">Size hava durumunu söyleyen, kod yazan ve sohbet eden şeffaf bir masaüstü arkadaşı edinin.</p>
                  <button onClick={() => addWidget('ai')} className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">Masaüstüne Ekle</button>
                </div>
              </div>

              {/* Prompt to Widget */}
              <div className="p-6 bg-black/40 border border-green-500/20 rounded-2xl">
                <h3 className="text-xl font-bold mb-2 text-green-400">Prompt-to-Widget Üretici</h3>
                <p className="text-white/50 text-sm mb-6">İstediğiniz widget'ı hayal edin ve yazın. Aura AI sizin için kodlayıp ekrana koysun.</p>
                
                <div className="flex flex-col gap-3">
                  <textarea 
                    placeholder="Örnek: Bana kırmızı renkte, dev boyutlu ve gölgeli bir dijital saat widget'ı yap..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/30 focus:border-green-500 outline-none resize-none transition-colors"
                  ></textarea>
                  <button onClick={() => {
                    alert("Aura AI Modeli yükleniyor... (API entegrasyonu tamamlandığında kod otomatik üretilecektir.)");
                  }} className="py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20">
                    Sihri Gerçekleştir 🚀
                  </button>
                </div>
              </div>
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
                            }
                          }}
                          className={`px-4 py-2 font-medium rounded-[12px] transition-colors text-sm shadow-sm ${editingId === w.id ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}
                        >
                          {editingId === w.id ? 'Ayarları Kapat' : 'Düzenle'}
                        </button>
                        <button 
                          onClick={() => removeWidget(w.id)}
                          className="px-4 py-2 bg-red-500/10 text-red-400 font-medium rounded-[12px] hover:bg-red-500/20 transition-colors text-sm shadow-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* iOS 26 Widget Settings Sidebar Overlay */}
      {editingId && (
        <WidgetSettingsSidebar 
          widget={config.widgets.find(w => w.id === editingId)} 
          updateSetting={updateSetting} 
          closeSidebar={() => setEditingId(null)}
          removeWidget={(id) => {
             removeWidget(id);
             setEditingId(null);
          }}
        />
      )}
    </div>
  )
}

function GalleryBento({ title, desc, onClick, colSpan = 'col-span-1', color, icon }) {
  return (
    <div 
      onClick={onClick}
      className={`${colSpan} group relative overflow-hidden rounded-3xl bg-gradient-to-br ${color} border border-white/10 p-6 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:border-white/20`}
    >
      <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="relative h-full flex flex-col justify-between z-10">
        <div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner">
            {icon}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{title}</h3>
          <p className="text-white/50 font-medium">{desc}</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span>Masaüstüne Ekle</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </div>
      </div>
    </div>
  )
}
