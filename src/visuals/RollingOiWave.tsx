'use client'

import { useEffect, useRef, useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'The life of open interest — watching the roll across the curve' },
  caption: {
    label: 'Caption',
    multiline: true,
    value: 'Five contracts, five different death dates. The open interest never dies with them: as each front month approaches expiry, its holders ROLL — closing the dying contract, reopening the next. The bubble wave you are watching IS the market: the front carries the crowd, the roll passes it on, and only a handful of lots ride into delivery on purpose.',
  },
  rollNote: {
    label: 'Roll-window note',
    multiline: true,
    value: 'During each roll window, VOLUME spikes (every migrating lot trades twice — one close, one open) while total OI barely moves: it only changes address. You saw this pair on the Volume & Open Interest slide.',
  },
})

// Five London contracts, expiries staggered every 2 months from "now + 2"
const CONTRACTS = [
  { m: 'Jan', exp: 2 },
  { m: 'Mar', exp: 4 },
  { m: 'May', exp: 6 },
  { m: 'Jul', exp: 8 },
  { m: 'Sep', exp: 10 },
]
const TOTAL_MONTHS = 11
const ROLL_WINDOW = 0.9 // months before expiry during which the front rolls
// Share of total OI by curve RANK (front, 2nd, 3rd…) — the front carries the crowd
const RANK_SHARE = [0.52, 0.26, 0.13, 0.06, 0.03]
const TOTAL_OI = 100 // '000 lots

const smooth = (u: number) => { const c = Math.min(1, Math.max(0, u)); return c * c * (3 - 2 * c) }

// OI of each contract at time t (months): rank shares, blended toward the
// next rank as the front's roll window progresses. What the front loses,
// the rest of the curve gains — one rank earlier each.
export function oiAt(t: number): number[] {
  const k = CONTRACTS.findIndex(c => t < c.exp) // current front (first unexpired)
  if (k === -1) return CONTRACTS.map(() => 0)
  const p = smooth((t - (CONTRACTS[k].exp - ROLL_WINDOW)) / ROLL_WINDOW)
  return CONTRACTS.map((c, i) => {
    if (t >= c.exp) return 0
    const r = i - k
    const share = (1 - p) * (RANK_SHARE[r] ?? 0) + p * (r === 0 ? 0.04 : RANK_SHARE[r - 1] ?? 0)
    return share * TOTAL_OI
  })
}

export default function RollingOiWave() {
  const t = useVisualText(textDef)
  const [now, setNow] = useState(0)
  const [playing, setPlaying] = useState(false)
  const raf = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setNow(v => {
        const next = v + 0.035
        if (next >= TOTAL_MONTHS) { setPlaying(false); return TOTAL_MONTHS }
        return next
      })
    }, 60)
    raf.current = id
    return () => clearInterval(id)
  }, [playing])

  const W = 560, H = 260, ml = 52, mr = 60, mt = 16, mb = 26
  const pw = W - ml - mr
  const rowY = (i: number) => mt + 18 + i * 44
  const x = (months: number) => ml + (months / TOTAL_MONTHS) * pw
  const oi = oiAt(now)
  const k = CONTRACTS.findIndex(c => now < c.exp)
  const rolling = k !== -1 && now > CONTRACTS[k].exp - ROLL_WINDOW && now < CONTRACTS[k].exp
  const rollP = k !== -1 ? smooth((now - (CONTRACTS[k].exp - ROLL_WINDOW)) / ROLL_WINDOW) : 0
  const done = now >= TOTAL_MONTHS

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">{t('heading')}</div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { if (done) setNow(0); setPlaying(p => done ? true : !p) }}
            className="rounded-full border border-brand-cyan/50 bg-brand-cyan/10 px-3 py-1 font-mono text-xs font-bold text-cyan-100 hover:bg-brand-cyan/20">
            {done ? '↻ Replay' : playing ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '270px' }}>
        {/* month grid */}
        {Array.from({ length: TOTAL_MONTHS + 1 }, (_, m) => (
          <g key={m}>
            <line x1={x(m)} y1={mt} x2={x(m)} y2={H - mb} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={x(m)} y={H - 8} textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">+{m}mo</text>
          </g>
        ))}

        {/* the five contract lines — each ends at ITS expiry */}
        {CONTRACTS.map((c, i) => {
          const expired = now >= c.exp
          const yy = rowY(i)
          return (
            <g key={c.m}>
              <text x={ml - 8} y={yy + 3} textAnchor="end" fill={expired ? '#475569' : '#94a3b8'} fontSize="10" fontFamily="monospace" fontWeight="bold">{c.m}</text>
              <line x1={ml} y1={yy} x2={x(c.exp)} y2={yy}
                stroke={expired ? '#334155' : i === k ? '#22d3ee' : '#3b82f6'} strokeWidth={i === k && !expired ? 2 : 1.2}
                strokeDasharray={expired ? '2 4' : undefined} opacity={expired ? 0.5 : 0.8} />
              {/* the death of the contract */}
              <text x={x(c.exp) + 4} y={yy + 3} fill={expired ? '#f43f5e' : '#64748b'} fontSize="8.5" fontFamily="monospace">
                {expired ? '✕ expired' : 'expiry'}
              </text>
              {/* the OI bubble riding the NOW line */}
              {!expired && now <= c.exp && oi[i] > 0.3 && (
                <g>
                  <circle cx={x(Math.min(now, c.exp))} cy={yy} r={3 + Math.sqrt(oi[i]) * 2.6} fill={i === k ? 'rgba(34,211,238,0.25)' : 'rgba(59,130,246,0.22)'}
                    stroke={i === k ? '#22d3ee' : '#3b82f6'} strokeWidth="1.2" />
                  <text x={x(Math.min(now, c.exp))} y={yy - (6 + Math.sqrt(oi[i]) * 2.6)} textAnchor="middle" fill={i === k ? '#22d3ee' : '#60a5fa'} fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                    {Math.round(oi[i])}k
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* the migration — lots streaming from the dying front to the next line */}
        {rolling && k < CONTRACTS.length - 1 && (
          <g>
            {[0.25, 0.55, 0.85].map((f, j) => {
              const yy = rowY(k) + (rowY(k + 1) - rowY(k)) * ((rollP + f) % 1)
              return <circle key={j} cx={x(now) + 6 + j * 4} cy={yy} r="2.2" fill="#f59e0b" opacity="0.9" />
            })}
            <text x={x(now) + 14} y={(rowY(k) + rowY(k + 1)) / 2 + 3} fill="#f59e0b" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              ROLL — volume spikes, OI migrates
            </text>
          </g>
        )}

        {/* NOW — the vertical line of time passing */}
        <line x1={x(now)} y1={mt} x2={x(now)} y2={H - mb} stroke="#f59e0b" strokeWidth="1.5" opacity="0.9" />
        <text x={x(now)} y={mt - 4} textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">NOW</text>
      </svg>

      {/* scrub the timeline by hand — same state the animation drives */}
      <div className="mt-1 flex items-center gap-3">
        <input type="range" min={0} max={TOTAL_MONTHS} step={0.05} value={now} aria-label="Timeline (months)"
          onChange={e => { setPlaying(false); setNow(parseFloat(e.target.value)) }}
          className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
        <span className="w-16 shrink-0 text-right font-mono text-[11px] tabular-nums text-slate-400">+{now.toFixed(1)} mo</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-300">{t('caption')}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{t('rollNote')}</p>
    </div>
  )
}
