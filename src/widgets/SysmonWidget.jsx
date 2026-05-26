import { useState, useEffect } from 'react'

const colorMap = {
  white: { text: 'text-white', stroke: '#ffffff', fill: 'bg-white' },
  blue: { text: 'text-blue-400', stroke: '#60a5fa', fill: 'bg-blue-400' },
  green: { text: 'text-green-400', stroke: '#4ade80', fill: 'bg-green-400' },
  purple: { text: 'text-purple-400', stroke: '#c084fc', fill: 'bg-purple-400' },
  red: { text: 'text-red-400', stroke: '#f87171', fill: 'bg-red-400' }
}

export default function SysmonWidget({ settings }) {
  const [stats, setStats] = useState({ memUsage: 0, usedMem: 0, totalMem: 0, cpuUsage: 0, uptime: 0, activeNet: false, cpuModel: 'Loading...' })
  const [prevCpu, setPrevCpu] = useState({ idle: 0, total: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      if (!window.electronAPI) return
      const rawStats = await window.electronAPI.getSysStats()
      
      const idleDiff = rawStats.cpuIdle - prevCpu.idle
      const totalDiff = rawStats.cpuTotal - prevCpu.total
      
      let newCpuUsage = stats.cpuUsage // Önceki kullanımı koru (Bug fix)
      if (totalDiff > 0) {
        newCpuUsage = 100 - Math.floor((idleDiff / totalDiff) * 100)
      }

      setPrevCpu({ idle: rawStats.cpuIdle, total: rawStats.cpuTotal })
      setStats({
        memUsage: rawStats.memUsage,
        usedMem: rawStats.usedMem,
        totalMem: rawStats.totalMem,
        cpuUsage: newCpuUsage < 0 ? 0 : newCpuUsage,
        uptime: rawStats.uptime || 0,
        activeNet: rawStats.activeNet || false,
        cpuModel: rawStats.cpuModel || 'Bilinmeyen İşlemci'
      })
    }

    fetchStats()
    const interval = setInterval(fetchStats, 2000)
    return () => clearInterval(interval)
  }, [prevCpu, stats.cpuUsage])

  const theme = colorMap[settings.color || 'white']

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}s ${m}d`
  }

  // Radial progress helper
  const radius = 30
  const circumference = radius * 2 * Math.PI

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <svg className={`w-5 h-5 ${theme.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
            <span className="font-bold text-white tracking-wide">SysCore</span>
          </div>
          <span className="text-[10px] text-white/40 uppercase mt-1 w-32 truncate" title={stats.cpuModel}>{stats.cpuModel}</span>
        </div>
        <div className="flex gap-2">
          {stats.activeNet && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Network Active"></div>}
          <div className={`text-xs font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-md border border-white/5`}>
            UP: {formatUptime(stats.uptime)}
          </div>
        </div>
      </div>
      
      {/* Visual Gauges */}
      <div className="flex items-center justify-around flex-1 mt-2">
        {/* CPU Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
            <circle cx="40" cy="40" r={radius} stroke={theme.stroke} strokeWidth="6" fill="none" 
              strokeDasharray={circumference} 
              strokeDashoffset={circumference - (stats.cpuUsage / 100) * circumference}
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white">{stats.cpuUsage}%</span>
            <span className="text-[9px] text-white/50 uppercase tracking-widest">CPU</span>
          </div>
        </div>

        {/* RAM Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
            <circle cx="40" cy="40" r={radius} stroke={theme.stroke} strokeWidth="6" fill="none" 
              strokeDasharray={circumference} 
              strokeDashoffset={circumference - (stats.memUsage / 100) * circumference}
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white">{Math.round(stats.memUsage)}%</span>
            <span className="text-[9px] text-white/50 uppercase tracking-widest">RAM</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Stats */}
      <div className="flex justify-between items-center text-[11px] text-white/60 bg-black/20 p-2 rounded-xl border border-white/5 mt-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          MEM: {stats.usedMem} / {stats.totalMem} GB
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          SYS: OK
        </div>
      </div>
    </div>
  )
}
