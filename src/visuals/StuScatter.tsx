'use client'

import { useState } from 'react'

function Slider({ label, value, min, max, step, onChange, display, amber }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string; amber?: boolean
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className={`text-xs font-mono ${amber ? 'text-brand-cyan' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-xs font-mono font-bold tabular-nums ${amber ? 'text-brand-cyan' : 'text-white'}`}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 cursor-pointer ${amber ? 'accent-brand-cyan' : 'accent-brand-blue'}`} />
    </div>
  )
}

// Illustrative history: (STU %, price index)
const POINTS: [number, number][] = [
  [30, 105], [28, 112], [27, 106], [25, 122], [24, 116], [22, 138], [20, 144],
  [19, 152], [18, 169], [16, 186], [15, 215], [14, 222], [13, 246], [11, 342],
]

// Fitted convex curve: price index as a function of stocks-to-use %
const price = (stu: number) => 40 + 1500 / (stu - 6)

// Uncertainty band widens as STU falls: ±12% at STU 25 → ±25% at STU 10
const bandPct = (stu: number) => Math.min(25, Math.max(12, 12 + 13 * Math.max(0, 25 - stu) / 15))

export default function StuScatter() {
  const [stu, setStu] = useState(12.4)

  const implied = price(stu)
  const band = bandPct(stu)
  const zone: 'tight' | 'balanced' | 'ample' = stu < 15 ? 'tight' : stu > 25 ? 'ample' : 'balanced'

  // ── SVG chart ──
  const W = 560, H = 280
  const ml = 46, mr = 20, mt = 18, mb = 38
  const pw = W - ml - mr
  const ph = H - mt - mb

  const XMIN = 8.5, XMAX = 32
  const YMIN = 50, YMAX = 700
  const x = (s: number) => ml + ((s - XMIN) / (XMAX - XMIN)) * pw
  const y = (p: number) => mt + (1 - (p - YMIN) / (YMAX - YMIN)) * ph

  const axisBottom = mt + ph
  const xTicks = [10, 15, 20, 25, 30]
  const yTicks = [100, 200, 300, 400, 500, 600, 700]

  // Sampled smooth curve path
  const samples: string[] = []
  for (let s = XMIN; s <= XMAX + 1e-9; s += 0.25) {
    samples.push(`${samples.length === 0 ? 'M' : 'L'}${x(s).toFixed(1)},${y(price(s)).toFixed(1)}`)
  }
  const curvePath = samples.join(' ')

  const bandTop = y(implied * (1 + band / 100))
  const bandBot = y(implied * (1 - band / 100))

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">Stocks-to-Use vs Price · The Convexity of Scarcity</div>

      <div className="mb-4">
        <Slider
          label="This year&rsquo;s STU"
          value={stu} min={9} max={30} step={0.1}
          onChange={setStu}
          display={`${stu.toFixed(1)}%`}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '280px' }}>
          {/* Zone shading */}
          <rect x={ml} y={mt} width={x(15) - ml} height={ph} fill="rgba(244,63,94,0.05)" />
          <rect x={x(25)} y={mt} width={ml + pw - x(25)} height={ph} fill="rgba(52,211,153,0.04)" />
          <text x={ml + 5} y={mt + 12} fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold" opacity="0.8">
            convexity zone
          </text>
          <text x={ml + pw - 5} y={mt + 12} textAnchor="end" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold" opacity="0.8">
            ample
          </text>

          {/* Y grid + tick labels */}
          {yTicks.map(v => (
            <g key={`yt-${v}`}>
              <line x1={ml} y1={y(v)} x2={ml + pw} y2={y(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={ml - 6} y={y(v) + 3} textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily="monospace">
                {v}
              </text>
            </g>
          ))}

          {/* X grid + tick labels */}
          {xTicks.map(v => (
            <g key={`xt-${v}`}>
              <line x1={x(v)} y1={mt} x2={x(v)} y2={axisBottom} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x={x(v)} y={axisBottom + 13} textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                {v}%
              </text>
            </g>
          ))}

          {/* Axes */}
          <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

          {/* Uncertainty band at slider value */}
          <rect x={x(stu) - 5} y={bandTop} width="10" height={Math.max(1, bandBot - bandTop)}
            fill="#d97706" opacity="0.22" rx="2" />

          {/* Fitted curve */}
          <path d={curvePath} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Illustrative historical scatter */}
          {POINTS.map(([s, p]) => (
            <circle key={`p-${s}-${p}`} cx={x(s)} cy={y(p)} r="3.5" fill="#94a3b8" stroke="#070912" strokeWidth="1" opacity="0.9">
              <title>{`STU ${s}% · index ${p}`}</title>
            </circle>
          ))}

          {/* Highlighted marker on the curve */}
          <circle cx={x(stu)} cy={y(implied)} r="10" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.45" />
          <circle cx={x(stu)} cy={y(implied)} r="5.5" fill="#3b82f6" stroke="#070912" strokeWidth="1.5">
            <title>{`STU ${stu.toFixed(1)}% · implied index ${implied.toFixed(0)} ±${band.toFixed(0)}%`}</title>
          </circle>

          {/* Axis labels */}
          <text x={ml + pw / 2} y={axisBottom + 27} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
            stocks-to-use ratio (ending stocks / consumption)
          </text>
          <text x={11} y={mt + ph / 2} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace"
            transform={`rotate(-90 11 ${mt + ph / 2})`}>price index</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ backgroundColor: '#94a3b8' }} />
          <span className="text-slate-400 text-xs font-mono">illustrative history</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 shrink-0" style={{ backgroundColor: '#d97706' }} />
          <span className="text-slate-400 text-xs font-mono">fitted curve</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-slate-400 text-xs font-mono">this year</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: 'rgba(217,119,6,0.3)' }} />
          <span className="text-slate-400 text-xs font-mono">uncertainty band</span>
        </div>
      </div>

      {/* Readout */}
      <div className={`rounded-xl p-3 border font-mono text-xs leading-relaxed mt-3 ${
        zone === 'tight'
          ? 'border-rose-500/30 bg-rose-500/[0.06] text-rose-200'
          : zone === 'ample'
            ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-200'
            : 'border-white/10 bg-white/[0.03] text-slate-300'
      }`}>
        <span className="font-bold">
          STU {stu.toFixed(1)}% → implied index ≈ {implied.toFixed(0)}, band ±{band.toFixed(0)}%
        </span>
        {' — '}
        {zone === 'tight'
          ? 'in the zone where one more Brazilian frost is not additive, it is multiplicative.'
          : zone === 'ample'
            ? 'buffers are deep — supply shocks get absorbed by inventory, and price sits near the cost floor.'
            : 'the balanced middle — price still responds to tightness, but roughly one for one.'}
      </div>

      <p className="text-slate-500 text-xs font-mono mt-3">
        Illustrative curve and points — the shape, not the values, is the lesson. Calibrate per commodity against its own history.
      </p>
    </div>
  )
}
