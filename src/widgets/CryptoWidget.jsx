import { useState, useEffect } from 'react'

const coinMeta = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', icon: 'M9 11.041v-.825c0-1.402.73-2.031 2.375-2.128v-2.088h-1.63v2.088c-1.397.106-2.285.514-2.285 1.706 0 1.05.674 1.558 2.051 1.78l1.378.225c.67.11 1.01.328 1.01.761 0 .53-.518.791-1.388.791-1.096 0-1.636-.26-1.78-.96h-1.928c.17 1.411 1.054 2.138 2.33 2.278v2.33h1.63v-2.32c1.696-.134 2.65-.774 2.65-2.05 0-1.127-.676-1.685-2.152-1.91l-1.376-.208c-.765-.117-1.077-.354-1.077-.736 0-.46.45-.733 1.258-.733.916 0 1.344.24 1.487.825h1.89zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', icon: 'M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z' },
  solana: { name: 'Solana', symbol: 'SOL', icon: 'M4 16.4l1.3-2.1h14.7l-1.3 2.1H4zm16-8.8L18.7 5.5H4l1.3 2.1h14.7zM4 12l1.3-2.1h14.7L18.7 12H4z' },
  dogecoin: { name: 'Dogecoin', symbol: 'DOGE', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1.5 14h-3v-8h3c3 0 4.5 1.5 4.5 4s-1.5 4-4.5 4zm0-1.5h1.5c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5H10.5v5z' }
}

const colorMap = {
  white: { stroke: '#ffffff', drop: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' },
  blue: { stroke: '#60a5fa', drop: 'drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' },
  green: { stroke: '#4ade80', drop: 'drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' },
  purple: { stroke: '#c084fc', drop: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]' },
  red: { stroke: '#f87171', drop: 'drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' }
}

export default function CryptoWidget({ settings }) {
  const [data, setData] = useState({ price: 0, change: 0, history: [], loading: true })
  const coinId = settings.coin || 'solana'
  const meta = coinMeta[coinId] || coinMeta.solana
  const theme = colorMap[settings.color || 'white']

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true }))
    
    const fetchCrypto = async () => {
      try {
        // Hem anlık fiyat hem de son 24 saatlik grafik verisi
        const [priceRes, chartRes] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`),
          fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`)
        ])
        
        const priceJson = await priceRes.json()
        const chartJson = await chartRes.json()

        if (priceJson[coinId] && chartJson.prices) {
          // Çok fazla nokta varsa seyrelt (Örn: her 6 noktadan biri)
          const history = chartJson.prices.filter((_, i) => i % 6 === 0).map(p => p[1])
          
          setData({
            price: priceJson[coinId].usd,
            change: priceJson[coinId].usd_24h_change,
            history,
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

  const openCoinMarketCap = () => {
    if (window.electronAPI) {
      window.electronAPI.openExternal(`https://coinmarketcap.com/currencies/${coinId}/`)
    }
  }

  if (data.loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  const isPositive = data.change >= 0
  const trendColor = isPositive ? 'text-green-400' : 'text-red-400'
  const trendStroke = isPositive ? '#4ade80' : '#f87171'

  let points = ""
  if (data.history.length > 0) {
    const min = Math.min(...data.history)
    const max = Math.max(...data.history)
    const range = max - min || 1
    points = data.history.map((p, i) => {
      const x = (i / (data.history.length - 1)) * 100
      const y = 100 - (((p - min) / range) * 80 + 10) // %10 padding alt/üst
      return `${x},${y}`
    }).join(' ')
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="flex justify-between items-start cursor-pointer hover:opacity-80 transition-opacity" onClick={openCoinMarketCap}>
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
            <svg className={`w-6 h-6 ${theme.drop}`} fill={theme.stroke} viewBox="0 0 24 24"><path d={meta.icon} /></svg>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight leading-tight">{meta.name}</h3>
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase">{meta.symbol} / USD</p>
          </div>
        </div>
        <div className="text-right z-10">
          <div className="font-black text-xl text-white tracking-tighter">
            ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
          </div>
          <div className={`text-xs font-bold flex items-center justify-end gap-1 ${trendColor}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Background SVG Chart (Aura Style) */}
      {data.history.length > 0 && (
        <div className="absolute inset-0 top-14 opacity-40 pointer-events-none">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polyline 
              points={points}
              fill="none"
              stroke={trendStroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
              style={{ filter: `drop-shadow(0px 0px 8px ${trendStroke})` }}
            />
            <polygon 
              points={`0,100 ${points} 100,100`}
              fill={`url(#grad_${coinId})`}
              className="opacity-20"
            />
            <defs>
              <linearGradient id={`grad_${coinId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={trendStroke} stopOpacity="1"/>
                <stop offset="100%" stopColor={trendStroke} stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </div>
  )
}
