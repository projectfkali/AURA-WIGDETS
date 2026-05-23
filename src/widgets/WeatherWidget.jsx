import { useState, useEffect } from 'react'

const colorMap = {
  white: 'text-white',
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  red: 'text-red-400'
}

export default function WeatherWidget({ settings }) {
  const [data, setData] = useState({ temp: 0, wmoCode: 0, loading: true })
  
  // Varsayılan koordinatlar: İstanbul (Enlem: 41.0082, Boylam: 28.9784)
  const lat = settings.lat || '41.0082'
  const lon = settings.lon || '28.9784'
  const iconColor = colorMap[settings.color || 'white']

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
            loading: false
          })
        }
      } catch (err) {
        console.error("Weather fetch error:", err)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 900000) // 15 dakikada bir güncelle
    return () => clearInterval(interval)
  }, [lat, lon])

  // Basit WMO code yorumlayıcı
  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️' // Güneşli
    if (code >= 1 && code <= 3) return '⛅' // Parçalı Bulutlu
    if (code >= 45 && code <= 48) return '🌫️' // Sisli
    if (code >= 51 && code <= 67) return '🌧️' // Yağmurlu
    if (code >= 71 && code <= 77) return '❄️' // Karlı
    if (code >= 95 && code <= 99) return '⛈️' // Fırtınalı
    return '☁️'
  }

  if (data.loading) {
    return (
      <div className="glass-panel p-5 w-[200px] flex items-center justify-center min-h-[100px]">
        <div className={`w-5 h-5 border-2 border-t-transparent ${iconColor.replace('text-', 'border-')} rounded-full animate-spin`}></div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-5 w-[200px] flex flex-col items-center justify-center">
      <div className="text-4xl mb-2">{getWeatherIcon(data.wmoCode)}</div>
      <div className={`text-3xl font-bold tracking-tight ${iconColor}`}>
        {data.temp}°C
      </div>
      <div className="text-xs text-white/50 uppercase tracking-wider mt-1">İstanbul</div>
    </div>
  )
}
