import { useState } from 'react'

const colorMap = {
  white: 'text-white',
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  red: 'text-red-400'
}

export default function MediaWidget({ settings }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const theme = colorMap[settings.color || 'white']

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (window.electronAPI) window.electronAPI.mediaControl('playpause')
  }

  const nextTrack = () => {
    setIsPlaying(true)
    if (window.electronAPI) window.electronAPI.mediaControl('next')
  }
  
  const prevTrack = () => {
    setIsPlaying(true)
    if (window.electronAPI) window.electronAPI.mediaControl('prev')
  }

  const openPlayer = () => {
    if (window.electronAPI) window.electronAPI.mediaControl('open-spotify')
  }

  return (
    <div className="glass-panel p-4 w-[280px] flex items-center gap-4 group">
      
      {/* Cover Art - Click to open Spotify */}
      <div 
        onClick={openPlayer}
        title="Spotify'ı Aç"
        className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 relative cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
      >
        <img 
          src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200" 
          alt="Album Cover" 
          className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
           <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.47-.077-.334.132-.67.47-.745 3.808-.87 7.076-.496 9.712 1.115.293.18.386.563.207.856zm1.2-3.15c-.225.367-.704.482-1.072.257-2.687-1.652-6.785-2.13-9.965-1.166-.413.127-.854-.108-.98-.52-.126-.413.108-.854.52-.98 3.65-1.11 8.28-.584 11.34 1.305.368.226.482.705.257 1.072zm.105-3.32c-3.21-1.905-8.5-2.08-11.56-1.15-.49.15-.99-.13-1.14-.62-.15-.49.13-.99.62-1.14 3.53-1.07 9.38-.86 13.06 1.33.44.26.58.83.32 1.27-.26.44-.83.58-1.3.31z"/></svg>
        </div>
      </div>

      {/* Info & Controls */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-2">
          <h4 className="font-bold text-sm leading-tight truncate w-[160px]">Aktif Medya</h4>
          <p className="text-[11px] text-white/50 truncate w-[160px]">Sistem Ses Çıkışı</p>
        </div>
        
        <div className={`flex items-center gap-3 ${theme}`}>
          <button onClick={prevTrack} className="hover:scale-110 transition-transform opacity-70 hover:opacity-100 focus:outline-none">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
          </button>
          
          <button onClick={togglePlay} className="hover:scale-110 transition-transform bg-white/10 p-1.5 rounded-full focus:outline-none">
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            )}
          </button>
          
          <button onClick={nextTrack} className="hover:scale-110 transition-transform opacity-70 hover:opacity-100 focus:outline-none">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6v12l8.5-6L8 6zm8 0h2v12h-2z"></path></svg>
          </button>
        </div>
      </div>

      {/* Visualizer bars */}
      <div className="absolute top-4 right-4 flex gap-0.5 items-end h-3">
        {[1,2,3].map(i => (
          <div 
            key={i} 
            className={`w-1 rounded-t-sm ${theme.replace('text-', 'bg-')}`} 
            style={{ 
              height: isPlaying ? `${Math.random() * 80 + 20}%` : '15%',
              transition: 'height 0.2s ease'
            }}
          ></div>
        ))}
      </div>

    </div>
  )
}
