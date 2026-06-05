const influences = [
  {
    label: 'Applying Information to the Present',
    detail: 'What does the future hold? Current data (production reports, weather, geopolitics) is immediately priced into the curve.',
  },
  {
    label: 'Outright Price Level',
    detail: 'The absolute spot price determines the financing cost component of the forward curve. Higher prices → higher carry costs → steeper contango.',
  },
  {
    label: 'Balance of Supply vs Demand',
    detail: 'The perception of future changes drives the shape. Oversupply today → stocks build → contango. Undersupply → stocks draw → backwardation.',
  },
  {
    label: 'Seasonality',
    detail: 'Predictable seasonal demand peaks (heating oil in winter, gasoline in summer) or harvest seasonality compress or widen the calendar spread.',
  },
  {
    label: 'Stock Levels',
    detail: 'Low inventory → tight nearby supply → backwardation. High inventory → abundant supply → contango. Inventory data (EIA, IEA, ICO) is the single most important weekly input.',
  },
]

export default function MarketInfluences() {
  return (
    <div className="mt-6 space-y-3">
      {influences.map((item, i) => (
        <div key={i} className="glass glass-hover flex gap-4 rounded-2xl p-5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 font-mono text-xs text-brand-cyan">{String(i + 1).padStart(2, '0')}</div>
          <div>
            <div className="text-white font-semibold tracking-tight text-sm mb-1">{item.label}</div>
            <div className="text-slate-400 text-xs leading-relaxed">{item.detail}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
