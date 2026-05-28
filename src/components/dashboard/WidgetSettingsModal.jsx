import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LivePreview from './LivePreview';

const colorMap = {
  white: 'bg-white text-black',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  purple: 'bg-purple-500 text-white',
  red: 'bg-red-500 text-white'
};

const WidgetSettingsModal = memo(({ widget, updateSetting, closeModal, removeWidget }) => {
  if (!widget) return null;
  const s = widget.settings || {};
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'data'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
      {/* Background Dim & Blur Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
        onClick={closeModal}
      />

      {/* VisionOS Glass Modal Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-6xl h-[85vh] bg-white/[0.05] backdrop-blur-3xl border border-white/20 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col md:flex-row overflow-hidden ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Side: Live Preview (Sticky & Spacious) */}
        <div className="w-full md:w-[45%] h-full bg-black/30 border-r border-white/10 flex flex-col relative z-10 shrink-0">
          <div className="p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
             
             {/* Glow effect behind widget */}
             <div className="absolute inset-0 pointer-events-none opacity-30">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
             </div>

             {/* Auto Scale Wrapper */}
             <div className="relative flex items-center justify-center" style={{ transform: `scale(${Math.min(1, 400 / Math.max(1, s.width || 300))})`, transformOrigin: 'center' }}>
               <LivePreview widget={widget} />
             </div>
             
             <div className="absolute bottom-8 left-0 w-full flex justify-center">
                <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-lg flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-white/70 text-sm font-medium tracking-wide uppercase">Canlı Görünüm</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Settings & Controls */}
        <div className="w-full md:w-[55%] h-full flex flex-col bg-white/[0.02]">
          
          {/* Top Navbar / Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/10 shrink-0">
             <div>
               <h2 className="text-3xl font-bold tracking-tight text-white mb-1 capitalize">{widget.type} Düzenleyici</h2>
               <p className="text-sm text-white/50 font-mono">Benzersiz Kimlik: {widget.id}</p>
             </div>
             <div className="flex gap-3">
                <button onClick={() => removeWidget(widget.id)} className="px-5 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 font-medium rounded-[16px] transition-all duration-300">
                  Sil
                </button>
                <button onClick={closeModal} className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-8 pt-6 shrink-0">
            <div className="flex bg-black/40 p-1.5 rounded-[20px] border border-white/10">
              <button 
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2.5 rounded-[16px] font-medium text-sm transition-all duration-300 ${activeTab === 'design' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
              >
                Görünüm & Boyut
              </button>
              <button 
                onClick={() => setActiveTab('data')}
                className={`flex-1 py-2.5 rounded-[16px] font-medium text-sm transition-all duration-300 ${activeTab === 'data' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
              >
                Veri & API (Bağlantılar)
              </button>
            </div>
          </div>

          {/* Scrollable Settings Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            
            <AnimatePresence mode="wait">
              {activeTab === 'design' && (
                <motion.div 
                  key="design"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  
                  {/* Görünüm Ayarları */}
                  <div>
                    <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">Stil Özelleştirmesi</span>
                    <div className="ios-inset-group flex flex-col">
                      <div className="ios-list-item px-6 py-4">
                         <div className="flex flex-col">
                            <span className="text-white font-medium text-[16px]">Şeffaf Kapsül Modu</span>
                            <span className="text-white/40 text-[13px]">Sadece iç öğeler görünür.</span>
                         </div>
                         <input type="checkbox" className="ios-switch" checked={s.isTransparent || false} onChange={e => updateSetting(widget.id, 'isTransparent', e.target.checked)} />
                      </div>
                      
                      <div className={`ios-list-item flex-col items-start gap-4 px-6 py-4 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
                         <div className="flex justify-between w-full items-center">
                            <span className="text-white font-medium text-[16px]">Arkaplan Koyuluğu</span>
                            <span className="text-white/50 font-mono text-[14px]">{Math.round((s.opacity ?? 0.4) * 100)}%</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.05" value={s.opacity ?? 0.4} onChange={e => updateSetting(widget.id, 'opacity', parseFloat(e.target.value))} className="ios-slider" />
                      </div>

                      <div className={`ios-list-item flex-col items-start gap-4 px-6 py-4 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
                         <div className="flex justify-between w-full items-center">
                            <span className="text-white font-medium text-[16px]">Cam Bulanıklığı (Blur)</span>
                            <span className="text-white/50 font-mono text-[14px]">{s.blur ?? 24}px</span>
                         </div>
                         <input type="range" min="0" max="50" step="1" value={s.blur ?? 24} onChange={e => updateSetting(widget.id, 'blur', parseInt(e.target.value))} className="ios-slider" />
                      </div>
                      
                      <div className={`ios-list-item flex-col items-start gap-4 px-6 py-4 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
                         <div className="flex justify-between w-full items-center">
                            <span className="text-white font-medium text-[16px]">Köşe Yuvarlaklığı</span>
                            <span className="text-white/50 font-mono text-[14px]">{s.radius ?? 32}px</span>
                         </div>
                         <input type="range" min="0" max="100" step="2" value={s.radius ?? 32} onChange={e => updateSetting(widget.id, 'radius', parseInt(e.target.value))} className="ios-slider" />
                      </div>

                      <div className={`ios-list-item px-6 py-4 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
                         <div className="flex flex-col">
                            <span className="text-white font-medium text-[16px]">Hareketli Degrade (Animasyon)</span>
                            <span className="text-white/40 text-[13px]">Arkaplanda dönen canlı renk geçişleri.</span>
                         </div>
                         <input type="checkbox" className="ios-switch" checked={s.animatedGradient || false} onChange={e => updateSetting(widget.id, 'animatedGradient', e.target.checked)} />
                      </div>

                      {widget.type !== 'custom' && widget.type !== 'smart' && widget.type !== 'notes' && (
                        <div className="ios-list-item flex-col items-start gap-4 px-6 py-4">
                           <span className="text-white font-medium text-[16px]">Tema Rengi</span>
                           <div className="flex gap-4">
                             {Object.keys(colorMap).map(color => (
                               <button
                                 key={color}
                                 onClick={() => updateSetting(widget.id, 'color', color)}
                                 className={`w-10 h-10 rounded-full border-[3px] transition-transform ${s.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'} ${colorMap[color].split(' ')[0]}`}
                               />
                             ))}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Boyut Ayarları */}
                  <div>
                    <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">Ölçek ve Boyutlandırma</span>
                    <div className="ios-inset-group flex flex-col">
                      <div className="ios-list-item flex-col items-start gap-4 px-6 py-4">
                         <div className="flex justify-between w-full items-center">
                            <span className="text-white font-medium text-[16px]">Genişlik (W)</span>
                            <span className="text-white/50 font-mono text-[14px]">{s.width || 300}px</span>
                         </div>
                         <input type="range" min="100" max="1200" step="10" value={s.width || 300} onChange={e => updateSetting(widget.id, 'width', parseInt(e.target.value))} className="ios-slider" />
                      </div>
                      <div className="ios-list-item flex-col items-start gap-4 px-6 py-4">
                         <div className="flex justify-between w-full items-center">
                            <span className="text-white font-medium text-[16px]">Yükseklik (H)</span>
                            <span className="text-white/50 font-mono text-[14px]">{s.height || 200}px</span>
                         </div>
                         <input type="range" min="100" max="1200" step="10" value={s.height || 200} onChange={e => updateSetting(widget.id, 'height', parseInt(e.target.value))} className="ios-slider" />
                      </div>
                      <div className={`ios-list-item flex-col items-start gap-4 px-6 py-4 transition-opacity duration-300 ${s.isTransparent ? 'opacity-30 pointer-events-none' : ''}`}>
                         <div className="flex justify-between w-full items-center">
                            <span className="text-white font-medium text-[16px]">İç Boşluk (Padding)</span>
                            <span className="text-white/50 font-mono text-[14px]">{s.padding ?? 24}px</span>
                         </div>
                         <input type="range" min="0" max="100" step="2" value={s.padding ?? 24} onChange={e => updateSetting(widget.id, 'padding', parseInt(e.target.value))} className="ios-slider" />
                      </div>
                      <div className="ios-list-item flex-col items-start gap-4 px-6 py-4">
                         <div className="flex justify-between w-full items-center">
                            <span className="text-white font-medium text-[16px]">Genel Büyüklük Çarpanı</span>
                            <span className="text-white/50 font-mono text-[14px]">{s.scale || 1.0}x</span>
                         </div>
                         <input type="range" min="0.5" max="3.0" step="0.1" value={s.scale || 1.0} onChange={e => updateSetting(widget.id, 'scale', parseFloat(e.target.value))} className="ios-slider" />
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {activeTab === 'data' && (
                <motion.div 
                  key="data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  
                  {widget.type === 'ai' ? (
                    <div>
                      <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">OpenAI API Bağlantısı</span>
                      <div className="ios-inset-group">
                        <div className="ios-list-item flex-col items-start gap-4 px-6 py-4">
                          <span className="text-white font-medium text-[16px]">API Anahtarı (Secret Key)</span>
                          <input 
                            type="password" 
                            value={s.aiApiKey || ''} 
                            onChange={e => updateSetting(widget.id, 'aiApiKey', e.target.value)} 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-lg outline-none focus:border-blue-500 transition-colors shadow-inner"
                            placeholder="sk-..."
                          />
                          <p className="text-white/40 text-[12px]">Bu alanı doldurduğunuzda AI Widget'ınız doğrudan ChatGPT (OpenAI) sunucularıyla konuşmaya başlar. Anahtarınız sadece bilgisayarınızda (yerel) saklanır.</p>
                        </div>
                      </div>
                    </div>
                  ) : widget.type === 'crypto' ? (
                    <div>
                      <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">Kripto Market Verisi</span>
                      <div className="ios-inset-group">
                        <div className="ios-list-item px-6 py-4">
                          <span className="text-white font-medium text-[16px]">Listelenecek Coin</span>
                          <select value={s.coin || 'solana'} onChange={e => updateSetting(widget.id, 'coin', e.target.value)} className="bg-white/10 border border-white/20 rounded-xl text-white outline-none px-4 py-2 cursor-pointer transition-colors hover:bg-white/20">
                            <option value="bitcoin" className="bg-[#1c1c1e]">Bitcoin (BTC)</option>
                            <option value="ethereum" className="bg-[#1c1c1e]">Ethereum (ETH)</option>
                            <option value="solana" className="bg-[#1c1c1e]">Solana (SOL)</option>
                            <option value="dogecoin" className="bg-[#1c1c1e]">Dogecoin (DOGE)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : widget.type === 'weather' ? (
                    <div>
                      <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">Meteoroloji İstasyonu</span>
                      <div className="ios-inset-group">
                        <div className="ios-list-item px-6 py-4">
                          <span className="text-white font-medium text-[16px]">Koordinat / Şehir</span>
                          <select value={`${s.lat || '41.0082'},${s.lon || '28.9784'}`} onChange={e => {
                            const [lat, lon] = e.target.value.split(',')
                            updateSetting(widget.id, 'lat', lat)
                            updateSetting(widget.id, 'lon', lon)
                          }} className="bg-white/10 border border-white/20 rounded-xl text-white outline-none px-4 py-2 cursor-pointer transition-colors hover:bg-white/20">
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
                  ) : widget.type === 'github' ? (
                    <div>
                      <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">Geliştirici Profil Bağlantısı</span>
                      <div className="ios-inset-group">
                        <div className="ios-list-item flex-col items-start gap-4 px-6 py-4">
                          <span className="text-white font-medium text-[16px]">Github Kullanıcı Adı (Username)</span>
                          <input 
                            type="text" 
                            value={s.username || 'mert'} 
                            onChange={e => updateSetting(widget.id, 'username', e.target.value)} 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-lg outline-none focus:border-blue-500 transition-colors shadow-inner"
                            placeholder="Örn: torvalds"
                          />
                          <p className="text-white/40 text-[12px]">Herkese açık reposu olan herhangi bir kullanıcı adını girebilirsiniz. Heatmap verileri otomatik çekilir.</p>
                        </div>
                      </div>
                    </div>
                  ) : widget.type === 'news' ? (
                    <div>
                      <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">Canlı Haber Akışı</span>
                      <div className="ios-inset-group">
                        <div className="ios-list-item flex-col items-start gap-4 px-6 py-4">
                          <span className="text-white font-medium text-[16px]">Odaklanılacak Kategori</span>
                          <select 
                            value={s.category || 'technology'} 
                            onChange={e => updateSetting(widget.id, 'category', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-lg outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-inner"
                          >
                            <option value="technology">Teknoloji & Yapay Zeka</option>
                            <option value="business">İş Dünyası & Finans</option>
                            <option value="sports">Spor Müsabakaları</option>
                            <option value="science">Bilim & Uzay</option>
                            <option value="general">Gündem / Genel</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : widget.type === 'worldclock' ? (
                    <div>
                      <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">Saat & Bölge Yönetimi</span>
                      <div className="ios-inset-group">
                        <div className="ios-list-item flex-col items-start gap-4 px-6 py-4">
                          <span className="text-white font-medium text-[16px]">Saat Dilimi (Timezone)</span>
                          <select 
                            value={s.timezone || 'Europe/Istanbul'} 
                            onChange={e => updateSetting(widget.id, 'timezone', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-lg outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-inner"
                          >
                            <option value="Europe/Istanbul">İstanbul (Türkiye Saati)</option>
                            <option value="America/New_York">New York (EST)</option>
                            <option value="Europe/London">Londra (GMT)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Australia/Sydney">Sidney (AEST)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : widget.type === 'custom' ? (
                    <div>
                      <span className="text-[14px] text-white/50 uppercase tracking-wider ml-2 block mb-3 font-bold">Gelişmiş Yazılım Entegrasyonu</span>
                      <div className="ios-inset-group">
                        <div className="flex-col items-start gap-4 p-6 w-full">
                          <span className="text-white font-medium text-[16px] mb-3 block">Özel Kod (HTML/CSS) Editörü</span>
                          <textarea 
                            value={s.htmlContent || '<h1>Merhaba Aura!</h1>'} 
                            onChange={e => updateSetting(widget.id, 'htmlContent', e.target.value)} 
                            className="w-full h-48 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-blue-500 transition-colors shadow-inner custom-scrollbar"
                            placeholder="<div>Özel kodunuzu buraya yazın...</div>"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                      <div className="text-4xl mb-4">✨</div>
                      <p className="text-white font-medium">Bu widget için özel bir veri ayarı bulunmuyor.</p>
                      <p className="text-white/50 text-sm mt-1">Görünüm sekmesinden tasarımı değiştirebilirsiniz.</p>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default WidgetSettingsModal;
