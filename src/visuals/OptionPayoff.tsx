'use client'

import { useState } from 'react'

function Slider({ label, value, min, max, step, onChange, display }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        <span className="text-xs font-mono font-bold tabular-nums text-white">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 cursor-pointer accent-brand-blue" />
    </div>
  )
}

type Strat = 'call' | 'put' | 'pput' | 'collar'

const STRATS: { key: Strat; label: string }[] = [
  { key: 'call', label: 'Long call' },
  { key: 'put', label: 'Long put' },
  { key: 'pput', label: 'Protective put' },
  { key: 'collar', label: 'Producer collar' },
]

// KC arabica, ¢/lb. Price axis at expiry:
const S_MIN = 150, S_MAX = 350

export default function OptionPayoff() {
  const [strat, setStrat] = useState<Strat>('collar')
  const [putK, setPutK] = useState(230)
  const [callK, setCallK] = useState(275)
  const [putPrem, setPutPrem] = useState(8)
  const [callPrem, setCallPrem] = useState(8)

  const producerMode = strat === 'pput' || strat === 'collar'
  const netCost = putPrem - callPrem

  // Payoff / effective-price function of the expiry price S
  function fx(S: number): number {
    switch (strat) {
      case 'call': return Math.max(S - callK, 0) - callPrem
      case 'put': return Math.max(putK - S, 0) - putPrem
      case 'pput': return S + Math.max(putK - S, 0) - putPrem
      case 'collar': return S + Math.max(putK - S, 0) - Math.max(S - callK, 0) - netCost
    }
  }

  // Piecewise-linear: evaluate at the ends and every kink
  const kinks = [S_MIN, putK, callK, S_MAX].filter(s => s >= S_MIN && s <= S_MAX).sort((a, b) => a - b)

  // Chart geometry
  const W = 560, H = 300, ml = 52, mr = 16, mt = 18, mb = 40
  const pw = W - ml - mr, ph = H - mt - mb
  const yMin = producerMode ? S_MIN : -45
  const yMax = producerMode ? S_MAX : 95
  const x = (s: number) => ml + ((s - S_MIN) / (S_MAX - S_MIN)) * pw
  const y = (v: number) => mt + (1 - (Math.min(Math.max(v, yMin), yMax) - yMin) / (yMax - yMin)) * ph

  const path = kinks.map((s, i) => `${i === 0 ? 'M' : 'L'}${x(s).toFixed(1)},${y(fx(s)).toFixed(1)}`).join(' ')

  const yTicks = producerMode ? [150, 200, 250, 300, 350] : [-40, 0, 40, 80]
  const xTicks = [150, 200, 250, 300, 350]

  // Key levels per strategy
  const breakeven = strat === 'call' ? callK + callPrem : strat === 'put' ? putK - putPrem : null
  const floor = strat === 'pput' ? putK - putPrem : strat === 'collar' ? putK - netCost : null
  const cap = strat === 'collar' ? callK - netCost : null
  const zeroCost = strat === 'collar' && Math.abs(netCost) < 0.25

  const c = (n: number) => `${n.toFixed(n % 1 ? 1 : 0)}¢`

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">Option Payoff Lab · ICE Arabica (¢/lb)</div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* LEFT: strategy + inputs */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {STRATS.map(s => (
              <button key={s.key} onClick={() => setStrat(s.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  strat === s.key
                    ? 'border-brand-blue/60 bg-brand-blue/20 text-blue-100'
                    : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
                }`}>
                {s.label}
              </button>
            ))}
          </div>

          {(strat === 'put' || producerMode) && (
            <Slider label="Put strike" value={putK} min={160} max={340} step={5} onChange={setPutK} display={c(putK)} />
          )}
          {(strat === 'call' || strat === 'collar') && (
            <Slider label="Call strike" value={callK} min={160} max={340} step={5} onChange={setCallK} display={c(callK)} />
          )}
          {(strat === 'put' || producerMode) && (
            <Slider label="Put premium paid" value={putPrem} min={0} max={40} step={0.5} onChange={setPutPrem} display={c(putPrem)} />
          )}
          {(strat === 'call' || strat === 'collar') && (
            <Slider label={strat === 'collar' ? 'Call premium received' : 'Call premium paid'} value={callPrem} min={0} max={40} step={0.5} onChange={setCallPrem} display={c(callPrem)} />
          )}

          {/* Key numbers */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums space-y-1.5">
            <div className="eyebrow mb-1">Key levels</div>
            {strat === 'call' && (<>
              <div className="flex justify-between"><span className="text-slate-400">Breakeven</span><span className="text-amber-300 font-bold">{c(callK + callPrem)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Max loss (premium)</span><span className="text-rose-300">−{c(callPrem)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Upside</span><span className="text-emerald-300">unlimited</span></div>
            </>)}
            {strat === 'put' && (<>
              <div className="flex justify-between"><span className="text-slate-400">Breakeven</span><span className="text-amber-300 font-bold">{c(putK - putPrem)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Max loss (premium)</span><span className="text-rose-300">−{c(putPrem)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Max gain (at zero)</span><span className="text-emerald-300">{c(putK - putPrem)}</span></div>
            </>)}
            {strat === 'pput' && (<>
              <div className="flex justify-between"><span className="text-slate-400">Price floor</span><span className="text-amber-300 font-bold">{c(putK - putPrem)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Cost of protection</span><span className="text-rose-300">−{c(putPrem)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Upside</span><span className="text-emerald-300">kept (minus premium)</span></div>
            </>)}
            {strat === 'collar' && (<>
              <div className="flex justify-between"><span className="text-slate-400">Price floor</span><span className="text-amber-300 font-bold">{c(putK - netCost)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Price cap</span><span className="text-amber-300 font-bold">{c(callK - netCost)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Net premium</span>
                <span className={zeroCost ? 'text-emerald-300 font-bold' : 'text-white'}>
                  {zeroCost ? 'zero-cost ✓' : `${netCost > 0 ? '−' : '+'}${c(Math.abs(netCost))}`}
                </span></div>
            </>)}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {producerMode
              ? 'Solid line: the producer’s effective sale price after the hedge. Dashed diagonal: unhedged.'
              : 'Payoff at expiry, net of premium. Dashed line: zero P&L.'}
          </p>
        </div>

        {/* RIGHT: payoff chart */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '300px' }}>
            {/* Grid + ticks */}
            {xTicks.map(s => (
              <g key={`x-${s}`}>
                <line x1={x(s)} y1={mt} x2={x(s)} y2={mt + ph} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <text x={x(s)} y={mt + ph + 14} textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="monospace">{s}</text>
              </g>
            ))}
            {yTicks.map(v => (
              <g key={`y-${v}`}>
                <line x1={ml} y1={y(v)} x2={ml + pw} y2={y(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <text x={ml - 6} y={y(v) + 3} textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily="monospace">{v}</text>
              </g>
            ))}
            <text x={ml + pw} y={mt + ph + 28} textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">KC price at expiry (¢/lb) →</text>
            <text x={12} y={mt + ph / 2} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace"
              transform={`rotate(-90 12 ${mt + ph / 2})`}>{producerMode ? 'effective sale price (¢/lb)' : 'P&L (¢/lb)'}</text>

            {/* Reference line: zero P&L, or the unhedged diagonal */}
            {producerMode ? (
              <line x1={x(S_MIN)} y1={y(S_MIN)} x2={x(S_MAX)} y2={y(S_MAX)}
                stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
            ) : (
              <line x1={ml} y1={y(0)} x2={ml + pw} y2={y(0)} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
            )}

            {/* Floor / cap guides */}
            {floor !== null && (
              <g>
                <line x1={ml} y1={y(floor)} x2={ml + pw} y2={y(floor)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <text x={ml + 4} y={y(floor) - 4} fill="#f59e0b" fontSize="8.5" fontFamily="monospace" fontWeight="bold">floor {c(floor)}</text>
              </g>
            )}
            {cap !== null && (
              <g>
                <line x1={ml} y1={y(cap)} x2={ml + pw} y2={y(cap)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <text x={ml + 4} y={y(cap) - 4} fill="#f59e0b" fontSize="8.5" fontFamily="monospace" fontWeight="bold">cap {c(cap)}</text>
              </g>
            )}

            {/* Payoff line */}
            <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

            {/* Kink markers with hover values */}
            {kinks.map(s => (
              <circle key={`k-${s}`} cx={x(s)} cy={y(fx(s))} r="4" fill="#3b82f6" stroke="#070912" strokeWidth="1">
                <title>{`S = ${s}¢ → ${producerMode ? 'effective price' : 'P&L'} ${fx(s).toFixed(1)}¢/lb`}</title>
              </circle>
            ))}

            {/* Breakeven marker */}
            {breakeven !== null && breakeven >= S_MIN && breakeven <= S_MAX && (
              <g>
                <circle cx={x(breakeven)} cy={y(0)} r="5" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <text x={x(breakeven)} y={y(0) - 10} textAnchor="middle" fill="#f59e0b" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                  breakeven {c(breakeven)}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
