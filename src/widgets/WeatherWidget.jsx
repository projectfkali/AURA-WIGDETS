import { useState, useEffect } from 'react'

const colorMap = {
  white: { text: 'text-white', glow: 'shadow-[0_0_15px_rgba(255,255,255,0.3)]' },
  blue: { text: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]' },
  green: { text: 'text-green-400', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' },
  purple: { text: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
  red: { text: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(248,113,113,0.3)]' }
}

export default function WeatherWidget({ settings }) {
  const [data, setData] = useState({ temp: 0, wmoCode: 0, wind: 0, humidity: 0, feelsLike: 0, loading: true })
  const [cityName, setCityName] = useState(settings.cityName || 'İstanbul')
  
  const lat = settings.lat || '41.0082'
  const lon = settings.lon || '28.9784'
  const theme = colorMap[settings.color || 'white']

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true }))
    
    // Eğer cityName settings'den geliyorsa onu kullan
    if (settings.cityName) {
      setCityName(settings.cityName)
    }
    
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature&timezone=auto`
        )
        const json = await res.json()
        if (json.current_weather) {
          // Saatlik veriden güncel nem ve hissedilen sıcaklığı al
          const currentHourIndex = new Date().getHours()
          const humidity = json.hourly?.relativehumidity_2m?.[currentHourIndex] || 0
          const feelsLike = json.hourly?.apparent_temperature?.[currentHourIndex] || json.current_weather.temperature
          
          setData({
            temp: json.current_weather.temperature,
            wmoCode: json.current_weather.weathercode,
            wind: json.current_weather.windspeed,
            humidity,
            feelsLike,
            loading: false
          })
        }
      } catch (err) {
        console.error("Weather fetch error:", err)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 900000) // 15 dk
    return () => clearInterval(interval)
  }, [lat, lon, settings.cityName])

  const getWeatherDetails = (code) => {
    if (code === 0) return { icon: '☀️', desc: 'Clear Sky' }
    if (code >= 1 && code <= 3) return { icon: '⛅', desc: 'Partly Cloudy' }
    if (code >= 45 && code <= 48) return { icon: '🌫️', desc: 'Foggy' }
    if (code >= 51 && code <= 55) return { icon: '🌦️', desc: 'Light Drizzle' }
    if (code >= 56 && code <= 67) return { icon: '🌧️', desc: 'Rainy' }
    if (code >= 71 && code <= 77) return { icon: '❄️', desc: 'Snowy' }
    if (code >= 80 && code <= 82) return { icon: '🌧️', desc: 'Rain Showers' }
    if (code >= 95 && code <= 99) return { icon: '⛈️', desc: 'Thunderstorm' }
    return { icon: '🌡️', desc: 'Unknown' }
  }

  if (data.loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  const weather = getWeatherDetails(data.wmoCode)

  return (
    <div className="w-full h-full flex flex-col justify-between p-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-white text-lg tracking-wide">{cityName}</h3>
          <p className="text-white/50 text-xs font-medium">{weather.desc}</p>
        </div>
        <div className={`text-5xl drop-shadow-xl filter ${theme.glow}`}>
          {weather.icon}
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex items-end justify-between">
          <div className={`text-5xl font-black tracking-tighter ${theme.text}`}>
            {Math.round(data.temp)}°
          </div>
          <div className="flex flex-col items-end gap-1 mb-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1.5">
              <span className="text-[10px] text-white/50">Feels</span>
              <span className="text-[11px] font-bold text-white">{Math.round(data.feelsLike)}°</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                <span className="text-[10px] font-bold text-white">{data.wind}km/h</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <span className="text-[10px] text-white/50">💧</span>
                <span className="text-[10px] font-bold text-white">{data.humidity}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
