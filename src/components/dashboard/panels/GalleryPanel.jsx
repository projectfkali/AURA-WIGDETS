import React from 'react';
import useStore from '../../../store/useStore';

export default function GalleryPanel() {
  const addWidget = useStore(state => state.addWidget);

  const handleAdd = (type) => {
    const defaultSettings = { scale: 1.0, opacity: 0.4, blur: 24, radius: 32, borderWidth: 1, padding: 24, bgColorHex: '#000000', fontFamily: 'inherit', color: 'white' }
    
    if (type === 'clock') { defaultSettings.format = '24h'; defaultSettings.width = 300; defaultSettings.height = 160; }
    if (type === 'crypto') { defaultSettings.coin = 'solana'; defaultSettings.width = 240; defaultSettings.height = 140; }
    if (type === 'weather') { defaultSettings.width = 200; defaultSettings.height = 160; }
    if (type === 'sysmon') { defaultSettings.width = 300; defaultSettings.height = 180; }
    if (type === 'stock') { defaultSettings.width = 280; defaultSettings.height = 200; defaultSettings.stockSymbol = 'AAPL'; defaultSettings.basePrice = 175.50; }
    if (type === 'github') { defaultSettings.width = 320; defaultSettings.height = 140; }
    if (type === 'calendar') { defaultSettings.width = 240; defaultSettings.height = 240; }
    if (type === 'news') { defaultSettings.width = 300; defaultSettings.height = 160; }
    if (type === 'shortcuts') { defaultSettings.width = 300; defaultSettings.height = 100; defaultSettings.isTransparent = true; }
    if (type === 'countdown') { defaultSettings.width = 280; defaultSettings.height = 140; }
    if (type === 'worldclock') { defaultSettings.width = 220; defaultSettings.height = 180; }
    if (type === 'custom') {
      defaultSettings.htmlContent = `<style>\nbody { color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }\nh1 { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }\n</style>\n<h1>Kendi Widget'ım</h1>`
      defaultSettings.width = 300; defaultSettings.height = 200;
    }
    if (type === 'smart') { defaultSettings.smartType = 'text'; defaultSettings.textContent = 'Yeni Akıllı Widget'; }

    addWidget(type, defaultSettings);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-6">
      <h2 className="text-4xl font-bold mb-2 tracking-tight">Widget Galerisi</h2>
      <p className="text-white/50 mb-10 text-lg">Masaüstünüzü kişiselleştirmek için modülleri seçin.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[200px]">
        <GalleryBento title="Borsa Grafiği" desc="Canlı Hisse" onClick={() => handleAdd('stock')} colSpan="md:col-span-2 lg:col-span-2" color="from-teal-500/20 to-green-500/5" icon="📈" />
        <GalleryBento title="GitHub Heatmap" desc="Commit Haritası" onClick={() => handleAdd('github')} colSpan="md:col-span-2 lg:col-span-2" color="from-emerald-500/20 to-teal-500/5" icon="🐙" />
        <GalleryBento title="Haberler / RSS" desc="Son Dakika Akışı" onClick={() => handleAdd('news')} colSpan="md:col-span-1 lg:col-span-2" color="from-red-500/20 to-orange-500/5" icon="📰" />
        <GalleryBento title="Aura AI" desc="Akıllı Asistan" onClick={() => handleAdd('ai')} colSpan="md:col-span-1 lg:col-span-2" color="from-purple-500/20 to-blue-500/5" icon="🤖" />
        
        <GalleryBento title="Minimal Takvim" desc="Aylık Ajanda" onClick={() => handleAdd('calendar')} colSpan="md:col-span-1 lg:col-span-1" color="from-blue-500/20 to-cyan-500/5" icon="📅" />
        <GalleryBento title="Masaüstü Dock" desc="Kısayollar" onClick={() => handleAdd('shortcuts')} colSpan="md:col-span-2 lg:col-span-1" color="from-purple-500/20 to-pink-500/5" icon="🚀" />
        <GalleryBento title="Geri Sayım" desc="Sayaç" onClick={() => handleAdd('countdown')} colSpan="md:col-span-1 lg:col-span-1" color="from-yellow-500/20 to-amber-500/5" icon="⏳" />
        <GalleryBento title="Dünya Saatleri" desc="Çoklu Bölge" onClick={() => handleAdd('worldclock')} colSpan="md:col-span-1 lg:col-span-1" color="from-indigo-500/20 to-purple-500/5" icon="🌍" />
        
        <GalleryBento title="Donanım" desc="Sensörler" onClick={() => handleAdd('hardware')} colSpan="md:col-span-1 lg:col-span-1" color="from-orange-500/20 to-red-500/5" icon="⚙️" />
        <GalleryBento title="Pomodoro" desc="Odaklanma" onClick={() => handleAdd('pomodoro')} colSpan="md:col-span-1 lg:col-span-1" color="from-red-500/20 to-rose-500/5" icon="🍅" />
        <GalleryBento title="Notlar" desc="Hızlı Not" onClick={() => handleAdd('notes')} colSpan="md:col-span-1 lg:col-span-1" color="from-yellow-400/20 to-yellow-600/5" icon="📝" />
        
        <GalleryBento title="Akıllı Modül" desc="Veri/AI odaklı" onClick={() => handleAdd('smart')} colSpan="md:col-span-1 lg:col-span-1" color="from-green-500/20 to-emerald-500/5" icon="✨" />
        <GalleryBento title="Özel Kod" desc="HTML/CSS/JS" onClick={() => handleAdd('custom')} colSpan="md:col-span-1 lg:col-span-1" color="from-blue-500/20 to-indigo-500/5" icon="👨‍💻" />
        <GalleryBento title="Medya" desc="Spotify Player" onClick={() => handleAdd('media')} colSpan="md:col-span-1 lg:col-span-1" color="from-pink-500/20 to-purple-500/5" icon="🎵" />
        <GalleryBento title="3D Core" desc="Aura WebGL" onClick={() => handleAdd('threed')} colSpan="md:col-span-2 lg:col-span-1" color="from-orange-500/20 to-red-500/5" icon="🧊" />
        <GalleryBento title="Sistem" desc="CPU/RAM" onClick={() => handleAdd('sysmon')} colSpan="1" color="from-zinc-500/20 to-zinc-800/5" icon="💻" />
        <GalleryBento title="Saat" desc="Zaman" onClick={() => handleAdd('clock')} colSpan="1" color="from-zinc-500/20 to-zinc-800/5" icon="⏰" />
        <GalleryBento title="Hava Durumu" desc="Sıcaklık" onClick={() => handleAdd('weather')} colSpan="1" color="from-zinc-500/20 to-zinc-800/5" icon="🌤️" />
        <GalleryBento title="Kripto" desc="Market" onClick={() => handleAdd('crypto')} colSpan="1" color="from-zinc-500/20 to-zinc-800/5" icon="🪙" />
      </div>
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
