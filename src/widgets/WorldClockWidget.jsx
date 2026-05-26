import { useState, useEffect } from 'react'

export default function WorldClockWidget({ settings }) {
  const [time, setTime] = useState(new Date())
  
  // İleride dashboard'dan değiştirilebilir
  const cities = settings.cities || [
    { name: 'NEW YORK', tz: 'America/New_York' },
    { name: 'LONDRA', tz: 'Europe/London' },
    { name: 'TOKYO', tz: 'Asia/Tokyo' }
  ]

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3 p-4">
      {cities.map((city, idx) => {
        // İlgili zaman dilimine göre saati al
        const localTimeStr = time.toLocaleTimeString('tr-TR', { timeZone: city.tz, hour: '2-digit', minute: '2-digit' })
        const [hours, minutes] = localTimeStr.split(':')

        // Gündüz/Gece basit tahmin (06:00 - 18:00 Gündüz)
        const hourInt = parseInt(hours, 10)
        const isDay = hourInt >= 6 && hourInt < 18

        return (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isDay ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]'}`}></div>
              <span className="font-bold text-xs text-white/70 uppercase tracking-widest group-hover:text-white transition-colors">{city.name}</span>
            </div>
            <div className="text-xl font-light text-white tracking-wider flex items-baseline">
              {hours}<span className="animate-pulse opacity-50 mx-0.5">:</span>{minutes}
            </div>
          </div>
        )
      })}
    </div>
  )
}
