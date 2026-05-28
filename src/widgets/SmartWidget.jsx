import { useState, useEffect } from 'react'

export default function SmartWidget({ settings }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const type = settings.smartType || 'text'
  const textContent = settings.textContent || 'Akıllı Widget'
  const imageUrl = settings.imageUrl || 'https://via.placeholder.com/150'
  
  const apiUrl = settings.apiUrl || ''
  const jsonPath = settings.jsonPath || ''
  const prefix = settings.prefix || ''
  const suffix = settings.suffix || ''
  const refreshRate = settings.refreshRate || 60000

  useEffect(() => {
    if (type !== 'api' || !apiUrl) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(apiUrl)
        const json = await res.json()
        
        // Basit JSON Path çözümleyici (örnek: "data.price.usd")
        let val = json
        if (jsonPath) {
          const parts = jsonPath.split('.')
          for (let part of parts) {
            if (val[part] !== undefined) val = val[part]
            else { val = 'Veri Bulunamadı'; break; }
          }
        }
        setData(String(val))
      } catch (err) {
        setError('API Hatası')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, refreshRate)
    return () => clearInterval(interval)
  }, [type, apiUrl, jsonPath, refreshRate])

  // Görünüm (Type'a göre render)
  return (
    <div className="w-full h-full flex items-center justify-center">
      
      {type === 'text' && (
        <div className="text-xl font-bold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 drop-shadow-md">
          {textContent}
        </div>
      )}

      {type === 'image' && (
        <div 
          className="w-full h-full min-h-[100px] rounded-[24px] bg-center bg-cover bg-no-repeat border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transition-all"
          style={{ backgroundImage: `url(${imageUrl})`, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}
        />
      )}

      {type === 'api' && (
        <div className="flex flex-col items-center">
          {loading && !data && <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>}
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {data && !error && (
            <div className="text-2xl font-bold tracking-tight">
              <span className="opacity-50 text-lg mr-1">{prefix}</span>
              {data}
              <span className="opacity-50 text-lg ml-1">{suffix}</span>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
