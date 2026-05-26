import { useState, useEffect } from 'react'

export default function NewsWidget({ settings }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const category = settings.newsCategory || 'technology'
  // Demo amaçlı statik veriler. (Gerçekte NewsAPI veya RSS to JSON proxy kullanılabilir)
  const mockNews = {
    technology: [
      { source: 'TechCrunch', title: 'OpenAI announces new AI model capable of reasoning.', time: '2 saat önce' },
      { source: 'The Verge', title: 'Apple Vision Pro 2 rumored to feature lighter design.', time: '5 saat önce' },
      { source: 'Wired', title: 'The future of quantum computing is closer than you think.', time: '7 saat önce' },
      { source: 'Gizmodo', title: 'Microsoft tests new Windows UI changes.', time: '12 saat önce' }
    ],
    world: [
      { source: 'Reuters', title: 'Global markets hit record highs amid tech rally.', time: '1 saat önce' },
      { source: 'BBC', title: 'New climate agreement signed in Geneva.', time: '3 saat önce' },
      { source: 'CNN', title: 'Major discoveries found in deep ocean expedition.', time: '6 saat önce' }
    ]
  }

  useEffect(() => {
    setLoading(true)
    // API simülasyonu
    setTimeout(() => {
      setNews(mockNews[category] || mockNews.technology)
      setLoading(false)
    }, 1000)
  }, [category])

  useEffect(() => {
    if (news.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length)
    }, settings.scrollSpeed || 8000) // 8 saniyede bir değiştir
    return () => clearInterval(interval)
  }, [news, settings.scrollSpeed])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  const currentItem = news[currentIndex]

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 relative group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Son Dakika</span>
        </div>
        <div className="text-[10px] font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
          {category.toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center relative overflow-hidden">
        {/* Animated Slide (Simple keyframe replacement via React key) */}
        <div key={currentIndex} className="animate-in fade-in slide-in-from-right-8 duration-700">
          <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-3">
            "{currentItem.title}"
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-400">{currentItem.source}</span>
            <span className="text-white/30">•</span>
            <span className="text-white/50">{currentItem.time}</span>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {news.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  )
}
