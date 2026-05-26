import { useState, useEffect } from 'react'

const colorMap = {
  white: { text: 'text-white', glow: 'shadow-[0_0_15px_rgba(255,255,255,0.3)]' },
  blue: { text: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]' },
  green: { text: 'text-green-400', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' },
  purple: { text: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
  red: { text: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(248,113,113,0.3)]' }
}

export default function WeatherWidget({ settings }) {
  const [data, setData] = useState({ temp: 0, wmoCode: 0, wind: 0, loading: true })
  
  const lat = settings.lat || '41.0082'
  const lon = settings.lon || '28.9784'
  const theme = colorMap[settings.color || 'white']

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true }))
    
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        const json = await res.json()
        if (json.current_weather) {
          setData({
            temp: json.current_weather.temperature,
            wmoCode: json.current_weather.weathercode,
            wind: json.current_weather.windspeed,
            loading: false
          })
        }
      } catch (err) {
        console.error("Weather fetch error:", err)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 900000)
    return () => clearInterval(interval)
  }, [lat, lon])

  const getWeatherDetails = (code) => {
    if (code === 0) return { icon: '☀️', desc: 'Açık / Güneşli' }
    if (code >= 1 && code <= 3) return { icon: '⛅', desc: 'Parçalı Bulutlu' }
    if (code >= 45 && code <= 48) return { icon: '🌫️', desc: 'Sisli' }
    if (code >= 51 && code <= 67) return { icon: '🌧️', desc: 'Yağmurlu' }
    if (code >= 71 && code <= 77) return { icon: '❄️', desc: 'Karlı' }
    if (code >= 95 && code <= 99) return { icon: '⛈️', desc: 'Fırtınalı' }
    return { icon: '🌡️', desc: 'Bilinmeyen' }
  }

  if (data.loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  const weather = getWeatherDetails(data.wmoCode)
  // Şehir adını enlem boylama göre kaba bir tahmin (Mükemmel değil ama şık)
  const isIstanbul = lat.includes('41.00')
  const isAnkara = lat.includes('39.92')
  const isIzmir = lat.includes('38.42')
  const isNy = lat.includes('40.71')
  const isLondon = lat.includes('51.50')
  const isTokyo = lat.includes('35.67')
  
  let cityName = 'Özel Konum'
  if (isIstanbul) cityName = 'İstanbul'
  if (isAnkara) cityName = 'Ankara'
  if (isIzmir) cityName = 'İzmir'
  if (isNy) cityName = 'New York'
  if (isLondon) cityName = 'Londra'
  if (isTokyo) cityName = 'Tokyo'

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-white text-lg tracking-wide">{cityName}</h3>
          <p className="text-white/50 text-xs font-medium">{weather.desc}</p>
        </div>
        <div className={`text-5xl drop-shadow-xl filter ${theme.glow}`}>
          {weather.icon}
        </div>
      </div>
      
      <div className="mt-auto flex items-end justify-between">
        <div className={`text-5xl font-black tracking-tighter ${theme.text}`}>
          {Math.round(data.temp)}°
        </div>
        <div className="flex flex-col items-end gap-1 mb-1">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1">
            <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            <span className="text-[10px] font-bold text-white">{data.wind} km/h</span>
          </div>
        </div>
      </div>
    </div>
  )
}
