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
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="floating-pill">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
              activeMenu === item.id 
                ? "bg-white text-black font-bold shadow-lg scale-105" 
                : "text-white/60 hover:text-white hover:bg-white/10 font-medium"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className={cn(
              "text-sm", 
              activeMenu !== item.id && "hidden md:block" // mobilde sadece ikon
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
