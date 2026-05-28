import React from 'react';
import useStore from '../../../store/useStore';

export default function ThemesPanel() {
  const applyTheme = useStore(state => state.applyGlobalTheme);

  const themes = [
    { id: 'glass', name: 'Premium Glass', color: 'bg-white/10' },
    { id: 'dark', name: 'Dark Mode', color: 'bg-black/60' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-yellow-500/20', border: 'border-yellow-500' },
    { id: 'neon', name: 'Neon Purple', color: 'bg-purple-900/40', border: 'border-purple-500' },
    { id: 'sunset', name: 'Sunset (Günbatımı)', color: 'bg-gradient-to-tr from-orange-500/30 to-pink-500/30', border: 'border-orange-400' },
    { id: 'ocean', name: 'Ocean (Okyanus)', color: 'bg-gradient-to-tr from-cyan-500/30 to-blue-600/30', border: 'border-cyan-400' },
    { id: 'aurora', name: 'Aurora (Kuzey Işıkları)', color: 'bg-gradient-to-tr from-green-400/30 to-blue-500/30', border: 'border-green-400' },
    { id: 'os', name: 'Sistem Teması (OS)', color: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20', border: 'border-white/30' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">Küresel Temalar</h2>
      <p className="text-white/50 mb-8">Tüm masaüstü görünümünüzü tek tıkla baştan yaratın.</p>
      
      <div className="grid grid-cols-1 gap-4 max-w-4xl">
        <div onClick={() => applyTheme('os')} className="group p-6 bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/10 hover:border-blue-400/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              AuraOS Varsayılan Tasarım
            </h3>
            <p className="text-white/50 text-sm">Geliştiricilerin tavsiye ettiği, her ortama uyan yarı şeffaf cam tasarımı.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div onClick={() => applyTheme('minimalist')} className="group p-6 bg-white border border-white/20 hover:border-white rounded-2xl cursor-pointer transition-all hover:bg-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-black mb-1">Aydınlık Minimalizm</h3>
              <p className="text-black/50 text-sm">Sıfır sınır çizgisi, yüksek şeffaflık. Ferahlatıcı bir masaüstü deneyimi.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
          </div>

          <div onClick={() => applyTheme('cyberpunk')} className="group p-6 bg-[#0f0f13] border border-yellow-500/30 hover:border-yellow-500 rounded-2xl cursor-pointer transition-all flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-1 font-mono">CYBERPUNK_2077</h3>
              <p className="text-yellow-500/50 text-sm font-mono">Sıfır yuvarlaklık, kalın sarı sınırlar ve monospaced fontlar.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 font-mono">→</div>
          </div>

          <div onClick={() => applyTheme('darkmode')} className="group p-6 bg-black border border-white/10 hover:border-white/30 rounded-2xl cursor-pointer transition-all hover:bg-black/80 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Klasik Dark Mode</h3>
              <p className="text-white/50 text-sm">Siyah ağırlıklı arka plan, belirgin sınırlar ve yüksek okunabilirlik.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
          </div>

          <div onClick={() => applyTheme('sunset')} className="group p-6 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 hover:border-orange-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-orange-400 mb-1">Sunset (Günbatımı)</h3>
              <p className="text-orange-400/50 text-sm">Turuncu ve pembe tonlarıyla sıcak ve romantik bir masaüstü.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
          </div>

          <div onClick={() => applyTheme('ocean')} className="group p-6 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-1">Ocean (Okyanus)</h3>
              <p className="text-cyan-400/50 text-sm">Derin deniz mavisi cam efektleri ve inanılmaz bir derinlik hissi.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
          </div>

          <div onClick={() => applyTheme('aurora')} className="group p-6 bg-gradient-to-r from-green-400/10 to-blue-500/10 border border-green-400/20 hover:border-green-400/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-1">Aurora (Animasyonlu K. Işıkları)</h3>
              <p className="text-green-400/50 text-sm">Widget arkaplanlarında hareketli degrade (gradient) animasyonları çalışır.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">→</div>
          </div>
        </div>
      </div>
    </div>
  )
}
