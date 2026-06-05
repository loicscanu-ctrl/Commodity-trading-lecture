import Sparkline from './Sparkline'

type Props = {
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  spark?: number[]
  color?: string
}

/**
 * Hero KPI card — large current value with a colored sparkline behind the
 * text and an optional delta indicator. Inspired by the trading-desk
 * "what is happening right now" pattern, adapted for course stats.
 */
export default function KpiCard({ label, value, delta, trend = 'flat', spark, color = '#3b82f6' }: Props) {
  const deltaColor =
    trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '◆'

  return (
    <div className="glass glass-hover overflow-hidden p-5">
      {/* Sparkline sits behind the text */}
      {spark && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-60">
          <Sparkline data={spark} color={color} width={300} height={64} className="w-full" />
        </div>
      )}
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="eyebrow">{label}</span>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }} />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-bold tracking-tight tabular-nums">{value}</span>
          {delta && (
            <span className={`mb-1 font-mono text-xs font-semibold ${deltaColor}`}>
              {arrow} {delta}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
