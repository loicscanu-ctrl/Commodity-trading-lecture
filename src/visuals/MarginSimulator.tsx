'use client'

import { useState } from 'react'

// Variation-margin simulator. Position: exporter SHORT 10 lots (100 t)
// of London Robusta, sold at $4,500/t; initial margin $60,000 posted.
// The student sets each of the 4 daily settlements (slider or typed),
// fixes it, and the daily + cumulative variation margin follow.
const ENTRY = 4500
const TONNES = 100
const IM = 60000
const DAYS = 4
const PMIN = 4200, PMAX = 5200

const usd = (n: number) => '$' + Math.abs(Math.round(n)).toLocaleString('en-US')
const sgn = (n: number) => (n < 0 ? '−' : '+') + usd(n)

export default function MarginSimulator() {
  const [settles, setSettles] = useState<number[]>([])
  const [live, setLive] = useState(4520)
  const [draft, setDraft] = useState<string | null>(null)
  const day = settles.length + 1 // the settlement day being set (1..4)
  const done = settles.length >= DAYS

  const points = [ENTRY, ...settles] // fixed points, day 0..n
  const prevSettle = points[points.length - 1]

  // VM for a SHORT position: price up = cash out
  const vmRows = settles.map((s, i) => {
    const prev = i === 0 ? ENTRY : settles[i - 1]
    return { day: i + 1, settle: s, move: s - prev, vm: -(s - prev) * TONNES }
  })
  const cumulative = vmRows.reduce((a, r) => a + r.vm, 0)
  const liveVm = -(live - prevSettle) * TONNES

  // Chart geometry
  const W = 560, H = 250, ml = 56, mr = 16, mt = 14, mb = 30
  const pw = W - ml - mr, ph = H - mt - mb
  const x = (d: number) => ml + (d / DAYS) * pw
  const y = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph

  const fixedPath = points.map((p, d) => `${d === 0 ? 'M' : 'L'}${x(d).toFixed(1)},${y(p).toFixed(1)}`).join(' ')

  function fix() {
    if (done) return
    setSettles(s => [...s, live])
    setDraft(null)
  }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Variation-Margin Simulator · short 10 lots @ {usd(ENTRY)}</div>
        <span className="chip !py-0.5 font-mono text-slate-300">initial margin posted: {usd(IM)}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
        {/* Chart + control */}
        <div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '250px' }}>
              {/* Grid */}
              {[4300, 4500, 4700, 4900, 5100].map(p => (
                <g key={p}>
                  <line x1={ml} y1={y(p)} x2={ml + pw} y2={y(p)} stroke={p === ENTRY ? 'rgba(34,211,238,0.25)' : 'rgba(255,255,255,0.05)'} strokeWidth="1" strokeDasharray={p === ENTRY ? '4 3' : undefined} />
                  <text x={ml - 6} y={y(p) + 3} textAnchor="end" fill={p === ENTRY ? '#22d3ee' : '#64748b'} fontSize="8.5" fontFamily="monospace">{p.toLocaleString()}</text>
                </g>
              ))}
              {[0, 1, 2, 3, 4].map(d => (
                <text key={d} x={x(d)} y={mt + ph + 16} textAnchor="middle" fill={d === 0 ? '#22d3ee' : d <= settles.length ? '#94a3b8' : d === day ? '#e2e8f0' : '#475569'} fontSize="8.5" fontFamily="monospace">
                  {d === 0 ? 'entry' : `Day ${d}`}
                </text>
              ))}

              {/* Fixed price path */}
              <path d={fixedPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {points.map((p, d) => (
                <circle key={d} cx={x(d)} cy={y(p)} r="4" fill={d === 0 ? '#22d3ee' : '#3b82f6'} stroke="#070912" strokeWidth="1.2">
                  <title>{d === 0 ? `entry $${p.toLocaleString()}` : `Day ${d} settle $${p.toLocaleString()}`}</title>
                </circle>
              ))}

              {/* Live (unfixed) point for the current day */}
              {!done && (
                <g>
                  <line x1={x(settles.length)} y1={y(prevSettle)} x2={x(day)} y2={y(live)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
                  <circle cx={x(day)} cy={y(live)} r="6" fill="#f59e0b" stroke="#070912" strokeWidth="1.5" />
                  <circle cx={x(day)} cy={y(live)} r="10" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.35" />
                  <text x={x(day)} y={y(live) - 12} textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">{live.toLocaleString()}</text>
                </g>
              )}
            </svg>
          </div>

          {/* Control for the live point */}
          {!done ? (
            <div className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-amber-300">Day {day} settlement — move it, then fix it</span>
                <input
                  type="number" value={draft ?? String(live)} step={5}
                  onChange={e => {
                    setDraft(e.target.value)
                    const v = parseFloat(e.target.value)
                    if (Number.isFinite(v)) setLive(Math.min(PMAX, Math.max(PMIN, v)))
                  }}
                  onBlur={() => setDraft(null)}
                  aria-label={`Day ${day} settlement`}
                  className="w-28 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-right font-mono text-xs tabular-nums text-white outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                />
              </div>
              <input type="range" min={PMIN} max={PMAX} step={5} value={live}
                onChange={e => { setDraft(null); setLive(parseFloat(e.target.value)) }}
                className="w-full h-1.5 cursor-pointer accent-brand-cyan" />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-400">
                  move {sgn(live - prevSettle).replace('$', '$')}/t → today&apos;s VM{' '}
                  <span className={liveVm >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(liveVm)}</span>
                </span>
                <button onClick={fix} className="btn-primary !px-3 !py-1.5 text-xs">Fix Day {day} settle</button>
              </div>
            </div>
          ) : (
            <button onClick={() => { setSettles([]); setLive(4520) }} className="btn-ghost mt-3 !px-3 !py-1.5 text-xs">Run another week</button>
          )}
        </div>

        {/* Margin account */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums">
            <div className="eyebrow mb-2">Daily variation margin (cash)</div>
            {vmRows.length === 0 && <div className="text-slate-500">No settlements fixed yet.</div>}
            <div className="space-y-1">
              {vmRows.map(r => (
                <div key={r.day} className="flex justify-between gap-2">
                  <span className="text-slate-400">Day {r.day} · {r.settle.toLocaleString()} ({r.move >= 0 ? '+' : '−'}{Math.abs(r.move)})</span>
                  <span className={r.vm >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(r.vm)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-4 font-mono text-xs tabular-nums ${cumulative >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'}`}>
            <div className="eyebrow mb-1">Cumulative cash{done ? ' — week complete' : ''}</div>
            <div className={`text-2xl font-bold ${cumulative >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(cumulative)}</div>
            <p className="mt-1.5 leading-relaxed text-slate-400">
              {cumulative < 0
                ? 'Wired OUT while the physical stock gains the same on paper — paper doesn’t wire. This is margin-funding risk: the hedge is perfect and the cash is real.'
                : cumulative > 0
                  ? 'Cash IN — the market fell, the short hedge pays you while the physical loses the same on paper. Symmetric, and just as misleading if you spend it.'
                  : 'Flat so far.'}
            </p>
          </div>

          <p className="text-[10px] leading-relaxed text-slate-500">
            Short position: price up = pay, price down = receive, $100 per $1/t move. A desk that cannot fund the red days is forced to lift its hedge at the top — how &ldquo;hedged&rdquo; books blow up (Ashanti 1999).
          </p>
        </div>
      </div>
    </div>
  )
}
