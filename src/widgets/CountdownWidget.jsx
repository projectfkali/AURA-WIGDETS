import { useState, useEffect } from 'react'

export default function CountdownWidget({ settings }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  // Varsayılan olarak Yılbaşı'na geri sayım veya ayarlardan gelen bir tarih
  const targetDateStr = settings.targetDate || `${new Date().getFullYear() + 1}-01-01T00:00:00`
  const title = settings.countdownTitle || 'Yeni Yıl'

  useEffect(() => {
    const target = new Date(targetDateStr).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = target - now

      if (distance < 0) {
        clearInterval(interval)
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
        return
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDateStr])

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner shadow-white/5">
        <span className="text-xl font-black text-white">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-white/80 font-bold text-sm tracking-widest uppercase mb-4">{title}</h3>
      <div className="flex gap-3">
        <TimeBox value={timeLeft.d} label="Gün" />
        <TimeBox value={timeLeft.h} label="Saat" />
        <TimeBox value={timeLeft.m} label="Dk" />
        <TimeBox value={timeLeft.s} label="Sn" />
      </div>
    </div>
  )
}
