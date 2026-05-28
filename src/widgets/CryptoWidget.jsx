import { useState, useEffect } from 'react'

// Top 20 coin listesi (CoinGecko ID'leri)
const topCoins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'tron', name: 'TRON', symbol: 'TRX' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'polygon-ecosystem-token', name: 'Polygon', symbol: 'POL' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
  { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR' },
  { id: 'stellar', name: 'Stellar', symbol: 'XLM' },
  { id: 'aptos', name: 'Aptos', symbol: 'APT' }
]

const colorMap = {
  white: { stroke: '#ffffff', drop: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' },
  blue: { stroke: '#60a5fa', drop: 'drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' },
  green: { stroke: '#4ade80', drop: 'drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' },
  purple: { stroke: '#c084fc', drop: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]' },
  red: { stroke: '#f87171', drop: 'drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' }
}

export default function CryptoWidget({ settings }) {
  const [data, setData] = useState({ price: 0, change: 0, history: [], loading: true, marketCap: 0 })
  const coinId = settings.coin || 'bitcoin'
  const meta = topCoins.find(c => c.id === coinId) || topCoins[0]
  const theme = colorMap[settings.color || 'white']

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true }))
    
    const fetchCrypto = async () => {
      try {
        const [priceRes, chartRes] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`),
          fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`)
        ])
        
        const priceJson = await priceRes.json()
        const chartJson = await chartRes.json()

        if (priceJson[coinId] && chartJson.prices) {
          const history = chartJson.prices.filter((_, i) => i % 6 === 0).map(p => p[1])
          
          setData({
            price: priceJson[coinId].usd,
            change: priceJson[coinId].usd_24h_change,
            marketCap: priceJson[coinId].usd_market_cap || 0,
            history,
            loading: false
          })
        }
      } catch (err) {
        console.error("Crypto fetch error:", err)
        setData(prev => ({ ...prev, loading: false }))
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

  // Market cap formatlama
  const formatMarketCap = (mc) => {
    if (mc >= 1e12) return `$${(mc / 1e12).toFixed(1)}T`
    if (mc >= 1e9) return `$${(mc / 1e9).toFixed(1)}B`
    if (mc >= 1e6) return `$${(mc / 1e6).toFixed(1)}M`
    return `$${mc.toLocaleString()}`
  }

  let points = ""
  if (data.history.length > 0) {
    const min = Math.min(...data.history)
    const max = Math.max(...data.history)
    const range = max - min || 1
    points = data.history.map((p, i) => {
      const x = (i / (data.history.length - 1)) * 100
      const y = 100 - (((p - min) / range) * 80 + 10)
      return `${x},${y}`
    }).join(' ')
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 relative">
      <div className="flex justify-between items-start cursor-pointer hover:opacity-80 transition-opacity z-10" onClick={openCoinMarketCap}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
            <span className="text-lg font-black">{meta.symbol.substring(0, 2)}</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight leading-tight">{meta.name}</h3>
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase">{meta.symbol} / USD</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-black text-xl text-white tracking-tighter">
            ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: data.price < 1 ? 6 : 2 })}
          </div>
          <div className={`text-xs font-bold flex items-center justify-end gap-1 ${trendColor}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Market Cap */}
      {data.marketCap > 0 && (
        <div className="text-[10px] text-white/30 font-mono z-10 mt-1">
          MCap: {formatMarketCap(data.marketCap)}
        </div>
      )}

      {/* Background SVG Chart */}
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
