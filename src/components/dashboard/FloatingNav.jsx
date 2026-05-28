import { cn } from '../../utils/theme'

export default function FloatingNav({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { id: 'gallery', icon: '✨', label: 'Keşfet' },
    { id: 'active', icon: '📱', label: 'Masaüstü' },
    { id: 'store', icon: '🛒', label: 'Mağaza' },
    { id: 'themes', icon: '🎨', label: 'Temalar' },
    { id: 'settings', icon: '⚙️', label: 'Ayarlar' }
  ]

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] rounded-[32px] p-2 flex items-center gap-1 mx-auto">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-20 h-16 rounded-[24px] transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              activeMenu === item.id 
                ? "bg-white text-black font-bold shadow-[0_8px_16px_rgba(255,255,255,0.2)] scale-110 -translate-y-2" 
                : "text-white/60 hover:text-white hover:bg-white/10 font-medium"
            )}
          >
            <span className="text-2xl drop-shadow-sm">{item.icon}</span>
            <span className={cn(
              "text-[10px] tracking-wide", 
              activeMenu !== item.id && "opacity-0 h-0 overflow-hidden" // mobilde sadece ikon
            )}>
              {item.label}
            </span>
            {activeMenu === item.id && (
              <span className="absolute -bottom-3 w-1.5 h-1.5 bg-white rounded-full opacity-50 shadow-[0_0_10px_white]"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
