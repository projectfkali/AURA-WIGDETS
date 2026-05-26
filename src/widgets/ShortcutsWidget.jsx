export default function ShortcutsWidget({ settings }) {
  const defaultShortcuts = [
    { name: 'Google', url: 'https://google.com', icon: 'G', color: 'bg-white text-black' },
    { name: 'YouTube', url: 'https://youtube.com', icon: 'Y', color: 'bg-red-500 text-white' },
    { name: 'GitHub', url: 'https://github.com', icon: 'GH', color: 'bg-gray-800 text-white' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'AI', color: 'bg-emerald-500 text-white' }
  ]

  // Dashboard ayarlarından gelen kısayolları kullan, yoksa varsayılanları
  const shortcuts = settings.customShortcuts || defaultShortcuts

  // Renk ataması (icon ilk harfine göre)
  const colorPalette = [
    'bg-white text-black',
    'bg-red-500 text-white',
    'bg-gray-800 text-white',
    'bg-emerald-500 text-white',
    'bg-blue-500 text-white',
    'bg-purple-500 text-white',
    'bg-yellow-500 text-black',
    'bg-pink-500 text-white'
  ]

  const openUrl = (url) => {
    if (window.electronAPI) {
      window.electronAPI.openExternal(url)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-around p-2 gap-2">
      {shortcuts.map((s, idx) => (
        <div 
          key={idx}
          onClick={() => openUrl(s.url)}
          className={`flex-1 aspect-square max-w-[64px] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl group relative ${s.color || colorPalette[idx % colorPalette.length]} border border-white/10`}
          title={s.name}
        >
          <span className="font-black text-xl">{s.icon}</span>
          <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity mt-1 absolute -bottom-5 text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-md whitespace-nowrap">
            {s.name}
          </span>
        </div>
      ))}
    </div>
  )
}
