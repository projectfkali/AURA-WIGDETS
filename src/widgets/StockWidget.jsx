import { useState, useEffect } from 'react'

export default function StockWidget({ settings }) {
  const [prices, setPrices] = useState([])
  const [currentPrice, setCurrentPrice] = useState(0)
  const [change, setChange] = useState(0)

  useEffect(() => {
    // Demo borsa verisi üretici
    let basePrice = settings.basePrice || 150.00
    setCurrentPrice(basePrice)
    const initialData = Array.from({length: 20}, (_, i) => basePrice + (Math.random() * 10 - 5))
    setPrices(initialData)

    const interval = setInterval(() => {
      setPrices(prev => {
        const next = [...prev.slice(1)]
        const newPrice = next[next.length - 1] + (Math.random() * 4 - 2)
        next.push(newPrice)
        setCurrentPrice(newPrice)
        setChange(((newPrice - next[0]) / next[0]) * 100)
        return next
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [settings.basePrice, settings.stockSymbol])

  const isPositive = change >= 0
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400'
  const strokeColor = isPositive ? '#4ade80' : '#f87171'

  // Çok basit bir SVG çizgi grafiği motoru
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  
  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * 100
    const y = 100 - (((p - min) / range) * 80 + 10) // %10 padding
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-bold text-xl">{settings.stockSymbol || 'AAPL'}</h3>
          <p className="text-white/50 text-xs uppercase tracking-wider">Nasdaq</p>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-2xl">${currentPrice.toFixed(2)}</div>
          <div className={`text-sm font-medium ${colorClass} flex items-center justify-end gap-1`}>
            {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full relative mt-4">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline 
            points={points}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500 ease-linear"
          />
          <polygon 
            points={`0,100 ${points} 100,100`}
            fill={`url(#grad_${isPositive ? 'up' : 'down'})`}
            className="transition-all duration-500 ease-linear opacity-20"
          />
          <defs>
            <linearGradient id="grad_up" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="1"/>
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="grad_down" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity="1"/>
              <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
