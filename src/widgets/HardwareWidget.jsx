import { useState, useEffect } from 'react'

const colorMap = {
  white: 'text-white border-white/20 bg-white/5',
  blue: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
  green: 'text-green-400 border-green-400/20 bg-green-400/5',
  purple: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
  red: 'text-red-400 border-red-400/20 bg-red-400/5'
}

export default function HardwareWidget({ settings }) {
  const [battery, setBattery] = useState({ level: 100, charging: false, supported: true })
  const [network, setNetwork] = useState({ type: '4g', speed: 0, online: true })

  const themeClass = colorMap[settings.color || 'white']

  useEffect(() => {
    // Batarya Bilgisi
    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        const updateBat = () => setBattery({
          level: Math.round(bat.level * 100),
          charging: bat.charging,
          supported: true
        })
        updateBat()
        bat.addEventListener('levelchange', updateBat)
        bat.addEventListener('chargingchange', updateBat)
      })
    } else {
      setBattery(prev => ({ ...prev, supported: false }))
    }

    // Ağ Bilgisi
    const updateNet = () => {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (conn) {
        setNetwork({
          type: conn.effectiveType || 'wifi',
          speed: conn.downlink || 0, // Mbps
          online: navigator.onLine
        })
      } else {
        setNetwork({ type: 'unknown', speed: 0, online: navigator.onLine })
      }
    }
    updateNet()
    window.addEventListener('online', updateNet)
    window.addEventListener('offline', updateNet)
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateNet)
    }

    return () => {
      window.removeEventListener('online', updateNet)
      window.removeEventListener('offline', updateNet)
    }
  }, [])

  return (
    <div className="w-full h-full p-3 flex flex-col gap-4">
      
      {/* Batarya */}
      <div className={`p-3 rounded-xl border ${themeClass} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {battery.charging ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          )}
          <span className="font-semibold text-sm">Batarya</span>
        </div>
        <span className="font-bold">{battery.supported ? `${battery.level}%` : 'N/A'}</span>
      </div>

      {/* Network */}
      <div className={`p-3 rounded-xl border ${themeClass} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {network.online ? (
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          )}
          <span className="font-semibold text-sm uppercase">{network.type}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold leading-none">{network.online ? network.speed : 0}</span>
          <span className="text-[10px] opacity-60">Mbps</span>
        </div>
      </div>

    </div>
  )
}
