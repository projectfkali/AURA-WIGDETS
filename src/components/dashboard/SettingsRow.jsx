import { cn } from '../../utils/theme'

export default function SettingsRow({ label, description, children, layout = 'horizontal' }) {
  if (layout === 'vertical') {
    return (
      <div className="p-4 transition-colors hover:bg-white/5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-sm font-medium text-white">{label}</div>
            {description && <div className="text-xs text-white/40 mt-0.5">{description}</div>}
          </div>
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    )
  }

  // Horizontal layout (default)
  return (
    <div className="flex items-center justify-between p-4 transition-colors hover:bg-white/5 gap-4">
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        {description && <div className="text-xs text-white/40 mt-0.5 leading-snug">{description}</div>}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  )
}
