import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import ClockWidget from '../widgets/ClockWidget'
import SysmonWidget from '../widgets/SysmonWidget'
import CryptoWidget from '../widgets/CryptoWidget'
import WeatherWidget from '../widgets/WeatherWidget'
import NotesWidget from '../widgets/NotesWidget'
import PomodoroWidget from '../widgets/PomodoroWidget'
import CustomWidget from '../widgets/CustomWidget'
import SmartWidget from '../widgets/SmartWidget'
import HardwareWidget from '../widgets/HardwareWidget'
import MediaWidget from '../widgets/MediaWidget'
import AiWidget from '../widgets/AiWidget'
import ThreeDWidget from '../widgets/ThreeDWidget'
import StockWidget from '../widgets/StockWidget'
import GithubWidget from '../widgets/GithubWidget'
import CalendarWidget from '../widgets/CalendarWidget'
import NewsWidget from '../widgets/NewsWidget'
import ShortcutsWidget from '../widgets/ShortcutsWidget'
import CountdownWidget from '../widgets/CountdownWidget'
import WorldClockWidget from '../widgets/WorldClockWidget'

const widgetMap = {
  clock: ClockWidget, sysmon: SysmonWidget, crypto: CryptoWidget,
  weather: WeatherWidget, notes: NotesWidget, pomodoro: PomodoroWidget,
  custom: CustomWidget, smart: SmartWidget, hardware: HardwareWidget,
  media: MediaWidget, ai: AiWidget, threed: ThreeDWidget,
  stock: StockWidget, github: GithubWidget, calendar: CalendarWidget,
  news: NewsWidget, shortcuts: ShortcutsWidget, countdown: CountdownWidget,
  worldclock: WorldClockWidget
}

export default function WidgetLayer() {
  const { config, setConfig, updateWidgetPosition, updateWidgetSettings, appContext, setAppContext } = useStore()
  const [isExposed, setIsExposed] = useState(false)
  const [showContextEffect, setShowContextEffect] = useState(false)
  
  useEffect(() => {
    // Initial load from main process
    if (window.electronAPI) {
      window.electronAPI.getConfig().then(setConfig)
    }

    // IPC Listeners
    const removeListener = window.electronAPI?.onConfigUpdated?.((newConfig) => {
      // Sadece Store'a yaz (SaveConfig loop'u engellemek için)
      useStore.setState({ config: newConfig })
    })
    const removeExposeListener = window.electronAPI?.onExposeToggled?.((exposed) => setIsExposed(exposed))
    const removeContextListener = window.electronAPI?.onContextChanged?.((ctx) => {
      setAppContext(ctx)
      if (ctx !== 'normal') {
         setShowContextEffect(true)
         setTimeout(() => setShowContextEffect(false), 3000)
      } else {
         setShowContextEffect(false)
      }
    })

    return () => {
       if(removeListener) removeListener()
       if(removeExposeListener) removeExposeListener()
       if(removeContextListener) removeContextListener()
    }
  }, [])

  return (
    <div className={`w-screen h-screen relative overflow-hidden transition-all duration-1000 pointer-events-none ${isExposed ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
      
      {/* Context Overlays & Badges */}
      <AnimatePresence>
        {appContext === 'gaming' && showContextEffect && !isExposed && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 2}}} className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(255,0,0,0.15)] z-0 mix-blend-screen" />
        )}
        {appContext === 'developer' && showContextEffect && !isExposed && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 2}}} className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,255,0,0.1)] z-0 mix-blend-screen" />
        )}

        {appContext !== 'normal' && showContextEffect && !isExposed && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50, transition: {duration: 1} }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-white z-50 text-xs tracking-widest ${appContext === 'gaming' ? 'bg-red-600/60 shadow-[0_0_30px_red]' : 'bg-green-600/60 shadow-[0_0_30px_green]'}`}
          >
            {appContext === 'gaming' ? 'GAMING MODE ACTIVATED' : 'DEVELOPER MODE ACTIVATED'}
          </motion.div>
        )}
      </AnimatePresence>

      {isExposed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h1 className="text-[10vw] font-black text-white/5 tracking-[0.2em] font-mono select-none">EXPOSÉ</h1>
        </div>
      )}

      <AnimatePresence>
        {config?.widgets?.filter(widget => {
           if (appContext === 'gaming') return ['hardware', 'sysmon', 'crypto', 'media'].includes(widget.type);
           if (appContext === 'developer') return ['notes', 'pomodoro', 'clock', 'sysmon', 'custom', 'smart'].includes(widget.type);
           return true; 
        }).map((widget) => {
          const WidgetComponent = widgetMap[widget.type]
          if (!WidgetComponent) return null

          return (
            <DraggableWidget 
              key={widget.id} 
              widget={widget} 
              updatePosition={updateWidgetPosition}
              updateSettings={updateWidgetSettings}
              isExposed={isExposed}
              appContext={appContext}
              showContextEffect={showContextEffect}
            >
              <WidgetComponent 
                settings={widget.settings || {}} 
                updateSettings={(newSettings) => updateWidgetSettings(widget.id, newSettings)}
              />
            </DraggableWidget>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function DraggableWidget({ widget, children, updatePosition, updateSettings, isExposed, appContext, showContextEffect }) {
  const settings = widget.settings || {}
  const scale = settings.scale || 1.0;
  const isTransparent = widget.type === 'threed' || settings.isTransparent === true;
  
  const isDragging = useRef(false)
  const isResizing = useRef(false)

  // Context'e göre belirgin parlamalar (Sadece ilk 3 saniye görünür)
  let contextGlow = 'none';
  let contextBorder = settings.borderColor || 'rgba(255,255,255,0.1)';
  
  if (showContextEffect && !isTransparent) {
    if (appContext === 'gaming') {
       contextBorder = 'rgba(239, 68, 68, 0.8)';
       contextGlow = '0 0 40px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(239, 68, 68, 0.2)';
    } else if (appContext === 'developer') {
       contextBorder = 'rgba(34, 197, 94, 0.8)';
       contextGlow = '0 0 40px rgba(34, 197, 94, 0.5), inset 0 0 20px rgba(34, 197, 94, 0.2)';
    }
  }
  
  const style = {
    backgroundColor: isTransparent ? 'transparent' : `color-mix(in srgb, ${settings.bgColorHex || '#000000'} ${Math.round((settings.opacity ?? 0.4) * 100)}%, transparent)`,
    backdropFilter: isTransparent ? 'none' : `blur(${settings.blur ?? 24}px)`,
    borderWidth: isTransparent ? '0px' : `${settings.borderWidth ?? 1}px`,
    borderColor: isTransparent ? 'transparent' : contextBorder,
    borderRadius: isTransparent ? '0px' : `${settings.radius ?? 32}px`,
    width: settings.width ? `${settings.width}px` : 'auto',
    height: settings.height ? `${settings.height}px` : 'auto',
    padding: isTransparent ? '0px' : (settings.padding !== undefined ? `${settings.padding}px` : '24px'),
    fontFamily: settings.fontFamily || 'inherit',
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden'
  }

  return (
    <motion.div 
      drag={!isResizing.current}
      dragMomentum={false}
      onDragStart={() => isDragging.current = true}
      onDragEnd={(e, info) => {
        setTimeout(() => isDragging.current = false, 150) // Drag sonrası click oluşmaması için ufak delay
        const snap = 20;
        const newX = widget.position.x + info.offset.x;
        const newY = widget.position.y + info.offset.y;
        const snappedX = Math.round(newX / snap) * snap;
        const snappedY = Math.round(newY / snap) * snap;
        updatePosition(widget.id, snappedX, snappedY);
      }}
      onClickCapture={(e) => {
        // Eğer widget'ı sürüklüyorsak, içindeki butonlara/linklere tıklanmasını tamamen engelle.
        if (isDragging.current) {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
      initial={{ opacity: 0, scale: 0.5, x: widget.position.x, y: widget.position.y + 50 }}
      animate={{ 
        opacity: 1, 
        scale: isExposed ? scale * 1.05 : scale, 
        x: widget.position.x, 
        y: widget.position.y,
        boxShadow: isTransparent ? 'none' : (isExposed ? '0 0 50px rgba(255,255,255,0.2)' : contextGlow),
        zIndex: isExposed ? 50 : 10
      }}
      exit={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="cursor-grab active:cursor-grabbing group pointer-events-auto transition-colors duration-700"
      style={{ ...style, transformOrigin: 'top left' }}
      onMouseEnter={() => window.electronAPI?.setIgnoreMouseEvents(false)}
      onMouseLeave={() => window.electronAPI?.setIgnoreMouseEvents(true)}
    >
      {settings.animatedGradient && (
         <div className="absolute inset-0 bg-animated-gradient opacity-40 mix-blend-color-dodge pointer-events-none z-[-1]" 
              style={{ backgroundImage: 'linear-gradient(45deg, #ff00cc, #333399, #00ffcc, #ff9900)' }} />
      )}
      
      {/* Sürükleme handle'ı (Sadece görsel) */}
      <div className="absolute top-0 left-0 w-full h-8 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center -translate-y-4">
         <div className="w-12 h-1.5 bg-white/40 rounded-full mt-5 pointer-events-none"></div>
      </div>
      
      {children}

      {/* Yeniden Boyutlandırma (Resize) Handle */}
      {!isTransparent && (
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-end justify-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-50"
          onPointerDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            isResizing.current = true
            
            const startX = e.clientX
            const startY = e.clientY
            const startWidth = settings.width || 300
            const startHeight = settings.height || 200
            
            const onPointerMove = (moveEvent) => {
              const newWidth = Math.max(150, startWidth + (moveEvent.clientX - startX))
              const newHeight = Math.max(100, startHeight + (moveEvent.clientY - startY))
              
              // Performans için geçici UI güncellemesi: DOM'a direkt müdahale
              e.currentTarget.parentElement.style.width = `${newWidth}px`
              e.currentTarget.parentElement.style.height = `${newHeight}px`
            }
            
            const onPointerUp = (upEvent) => {
              document.removeEventListener('pointermove', onPointerMove)
              document.removeEventListener('pointerup', onPointerUp)
              isResizing.current = false
              
              // Final kaydetme işlemi Zustand/Electron'a gider
              const finalWidth = Math.max(150, startWidth + (upEvent.clientX - startX))
              const finalHeight = Math.max(100, startHeight + (upEvent.clientY - startY))
              updateSettings(widget.id, { width: finalWidth, height: finalHeight })
            }
            
            document.addEventListener('pointermove', onPointerMove)
            document.addEventListener('pointerup', onPointerUp)
          }}
        >
          <svg className="w-3 h-3 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
        </div>
      )}
    </motion.div>
  )
}
