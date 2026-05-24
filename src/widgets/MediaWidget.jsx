import { useState, useEffect } from 'react'

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

  const [trackInfo, setTrackInfo] = useState({ title: 'Sistem Sesi', artist: 'Windows' })

  useEffect(() => {
    let interval;
    if (window.electronAPI?.getMediaInfo) {
      interval = setInterval(async () => {
        const info = await window.electronAPI.getMediaInfo();
        if (info && info.Track) {
           let parts = info.Track.split(' - ');
           if (parts.length > 1) {
             setTrackInfo({ artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() });
           } else {
             setTrackInfo({ title: info.Track, artist: info.Status === 'Playing' ? 'Spotify' : 'Windows' });
           }
           setIsPlaying(info.Status === 'Playing');
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, []);

  const handleAction = (action) => {
    if (window.electronAPI) {
      window.electronAPI.mediaControl(action)
      if (action === 'play_pause') setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="glass-panel w-72 flex flex-col overflow-hidden group">
      
      {/* Album Art Area (Click to launch) */}
      <div 
        className="h-32 bg-gradient-to-br from-pink-500/20 to-purple-600/20 relative overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity drag-handle"
        onClick={() => handleAction('launch')}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl pointer-events-none">
          <svg className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        
        {/* Animated equalizer waves when playing */}
        {isPlaying && (
          <div className="absolute bottom-3 right-3 flex gap-1 items-end h-4 pointer-events-none">
            <div className="w-1 bg-green-400 rounded-t animate-bounce" style={{animationDuration: '0.7s'}}></div>
            <div className="w-1 bg-green-400 rounded-t animate-bounce" style={{animationDuration: '0.5s'}}></div>
            <div className="w-1 bg-green-400 rounded-t animate-bounce" style={{animationDuration: '0.9s'}}></div>
          </div>
        )}
      </div>

      {/* Info & Controls Area */}
      <div className="p-4 bg-black/20 backdrop-blur-lg border-t border-white/5">
        <div className="mb-4">
          <h3 className="font-bold text-white text-lg truncate drop-shadow-md">{trackInfo.title}</h3>
          <p className="text-white/60 text-sm truncate">{trackInfo.artist}</p>
        </div>

        <div className="flex items-center justify-between px-2">
          <button 
            onClick={() => handleAction('prev')}
            className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
          </button>
          
          <button 
            onClick={() => handleAction('play_pause')}
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 hover:bg-gray-200 transition-all shadow-lg"
          >
            {isPlaying ? (
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            ) : (
               <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            )}
          </button>
          
          <button 
            onClick={() => handleAction('next')}
            className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0013 14v-2.798l5.445 3.63A1 1 0 0020 14V6a1 1 0 00-1.555-.832L13 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4zM4.555 14.832A1 1 0 006 14v-2.798l5.445 3.63A1 1 0 0013 14V6a1 1 0 00-1.555-.832L6 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
