const SEGMENTS = [
  { name: 'Petroleum Products',             short: '$1.5T',  value: 1500, group: 'Energy',       color: '#1d4ed8', glow: '#3b82f6' },
  { name: 'Natural Gas, Coal & Electricity', short: '$454B',  value: 454,  group: 'Energy',       color: '#2563eb', glow: '#3b82f6' },
  { name: 'Precious Stones & Metals',        short: '$647B',  value: 647,  group: 'Minerals',     color: '#7c3aed', glow: '#8b5cf6' },
  { name: 'Base Metals & Other Minerals',    short: '$758B',  value: 758,  group: 'Minerals',     color: '#6d28d9', glow: '#8b5cf6' },
  { name: 'Crop Products & Forestry',        short: '$1.2T',  value: 1200, group: 'Agriculture',  color: '#059669', glow: '#34d399' },
  { name: 'Animal Products',                 short: '$446B',  value: 446,  group: 'Agriculture',  color: '#047857', glow: '#34d399' },
  { name: 'Other Products',                  short: '$319B',  value: 319,  group: 'Other',        color: '#475569', glow: '#64748b' },
]

const GROUP_COLOR: Record<string, string> = {
  Energy: '#60a5fa',
  Minerals: '#c084fc',
  Agriculture: '#4ade80',
  Other: '#71717a',
}

const CX = 150, CY = 155, IR = 60, OR = 120

function polar(r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * Math.PI / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function arcPath(startAngle: number, endAngle: number): string {
  const so = polar(OR, startAngle), eo = polar(OR, endAngle)
  const si = polar(IR, startAngle), ei = polar(IR, endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${so.x.toFixed(2)} ${so.y.toFixed(2)}`,
    `A ${OR} ${OR} 0 ${large} 1 ${eo.x.toFixed(2)} ${eo.y.toFixed(2)}`,
    `L ${ei.x.toFixed(2)} ${ei.y.toFixed(2)}`,
    `A ${IR} ${IR} 0 ${large} 0 ${si.x.toFixed(2)} ${si.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

export default function CommodityDonutChart() {
  const total = SEGMENTS.reduce((s, d) => s + d.value, 0)

  let cum = 0
  const segs = SEGMENTS.map(d => {
    const start = cum
    const span = (d.value / total) * 360
    cum += span
    return { ...d, start, end: cum, mid: start + span / 2, span }
  })

  return (
    <div className="mt-5 flex flex-col lg:flex-row gap-5 items-start">

      {/* Donut */}
      <div className="shrink-0 flex flex-col items-center">
        <svg viewBox="0 0 300 310" width="280" height="290">

          {/* Segments */}
          {segs.map((s, i) => (
            <path key={i} d={arcPath(s.start, s.end)} fill={s.color}
              stroke="#070912" strokeWidth="2" />
          ))}

          {/* In-segment labels */}
          {segs.map((s, i) => {
            const mp = polar((IR + OR) / 2, s.mid)
            if (s.span < 20) return null
            const showName = s.span >= 40
            const nameParts = s.name.split(' ')
            const line1 = nameParts.slice(0, 2).join(' ').toUpperCase()
            const line2 = nameParts.slice(2, 4).join(' ').toUpperCase()
            return (
              <g key={i}>
                {showName && (
                  <>
                    <text x={mp.x} y={mp.y - (line2 ? 10 : 6)} textAnchor="middle"
                      fill="white" fontSize="7.5" fontFamily="monospace" fontWeight="bold">{line1}</text>
                    {line2 && (
                      <text x={mp.x} y={mp.y + 2} textAnchor="middle"
                        fill="white" fontSize="7.5" fontFamily="monospace" fontWeight="bold">{line2}</text>
                    )}
                    <text x={mp.x} y={mp.y + (line2 ? 14 : 10)} textAnchor="middle"
                      fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">{s.short}</text>
                  </>
                )}
                {!showName && (
                  <text x={mp.x} y={mp.y + 4} textAnchor="middle"
                    fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">{s.short}</text>
                )}
              </g>
            )
          })}

          {/* Center */}
          <text x={CX} y={CY - 14} textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace" letterSpacing="1">TOTAL</text>
          <text x={CX} y={CY + 12} textAnchor="middle" fill="white" fontSize="22" fontFamily="monospace" fontWeight="bold">$5.3T</text>
          <text x={CX} y={CY + 28} textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">annual commodity exports</text>

          {/* Group arc labels */}
          {/* Energy label (right arc, ~13° to ~42°) */}
          <text x={CX + OR + 14} y={CY - 30} fill="#60a5fa" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1">ENERGY</text>
          {/* Minerals label (bottom-right arc) */}
          <text x={CX + 20} y={CY + OR + 20} fill="#c084fc" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1">MINERALS</text>
          {/* Agriculture label (left arc) */}
          <text x={CX - OR - 62} y={CY + 10} fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1">AGRICULTURE</text>
        </svg>
        <div className="text-slate-500 text-xs font-mono text-center mt-2">
          Source: UN Trade & Development · 2019–2021 avg.
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-3 min-w-0">
        <div className="eyebrow mb-2">Breakdown by Category</div>
        {(['Energy', 'Minerals', 'Agriculture', 'Other'] as const).map(group => {
          const groupSegs = segs.filter(s => s.group === group)
          const groupTotal = groupSegs.reduce((s, d) => s + d.value, 0)
          const gc = GROUP_COLOR[group]
          return (
            <div key={group} className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden transition-colors hover:border-white/20">
              <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.16em]" style={{ color: gc }}>{group}</span>
                <span className="text-xs font-mono text-slate-300">{groupSegs.length > 1 ? `$${(groupTotal/1000).toFixed(1)}T` : groupSegs[0].short}</span>
              </div>
              {groupSegs.map(s => (
                <div key={s.name} className="flex items-center justify-between px-3.5 py-2 border-t border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: gc }} />
                    <span className="text-slate-300 text-xs truncate">{s.name}</span>
                  </div>
                  <span className="text-white font-mono text-xs font-bold ml-2 shrink-0">{s.short}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

    </div>
  )
}
