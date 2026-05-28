import { cn } from '../../utils/theme'

export default function SidebarNav({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { id: 'gallery', icon: '✨', label: 'Keşfet' },
    { id: 'active', icon: '📱', label: 'Masaüstü' },
    { id: 'store', icon: '🛒', label: 'Mağaza' },
    { id: 'themes', icon: '🎨', label: 'Temalar' },
    { id: 'settings', icon: '⚙️', label: 'Ayarlar' }
  ]

  return (
    <div className="w-20 md:w-64 h-full bg-white/5 backdrop-blur-3xl border-r border-white/10 shrink-0 flex flex-col items-center md:items-stretch py-8 z-50">
      
      {/* Brand / Logo */}
      <div className="mb-12 flex items-center justify-center md:justify-start px-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
        </div>
        <div className="hidden md:block ml-3">
          <h1 className="font-black text-xl tracking-tight text-white leading-tight">Aura<span className="text-blue-400">OS</span></h1>
          <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase">System V7</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2 px-3 md:px-4 flex-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-300 group relative",
              activeMenu === item.id 
                ? "bg-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.4)] border border-white/20" 
                : "hover:bg-white/5 border border-transparent"
            )}
          >
            {activeMenu === item.id && (
              <motion-layout-id className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"></motion-layout-id>
            )}
            <span className={cn("text-2xl transition-transform duration-300", activeMenu === item.id ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "opacity-60 group-hover:opacity-100 group-hover:scale-110")}>
              {item.icon}
            </span>
            <span className={cn(
              "hidden md:block font-medium tracking-wide transition-all",
              activeMenu === item.id ? "text-white font-bold drop-shadow-md" : "text-white/60 group-hover:text-white"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* User Profile / Footer */}
      <div className="mt-auto px-4 w-full">
         <div className="bg-black/20 border border-white/5 rounded-2xl p-3 flex items-center justify-center md:justify-start gap-3 w-full cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 shrink-0"></div>
            <div className="hidden md:block overflow-hidden">
               <div className="font-bold text-sm text-white truncate">Geliştirici</div>
               <div className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                 Senkronize
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
