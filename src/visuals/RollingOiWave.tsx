'use client'

import { useEffect, useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'The life of open interest — one real year of Robusta, replayed' },
  caption: {
    label: 'Caption',
    multiline: true,
    value: 'Six contracts, six different death dates. The open interest never dies with them: as each front month approaches expiry, its holders ROLL — closing the dying contract, reopening the next. Read the THICKNESS of each price line (the fat line is where the market lives) and the coloured bands underneath (the same open interest, stacked): the crowd hands over contract by contract, and only a handful of lots ride into delivery on purpose.',
  },
  bwNote: {
    label: 'Structure note',
    multiline: true,
    value: 'Read the price axis while it plays. Through the winter the market is deeply BACKWARDATED — every deferred trades under the front, and each contract CLIMBS toward the front price as its expiry approaches: the pull to spot, the roll yield of the previous section. Then watch mid-year: the record crop arrives, the front collapses hardest, and by autumn the curve has quietly flipped into a mild CONTANGO — structure is a live thing, not a diagram.',
  },
  rollNote: {
    label: 'Roll-window note',
    multiline: true,
    value: 'During each roll window, VOLUME spikes (every migrating lot trades twice — one close, one open) while total OI barely moves: it only changes address. Prices and open interest here replay the last 12 months of the real London Robusta market (indicative, reconstructed from settlement history).',
  },
})

// The six London Robusta contracts that carried the last 12 months
// (Nov 2024 → Nov 2025). Codes are the exchange month letters.
const CONTRACTS = [
  { m: 'Jan 25', code: 'F', exp: 2, color: '#22d3ee' },
  { m: 'Mar 25', code: 'H', exp: 4, color: '#3b82f6' },
  { m: 'May 25', code: 'K', exp: 6, color: '#8b5cf6' },
  { m: 'Jul 25', code: 'N', exp: 8, color: '#f59e0b' },
  { m: 'Sep 25', code: 'U', exp: 10, color: '#34d399' },
  { m: 'Nov 25', code: 'X', exp: 12, color: '#f43f5e' },
]
const TOTAL_MONTHS = 12
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const calLabel = (m: number) => `${MONTH_NAMES[(10 + m) % 12]}${(10 + m) % 12 === 10 ? (m === 0 ? "'24" : "'25") : ''}`

// Piecewise-linear series helper
const lerp = (anchors: [number, number][], t: number): number => {
  if (t <= anchors[0][0]) return anchors[0][1]
  for (let i = 1; i < anchors.length; i++) {
    if (t <= anchors[i][0]) {
      const [t0, v0] = anchors[i - 1], [t1, v1] = anchors[i]
      return v0 + ((t - t0) / (t1 - t0)) * (v1 - v0)
    }
  }
  return anchors[anchors.length - 1][1]
}

// The REAL year, reconstructed (indicative): the front price rode the winter
// spike toward $5,700, collapsed to ~$3,500 when the record crop landed
// mid-2025, and rebounded through the autumn.
const FRONT_PATH: [number, number][] = [
  [0, 4950], [1, 5150], [2, 5500], [3, 5700], [4, 5450], [5, 5300],
  [6, 4850], [7, 4400], [8, 3700], [9, 3500], [10, 4100], [11, 4500], [12, 4350],
]
// Curve structure, $/t per month of remaining life: deeply backwardated
// (negative) through the tight winter, flipping to mild contango by autumn.
const STRUCT_PATH: [number, number][] = [
  [0, -65], [3, -60], [6, -35], [8, -12], [10, 5], [12, 12],
]
// Total open interest across the board, '000 lots (indicative)
const TOTAL_OI_PATH: [number, number][] = [
  [0, 126], [2, 132], [4, 128], [6, 118], [8, 108], [10, 112], [12, 120],
]

/** Price of contract i at time t (months from Nov 2024). */
export const priceAt = (t: number, i: number): number =>
  Math.round(lerp(FRONT_PATH, t) + lerp(STRUCT_PATH, t) * Math.max(0, CONTRACTS[i].exp - t))

const ROLL_WINDOW = 0.9 // months before expiry during which the front rolls
// Share of total OI by curve RANK (front, 2nd, 3rd…) — the front carries the crowd
const RANK_SHARE = [0.5, 0.25, 0.12, 0.07, 0.04, 0.02]

const smooth = (u: number) => { const c = Math.min(1, Math.max(0, u)); return c * c * (3 - 2 * c) }

// OI of each contract at time t: rank shares of the (real) total, blended
// toward the next rank as the front's roll window progresses.
export function oiAt(t: number): number[] {
  const k = CONTRACTS.findIndex(c => t < c.exp)
  if (k === -1) return CONTRACTS.map(() => 0)
  const p = smooth((t - (CONTRACTS[k].exp - ROLL_WINDOW)) / ROLL_WINDOW)
  const total = lerp(TOTAL_OI_PATH, t)
  return CONTRACTS.map((c, i) => {
    if (t >= c.exp) return 0
    const r = i - k
    const share = (1 - p) * (RANK_SHARE[r] ?? 0) + p * (r === 0 ? 0.03 : RANK_SHARE[r - 1] ?? 0)
    return share * total
  })
}

// ── The rolled long: buy 1 lot of the front at the start, roll it into the
// next contract mid-window, all year. The roll itself books NOTHING — the
// edge comes from buying the deferred CHEAP (backwardation) and riding its
// pull to spot. Decomposed against the front-path move so the ROLL YIELD
// shows up as its own line.
const LOT_TONNES = 10
export function rolledLongAt(t: number): { pnl: number; marketMove: number; rollYield: number; holding: number; rolls: number } {
  const tc = Math.min(t, TOTAL_MONTHS)
  let pnl = 0
  let j = 0
  let a = 0
  for (;;) {
    const isLast = j >= CONTRACTS.length - 1
    const rollT = isLast ? CONTRACTS[CONTRACTS.length - 1].exp : CONTRACTS[j].exp - ROLL_WINDOW / 2
    const b = Math.min(tc, rollT)
    if (b > a) pnl += (priceAt(b, j) - priceAt(a, j)) * LOT_TONNES
    if (tc <= rollT || isLast) break
    a = rollT
    j++
  }
  const marketMove = (lerp(FRONT_PATH, tc) - lerp(FRONT_PATH, 0)) * LOT_TONNES
  return { pnl: Math.round(pnl), marketMove: Math.round(marketMove), rollYield: Math.round(pnl - marketMove), holding: j, rolls: j }
}

export default function RollingOiWave() {
  const t = useVisualText(textDef)
  const [now, setNow] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setNow(v => {
        const next = v + 0.04
        if (next >= TOTAL_MONTHS) { setPlaying(false); return TOTAL_MONTHS }
        return next
      })
    }, 60)
    return () => clearInterval(id)
  }, [playing])

  const W = 560, H = 412, ml = 56, mr = 40, mt = 14
  const pw = W - ml - mr
  const ph = 270 // price panel height — tall, so the contract gaps read
  const PMIN = 3400, PMAX = 5800
  const OTOP = 306, OH = 82, OI_MAX = 140 // the OI band panel underneath
  const x = (months: number) => ml + (months / TOTAL_MONTHS) * pw
  const y = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph
  const oy = (v: number) => OTOP + OH - (v / OI_MAX) * OH

  const oi = oiAt(now)
  const k = CONTRACTS.findIndex(c => now < c.exp)
  const rolling = k !== -1 && now > CONTRACTS[k].exp - ROLL_WINDOW && now < CONTRACTS[k].exp
  const rollP = k !== -1 ? smooth((now - (CONTRACTS[k].exp - ROLL_WINDOW)) / ROLL_WINDOW) : 0
  const done = now >= TOTAL_MONTHS
  const struct = lerp(STRUCT_PATH, now)

  // Each contract's price path, drawn up to NOW (or its death)
  const pathOf = (i: number): string => {
    const end = Math.min(now, CONTRACTS[i].exp)
    if (end <= 0) return ''
    const pts: string[] = []
    for (let tt = 0; tt <= end + 1e-9; tt += 0.1) {
      const tc = Math.min(tt, end)
      pts.push(`${pts.length === 0 ? 'M' : 'L'}${x(tc).toFixed(1)},${y(priceAt(tc, i)).toFixed(1)}`)
    }
    return pts.join(' ')
  }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">{t('heading')}</div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${
            struct < 0 ? 'border-rose-500/40 bg-rose-500/[0.08] text-rose-300' : 'border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-300'
          }`}
            title="The live curve structure: deferreds under the front (backwardation) or above it (contango).">
            {k !== -1 ? `front ${CONTRACTS[k].code} · ${priceAt(now, k).toLocaleString('en-US')} · OI ${Math.round(oiAt(now)[k])}k · ` : ''}{struct < 0 ? 'BACKWARDATION' : 'CONTANGO'}
          </span>
          <button type="button" onClick={() => { if (done) setNow(0); setPlaying(p => done ? true : !p) }}
            className="rounded-full border border-brand-cyan/50 bg-brand-cyan/10 px-3 py-1 font-mono text-xs font-bold text-cyan-100 hover:bg-brand-cyan/20">
            {done ? '↻ Replay' : playing ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      {/* legend — the six contracts by code, month and colour */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {CONTRACTS.map((c, i) => {
          const expired = now >= c.exp
          return (
            <span key={c.code} className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] ${
              expired ? 'border-white/5 text-slate-600' : i === k ? 'border-white/25 bg-white/[0.06] font-bold text-white' : 'border-white/10 text-slate-400'
            }`}>
              <span className="h-2 w-2 rounded-full" style={{ background: expired ? '#334155' : c.color }} />
              {c.code} · {c.m}{expired ? ' ✕' : i === k ? ' · front' : ''}
            </span>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_195px] gap-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '420px' }}>
        {/* price grid — the y-axis IS the price */}
        {[3500, 4000, 4500, 5000, 5500].map(p => (
          <g key={p}>
            <line x1={ml} y1={y(p)} x2={ml + pw} y2={y(p)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={ml - 6} y={y(p) + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">{p.toLocaleString('en-US')}</text>
          </g>
        ))}
        {/* month grid — through the price panel and the OI panel */}
        {Array.from({ length: TOTAL_MONTHS + 1 }, (_, m) => (
          <g key={m}>
            <line x1={x(m)} y1={mt} x2={x(m)} y2={OTOP + OH} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={x(m)} y={H - 8} textAnchor="middle" fill={m === 0 || m === TOTAL_MONTHS ? '#fbbf24' : '#475569'} fontSize="7.5" fontFamily="monospace">{calLabel(m)}</text>
          </g>
        ))}

        {/* ── The OI sub-panel: the same open interest, stacked by contract ── */}
        <text x={ml} y={OTOP - 5} fill="#94a3b8" fontSize="8.5" fontFamily="monospace">OPEN INTEREST · ’000 lots (stacked by contract)</text>
        {[70, 140].map(v => (
          <g key={`og-${v}`}>
            <line x1={ml} y1={oy(v)} x2={ml + pw} y2={oy(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={ml - 6} y={oy(v) + 3} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace">{v}k</text>
          </g>
        ))}
        <line x1={ml} y1={OTOP + OH} x2={ml + pw} y2={OTOP + OH} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        {now > 0.05 && (() => {
          const STEP = 0.15
          const samples: { tt: number; cum: number[] }[] = []
          for (let tt = 0; tt <= now + 1e-9; tt += STEP) {
            const tc = Math.min(tt, now)
            const vals = oiAt(tc)
            const cum: number[] = [0]
            for (let i = 0; i < vals.length; i++) cum.push(cum[i] + vals[i])
            samples.push({ tt: tc, cum })
          }
          return CONTRACTS.map((c, i) => {
            const upper = samples.map(sm => `L${x(sm.tt).toFixed(1)},${oy(sm.cum[i + 1]).toFixed(1)}`)
            const lower = [...samples].reverse().map(sm => `L${x(sm.tt).toFixed(1)},${oy(sm.cum[i]).toFixed(1)}`)
            const d = `M${x(0).toFixed(1)},${oy(samples[0].cum[i + 1]).toFixed(1)} ${upper.join(' ')} ${lower.join(' ')} Z`
            return <path key={`band-${c.code}`} d={d} fill={`${c.color}55`} stroke={c.color} strokeWidth="0.6" />
          })
        })()}
        {/* band labels at NOW — codes for whoever holds a visible share */}
        {(() => {
          const vals = oiAt(now)
          let acc = 0
          return CONTRACTS.map((c, i) => {
            const lower = acc; acc += vals[i]
            if (vals[i] < 14) return null
            return (
              <text key={`bl-${c.code}`} x={Math.max(ml + 10, x(now) - 8)} y={oy(lower + vals[i] / 2) + 3} textAnchor="end" fill="#fff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                {c.code} {Math.round(vals[i])}k
              </text>
            )
          })
        })()}

        {/* the six price paths — each dies at ITS expiry */}
        {CONTRACTS.map((c, i) => {
          const expired = now >= c.exp
          const endT = Math.max(0, Math.min(now, c.exp))
          const endX = x(endT), endY = y(priceAt(endT, i))
          return (
            <g key={c.code}>
              {/* the line's THICKNESS is its open interest — the fat line is where the market lives */}
              <path d={pathOf(i)} fill="none" stroke={c.color}
                strokeWidth={expired ? 1 : Math.max(1, 0.8 + oi[i] * 0.075)}
                opacity={expired ? 0.3 : i === k ? 0.95 : 0.75}
                strokeDasharray={expired ? '3 3' : undefined} strokeLinejoin="round" strokeLinecap="round" />
              {/* the contract's code rides the end of its own line — the on-chart legend */}
              <text x={endX + 5} y={endY + 3} fill={expired ? '#64748b' : c.color} fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                {c.code}{expired ? ' ✕' : ''}
              </text>
            </g>
          )
        })}

        {/* the migration — lots streaming from the dying front to the next contract */}
        {rolling && k < CONTRACTS.length - 1 && (
          <g>
            {[0.25, 0.55, 0.85].map((f, j) => {
              const y1 = y(priceAt(now, k)), y2 = y(priceAt(now, k + 1))
              const yy = y1 + (y2 - y1) * ((rollP + f) % 1)
              return <circle key={j} cx={x(now) + 6 + j * 4} cy={yy} r="2.2" fill="#f59e0b" opacity="0.9" />
            })}
            <text x={x(now) + 14} y={(y(priceAt(now, k)) + y(priceAt(now, k + 1))) / 2 + 3} fill="#f59e0b" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              ROLL — volume spikes, OI migrates
            </text>
          </g>
        )}

        {/* NOW — the vertical line of time passing */}
        <line x1={x(now)} y1={mt} x2={x(now)} y2={OTOP + OH} stroke="#f59e0b" strokeWidth="1.5" opacity="0.9" />
        <text x={x(now)} y={mt - 3} textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">NOW</text>
      </svg>

      {/* ── The margin P&L: a long taken at the start and ROLLED all year ── */}
      {(() => {
        const rl = rolledLongAt(now)
        const holdingC = CONTRACTS[rl.holding]
        const alive = now < TOTAL_MONTHS
        return (
          <div className="space-y-2 self-start">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[10px] tabular-nums">
              <div className="eyebrow mb-1.5">The rolled long · 1 lot (10 t)</div>
              <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-slate-200">bought F @ 4,820</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{alive ? 'Holding' : 'Ended'}</span>
                <span style={{ color: holdingC.color }} className="font-bold">
                  {alive ? `${holdingC.code} @ ${priceAt(now, rl.holding).toLocaleString('en-US')}` : `${holdingC.code} expired`}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-slate-500">Rolls executed</span><span className="text-slate-200">{rl.rolls}</span></div>
            </div>

            <div className={`rounded-xl border p-3 font-mono text-[10px] tabular-nums ${rl.pnl >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-rose-500/40 bg-rose-500/[0.06]'}`}>
              <div className="flex justify-between"><span className="text-slate-400">Rolled long P&L</span>
                <span className={`text-sm font-bold ${rl.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{rl.pnl < 0 ? '−' : '+'}${Math.abs(rl.pnl).toLocaleString('en-US')}</span></div>
              <div className="mt-1.5 flex justify-between border-t border-white/10 pt-1.5"><span className="text-slate-500">of which market move</span>
                <span className={rl.marketMove >= 0 ? 'text-emerald-300/80' : 'text-rose-300/80'}>{rl.marketMove < 0 ? '−' : '+'}${Math.abs(rl.marketMove).toLocaleString('en-US')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">of which ROLL YIELD</span>
                <span className={`font-bold ${rl.rollYield >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{rl.rollYield < 0 ? '−' : '+'}${Math.abs(rl.rollYield).toLocaleString('en-US')}</span></div>
            </div>

            <p className="text-[9.5px] leading-relaxed text-slate-500">
              The roll books nothing by itself — the ROLL YIELD is earned by buying each deferred CHEAP (backwardation) and riding its pull to spot. Watch it stall when the curve flips to contango.
            </p>
          </div>
        )
      })()}
      </div>

      {/* scrub the timeline by hand — same state the animation drives */}
      <div className="mt-1 flex items-center gap-3">
        <input type="range" min={0} max={TOTAL_MONTHS} step={0.05} value={now} aria-label="Timeline (months)"
          onChange={e => { setPlaying(false); setNow(parseFloat(e.target.value)) }}
          className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
        <span className="w-16 shrink-0 text-right font-mono text-[11px] tabular-nums text-slate-400">+{now.toFixed(1)} mo</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-300">{t('caption')}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{t('bwNote')}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{t('rollNote')}</p>
    </div>
  )
}
