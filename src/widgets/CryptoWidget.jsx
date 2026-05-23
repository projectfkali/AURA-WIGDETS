import { useState, useEffect } from 'react'

const coinMeta = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', icon: 'M9 11.041v-.825c0-1.402.73-2.031 2.375-2.128v-2.088h-1.63v2.088c-1.397.106-2.285.514-2.285 1.706 0 1.05.674 1.558 2.051 1.78l1.378.225c.67.11 1.01.328 1.01.761 0 .53-.518.791-1.388.791-1.096 0-1.636-.26-1.78-.96h-1.928c.17 1.411 1.054 2.138 2.33 2.278v2.33h1.63v-2.32c1.696-.134 2.65-.774 2.65-2.05 0-1.127-.676-1.685-2.152-1.91l-1.376-.208c-.765-.117-1.077-.354-1.077-.736 0-.46.45-.733 1.258-.733.916 0 1.344.24 1.487.825h1.89zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', icon: 'M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z' },
  solana: { name: 'Solana', symbol: 'SOL', icon: 'M4 16.4l1.3-2.1h14.7l-1.3 2.1H4zm16-8.8L18.7 5.5H4l1.3 2.1h14.7zM4 12l1.3-2.1h14.7L18.7 12H4z' },
  dogecoin: { name: 'Dogecoin', symbol: 'DOGE', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1.5 14h-3v-8h3c3 0 4.5 1.5 4.5 4s-1.5 4-4.5 4zm0-1.5h1.5c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5H10.5v5z' }
}

const colorMap = {
  white: 'text-white',
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  red: 'text-red-400'
}

export default function CryptoWidget({ settings }) {
  const [data, setData] = useState({ price: 0, change: 0, loading: true })
  const coinId = settings.coin || 'solana'
  const meta = coinMeta[coinId] || coinMeta.solana
  const iconColor = colorMap[settings.color || 'white']

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true }))
    
    const fetchCrypto = async () => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`)
        const json = await res.json()
        if (json[coinId]) {
          setData({
            price: json[coinId].usd,
            change: json[coinId].usd_24h_change,
            loading: false
          })
        }
      } catch (err) {
        console.error("Crypto fetch error:", err)
      }
    }

    fetchCrypto()
    const interval = setInterval(fetchCrypto, 60000)
    return () => clearInterval(interval)
  }, [coinId])

  if (data.loading) {
    return (
      <div className="glass-panel p-5 w-[220px] flex items-center justify-center min-h-[100px]">
        <div className={`w-5 h-5 border-2 border-t-transparent ${iconColor.replace('text-', 'border-')} rounded-full animate-spin`}></div>
      </div>
    )
  }

  const isPositive = data.change >= 0

  return (
    <div className="glass-panel p-5 w-[220px]">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${iconColor}`}>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d={meta.icon}/>
          </svg>
        </div>
        <div>
          <div className="font-bold text-lg leading-tight">{meta.name}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">{meta.symbol}/USD</div>
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-4">
        <div className="text-2xl font-bold tracking-tight">${data.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <svg className={`w-3 h-3 ${!isPositive && 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          {Math.abs(data.change).toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
