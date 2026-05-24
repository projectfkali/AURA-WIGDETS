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
  ai: AiWidget
}

export default function WidgetLayer() {
  const [config, setConfig] = useState({ widgets: [] })
  const [isExposed, setIsExposed] = useState(false)
  
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

    return () => {
       if(removeListener) removeListener()
       if(removeExposeListener) removeExposeListener()
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
    <div className={`w-screen h-screen relative overflow-hidden transition-all duration-500 pointer-events-none ${isExposed ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
      
      {isExposed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h1 className="text-[10vw] font-black text-white/5 tracking-[0.2em] font-mono select-none">EXPOSÉ</h1>
        </div>
      )}

      <AnimatePresence>
        {config?.widgets?.map((widget) => {
          const WidgetComponent = widgetMap[widget.type]
          if (!WidgetComponent) return null

          return (
            <DraggableWidget 
              key={widget.id} 
              widget={widget} 
              updatePosition={updatePosition}
              isExposed={isExposed}
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

function DraggableWidget({ widget, children, updatePosition, isExposed }) {
  const settings = widget.settings || {}
  const scale = settings.scale || 1.0;
  
  const style = {
    '--panel-opacity': settings.opacity ?? 0.4,
    '--panel-blur': `${settings.blur ?? 24}px`,
    '--panel-radius': `${settings.radius ?? 32}px`,
    '--panel-border-width': `${settings.borderWidth ?? 1}px`,
    '--panel-font': settings.fontFamily || 'inherit',
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
        boxShadow: isExposed ? '0 0 50px rgba(255,255,255,0.1)' : 'none',
        zIndex: isExposed ? 50 : 10
      }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="cursor-grab active:cursor-grabbing group pointer-events-auto"
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
