import { useState, useEffect } from 'react'

const colorMap = {
  white: 'bg-white',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  purple: 'bg-purple-400',
  red: 'bg-red-400'
}

export default function SysmonWidget({ settings }) {
  const [stats, setStats] = useState({ memUsage: 0, usedMem: 0, totalMem: 0, cpuUsage: 0 })
  const [prevCpu, setPrevCpu] = useState({ idle: 0, total: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      if (!window.electronAPI) return
      const rawStats = await window.electronAPI.getSysStats()
      
      const idleDiff = rawStats.cpuIdle - prevCpu.idle
      const totalDiff = rawStats.cpuTotal - prevCpu.total
      let cpuUsage = 0
      if (totalDiff > 0) {
        cpuUsage = 100 - Math.floor((idleDiff / totalDiff) * 100)
      }

      setPrevCpu({ idle: rawStats.cpuIdle, total: rawStats.cpuTotal })
      setStats({
        memUsage: rawStats.memUsage,
        usedMem: rawStats.usedMem,
        totalMem: rawStats.totalMem,
        cpuUsage
      })
    }

    fetchStats()
    const interval = setInterval(fetchStats, 2000)
    return () => clearInterval(interval)
  }, [prevCpu])

  const barColor = colorMap[settings.color || 'white']

  return (
    <div className={`${settings.isTransparent ? '' : 'glass-panel'} p-6 w-[280px]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white/80">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
          <span className="font-semibold text-sm uppercase tracking-wider">Sistem</span>
        </div>
        <div className={`w-2 h-2 rounded-full animate-pulse ${barColor}`}></div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>CPU</span>
            <span>{stats.cpuUsage}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${stats.cpuUsage}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>RAM ({stats.usedMem}/{stats.totalMem} GB)</span>
            <span>{stats.memUsage}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${stats.memUsage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
