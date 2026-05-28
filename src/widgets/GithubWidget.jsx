import { useState, useEffect } from 'react'

export default function GithubWidget({ settings }) {
  const [contributions, setContributions] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const username = settings.githubUser || 'torvalds'
  const theme = settings.color || 'green'

  const colors = {
    green: ['bg-white/5', 'bg-green-900/50', 'bg-green-700/70', 'bg-green-500/90', 'bg-green-400'],
    blue: ['bg-white/5', 'bg-blue-900/50', 'bg-blue-700/70', 'bg-blue-500/90', 'bg-blue-400'],
    purple: ['bg-white/5', 'bg-purple-900/50', 'bg-purple-700/70', 'bg-purple-500/90', 'bg-purple-400'],
    red: ['bg-white/5', 'bg-red-900/50', 'bg-red-700/70', 'bg-red-500/90', 'bg-red-400'],
    white: ['bg-white/5', 'bg-white/20', 'bg-white/40', 'bg-white/70', 'bg-white']
  }

  const activeColors = colors[theme] || colors.green

  useEffect(() => {
    setLoading(true)
    setError(null)

    const fetchGithub = async () => {
      try {
        // GitHub'ın contribution sayfasını SVG olarak çekip parse et
        const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`)
        
        if (!res.ok) {
          throw new Error('User not found')
        }

        const json = await res.json()
        
        if (json.contributions && json.contributions.length > 0) {
          // Son 52 hafta (364 gün) al
          const allDays = json.contributions.flat()
          const recentDays = allDays.slice(-364)
          
          // Contribution sayılarını 0-4 arası level'a dönüştür
          const maxContrib = Math.max(...recentDays.map(d => d.count || 0), 1)
          
          const levels = recentDays.map(d => {
            const count = d.count || 0
            if (count === 0) return 0
            const ratio = count / maxContrib
            if (ratio > 0.75) return 4
            if (ratio > 0.5) return 3
            if (ratio > 0.25) return 2
            return 1
          })
          
          const total = recentDays.reduce((sum, d) => sum + (d.count || 0), 0)
          
          setContributions(levels)
          setTotalCount(total)
          setLoading(false)
        } else {
          throw new Error('No data')
        }
      } catch (err) {
        console.error('GitHub fetch error:', err)
        // Fallback: Basit bir GitHub events API dene
        try {
          const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`)
          if (eventsRes.ok) {
            const events = await eventsRes.json()
            // Event sayılarından basit bir heatmap oluştur
            const dayMap = {}
            events.forEach(e => {
              const day = e.created_at.split('T')[0]
              dayMap[day] = (dayMap[day] || 0) + 1
            })
            
            // Son 364 gün için level hesapla
            const levels = []
            const now = new Date()
            const maxCount = Math.max(...Object.values(dayMap), 1)
            
            for (let i = 363; i >= 0; i--) {
              const d = new Date(now)
              d.setDate(d.getDate() - i)
              const key = d.toISOString().split('T')[0]
              const count = dayMap[key] || 0
              if (count === 0) levels.push(0)
              else if (count / maxCount > 0.75) levels.push(4)
              else if (count / maxCount > 0.5) levels.push(3)
              else if (count / maxCount > 0.25) levels.push(2)
              else levels.push(1)
            }
            
            setContributions(levels)
            setTotalCount(Object.values(dayMap).reduce((a, b) => a + b, 0))
            setLoading(false)
          } else {
            throw new Error('Events API failed')
          }
        } catch (fallbackErr) {
          setError(`"${username}" bulunamadı`)
          setLoading(false)
        }
      }
    }

    const timer = setTimeout(fetchGithub, 300) // Debounce
    return () => clearTimeout(timer)
  }, [username])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <svg className="w-8 h-8 text-white/30 mb-2" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
        <p className="text-white/40 text-xs text-center">{error}</p>
        <p className="text-white/20 text-[10px] mt-1">Ayarlardan kullanıcı adını kontrol edin</p>
      </div>
    )
  }

  const columns = []
  for (let i = 0; i < contributions.length; i += 7) {
    columns.push(contributions.slice(i, i + 7))
  }

  const openGithub = () => {
    if (window.electronAPI) {
      window.electronAPI.openExternal(`https://github.com/${username}`)
    }
  }

  return (
    <div className="w-full h-full flex flex-col p-3">
      <div className="flex items-center justify-between mb-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={openGithub}>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
          <span className="font-bold text-white text-sm">@{username}</span>
        </div>
        <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
          {totalCount.toLocaleString()} commits
        </span>
      </div>
      
      <div className="flex-1 flex gap-[3px] items-center justify-center overflow-hidden">
        {columns.slice(-25).map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-[3px]">
            {col.map((level, dayIdx) => (
              <div 
                key={dayIdx} 
                className={`w-[10px] h-[10px] rounded-[2px] ${activeColors[level]} transition-colors duration-300 hover:scale-150 hover:z-10`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
