import React from 'react';
import useStore from '../../../store/useStore';

export default function ActivePanel() {
  const { config, removeWidget, setEditingId } = useStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Aktif Modüller</h2>
          <p className="text-white/50">Masaüstünüzde anlık olarak çalışan widget'lar ({config.widgets?.length || 0})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.widgets?.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
             <div className="text-6xl mb-4 opacity-50">🛸</div>
             <h3 className="text-xl font-bold mb-2">Masaüstünüz Çok Boş</h3>
             <p className="text-white/50">Keşfet sekmesinden yeni widget'lar ekleyin.</p>
          </div>
        ) : (
          config.widgets?.map(widget => (
            <div key={widget.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center font-bold uppercase text-white/70">
                  {widget.type.substring(0,2)}
                </div>
                <div>
                  <h3 className="font-bold capitalize">{widget.type}</h3>
                  <p className="text-xs text-white/40">ID: {widget.id.split('_')[1]}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingId(widget.id)} className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button onClick={() => removeWidget(widget.id)} className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
