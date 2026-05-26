import { useState, useEffect } from 'react'

const colorMap = {
  white: 'text-white',
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  red: 'text-red-400'
}

export default function CalendarWidget({ settings }) {
  const [date, setDate] = useState(new Date())
  const theme = colorMap[settings.color || 'white']

  useEffect(() => {
    // Gece yarısı olduğunda takvimi güncelle (veya her saat başı)
    const interval = setInterval(() => {
      setDate(new Date())
    }, 3600000)
    return () => clearInterval(interval)
  }, [])

  const currentMonth = date.toLocaleString('tr-TR', { month: 'long' })
  const currentYear = date.getFullYear()
  const today = date.getDate()
  const currentDayOfWeek = date.getDay()

  // Ayın ilk gününün haftanın hangi gününe denk geldiği (Pazartesi: 1, Pazar: 0, vb.)
  const firstDayOfMonth = new Date(currentYear, date.getMonth(), 1).getDay()
  // JavaScript'te Pazar 0'dır, Pazartesi'den başlatmak için offset ayarı:
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const daysInMonth = new Date(currentYear, date.getMonth() + 1, 0).getDate()
  
  const days = []
  // Boş kutular
  for (let i = 0; i < offset; i++) {
    days.push(null)
  }
  // Dolu kutular
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

  return (
    <div className="w-full h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{currentMonth}</h2>
          <p className="text-sm font-medium text-white/50">{currentYear}</p>
        </div>
        <div className={`w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl shadow-inner border border-white/5 ${theme}`}>
          {today}
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map((day, idx) => {
          const isToday = day === today
          return (
            <div 
              key={idx} 
              className={`flex items-center justify-center text-xs font-medium rounded-lg transition-all ${
                !day ? '' :
                isToday ? `${theme.replace('text-', 'bg-')} text-black shadow-lg shadow-white/10 scale-110 font-black z-10` : 
                'text-white/70 hover:bg-white/10 hover:text-white cursor-pointer'
              }`}
            >
              {day || ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}
