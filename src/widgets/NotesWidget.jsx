import { useState, useEffect } from 'react'

const bgColorMap = {
  white: 'bg-white/10',
  blue: 'bg-blue-400/20',
  green: 'bg-green-400/20',
  purple: 'bg-purple-400/20',
  red: 'bg-red-400/20'
}

export default function NotesWidget({ settings, updateSettings }) {
  const [content, setContent] = useState(settings.content || '')
  const bgColor = bgColorMap[settings.color || 'white']

  useEffect(() => {
    setContent(settings.content || '')
  }, [settings.content])

  const handleChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    
    // Debounce ile ayarları güncelle
    if (window.noteTimeout) clearTimeout(window.noteTimeout)
    window.noteTimeout = setTimeout(() => {
      updateSettings({ content: newContent })
    }, 1000)
  }

  return (
    <div className={`glass-panel p-4 w-[250px] flex flex-col ${bgColor}`}>
      <div className="flex items-center gap-2 mb-2 text-white/70 border-b border-white/10 pb-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        <span className="text-xs font-medium uppercase tracking-wider">Hızlı Notlar</span>
      </div>
      <textarea 
        value={content}
        onChange={handleChange}
        className="w-full h-[150px] bg-transparent resize-none outline-none text-sm text-white/90 placeholder-white/30" 
        placeholder="Bir şeyler yazın..."
      />
    </div>
  )
}
