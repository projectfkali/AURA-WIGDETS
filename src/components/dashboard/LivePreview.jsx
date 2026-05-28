import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import ClockWidget from '../../widgets/ClockWidget'
import SysmonWidget from '../../widgets/SysmonWidget'
import CryptoWidget from '../../widgets/CryptoWidget'
import WeatherWidget from '../../widgets/WeatherWidget'
import NotesWidget from '../../widgets/NotesWidget'
import PomodoroWidget from '../../widgets/PomodoroWidget'
import CustomWidget from '../../widgets/CustomWidget'
import SmartWidget from '../../widgets/SmartWidget'
import HardwareWidget from '../../widgets/HardwareWidget'
import MediaWidget from '../../widgets/MediaWidget'
import AiWidget from '../../widgets/AiWidget'
import ThreeDWidget from '../../widgets/ThreeDWidget'
import StockWidget from '../../widgets/StockWidget'
import GithubWidget from '../../widgets/GithubWidget'
import CalendarWidget from '../../widgets/CalendarWidget'
import NewsWidget from '../../widgets/NewsWidget'
import ShortcutsWidget from '../../widgets/ShortcutsWidget'
import CountdownWidget from '../../widgets/CountdownWidget'
import WorldClockWidget from '../../widgets/WorldClockWidget'

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
  threed: ThreeDWidget,
  stock: StockWidget,
  github: GithubWidget,
  calendar: CalendarWidget,
  news: NewsWidget,
  shortcuts: ShortcutsWidget,
  countdown: CountdownWidget,
  worldclock: WorldClockWidget
}

export default function LivePreview({ widget }) {
  if (!widget) return null;

  const Component = widgetMap[widget.type]
  if (!Component) return null

  const s = widget.settings || {}
  
  // Transform iOS 26 style glass wrapper
  const dynamicStyle = {
    width: s.width || 300,
    height: s.height || 200,
    transform: `scale(${s.scale || 1.0})`,
    borderRadius: s.radius ?? 24,
    borderWidth: s.borderWidth ?? 1,
    padding: s.padding ?? 16,
    borderColor: s.borderColor || `rgba(255,255,255,${(s.opacity || 0.1) * 2})`,
    background: s.bgColorHex || `rgba(0,0,0,${s.bgOpacity !== undefined ? s.bgOpacity/100 : s.opacity || 0.4})`,
    backdropFilter: `blur(${s.blur ?? 20}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${s.blur ?? 20}px) saturate(180%)`,
    fontFamily: s.fontFamily || 'inherit',
    color: s.textColor || 'white',
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)`
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
      {/* Background to show off glass effect */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[80px]"></div>
      </div>
      
      <p className="absolute top-4 left-6 text-xs font-bold text-white/30 uppercase tracking-widest z-10">Canlı Önizleme</p>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={widget.id} // Sadece ID olmalı, JSON.stringify her slider değişiminde komponenti yok edip geri getirerek kaybolma bug'ı yaratıyordu.
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative flex flex-col z-10 ${s.isTransparent ? '' : 'liquid-glass'}`}
          style={{...dynamicStyle, transform: 'none'}} // Scale işlemi üst componentten (WidgetSettingsSidebar) yapılacak.
        >
          <div className="w-full h-full relative z-10">
            <Component widgetId={widget.id} settings={s} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
