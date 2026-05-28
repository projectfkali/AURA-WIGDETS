import React, { useEffect } from 'react';
import useStore from '../../../store/useStore';

export default function StorePanel() {
  const { storeWidgets, loadingStore, setStoreWidgets, setLoadingStore, addWidget } = useStore();

  useEffect(() => {
    if (storeWidgets.length === 0) {
      setLoadingStore(true)
      
      const fallbackStoreWidgets = [
        {
          id: 'mock_1', name: 'Cyber Clock', author: 'Neo', downloads: 1250,
          description: 'Cyberpunk temalı özel tasarım saat widgetı.',
          htmlContent: '<div style="background:rgba(0,0,0,0.8);color:#a855f7;padding:20px;border-radius:16px;border:2px solid #a855f7;font-family:monospace;font-size:24px;text-align:center;">CYBER_TIME: <br/><span id="time">00:00:00</span></div><script>setInterval(() => document.getElementById("time").innerText = new Date().toLocaleTimeString(), 1000)</script>'
        },
        {
          id: 'mock_2', name: 'Minimal Terminal', author: 'root', downloads: 890,
          description: 'Hacker hissiyatı veren retro terminal ekranı.',
          htmlContent: '<div style="background:#000;color:#4ade80;padding:20px;border-radius:8px;font-family:monospace;height:100%;width:100%;">user@aura:~$ ping 8.8.8.8<br/>64 bytes from 8.8.8.8: icmp_seq=1 ttl=115 time=14.3 ms<br/>user@aura:~$ _</div>'
        },
        {
          id: 'mock_3', name: 'Neon Text', author: 'Aura', downloads: 3400,
          description: 'Masaüstünüzü aydınlatacak neon parlayan metin.',
          htmlContent: '<div style="display:flex;align-items:center;justify-content:center;height:100%;"><h1 style="color:#fff;text-shadow:0 0 10px #fff,0 0 20px #fff,0 0 40px #ff00de,0 0 80px #ff00de;font-family:sans-serif;">STAY FOCUSED</h1></div>'
        }
      ]

      fetch('https://jsonblob.com/api/jsonBlob/019e6603-2cb0-72ca-8ab7-2898eace8c5c')
        .then(res => res.json())
        .then(data => {
          setStoreWidgets((data.widgets && data.widgets.length > 0) ? data.widgets : fallbackStoreWidgets)
          setLoadingStore(false)
        })
        .catch(err => {
          console.error("Store error:", err)
          setStoreWidgets(fallbackStoreWidgets)
          setLoadingStore(false)
        })
    }
  }, []);

  const handleDownload = (widget) => {
    addWidget('custom', { 
      scale: 1.0, opacity: 0.1, blur: 0, radius: 16, htmlContent: widget.htmlContent, width: 400, height: 400, borderWidth: 0 
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Aura Mağazası (Topluluk)</h2>
          <p className="text-white/50">Diğer kullanıcılar tarafından kodlanmış gelişmiş modülleri indirin.</p>
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
                <button onClick={() => handleDownload(widget)} className="mt-auto w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                  İndir ve Ekle ({widget.downloads} İndirme)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
