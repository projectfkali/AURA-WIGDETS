import React, { memo } from 'react';
import LivePreview from './LivePreview';

const colorMap = {
  white: 'bg-white text-black',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  purple: 'bg-purple-500 text-white',
  red: 'bg-red-500 text-white'
};

const WidgetSettingsSidebar = memo(({ widget, updateSetting, closeSidebar, removeWidget }) => {
  if (!widget) return null;
  const s = widget.settings || {};

  return (
    <div className="fixed top-0 right-0 h-full w-[400px] lg:w-[450px] bg-[#1c1c1e]/80 backdrop-blur-3xl border-l border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-500 translate-x-0">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0 bg-black/20">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Ayarları</h2>
          <p className="text-xs text-white/50 font-mono mt-1">ID: {widget.id}</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => removeWidget(widget.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
           </button>
           <button onClick={closeSidebar} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sabit Üst Kısım: Canlı Önizleme */}
        <div className="shrink-0 p-5 border-b border-white/10 bg-black/10 relative z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-2">
             <span className="text-[13px] text-white/50 uppercase ml-4 block mb-1">Canlı Önizleme</span>
             <div className="ios-inset-group p-4 flex items-center justify-center min-h-[200px] relative bg-black/20" style={{ overflow: 'hidden' }}>
               <div className="relative flex items-center justify-center" style={{ transform: `scale(${Math.min(1, 350 / Math.max(1, s.width || 300))})`, transformOrigin: 'center' }}>
                 <LivePreview widget={widget} />
               </div>
             </div>
          </div>
        </div>

        {/* Kaydırılabilir Alt Kısım: Ayarlar */}
        <div className="flex-1 overflow-y-auto p-5 space-y-7 custom-scrollbar pb-32">
          
          {/* Görünüm Ayarları */}
        <div>
          <span className="text-[13px] text-white/50 uppercase ml-4 block mb-2">Görünüm ve Stil</span>
          <div className="ios-inset-group flex flex-col">
            <div className="ios-list-item">
               <div className="flex flex-col">
                  <span className="text-white text-[16px]">Şeffaf Mod (Kapsül)</span>
                  <span className="text-white/40 text-[12px]">Sadece içerik görünür.</span>
               </div>
               <input type="checkbox" className="ios-switch" checked={s.isTransparent || false} onChange={e => updateSetting(widget.id, 'isTransparent', e.target.checked)} />
            </div>
            
            <div className={`ios-list-item flex-col items-start gap-3 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
               <div className="flex justify-between w-full items-center">
                  <span className="text-white text-[16px]">Arkaplan Koyuluğu</span>
                  <span className="text-white/50 text-[15px]">{Math.round((s.opacity ?? 0.4) * 100)}%</span>
               </div>
               <input type="range" min="0" max="1" step="0.05" value={s.opacity ?? 0.4} onChange={e => updateSetting(widget.id, 'opacity', parseFloat(e.target.value))} className="ios-slider" />
            </div>

            <div className={`ios-list-item flex-col items-start gap-3 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
               <div className="flex justify-between w-full items-center">
                  <span className="text-white text-[16px]">Bulanıklık (Blur)</span>
                  <span className="text-white/50 text-[15px]">{s.blur ?? 24}px</span>
               </div>
               <input type="range" min="0" max="50" step="1" value={s.blur ?? 24} onChange={e => updateSetting(widget.id, 'blur', parseInt(e.target.value))} className="ios-slider" />
            </div>
            
            <div className={`ios-list-item flex-col items-start gap-3 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
               <div className="flex justify-between w-full items-center">
                  <span className="text-white text-[16px]">Köşe Yuvarlaklığı</span>
                  <span className="text-white/50 text-[15px]">{s.radius ?? 32}px</span>
               </div>
               <input type="range" min="0" max="100" step="2" value={s.radius ?? 32} onChange={e => updateSetting(widget.id, 'radius', parseInt(e.target.value))} className="ios-slider" />
            </div>

            {widget.type !== 'custom' && widget.type !== 'smart' && widget.type !== 'notes' && (
              <div className="ios-list-item flex-col items-start gap-3">
                 <span className="text-white text-[16px]">Tema Rengi</span>
                 <div className="flex gap-4">
                   {Object.keys(colorMap).map(color => (
                     <button
                       key={color}
                       onClick={() => updateSetting(widget.id, 'color', color)}
                       className={`w-8 h-8 rounded-full border-[3px] transition-transform ${s.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'} ${colorMap[color].split(' ')[0]}`}
                     />
                   ))}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Boyut Ayarları */}
        <div>
          <span className="text-[13px] text-white/50 uppercase ml-4 block mb-2">Boyutlandırma</span>
          <div className="ios-inset-group flex flex-col">
            <div className="ios-list-item flex-col items-start gap-3">
               <div className="flex justify-between w-full items-center">
                  <span className="text-white text-[16px]">Genişlik (W)</span>
                  <span className="text-white/50 text-[15px]">{s.width || 300}px</span>
               </div>
               <input type="range" min="100" max="1200" step="10" value={s.width || 300} onChange={e => updateSetting(widget.id, 'width', parseInt(e.target.value))} className="ios-slider" />
            </div>
            <div className="ios-list-item flex-col items-start gap-3">
               <div className="flex justify-between w-full items-center">
                  <span className="text-white text-[16px]">Yükseklik (H)</span>
                  <span className="text-white/50 text-[15px]">{s.height || 200}px</span>
               </div>
               <input type="range" min="100" max="1200" step="10" value={s.height || 200} onChange={e => updateSetting(widget.id, 'height', parseInt(e.target.value))} className="ios-slider" />
            </div>
            <div className={`ios-list-item flex-col items-start gap-3 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
               <div className="flex justify-between w-full items-center">
                  <span className="text-white text-[16px]">İç Boşluk (Padding)</span>
                  <span className="text-white/50 text-[15px]">{s.padding ?? 24}px</span>
               </div>
               <input type="range" min="0" max="100" step="2" value={s.padding ?? 24} onChange={e => updateSetting(widget.id, 'padding', parseInt(e.target.value))} className="ios-slider" />
            </div>
            <div className="ios-list-item flex-col items-start gap-3">
               <div className="flex justify-between w-full items-center">
                  <span className="text-white text-[16px]">Genel Büyüklük (Scale)</span>
                  <span className="text-white/50 text-[15px]">{s.scale || 1.0}x</span>
               </div>
               <input type="range" min="0.5" max="3.0" step="0.1" value={s.scale || 1.0} onChange={e => updateSetting(widget.id, 'scale', parseFloat(e.target.value))} className="ios-slider" />
            </div>
          </div>
        </div>

        {/* Veri / Widget Özel Ayarları */}
        {widget.type === 'crypto' && (
          <div>
            <span className="text-[13px] text-white/50 uppercase ml-4 block mb-2">Veri Kaynağı</span>
            <div className="ios-inset-group">
              <div className="ios-list-item">
                <span className="text-white text-[16px]">Kripto Para</span>
                <select value={s.coin || 'solana'} onChange={e => updateSetting(widget.id, 'coin', e.target.value)} className="bg-transparent text-white/80 outline-none text-right text-[16px] cursor-pointer appearance-none px-2">
                  <option value="bitcoin" className="bg-[#1c1c1e]">Bitcoin (BTC)</option>
                  <option value="ethereum" className="bg-[#1c1c1e]">Ethereum (ETH)</option>
                  <option value="solana" className="bg-[#1c1c1e]">Solana (SOL)</option>
                  <option value="dogecoin" className="bg-[#1c1c1e]">Dogecoin (DOGE)</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {widget.type === 'weather' && (
          <div>
            <span className="text-[13px] text-white/50 uppercase ml-4 block mb-2">Lokasyon Ayarı</span>
            <div className="ios-inset-group">
              <div className="ios-list-item">
                <span className="text-white text-[16px]">Şehir</span>
                <select value={`${s.lat || '41.0082'},${s.lon || '28.9784'}`} onChange={e => {
                  const [lat, lon] = e.target.value.split(',')
                  updateSetting(widget.id, 'lat', lat)
                  updateSetting(widget.id, 'lon', lon)
                }} className="bg-transparent text-white/80 outline-none text-right text-[16px] cursor-pointer appearance-none px-2">
                  <option value="41.0082,28.9784" className="bg-[#1c1c1e]">İstanbul</option>
                  <option value="39.9208,32.8541" className="bg-[#1c1c1e]">Ankara</option>
                  <option value="38.4237,27.1428" className="bg-[#1c1c1e]">İzmir</option>
                  <option value="40.7128,-74.0060" className="bg-[#1c1c1e]">New York</option>
                  <option value="51.5074,-0.1278" className="bg-[#1c1c1e]">London</option>
                  <option value="35.6762,139.6503" className="bg-[#1c1c1e]">Tokyo</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {widget.type === 'github' && (
          <div>
            <span className="text-[13px] text-white/50 uppercase ml-4 block mb-2">Github API Verisi</span>
            <div className="ios-inset-group">
              <div className="ios-list-item flex-col items-start gap-3">
                <span className="text-white text-[16px]">Kullanıcı Adı</span>
                <input 
                  type="text" 
                  value={s.username || 'mert'} 
                  onChange={e => updateSetting(widget.id, 'username', e.target.value)} 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder="github username..."
                />
              </div>
            </div>
          </div>
        )}

        {widget.type === 'news' && (
          <div>
            <span className="text-[13px] text-white/50 uppercase ml-4 block mb-2">RSS Haber Kaynağı</span>
            <div className="ios-inset-group">
              <div className="ios-list-item flex-col items-start gap-3">
                <span className="text-white text-[16px]">Haber Kategorisi</span>
                <select 
                  value={s.category || 'technology'} 
                  onChange={e => updateSetting(widget.id, 'category', e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="technology">Teknoloji</option>
                  <option value="business">İş / Finans</option>
                  <option value="sports">Spor</option>
                  <option value="science">Bilim</option>
                  <option value="general">Gündem</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {widget.type === 'worldclock' && (
          <div>
            <span className="text-[13px] text-white/50 uppercase ml-4 block mb-2">Zaman Dilimi Ayarı</span>
            <div className="ios-inset-group">
              <div className="ios-list-item flex-col items-start gap-3">
                <span className="text-white text-[16px]">Bölge (Timezone)</span>
                <select 
                  value={s.timezone || 'Europe/Istanbul'} 
                  onChange={e => updateSetting(widget.id, 'timezone', e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="Europe/Istanbul">İstanbul (TR)</option>
                  <option value="America/New_York">New York (EST)</option>
                  <option value="Europe/London">Londra (GMT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sidney (AEST)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {widget.type === 'custom' && (
          <div>
            <span className="text-[13px] text-white/50 uppercase ml-4 block mb-2">Özel Kod (HTML/CSS)</span>
            <div className="ios-inset-group">
              <div className="p-4 flex-col items-start gap-3 w-full">
                <textarea 
                  value={s.htmlContent || '<h1>Merhaba Aura!</h1>'} 
                  onChange={e => updateSetting(widget.id, 'htmlContent', e.target.value)} 
                  className="w-full h-32 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-xs outline-none focus:border-blue-500 transition-colors"
                  placeholder="<div>Özel kodunuzu buraya yazın...</div>"
                />
              </div>
            </div>
          </div>
        )}
        
        </div>
      </div>
    </div>
  );
});

export default WidgetSettingsSidebar;
