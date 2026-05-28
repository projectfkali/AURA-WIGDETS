import { useState, useEffect } from 'react'

const colorMap = {
  white: 'text-white border-white',
  blue: 'text-blue-400 border-blue-400',
  green: 'text-green-400 border-green-400',
  purple: 'text-purple-400 border-purple-400',
  red: 'text-red-400 border-red-400'
}

export default function PomodoroWidget({ settings }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const theme = colorMap[settings.color || 'white']
  const textColor = theme.split(' ')[0]

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const toggleTimer = () => setIsActive(!isActive)
  
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(25 * 60)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  return (
    <div className="w-full h-full p-3 flex flex-col items-center justify-center relative">
      <div className="text-xs text-white/50 uppercase tracking-widest mb-3">Pomodoro</div>
      <div className={`text-5xl font-mono font-bold mb-4 ${textColor}`}>
        {mins}:{secs}
      </div>
      <div className="flex gap-3">
        <button 
          onClick={toggleTimer}
          className={`px-3 py-1 text-sm border rounded-full hover:bg-white/10 transition-colors ${theme}`}
        >
          {isActive ? 'Duraklat' : 'Başlat'}
        </button>
        <button 
          onClick={resetTimer}
          className="px-3 py-1 text-sm border border-white/20 text-white/60 rounded-full hover:bg-white/10 transition-colors"
        >
          Sıfırla
        </button>
      </div>
    </div>
  )
}
