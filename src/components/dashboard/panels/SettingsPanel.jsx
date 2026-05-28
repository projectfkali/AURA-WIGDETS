import React, { useRef } from 'react';
import useStore from '../../../store/useStore';

export default function SettingsPanel() {
  const { config, setConfig } = useStore();
  const fileInputRef = useRef(null);

  const exportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "aura-desktop-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importConfig = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target.result);
        if (importedConfig && importedConfig.widgets) {
          setConfig(importedConfig);
          alert('Düzen başarıyla içe aktarıldı!');
        }
      } catch (err) {
        alert('Geçersiz dosya formatı.');
      }
    };
    reader.readAsText(file);
  };

  return (
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
  )
}
