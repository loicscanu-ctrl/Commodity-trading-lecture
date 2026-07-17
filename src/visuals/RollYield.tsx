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

export default function RollYield() {
  const [carryPct, setCarryPct] = useState(0.6)

  const c = carryPct / 100
  // Spot flat at 100. Each month: buy front at 100·(1+c), it converges to 100 at expiry, roll.
  // E(m) = 100 · (1/(1+c))^m
  const equity = Array.from({ length: 13 }, (_, m) => 100 * Math.pow(1 / (1 + c), m))
  const annualRollYield = (Math.pow(1 / (1 + c), 12) - 1) * 100

  const contango = carryPct > 0.001
  const backwardation = carryPct < -0.001

  // ── SVG chart ──
  const W = 560, H = 260
  const ml = 44, mr = 20, mt = 18, mb = 34
  const pw = W - ml - mr
  const ph = H - mt - mb

  const YMIN = 78, YMAX = 125
  const x = (m: number) => ml + (m / 12) * pw
  const y = (v: number) => mt + (1 - (v - YMIN) / (YMAX - YMIN)) * ph

  const axisBottom = mt + ph
  const spotY = y(100)
  const yTicks = [80, 90, 100, 110, 120]

  const path = equity
    .map((v, m) => `${m === 0 ? 'M' : 'L'}${x(m).toFixed(1)},${y(v).toFixed(1)}`)
    .join(' ')

  const yieldColor = annualRollYield < -0.01 ? 'text-rose-400' : annualRollYield > 0.01 ? 'text-emerald-400' : 'text-slate-300'

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">Roll Yield · Long Futures, Rolled Monthly</div>

      <div className="mb-4">
        <Slider
          label="Monthly carry (contango + / backwardation −)"
          value={carryPct} min={-1.5} max={1.5} step={0.1}
          onChange={setCarryPct}
          display={`${carryPct >= 0 ? '+' : ''}${carryPct.toFixed(1)}%`}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '260px' }}>
          {/* Y grid + tick labels */}
          {yTicks.map(v => (
            <g key={`yt-${v}`}>
              <line x1={ml} y1={y(v)} x2={ml + pw} y2={y(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={ml - 6} y={y(v) + 3} textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily="monospace">
                {v}
              </text>
            </g>
          ))}

          {/* Vertical grid per month */}
          {equity.map((_, m) => (
            <line key={`g-${m}`} x1={x(m)} y1={mt} x2={x(m)} y2={axisBottom}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

          {/* Thin bars: cumulative roll P&L (gap between spot and strategy) */}
          {equity.map((v, m) => {
            if (m === 0) return null
            const gap = Math.abs(y(v) - spotY)
            if (gap < 0.5) return null
            return (
              <rect key={`b-${m}`} x={x(m) - 2} y={Math.min(spotY, y(v))} width="4" height={gap}
                fill="#d97706" opacity="0.18" />
            )
          })}

          {/* SPOT: dashed slate flat at 100 */}
          <line x1={ml} y1={spotY} x2={ml + pw} y2={spotY}
            stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.8" />
          <text x={ml + pw} y={spotY + (backwardation ? 12 : -6)} textAnchor="end"
            fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            SPOT = 100
          </text>

          {/* STRATEGY line */}
          <path d={path} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Markers with tooltips */}
          {equity.map((v, m) => (
            <circle key={`m-${m}`} cx={x(m)} cy={y(v)} r="3.5" fill="#d97706" stroke="#070912" strokeWidth="1">
              <title>{`Month ${m} · ${v.toFixed(1)}`}</title>
            </circle>
          ))}

          {/* X tick labels */}
          {equity.map((_, m) => (
            <text key={`xl-${m}`} x={x(m)} y={axisBottom + 13} textAnchor="middle"
              fill="#94a3b8" fontSize="8.5" fontFamily="monospace">{m}</text>
          ))}
          <text x={ml + pw / 2} y={axisBottom + 26} textAnchor="middle"
            fill="#64748b" fontSize="9" fontFamily="monospace">months held (rolled at each expiry)</text>

          {/* Y-axis label */}
          <text x={11} y={mt + ph / 2} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace"
            transform={`rotate(-90 11 ${mt + ph / 2})`}>strategy equity</text>

          {/* Strategy label near end of line */}
          <text x={x(12) - 8} y={y(equity[12]) + (contango ? 16 : -10)} textAnchor="end"
            fill="#d97706" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
            LONG + MONTHLY ROLL
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 shrink-0" style={{ backgroundColor: '#d97706' }} />
          <span className="text-slate-400 text-xs font-mono">strategy equity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t border-dashed shrink-0" style={{ borderColor: '#94a3b8' }} />
          <span className="text-slate-400 text-xs font-mono">spot (flat)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: 'rgba(217,119,6,0.3)' }} />
          <span className="text-slate-400 text-xs font-mono">cumulative roll P&amp;L</span>
        </div>
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs">
          <div className="eyebrow mb-1">Annual roll yield</div>
          <div className={`text-2xl font-bold tabular-nums ${yieldColor}`}>
            {annualRollYield >= 0 ? '+' : ''}{annualRollYield.toFixed(1)}%
          </div>
          <div className="text-slate-500 mt-1">= (1 / (1 + carry))<sup>12</sup> − 1, spot unchanged</div>
        </div>

        <div className={`rounded-xl p-3 border font-mono text-xs leading-relaxed ${
          contango
            ? 'border-rose-500/30 bg-rose-500/[0.06] text-rose-200'
            : backwardation
              ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-200'
              : 'border-white/10 bg-white/[0.03] text-slate-400'
        }`}>
          {contango ? (
            <>
              <div className="font-bold mb-1 text-rose-400">CONTANGO</div>
              the curve charges you rent for holding paper barrels — this is why long-only index investors underperform spot in contango
            </>
          ) : backwardation ? (
            <>
              <div className="font-bold mb-1 text-emerald-400">BACKWARDATION</div>
              rolling down the curve pays you — the backwardated market pays holders of the front
            </>
          ) : (
            <>
              <div className="font-bold mb-1 text-slate-300">FLAT CURVE</div>
              with zero carry each roll is free — the strategy simply tracks spot
            </>
          )}
        </div>
      </div>

      <p className="text-slate-500 text-xs font-mono mt-3">Spot never moved. The whole P&amp;L is the roll.</p>
    </div>
  )
}
