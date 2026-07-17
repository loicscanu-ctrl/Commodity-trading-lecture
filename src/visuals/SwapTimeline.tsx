'use client'

import { useState } from 'react'

// Swap cash flows on a timeline. The producer's Q1 swap from the lecture:
// 500 t/month fixed at $4,300/t vs the monthly index average. Nothing is
// paid at signature; cash moves at each monthly settlement, and the
// producer's effective price is pinned to the fix whatever the index does.
const FIXED = 4300
const VOL = 500
const MONTHS = ['Jan', 'Feb', 'Mar'] as const

const usd = (n: number) => '$' + Math.abs(Math.round(n)).toLocaleString('en-US')
const sgn = (n: number) => (n === 0 ? '$0' : (n < 0 ? '−' : '+') + usd(n))

function AvgInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-slate-400">{label}</span>
        <input
          type="number" value={draft ?? String(value)} step={10}
          onChange={e => {
            setDraft(e.target.value)
            const v = parseFloat(e.target.value)
            if (Number.isFinite(v)) onChange(Math.min(4600, Math.max(4000, v)))
          }}
          onBlur={() => setDraft(null)}
          aria-label={label}
          className="w-24 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-right font-mono text-xs tabular-nums text-white outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
        />
      </div>
      <input type="range" min={4000} max={4600} step={10} value={value}
        onChange={e => { setDraft(null); onChange(parseFloat(e.target.value)) }}
        className="w-full h-1.5 cursor-pointer accent-brand-blue" />
    </div>
  )
}

export default function SwapTimeline() {
  const [avgs, setAvgs] = useState<number[]>([4150, 4420, 4300])

  // Producer receives fixed, pays floating: + when the index averages below the fix.
  const flows = avgs.map(a => (FIXED - a) * VOL)
  const total = flows.reduce((a, b) => a + b, 0)

  // Chart geometry: top panel = prices, bottom panel = cash-flow bars.
  const W = 560, ml = 64, mr = 18
  const pw = W - ml - mr
  // x positions: 0 = Dec (trade date), then end-Jan / end-Feb / end-Mar
  const x = (i: number) => ml + (i / 3) * pw
  const P = { top: 24, h: 110, min: 4000, max: 4600 }
  const yP = (v: number) => P.top + (1 - (v - P.min) / (P.max - P.min)) * P.h
  const B = { top: 178, h: 96, max: 110000 }
  const yZero = B.top + B.h / 2
  const yB = (v: number) => yZero - (v / B.max) * (B.h / 2)

  const idxPath = avgs.map((a, i) => `${i === 0 ? 'M' : 'L'}${x(i + 1).toFixed(1)},${yP(a).toFixed(1)}`).join(' ')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Swap Cash Flows on a Timeline · 500 t/month fixed at {usd(FIXED)}/t</div>
        <span className="chip !py-0.5 font-mono text-slate-300">net over Q1: <span className={total >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(total)}</span></span>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <svg viewBox={`0 0 ${W} 300`} className="w-full" style={{ maxHeight: '300px' }}>
          {/* ── Top panel: fixed vs floating ── */}
          <text x={ml} y={14} fill="#94a3b8" fontSize="9" fontFamily="monospace">PRICE ($/t): fixed leg vs monthly index average</text>
          {[4000, 4300, 4600].map(v => (
            <g key={v}>
              <line x1={ml} y1={yP(v)} x2={ml + pw} y2={yP(v)} stroke={v === FIXED ? 'rgba(34,211,238,0.35)' : 'rgba(255,255,255,0.05)'} strokeWidth="1" strokeDasharray={v === FIXED ? '5 4' : undefined} />
              <text x={ml - 6} y={yP(v) + 3} textAnchor="end" fill={v === FIXED ? '#22d3ee' : '#64748b'} fontSize="8.5" fontFamily="monospace">{v.toLocaleString()}</text>
            </g>
          ))}
          <text x={ml + pw} y={yP(FIXED) - 5} textAnchor="end" fill="#22d3ee" fontSize="8.5" fontFamily="monospace" fontWeight="bold">fixed {usd(FIXED)}</text>

          {/* Index line + points */}
          <path d={idxPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
          {avgs.map((a, i) => (
            <g key={i}>
              <circle cx={x(i + 1)} cy={yP(a)} r="4" fill="#f59e0b" stroke="#070912" strokeWidth="1.2">
                <title>{`${MONTHS[i]} index average $${a.toLocaleString()}/t`}</title>
              </circle>
              <text x={x(i + 1)} y={yP(a) + (a >= FIXED ? -8 : 14)} textAnchor="middle" fill="#fbbf24" fontSize="8.5" fontFamily="monospace">{a.toLocaleString()}</text>
            </g>
          ))}

          {/* Trade date marker */}
          <line x1={x(0)} y1={P.top} x2={x(0)} y2={B.top + B.h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
          <text x={x(0)} y={P.top + 8} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">swap signed</text>
          <text x={x(0)} y={P.top + 18} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">no cash changes hands</text>

          {/* ── Bottom panel: cash flows at each settlement ── */}
          <text x={ml} y={B.top - 6} fill="#94a3b8" fontSize="9" fontFamily="monospace">CASH FLOW to the producer at each monthly settlement</text>
          <line x1={ml} y1={yZero} x2={ml + pw} y2={yZero} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {flows.map((f, i) => {
            const h = Math.abs(yB(f) - yZero)
            const top = f >= 0 ? yB(f) : yZero
            return (
              <g key={i}>
                <rect x={x(i + 1) - 16} y={top} width="32" height={Math.max(h, f === 0 ? 2 : 2)} rx="2"
                  fill={f > 0 ? '#34d399' : f < 0 ? '#f43f5e' : '#64748b'}>
                  <title>{`${MONTHS[i]}: (${FIXED.toLocaleString()} − ${avgs[i].toLocaleString()}) × ${VOL} t = ${sgn(f)}`}</title>
                </rect>
                <text x={x(i + 1)} y={f >= 0 ? top - 5 : top + h + 11} textAnchor="middle"
                  fill={f > 0 ? '#34d399' : f < 0 ? '#f87171' : '#94a3b8'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {sgn(f)}
                </text>
              </g>
            )
          })}

          {/* Time axis */}
          {['Dec · trade date', 'end Jan', 'end Feb', 'end Mar'].map((t, i) => (
            <text key={t} x={x(i)} y={B.top + B.h + 16} textAnchor="middle" fill={i === 0 ? '#94a3b8' : '#e2e8f0'} fontSize="8.5" fontFamily="monospace">{t}</text>
          ))}
          {/* timeline arrow */}
          <line x1={ml} y1={B.top + B.h + 24} x2={ml + pw} y2={B.top + B.h + 24} stroke="#475569" strokeWidth="1" markerEnd="url(#st-arrow)" />
          <defs>
            <marker id="st-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#475569" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Controls + effective price */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="eyebrow">Move the monthly index averages</div>
          {MONTHS.map((m, i) => (
            <AvgInput key={m} label={`${m} index average ($/t)`} value={avgs[i]}
              onChange={v => setAvgs(a => a.map((x0, j) => (j === i ? v : x0)))} />
          ))}
        </div>
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3 font-mono text-[11px] tabular-nums">
          <div className="eyebrow mb-2 text-emerald-400">The producer&apos;s effective price — every month</div>
          <div className="space-y-1">
            {MONTHS.map((m, i) => (
              <div key={m} className="flex justify-between gap-2">
                <span className="text-slate-400">{m}: sell physical @ {avgs[i].toLocaleString()} {flows[i] >= 0 ? '+' : '−'} swap {usd(Math.abs(flows[i] / VOL))}</span>
                <span className="font-bold text-emerald-300">= {usd(FIXED)}/t</span>
              </div>
            ))}
          </div>
          <p className="mt-2 leading-relaxed text-slate-400">
            Drag the index anywhere: the swap leg always tops the physical sale up (or down) to exactly {usd(FIXED)} — that is what &ldquo;fixing your price&rdquo; means. And note the trade date: unlike an option, a swap costs <span className="text-slate-200">nothing upfront</span> — the cash moves only at the settlements.
          </p>
        </div>
      </div>
    </div>
  )
}
