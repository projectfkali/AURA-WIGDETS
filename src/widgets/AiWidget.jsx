import { useState, useRef, useEffect } from 'react'

export default function AiWidget({ settings }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Merhaba! Ben Aura AI. Masaüstünüzdeki kişisel asistanınızım. Size nasıl yardımcı olabilirim?' }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isTyping])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userText = input
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      let aiResponse = "Anladım. Şu an test modundayım, o yüzden size tam bir cevap veremiyorum. (API entegrasyonu bekleniyor)"
      if (userText.toLowerCase().includes('saat')) {
        aiResponse = "Şu an saat: " + new Date().toLocaleTimeString()
      } else if (userText.toLowerCase().includes('hava')) {
        aiResponse = "Bugün hava oldukça güzel görünüyor, ancak dışarı çıkmadan önce bir hava durumu widget'ı ekleyebilirsiniz!"
      }
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }])
    }, 1500)
  }

  return (
    <div className="glass-panel w-[320px] h-[400px] flex flex-col overflow-hidden text-sm relative group">
      
      {/* Header */}
      <div className="p-3 bg-white/5 border-b border-white/10 flex items-center gap-2 drag-handle">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <div className="font-bold text-white/90">Aura AI Asistan</div>
          <div className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Çevrimiçi
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 custom-scrollbar" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-blue-500 text-white rounded-tr-sm' 
                : 'bg-white/10 text-white/90 border border-white/5 rounded-tl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-black/20 border-t border-white/5">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bir şeyler sorun..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 outline-none focus:border-blue-500 transition-colors text-white placeholder:text-white/30"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
            <svg className="w-3.5 h-3.5 text-white transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          </button>
        </form>
      </div>
      
    </div>
  )
}
