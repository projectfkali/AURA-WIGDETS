import React, { useEffect } from 'react'
import SidebarNav from '../components/dashboard/SidebarNav'
import WidgetSettingsModal from '../components/dashboard/WidgetSettingsModal'
import GalleryPanel from '../components/dashboard/panels/GalleryPanel'
import StorePanel from '../components/dashboard/panels/StorePanel'
import ThemesPanel from '../components/dashboard/panels/ThemesPanel'
import SettingsPanel from '../components/dashboard/panels/SettingsPanel'
import ActivePanel from '../components/dashboard/panels/ActivePanel'
import useStore from '../store/useStore'

export default function Dashboard() {
  const { 
    config, setConfig, activeMenu, setActiveMenu, editingId, setEditingId, updateWidgetSettings, removeWidget
  } = useStore()

  useEffect(() => {
    // Initial load from Electron
    if (window.electronAPI) {
      window.electronAPI.onConfigUpdated((newConfig) => {
        // Zustand store'u güncelle ama sonsuz döngüye girmemek için "saveConfig" yapma
        useStore.setState({ config: newConfig })
      })
    }
    
    // Ambient background animation setup (Mesh Gradient)
    const interBubble = document.querySelector('.interactive')
    let curX = 0, curY = 0, tgX = 0, tgY = 0

    const move = () => {
      curX += (tgX - curX) / 20
      curY += (tgY - curY) / 20
      if (interBubble) interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
      requestAnimationFrame(move)
    }

    const onMouseMove = (e) => { tgX = e.clientX; tgY = e.clientY }
    window.addEventListener('mousemove', onMouseMove)
    move()

    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div className="flex flex-row h-screen overflow-hidden text-white font-sans bg-[#0a0a0a] selection:bg-white/30 relative">
      <SidebarNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      {/* Mesh Gradient Arkaplan */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
         <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000"></div>
         <div className="interactive absolute w-full h-full bg-cyan-400/10 rounded-full mix-blend-screen filter blur-[100px] opacity-50 top-[-50%] left-[-50%]"></div>
      </div>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 overflow-y-auto z-10 w-full custom-scrollbar">
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full pt-10 pb-10">
          
          {/* Üst Kısım */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight mb-2">Aura <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Dashboard</span></h1>
              <p className="text-white/50 text-lg font-medium tracking-wide">Masaüstünüzü yeniden tasarlayın.</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button onClick={() => window.electronAPI?.closeDashboard()} className="px-6 py-2.5 bg-white/10 hover:bg-red-500/80 rounded-xl transition-all font-medium border border-white/10 hover:border-red-500 shadow-lg backdrop-blur-md">
                Kapat
              </button>
            </div>
          </div>

          {/* Dinamik Paneller */}
          {activeMenu === 'gallery' && <GalleryPanel />}
          {activeMenu === 'active' && <ActivePanel />}
          {activeMenu === 'store' && <StorePanel />}
          {activeMenu === 'themes' && <ThemesPanel />}
          {activeMenu === 'settings' && <SettingsPanel />}

        </div>
      </main>

      {/* iOS 26 / VisionOS Widget Settings Modal Overlay */}
      {editingId && (
        <WidgetSettingsModal 
          widget={config.widgets.find(w => w.id === editingId)} 
          updateSetting={updateWidgetSettings} 
          closeModal={() => setEditingId(null)}
          removeWidget={(id) => {
             removeWidget(id);
             setEditingId(null);
          }}
        />
      )}
    </div>
  )
}
