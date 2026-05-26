import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

const widgetMap = {
  clock: ClockWidget,
  sysmon: SysmonWidget,
  crypto: CryptoWidget,
  weather: WeatherWidget,
  notes: NotesWidget,
  pomodoro: PomodoroWidget,
  custom: CustomWidget,
  smart: SmartWidget,
  hardware: HardwareWidget,
  media: MediaWidget,
  ai: AiWidget,
  threed: ThreeDWidget
}

export default function WidgetLayer() {
  const [config, setConfig] = useState({ widgets: [] })
  const [isExposed, setIsExposed] = useState(false)
  const [appContext, setAppContext] = useState('normal')
  const [showContextEffect, setShowContextEffect] = useState(false)
  
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getConfig().then(setConfig)
    }
    const removeListener = window.electronAPI?.onConfigUpdated?.((newConfig) => {
      setConfig(newConfig)
    })
    const removeExposeListener = window.electronAPI?.onExposeToggled?.((exposed) => {
      setIsExposed(exposed);
    });
    const removeContextListener = window.electronAPI?.onContextChanged?.((ctx) => {
      setAppContext(ctx);
      if (ctx !== 'normal') {
         setShowContextEffect(true);
         setTimeout(() => setShowContextEffect(false), 3000);
      } else {
         setShowContextEffect(false);
      }
    });

    return () => {
       if(removeListener) removeListener()
       if(removeExposeListener) removeExposeListener()
       if(removeContextListener) removeContextListener()
    }
  }, [])

  const updatePosition = (id, x, y) => {
    const newConfig = { ...config }
    const widget = newConfig.widgets.find(w => w.id === id)
    if (widget) {
      widget.position = { x, y }
      setConfig(newConfig)
      if (window.electronAPI) window.electronAPI.saveConfig(newConfig)
    }
  }
  
  const updateSettings = (id, newSettings) => {
    const newConfig = { ...config }
    const widget = newConfig.widgets.find(w => w.id === id)
    if (widget) {
      widget.settings = { ...widget.settings, ...newSettings }
      setConfig(newConfig)
      if (window.electronAPI) window.electronAPI.saveConfig(newConfig)
    }
  }

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
           // İşlevsel Smart Context: Gereksiz widget'ları bağlama göre gizle
           if (appContext === 'gaming') {
              // Oyun modunda sadece performans, donanım ve kripto kalsın. Müzik, saat, notlar vs. gizlensin.
              return ['hardware', 'sysmon', 'crypto', 'media'].includes(widget.type);
           }
           if (appContext === 'developer') {
              // Geliştirici modunda saat, notlar, pomodoro, sysmon ve özel kodlar kalsın.
              return ['notes', 'pomodoro', 'clock', 'sysmon', 'custom', 'smart'].includes(widget.type);
           }
           return true; // Normal modda hepsi görünür
        }).map((widget) => {
          const WidgetComponent = widgetMap[widget.type]
          if (!WidgetComponent) return null

          return (
            <DraggableWidget 
              key={widget.id} 
              widget={widget} 
              updatePosition={updatePosition}
              isExposed={isExposed}
              appContext={appContext}
              showContextEffect={showContextEffect}
            >
              <WidgetComponent 
                settings={widget.settings || {}} 
                updateSettings={(newSettings) => updateSettings(widget.id, newSettings)}
              />
            </DraggableWidget>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function DraggableWidget({ widget, children, updatePosition, isExposed, appContext, showContextEffect }) {
  const settings = widget.settings || {}
  const scale = settings.scale || 1.0;
  const isTransparent = widget.type === 'threed' || settings.isTransparent === true;
  
  // Context'e göre belirgin parlamalar (Sadece ilk 3 saniye görünür)
  let contextGlow = 'none';
  let contextBorder = settings.borderColor || 'rgba(255,255,255,0.1)';
  
  if (showContextEffect && !isTransparent) {
    if (appContext === 'gaming') {
       contextBorder = 'rgba(239, 68, 68, 0.8)'; // Kırmızı
       contextGlow = '0 0 40px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(239, 68, 68, 0.2)';
    } else if (appContext === 'developer') {
       contextBorder = 'rgba(34, 197, 94, 0.8)'; // Yeşil
       contextGlow = '0 0 40px rgba(34, 197, 94, 0.5), inset 0 0 20px rgba(34, 197, 94, 0.2)';
    }
  }
  
  const style = {
    backgroundColor: isTransparent ? 'transparent' : `rgba(0, 0, 0, ${settings.opacity ?? 0.4})`,
    backdropFilter: isTransparent ? 'none' : `blur(${settings.blur ?? 24}px)`,
    borderWidth: isTransparent ? '0px' : `${settings.borderWidth ?? 1}px`,
    borderColor: isTransparent ? 'transparent' : contextBorder,
    borderRadius: isTransparent ? '0px' : `${settings.radius ?? 32}px`,
    fontFamily: settings.fontFamily || 'inherit',
    position: 'absolute',
    top: 0,
    left: 0
  }

  return (
    <motion.div 
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        const snap = 20;
        const newX = widget.position.x + info.offset.x;
        const newY = widget.position.y + info.offset.y;
        const snappedX = Math.round(newX / snap) * snap;
        const snappedY = Math.round(newY / snap) * snap;
        updatePosition(widget.id, snappedX, snappedY);
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
      <div className="absolute top-0 left-0 w-full h-8 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center -translate-y-4">
         <div className="w-12 h-1.5 bg-white/40 rounded-full mt-5 pointer-events-none"></div>
      </div>
      {children}
    </motion.div>
  )
}
