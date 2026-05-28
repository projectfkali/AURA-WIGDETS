import { useState, useEffect } from 'react'

export default function NewsWidget({ settings }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(null)
  
  // Hazır RSS kaynakları
  const feedPresets = {
    techcrunch: { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    hackernews: { name: 'Hacker News', url: 'https://hnrss.org/frontpage' },
    bbc_world: { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    bbc_tech: { name: 'BBC Tech', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },
    verge: { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    reddit_tech: { name: 'Reddit r/technology', url: 'https://www.reddit.com/r/technology/.rss' },
    custom: { name: 'Özel RSS', url: '' }
  }
  
  const feedKey = settings.feedSource || 'hackernews'
  const customUrl = settings.customRssUrl || ''
  const feedUrl = feedKey === 'custom' ? customUrl : (feedPresets[feedKey]?.url || feedPresets.hackernews.url)

  useEffect(() => {
    if (!feedUrl) {
      setError('RSS URL belirtilmemiş')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setCurrentIndex(0)
    
    const fetchNews = async () => {
      try {
        // rss2json.com ücretsiz API ile RSS → JSON
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=10`
        const res = await fetch(apiUrl)
        const json = await res.json()
        
        if (json.status === 'ok' && json.items && json.items.length > 0) {
          const articles = json.items.map(item => ({
            title: item.title,
            source: json.feed?.title || feedPresets[feedKey]?.name || 'RSS',
            link: item.link,
            time: formatTimeAgo(new Date(item.pubDate))
          }))
          
          setNews(articles)
          setLoading(false)
        } else {
          throw new Error(json.message || 'Feed parse error')
        }
      } catch (err) {
        console.error('News fetch error:', err)
        setError('RSS yüklenemedi')
        setLoading(false)
      }
    }

    fetchNews()
    // Her 10 dakikada bir yenile
    const interval = setInterval(fetchNews, 600000)
    return () => clearInterval(interval)
  }, [feedUrl])

  useEffect(() => {
    if (news.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length)
    }, settings.scrollSpeed || 8000)
    return () => clearInterval(interval)
  }, [news, settings.scrollSpeed])

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins} dk önce`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} saat önce`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} gün önce`
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || news.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <span className="text-3xl mb-2">📰</span>
        <p className="text-white/40 text-xs text-center">{error || 'Haber bulunamadı'}</p>
        <p className="text-white/20 text-[10px] mt-1">Ayarlardan RSS kaynağını kontrol edin</p>
      </div>
    )
  }

  const currentItem = news[currentIndex]

  const openArticle = () => {
    if (window.electronAPI && currentItem.link) {
      window.electronAPI.openExternal(currentItem.link)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 relative group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">LIVE FEED</span>
        </div>
        <div className="text-[10px] font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 truncate max-w-[120px]">
          {currentItem.source}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center relative overflow-hidden cursor-pointer" onClick={openArticle}>
        <div key={currentIndex} className="animate-in fade-in slide-in-from-right-8 duration-700">
          <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-3 hover:text-blue-300 transition-colors">
            {currentItem.title}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-400">{currentItem.source}</span>
            <span className="text-white/30">•</span>
            <span className="text-white/50">{currentItem.time}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {news.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  )
}
