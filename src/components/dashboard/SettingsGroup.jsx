import { cn } from '../../utils/theme'

export default function SettingsGroup({ title, children, className }) {
  return (
    <div className={cn("mb-6", className)}>
      {title && (
        <h4 className="text-[13px] font-bold text-white/50 uppercase tracking-widest mb-2 ml-2">
          {title}
        </h4>
      )}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
        {children}
      </div>
    </div>
  )
}
