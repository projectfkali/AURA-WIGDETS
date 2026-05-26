import { useState, useEffect } from 'react'

const colorStyles = {
  white: 'text-white from-white to-white/70',
  blue: 'text-blue-400 from-blue-400 to-blue-200',
  green: 'text-green-400 from-green-400 to-green-200',
  purple: 'text-purple-400 from-purple-400 to-purple-200',
  red: 'text-red-400 from-red-400 to-red-200'
}

export default function ClockWidget({ settings }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const is12h = settings.format === '12h'
  let hoursRaw = time.getHours()
  const ampm = hoursRaw >= 12 ? 'PM' : 'AM'
  
  if (is12h) {
    hoursRaw = hoursRaw % 12 || 12
  }

  const hours = String(hoursRaw).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const dateStr = time.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  const colorClass = colorStyles[settings.color || 'white']

  return (
    <div className={`${settings.isTransparent ? '' : 'glass-panel'} p-6 flex flex-col items-center justify-center min-w-[250px]`}>
      <div className={`text-6xl font-mono font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br drop-shadow-md flex items-baseline ${colorClass}`}>
        {hours}<span className="text-white/30 mx-1">:</span>{minutes}
        {is12h && <span className="text-xl ml-2 font-bold opacity-80">{ampm}</span>}
      </div>
      <div className="text-xs mt-2 text-white/50 font-medium tracking-widest uppercase">
        {dateStr}
      </div>
    </div>
  )
}
