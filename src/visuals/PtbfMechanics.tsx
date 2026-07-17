'use client'

import { useState, useRef, useEffect } from 'react'

// Two PTBF trades on 100 t of Robusta.
//  Exporter (4 steps): buy local VND (outright) → sell futures (sets the
//    buying diff) → sell FOB (diff) → fix (buy futures).
//  Importer (5 steps): buy FOB (diff only — unpriced) → buy freight →
//    fix before export (sell futures: prices the purchase AND hedges) →
//    sell spot outright in EUR (fixed 1.20 USD/EUR) → buy futures
//    (locks the selling differential).
// Every input is typeable (any value, even beyond the slider scale) and
// LOCKS when the action that consumes it executes.
const FX = 25500        // VND per USD
const EURUSD = 1.20     // USD per EUR (fixed)
const CIF_INSTORE = 100 // $/t CIF → instore
const TONNES = 100

type Mode = 'exporter' | 'importer'
type Deal = {
  vnd?: number; buy?: number          // exporter step 1
  dBuy?: number                        // importer step 1
  freight?: number                     // importer step 2
  fHedge?: number                      // futures sold (exporter step 2 / importer step 3)
  sell?: number                        // exporter step 3: FOB diff · importer step 4: sale in USD
  eur?: number                         // importer step 4: sale in EUR
  fFix?: number                        // futures bought back (final step)
  stamps?: number[]                    // live mode: the round (T0..) each action executed in
  stampTimes?: number[]                // live mode: the exact second each action executed at
  futMarks?: number[]                  // London futures level at each executed action (for the price graph)
  diffMarks?: number[]                 // FOB differential at each executed action (second graph panel)
}

// Live-market mode: a predetermined multi-season path, identical for every
// student. 45 seconds per round; within a round the market DRIFTS from the
// previous round's level to this round's published level in 5-second steps
// (reaching it at 40 s and holding, so the printed level is tradeable),
// then freezes on the final round. Each round opens with a news flash —
// the prices move the way the news says.
const ROUND_SECONDS = 45
const TICK_SECONDS = 5
const TICKS_TO_TARGET = ROUND_SECONDS / TICK_SECONDS - 1 // target reached one tick early
const LIVE_SCRIPT = [
  { label: 'Y1 Apr', vnd: 119000, fut: 4800, fob: -90, freight: 70, eur: 4090,
    news: 'A broker reports an unseasonal increase of Vietnam coffee stocks at origin — warehouses almost full. Bearish Vietnam FOB differentials.' },
  { label: 'Y1 Jul', vnd: 114000, fut: 4650, fob: -120, freight: 70, eur: 3980,
    news: 'Warehouses at origin confirmed well filled. A contact at Starbucks reports consumption shifting from coffee towards iced tea and matcha.' },
  { label: 'Y1 Nov', vnd: 113000, fut: 4950, fob: -280, freight: 270, eur: 4290,
    news: 'Harvest just starting — and Bab-el-Mandeb is CLOSED. Freight quotes +$200/t with a lack of vessels. Bullish London, bearish differential.' },
  { label: 'Y2 Mar', vnd: 138500, fut: 5400, fob: 80, freight: 150, eur: 4620,
    news: 'Good crop in the barn — but a drought is hitting the NEXT crop: a broker estimates −10%. Bullish London and bullish Vietnam diffs, Vietnam outpacing the screen.' },
  { label: 'Y2 Sep', vnd: 144500, fut: 5600, fob: 150, freight: 140, eur: 4800,
    news: 'HCM warehouses emptier than normal. High prices push farmers to cut avocado trees and plant coffee — an agronomist estimates +5% area (yields in two years). Diffs still bullish for now.' },
  { label: 'Y2 Oct', vnd: 142000, fut: 5450, fob: 200, freight: 45, eur: 4690,
    news: 'Logistics normalising — historically low freight. Bearish London/spot, bullish FOB differentials.' },
  { label: 'Y3 Dec', vnd: 133500, fut: 5300, fob: 60, freight: 50, eur: 4470,
    news: 'Harvested crop estimated −10% vs Y2 — but an agronomist shows fertilizer inflows (afforded thanks to high prices) boosting yields +3%. Origin stocks still low; farmers sell hard ahead of a record next crop. Bearish differential.' },
  { label: 'Y4 Aug', vnd: 111500, fut: 4700, fob: -150, freight: 55, eur: 4000,
    news: 'A broker publishes a RECORD crop estimate: +20%! Bearish London and further bearish differentials.' },
  { label: 'Y4 Dec', vnd: 127000, fut: 4850, fob: 90, freight: 60, eur: 4180,
    news: 'La Niña brings heavy rain and postpones the harvest to January. Flash hike of local FOB differentials — exporters scramble for spot coffee.' },
  { label: 'Y5 Jan', vnd: 114000, fut: 4600, fob: -80, freight: 60, eur: 3950,
    news: 'The harvest is happening. Final round — complete your remaining actions.' },
]

const SESSION_SECONDS = LIVE_SCRIPT.length * ROUND_SECONDS // 450 s of live market

// Deterministic live value at second t — the same lerp+snap as the feed, so
// the graph can reconstruct the whole tick-by-tick price history from time.
function liveValueAt(t: number, get: (r: (typeof LIVE_SCRIPT)[number]) => number, snap: number): number {
  const r = Math.min(LIVE_SCRIPT.length - 1, Math.floor(t / ROUND_SECONDS))
  const prev = get(LIVE_SCRIPT[Math.max(0, r - 1)])
  const target = get(LIVE_SCRIPT[r])
  const f = Math.min(1, Math.floor(Math.max(0, t - r * ROUND_SECONDS) / TICK_SECONDS) / TICKS_TO_TARGET)
  return Math.round((prev + (target - prev) * f) / snap) * snap
}

const fmtUsd = (n: number, dp = 0) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
const fmtEur = (n: number) => '€' + Math.abs(n).toLocaleString('en-US')
const sgn = (n: number, dp = 0) => (n < 0 ? '−' : '+') + fmtUsd(n, dp)
const dfmt = (n: number, dp = 0) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`

export type TradeRecord = {
  mode: Mode
  tonnes: number
  deal: Deal
  physical: number
  futures: number
  costs: number
  net: number
}

const stampLabel = (deal: Deal, i: number) => (deal.stamps?.[i] !== undefined ? ` · ${LIVE_SCRIPT[deal.stamps[i]].label}` : '')

/** Plain-text session report: every trade with its executions, stamps and P&L. */
export function buildTradeReport(history: TradeRecord[]): string {
  const L: string[] = []
  L.push('PTBF TRADE REPORT — 100 t Robusta per trade')
  L.push(`Generated: ${new Date().toISOString()}`)
  L.push('')
  history.forEach((t, n) => {
    const d = t.deal
    L.push(`Trade ${n + 1} — ${t.mode === 'exporter' ? 'Exporter (buy VND → sell FOB)' : 'Importer (buy FOB → sell spot EUR)'} · ${t.tonnes} t`)
    if (t.mode === 'exporter') {
      const dBuy = d.buy! - d.fHedge!
      L.push(`  1. Buy physical: ${d.vnd?.toLocaleString('en-US')} VND/kg = ${fmtUsd(d.buy!, 1)}/t${stampLabel(d, 0)}`)
      L.push(`  2. Sell futures (hedge): ${fmtUsd(d.fHedge!)} → buying diff ${dfmt(dBuy, 1)}${stampLabel(d, 1)}`)
      L.push(`  3. Sell physical FOB: London ${dfmt(d.sell!)}${stampLabel(d, 2)}`)
      L.push(`  4. Fix (buy futures): ${fmtUsd(d.fFix!)} → invoice ${fmtUsd(d.fFix! + d.sell!)}/t${stampLabel(d, 3)}`)
      if (d.stamps) L.push(`  Rounds unhedged (flat risk): ${d.stamps[1] - d.stamps[0]}`)
    } else {
      L.push(`  1. Buy physical FOB: London ${dfmt(d.dBuy!)} (PTBF)${stampLabel(d, 0)}`)
      L.push(`  2. Buy freight: $${d.freight}/t + $${CIF_INSTORE} instore${stampLabel(d, 1)}`)
      L.push(`  3. Fix before export (sell futures): ${fmtUsd(d.fHedge!)} → purchase ${fmtUsd(d.fHedge! + d.dBuy!)}/t${stampLabel(d, 2)}`)
      L.push(`  4. Sell spot outright: ${fmtEur(d.eur!)}/t × ${EURUSD.toFixed(2)} = ${fmtUsd(d.sell!)}/t${stampLabel(d, 3)}`)
      L.push(`  5. Buy futures: ${fmtUsd(d.fFix!)} → selling diff ${dfmt(d.sell! - d.fFix!)}${stampLabel(d, 4)}`)
      if (d.stamps) L.push(`  Rounds with naked short (flat risk): ${d.stamps[4] - d.stamps[3]}`)
    }
    L.push(`  Physical P&L: ${sgn(t.physical, 1)}/t · Futures P&L: ${sgn(t.futures)}/t${t.costs !== 0 ? ` · Costs: ${sgn(t.costs)}/t` : ''}`)
    L.push(`  NET: ${sgn(t.net, 1)}/t = ${sgn(t.net * t.tonnes)} on ${t.tonnes} t`)
    L.push('')
  })
  const total = history.reduce((s, t) => s + t.net * t.tonnes, 0)
  L.push(`SESSION TOTAL (${history.length} trade${history.length === 1 ? '' : 's'}): ${sgn(total)}`)
  return L.join('\n')
}

function Field({ label, value, min, max, step, onChange, locked, lockedAt, live }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; locked: boolean; lockedAt?: string; live?: boolean
}) {
  const [draft, setDraft] = useState<string | null>(null)
  if (live && !locked) {
    // Live-market feed: read-only, identical for everyone.
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-brand-cyan/20 bg-brand-cyan/[0.04] px-2.5 py-1.5">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        <span className="font-mono text-xs font-bold tabular-nums text-white">
          {value.toLocaleString('en-US')} <span className="ml-1 rounded bg-brand-cyan/20 px-1 text-[9px] font-bold text-brand-cyan">LIVE</span>
        </span>
      </div>
    )
  }
  return (
    <div className={locked ? 'opacity-70' : ''}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        {locked ? (
          <span className="chip !py-0.5 border-amber-500/40 bg-amber-500/10 font-mono text-[10px] text-amber-300">locked {lockedAt}</span>
        ) : (
          <input
            type="number" value={draft ?? String(value)} step={step}
            onChange={e => {
              setDraft(e.target.value)
              const v = parseFloat(e.target.value)
              if (Number.isFinite(v)) onChange(v) // no clamping — type any value
            }}
            onBlur={() => setDraft(null)}
            aria-label={label}
            className="w-28 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-right font-mono text-xs tabular-nums text-white outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} disabled={locked}
        onChange={e => { setDraft(null); onChange(parseFloat(e.target.value)) }}
        className={`w-full h-1.5 ${locked ? 'cursor-not-allowed accent-slate-600' : 'cursor-pointer accent-brand-blue'}`} />
    </div>
  )
}

function RiskSquare({ label, on, active }: { label: string; on: boolean; active: boolean }) {
  return (
    <div
      data-testid={`risk-${label.toLowerCase()}`}
      title={`${label} price risk is ${on ? 'OPEN' : active ? 'covered' : 'not present'}`}
      className={`flex w-16 flex-col items-center rounded-lg border px-2 py-1 font-mono text-[10px] leading-tight ${
        on
          ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
          : active
            ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400'
            : 'border-white/10 bg-white/[0.02] text-slate-500'
      }`}
    >
      <span className="font-bold tracking-wide">{label}</span>
      <span>{on ? 'AT RISK' : active ? 'covered' : '—'}</span>
    </div>
  )
}

// London-futures price graph, margin-simulator style: each executed action
// pins a point on the path (GREEN dot = a buy, RED dot = a sell — futures or
// differential); the live market is the movable dashed point; the dotted
// white line is the flat OUTRIGHT (futures + diff); the x-axis shows WHEN
// each action happened (live-market round labels, or T1/T2… by hand); the
// hedge→fix window is annotated because it IS the Futures P&L.
function PriceGraph({ marks, liveFut, diffMarks, liveDiff, lastStep, hedgeIdx, complete, sides, stamps, stampTimes, liveLabel, elapsed }: {
  marks: number[]; liveFut: number; diffMarks: number[]; liveDiff: number; lastStep: number; hedgeIdx: number; complete: boolean
  sides: ReadonlyArray<'buy' | 'sell'>; stamps?: number[]; stampTimes?: number[]; liveLabel: string
  elapsed?: number // live mode: seconds since session start → real time axis
}) {
  const W = 560, H = 320, ml = 56, mr = 16, mt = 12
  const pw = W - ml - mr, ph = 158 - mt // futures panel height
  const PMINg = 3500, PMAXg = 6000
  const y = (p: number) => mt + (1 - (p - PMINg) / (PMAXg - PMINg)) * ph
  // Second panel: the FOB differential — the risk the desk actually trades
  const D = { top: 196, h: 92, min: -350, max: 300 }
  const clampD = (v: number) => Math.min(D.max, Math.max(D.min, v))
  const yd = (v: number) => D.top + (1 - (clampD(v) - D.min) / (D.max - D.min)) * D.h

  // ── Two x-axes ──
  // Live mode: REAL TIME — the full 450 s session, the ticker crawling right
  // one notch every 5-second tick. Manual mode: one slot per action (T1…).
  const isTime = elapsed !== undefined
  const tickNow = isTime ? Math.min(SESSION_SECONDS, Math.floor(elapsed! / TICK_SECONDS) * TICK_SECONDS) : 0
  const xT = (t: number) => ml + (Math.min(t, SESSION_SECONDS) / SESSION_SECONDS) * pw
  const xStep = (step: number) => ml + ((step - 1) / (lastStep - 1)) * pw
  // x of executed action i, and of the live point
  const xa = (i: number) => (isTime ? xT(stampTimes?.[i] ?? 0) : xStep(i + 1))
  const nextStep = marks.length + 1
  const xLive = isTime ? xT(tickNow) : xStep(nextStep)

  // Live mode: reconstruct the whole tick-by-tick history (deterministic)
  const times: number[] = isTime ? Array.from({ length: tickNow / TICK_SECONDS + 1 }, (_, k) => k * TICK_SECONDS) : []
  const futSeries = times.map(t => liveValueAt(t, r => r.fut, 5))
  const diffSeries = times.map(t => liveValueAt(t, r => r.fob, 1))
  const seriesPath = (vals: number[], yf: (v: number) => number) =>
    vals.map((v, k) => `${k === 0 ? 'M' : 'L'}${xT(times[k]).toFixed(1)},${yf(v).toFixed(1)}`).join(' ')

  const path = isTime ? seriesPath(futSeries, y) : marks.map((v, i) => `${i === 0 ? 'M' : 'L'}${xStep(i + 1).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const diffPath = isTime ? seriesPath(diffSeries, yd) : diffMarks.map((v, i) => `${i === 0 ? 'M' : 'L'}${xStep(i + 1).toFixed(1)},${yd(v).toFixed(1)}`).join(' ')

  const hedge = marks[hedgeIdx - 1]
  const fix = complete ? marks[lastStep - 1] : undefined
  const futPnlT = hedge !== undefined && fix !== undefined ? hedge - fix : null

  const sideHex = (i: number) => (sides[i] === 'buy' ? '#34d399' : '#f43f5e')
  // Time label of each executed action: live-round stamp, or T1/T2… by hand
  const timeLabel = (i: number) => (stamps?.[i] !== undefined ? LIVE_SCRIPT[stamps[i]].label : `T${i + 1}`)
  // The flat outright = futures + differential, along the series (live) or the actions (manual)
  const outright = marks.map((v, i) => v + (diffMarks[i] ?? 0))
  const outrightSeries = futSeries.map((v, k) => v + diffSeries[k])
  const outrightPath = isTime
    ? seriesPath(outrightSeries, y)
    : outright.map((v, i) => `${i === 0 ? 'M' : 'L'}${xStep(i + 1).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const liveOutright = liveFut + liveDiff
  const showOutright = isTime ? times.length > 1 : marks.length > 0

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">London futures — the price path of your trade</div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> buy</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> sell</span>
          <span className="flex items-center gap-1"><span className="inline-block w-4 border-t border-dotted border-slate-200" /> outright (fut + diff)</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '360px' }}>
        {[4000, 4500, 5000, 5500].map(p => (
          <g key={p}>
            <line x1={ml} y1={y(p)} x2={ml + pw} y2={y(p)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={ml - 6} y={y(p) + 3} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">{p.toLocaleString()}</text>
          </g>
        ))}

        {/* X axis: TIME. Live → the 10 rounds of the session; manual → T1/T2… */}
        {isTime ? (
          LIVE_SCRIPT.map((r, ri) => {
            const bx = xT(ri * ROUND_SECONDS)
            const current = ri === Math.min(LIVE_SCRIPT.length - 1, Math.floor(elapsed! / ROUND_SECONDS))
            return (
              <g key={r.label}>
                <line x1={bx} y1={mt} x2={bx} y2={H - 22} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <text x={bx + 3} y={H - 6} textAnchor="start"
                  fill={current ? '#e2e8f0' : ri * ROUND_SECONDS < tickNow ? '#94a3b8' : '#475569'}
                  fontSize="8" fontFamily="monospace" transform={`rotate(-30 ${bx + 3} ${H - 6})`}>
                  {r.label}
                </text>
              </g>
            )
          })
        ) : (
          Array.from({ length: lastStep }, (_, i) => i + 1).map(stp => (
            <text key={stp} x={xStep(stp)} y={H - 6} textAnchor="middle"
              fill={stp <= marks.length ? '#94a3b8' : stp === nextStep ? '#e2e8f0' : '#475569'} fontSize="9.5" fontFamily="monospace">
              {stp <= marks.length ? timeLabel(stp - 1) : stp === nextStep && !complete ? liveLabel : '·'}
            </text>
          ))
        )}

        {/* Flat outright — dotted white, above the futures path */}
        {showOutright && (
          <path d={outrightPath} fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.75" strokeLinecap="round" />
        )}
        {!isTime && !complete && marks.length > 0 && (
          <line x1={xStep(marks.length)} y1={y(outright[outright.length - 1])} x2={xStep(nextStep)} y2={y(liveOutright)}
            stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 4" opacity="0.45" />
        )}
        {showOutright && (
          <text x={ml + 6} y={y(isTime ? outrightSeries[0] : outright[0]) - 6} fill="#e2e8f0" fontSize="8.5" fontFamily="monospace" opacity="0.8">outright</text>
        )}

        {/* hedge → fix window: the futures leg */}
        {hedge !== undefined && (
          <g>
            <line x1={xa(hedgeIdx - 1)} y1={y(hedge)} x2={complete ? xa(lastStep - 1) : Math.max(xLive, xa(hedgeIdx - 1))} y2={y(hedge)}
              stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x={xa(hedgeIdx - 1)} y={y(hedge) - 8} textAnchor="middle" fill="#22d3ee" fontSize="9.5" fontFamily="monospace" fontWeight="bold">hedge</text>
          </g>
        )}
        {futPnlT !== null && (
          <g>
            <line x1={xa(lastStep - 1)} y1={y(hedge!)} x2={xa(lastStep - 1)} y2={y(fix!)} stroke={futPnlT >= 0 ? '#34d399' : '#f43f5e'} strokeWidth="1.5" />
            <text x={xa(lastStep - 1) - 6} y={(y(hedge!) + y(fix!)) / 2 + 3} textAnchor="end"
              fill={futPnlT >= 0 ? '#34d399' : '#f87171'} fontSize="10" fontFamily="monospace" fontWeight="bold">
              futures leg {futPnlT >= 0 ? '+' : '−'}${Math.abs(futPnlT).toLocaleString('en-US')}/t
            </text>
          </g>
        )}

        {/* Price path: live → the tick-by-tick market; manual → the executed marks */}
        {(isTime ? times.length > 1 : marks.length > 0) && (
          <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {/* Executed actions lock in as green (buy) / red (sell) dots */}
        {marks.map((v, i) => (
          <circle key={i} cx={xa(i)} cy={y(v)} r="4.5" fill={sideHex(i)} stroke="#070912" strokeWidth="1.2">
            <title>{`action ${i + 1} (${sides[i]}) · ${timeLabel(i)} · $${v.toLocaleString('en-US')}`}</title>
          </circle>
        ))}

        {/* Live ticker — crawls one notch right every 5-second tick */}
        {!complete && (
          <g>
            {!isTime && marks.length > 0 && (
              <line x1={xStep(marks.length)} y1={y(marks[marks.length - 1])} x2={xLive} y2={y(liveFut)}
                stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
            )}
            <circle cx={xLive} cy={y(liveFut)} r="6" fill="#f59e0b" stroke="#070912" strokeWidth="1.5" />
            <circle cx={xLive} cy={y(liveFut)} r="10" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.35" />
            <text x={xLive} y={y(liveFut) - 12} textAnchor={isTime && xLive > ml + pw - 40 ? 'end' : 'middle'} fill="#fbbf24" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
              {liveFut.toLocaleString('en-US')}
            </text>
          </g>
        )}

        {/* ── FOB differential panel — the DIFF tile as a chart ── */}
        <text x={ml} y={D.top - 8} fill="#94a3b8" fontSize="10" fontFamily="monospace">FOB HCM DIFFERENTIAL ($/t vs London)</text>
        {[-200, 0, 200].map(v => (
          <g key={`d-${v}`}>
            <line x1={ml} y1={yd(v)} x2={ml + pw} y2={yd(v)}
              stroke={v === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.05)'} strokeWidth="1" strokeDasharray={v === 0 ? '4 3' : undefined} />
            <text x={ml - 6} y={yd(v) + 3} textAnchor="end" fill={v === 0 ? '#94a3b8' : '#64748b'} fontSize="10" fontFamily="monospace">{v === 0 ? '0' : (v > 0 ? '+' : '−') + Math.abs(v)}</text>
          </g>
        ))}
        {(isTime ? times.length > 1 : diffMarks.length > 0) && (
          <path d={diffPath} fill="none" stroke="#0891b2" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {diffMarks.map((v, i) => (
          <circle key={`dm-${i}`} cx={xa(i)} cy={yd(v)} r="4" fill={sideHex(i)} stroke="#070912" strokeWidth="1.2">
            <title>{`action ${i + 1} (${sides[i]}) · ${timeLabel(i)} · diff ${v >= 0 ? '+' : '−'}$${Math.abs(v).toLocaleString('en-US')}`}</title>
          </circle>
        ))}
        {!complete && (
          <g>
            {!isTime && diffMarks.length > 0 && (
              <line x1={xStep(diffMarks.length)} y1={yd(diffMarks[diffMarks.length - 1])} x2={xLive} y2={yd(liveDiff)}
                stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
            )}
            <circle cx={xLive} cy={yd(liveDiff)} r="5" fill="#f59e0b" stroke="#070912" strokeWidth="1.2" />
            <text x={xLive} y={yd(liveDiff) - 9} textAnchor={isTime && xLive > ml + pw - 40 ? 'end' : 'middle'} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {liveDiff >= 0 ? '+' : '−'}{Math.abs(liveDiff).toLocaleString('en-US')}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

// The side of each action, for the graph's buy/sell dots:
//  Exporter: buy VND · sell futures · sell FOB · buy futures (fix)
//  Importer: buy diff · buy freight · sell futures · sell spot EUR · buy futures
const EXP_SIDES = ['buy', 'sell', 'sell', 'buy'] as const
const IMP_SIDES = ['buy', 'buy', 'sell', 'sell', 'buy'] as const

const EXP_STATUS = ['No position', 'Long physical (VND) — UNHEDGED', 'Hedged — buying diff locked', 'Sold FOB — fixing pending', 'FLAT — trade complete']
const IMP_STATUS = ['No position', 'Long the diff — unpriced PTBF, no flat risk yet', 'Freight booked — costs locked', 'Fixed & hedged — long the basis', 'Sold outright (EUR) — short futures open!', 'FLAT — trade complete']
const CHIP_CLS = (s: string) =>
  s === 'No position' ? 'border-white/10 bg-white/[0.03] text-slate-400'
  : s.includes('UNHEDGED') || s.includes('open!') ? 'border-rose-500/40 bg-rose-500/[0.10] text-rose-300'
  : s.includes('FLAT') ? 'border-emerald-500/40 bg-emerald-500/[0.10] text-emerald-300'
  : s.includes('pending') || s.includes('Freight') ? 'border-amber-500/40 bg-amber-500/[0.10] text-amber-300'
  : 'border-brand-cyan/40 bg-brand-cyan/10 text-cyan-200'

export default function PtbfMechanics() {
  const [mode, setMode] = useState<Mode>('exporter')

  // Live market
  const [vnd, setVnd] = useState(120000)     // VND/kg, local HCM
  const [fut, setFut] = useState(4800)       // London — hedge leg, $/t
  const [futFix, setFutFix] = useState(4800) // London — since the hedge, $/t
  const [fobDiff, setFobDiff] = useState(-60)
  const [freight, setFreight] = useState(70)
  const [eurSpot, setEurSpot] = useState(4100) // spot Antwerp, outright €/t

  const [deal, setDeal] = useState<Deal>({})
  const [history, setHistory] = useState<TradeRecord[]>([])

  // Live-market mode: the predetermined path plays at one round per minute.
  const [live, setLive] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(0)
  const liveRound = Math.min(LIVE_SCRIPT.length - 1, Math.floor(elapsed / ROUND_SECONDS))
  const liveFinal = live && liveRound === LIVE_SCRIPT.length - 1
  const nextTickIn = ROUND_SECONDS - (elapsed % ROUND_SECONDS)

  useEffect(() => {
    if (!live) return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [live])

  // Feed the market — identical for every student. Within each round the
  // prices step every 5 seconds from the previous round's level toward this
  // round's published level (e.g. 100 → 145 walks 105, 110, … , 145).
  useEffect(() => {
    if (!live) return
    const prev = LIVE_SCRIPT[Math.max(0, liveRound - 1)]
    const target = LIVE_SCRIPT[liveRound]
    const secInRound = elapsed - liveRound * ROUND_SECONDS
    const f = Math.min(1, Math.floor(Math.max(0, secInRound) / TICK_SECONDS) / TICKS_TO_TARGET)
    const lerp = (a: number, b: number, snap: number) => Math.round((a + (b - a) * f) / snap) * snap
    setVnd(lerp(prev.vnd, target.vnd, 100))
    const futNow = lerp(prev.fut, target.fut, 5)
    setFut(futNow); setFutFix(futNow)
    setFobDiff(lerp(prev.fob, target.fob, 1))
    setFreight(lerp(prev.freight, target.freight, 1))
    setEurSpot(lerp(prev.eur, target.eur, 5))
  }, [live, liveRound, elapsed])

  function toggleLive() {
    if (live) { setLive(false); return }
    startRef.current = Date.now()
    setElapsed(0)
    setDeal({})
    setLive(true)
  }

  // Step counters per mode
  const step = mode === 'exporter'
    ? (deal.fFix !== undefined ? 4 : deal.sell !== undefined ? 3 : deal.fHedge !== undefined ? 2 : deal.buy !== undefined ? 1 : 0)
    : (deal.fFix !== undefined ? 5 : deal.sell !== undefined ? 4 : deal.fHedge !== undefined ? 3 : deal.freight !== undefined ? 2 : deal.dBuy !== undefined ? 1 : 0)
  const lastStep = mode === 'exporter' ? 4 : 5
  const hedged = deal.fHedge !== undefined

  const localUsd = (vnd * 1000) / FX
  const eurUsd = eurSpot * EURUSD
  const curFut = hedged ? futFix : fut

  function switchMode(m: Mode) { setMode(m); setDeal({}) }

  function act() {
    // Every execution stamps the current futures level (for the price graph)
    // and, in live mode, the round it happened in.
    const stamp = (d: Deal): Pick<Deal, 'stamps' | 'stampTimes' | 'futMarks' | 'diffMarks'> => ({
      futMarks: [...(d.futMarks ?? []), curFut],
      diffMarks: [...(d.diffMarks ?? []), fobDiff],
      ...(live ? { stamps: [...(d.stamps ?? []), liveRound], stampTimes: [...(d.stampTimes ?? []), elapsed] } : {}),
    })
    if (mode === 'exporter') {
      if (step === 0) setDeal(d => ({ vnd, buy: localUsd, ...stamp(d) }))
      else if (step === 1) { setFutFix(fut); setDeal(d => ({ ...d, fHedge: fut, ...stamp(d) })) }
      else if (step === 2) setDeal(d => ({ ...d, sell: fobDiff, ...stamp(d) }))
      else if (step === 3) setDeal(d => ({ ...d, fFix: futFix, ...stamp(d) }))
    } else {
      if (step === 0) setDeal(d => ({ dBuy: fobDiff, ...stamp(d) }))
      else if (step === 1) setDeal(d => ({ ...d, freight, ...stamp(d) }))
      else if (step === 2) { setFutFix(fut); setDeal(d => ({ ...d, fHedge: fut, ...stamp(d) })) }
      else if (step === 3) setDeal(d => ({ ...d, eur: eurSpot, sell: eurUsd, ...stamp(d) }))
      else if (step === 4) setDeal(d => ({ ...d, fFix: futFix, ...stamp(d) }))
    }
  }

  const roundTag = (i: number) => stampLabel(deal, i)

  // Record the completed trade into the log and clear the desk for the next one.
  function recordTrade() {
    const p = physical, f = futures, n = total
    if (p === null || f === null || n === null) return
    setHistory(h => [...h, { mode, tonnes: TONNES, deal, physical: p, futures: f, costs, net: n }])
    setDeal({})
  }

  function exportReport() {
    const blob = new Blob([buildTradeReport(history)], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ptbf-trade-report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const sessionTotal = history.reduce((s, t) => s + t.net * t.tonnes, 0)

  // Derived economics
  const dBuyExp = mode === 'exporter' && hedged ? deal.buy! - deal.fHedge! : null
  const impInvoice = mode === 'importer' && hedged ? deal.fHedge! + deal.dBuy! : null
  const dSellImp = mode === 'importer' && deal.fFix !== undefined ? deal.sell! - deal.fFix! : null

  const complete = step >= lastStep
  let physical: number | null = null, futures: number | null = null, costs = 0
  if (complete) {
    futures = deal.fHedge! - deal.fFix!
    if (mode === 'exporter') {
      physical = (deal.fFix! + deal.sell!) - deal.buy!
    } else {
      costs = -(deal.freight! + CIF_INSTORE)
      physical = deal.sell! - impInvoice!
    }
  }
  const total = physical !== null ? physical + futures! + costs : null

  const ACTIONS = mode === 'exporter'
    ? [
        { n: 1, label: 'Buy physical (VND)', detail: `${vnd.toLocaleString()} VND/kg = ${fmtUsd(localUsd, 1)}/t at ${FX.toLocaleString()} FX` },
        { n: 2, label: 'Sell futures', detail: `hedge 10 lots at ${fmtUsd(fut)} → sets your buying differential` },
        { n: 3, label: 'Sell physical FOB (diff)', detail: `London ${dfmt(fobDiff)} · PTBF` },
        { n: 4, label: 'Fix it (buy futures)', detail: `EFP at ${fmtUsd(curFut)} → invoice = fix + diff` },
      ]
    : [
        { n: 1, label: 'Buy physical FOB (diff)', detail: `London ${dfmt(fobDiff)} · PTBF — price still floating` },
        { n: 2, label: 'Buy freight', detail: `HCM → Antwerp at $${freight}/t (+$${CIF_INSTORE} CIF→instore)` },
        { n: 3, label: 'Fix before export (sell futures)', detail: `at ${fmtUsd(fut)} → purchase prices at fix + diff, and you are hedged` },
        { n: 4, label: 'Sell spot (outright, EUR)', detail: `${fmtEur(eurSpot)}/t × ${EURUSD.toFixed(2)} = ${fmtUsd(eurUsd)}/t` },
        { n: 5, label: 'Buy futures', detail: `at ${fmtUsd(curFut)} → locks your selling differential` },
      ]

  const STATUS = mode === 'exporter' ? EXP_STATUS : IMP_STATUS

  // Which risks are OPEN at each stage of the book:
  //  Exporter: 1 = outright VND long (flat+diff) · 2 = hedged, selling diff
  //  still open · 3-4 = PTBF sale offsets the short (EFP fix is riskless).
  //  Importer: 1-3 = diff open (selling side unsecured), no flat (unpriced
  //  PTBF, then hedged) · 4 = naked short futures (flat!) · 5 = flat book.
  const flatRisk = mode === 'exporter' ? step === 1 : step === 4
  const diffRisk = mode === 'exporter' ? step >= 1 && step <= 2 : step >= 1 && step <= 3

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Two PTBF Trades · 100 t Robusta</div>
        <div className="flex items-center gap-1.5">
          <RiskSquare label="FLAT" on={flatRisk} active={step > 0 && !complete} />
          <RiskSquare label="DIFF" on={diffRisk} active={step > 0 && !complete} />
          <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${CHIP_CLS(STATUS[step])}`}>{STATUS[step]}</span>
        </div>
      </div>

      {/* Trade selector + live-market control */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {([['exporter', 'Exporter: buy VND → sell FOB'], ['importer', 'Importer: buy FOB → sell spot']] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => switchMode(m)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              mode === m ? 'border-brand-blue/60 bg-brand-blue/20 text-blue-100' : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
            }`}>
            {label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-white/10" />
        <button onClick={toggleLive}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            live ? 'border-brand-cyan/60 bg-brand-cyan/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
          }`}>
          {live ? '■ Stop live market' : '▶ Live market (10 rounds × 0:45)'}
        </button>
        {live && (
          <span className="rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1 font-mono text-[11px] text-cyan-200">
            Round {liveRound + 1}/{LIVE_SCRIPT.length} · {LIVE_SCRIPT[liveRound].label}{liveFinal
              ? ' · final round'
              : ` · next tick ${Math.floor(nextTickIn / 60)}:${String(nextTickIn % 60).padStart(2, '0')}`}
          </span>
        )}
      </div>

      {/* News flash — the round's story; prices below react the way it says */}
      {live && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-brand-cyan/25 bg-brand-cyan/[0.05] p-3">
          <span className="chip !py-0.5 shrink-0 border-brand-cyan/50 bg-brand-cyan/15 font-mono text-[10px] font-bold text-brand-cyan">NEWS · {LIVE_SCRIPT[liveRound].label}</span>
          <p className="text-xs leading-relaxed text-slate-300">{LIVE_SCRIPT[liveRound].news}</p>
        </div>
      )}

      {/* Futures price graph — points pin as actions execute */}
      <PriceGraph
        marks={deal.futMarks ?? []}
        liveFut={curFut}
        diffMarks={deal.diffMarks ?? []}
        liveDiff={fobDiff}
        lastStep={lastStep}
        hedgeIdx={mode === 'exporter' ? 2 : 3}
        complete={complete}
        sides={mode === 'exporter' ? EXP_SIDES : IMP_SIDES}
        stamps={deal.stamps}
        stampTimes={deal.stampTimes}
        liveLabel={live ? LIVE_SCRIPT[liveRound].label : 'now'}
        elapsed={live ? elapsed : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: the market */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">{live ? 'The market — LIVE feed (identical for everyone)' : 'The market — type any value or slide'}</div>

          {mode === 'exporter' ? (
            <Field live={live} label="Spot HCM (VND/kg)" value={vnd} min={80000} max={160000} step={500} onChange={setVnd}
              locked={step >= 1} lockedAt={step >= 1 ? `@ ${deal.vnd!.toLocaleString()}` : undefined} />
          ) : (
            <>
              <Field live={live} label="FOB HCM differential ($/t)" value={fobDiff} min={-350} max={1000} step={5} onChange={setFobDiff}
                locked={step >= 1} lockedAt={step >= 1 ? `@ ${dfmt(deal.dBuy!)}` : undefined} />
              <p className="-mt-1 text-[10px] text-slate-500">Scale floor −$350 ≈ tenderable parity: below it, delivering to the exchange beats the cash market.</p>
            </>
          )}

          {mode === 'importer' && (
            <Field live={live} label="Freight HCM → Antwerp ($/t)" value={freight} min={40} max={150} step={5} onChange={setFreight}
              locked={step >= 2} lockedAt={step >= 2 ? `@ $${deal.freight}` : undefined} />
          )}

          <Field live={live} label="London futures — hedge leg ($/t)" value={fut} min={3500} max={6000} step={5} onChange={setFut}
            locked={hedged} lockedAt={hedged ? `@ ${fmtUsd(deal.fHedge!)}` : undefined} />

          {hedged && (
            <Field live={live} label="London futures — since the hedge ($/t)" value={futFix} min={3500} max={6000} step={5} onChange={setFutFix}
              locked={deal.fFix !== undefined} lockedAt={deal.fFix !== undefined ? `@ ${fmtUsd(deal.fFix)}` : undefined} />
          )}

          {mode === 'exporter' ? (
            <>
              <Field live={live} label="FOB HCM differential ($/t)" value={fobDiff} min={-350} max={1000} step={5} onChange={setFobDiff}
                locked={step >= 3} lockedAt={step >= 3 ? `@ ${dfmt(deal.sell!)}` : undefined} />
              <p className="-mt-1 text-[10px] text-slate-500">Scale floor −$350 ≈ tenderable parity: below it, delivering to the exchange beats the cash market.</p>
            </>
          ) : (
            <Field live={live} label="Spot Antwerp, outright (€/t)" value={eurSpot} min={3200} max={5000} step={10} onChange={setEurSpot}
              locked={step >= 4} lockedAt={step >= 4 ? `@ ${fmtEur(deal.eur!)}` : undefined} />
          )}

          {/* Live conversion */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums space-y-1">
            <div className="eyebrow mb-1">Live conversion</div>
            {mode === 'exporter' ? (
              <>
                <div className="flex justify-between"><span className="text-slate-400">Local price in USD</span><span className="text-white">{fmtUsd(localUsd, 1)}/t</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Implied local diff vs London (now)</span><span className="text-brand-cyan font-bold">{dfmt(localUsd - curFut, 1)}</span></div>
                {dBuyExp !== null && (
                  <div className="flex justify-between border-t border-white/10 pt-1"><span className="text-slate-400">YOUR buying diff (VND buy vs hedge)</span><span className="text-amber-300 font-bold">{dfmt(dBuyExp, 1)}</span></div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between"><span className="text-slate-400">Purchase price</span><span className="text-white">{impInvoice !== null ? `${fmtUsd(impInvoice)}/t (fixed)` : 'floating — fix + diff'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">EUR sale in USD (× {EURUSD.toFixed(2)})</span><span className="text-white">{fmtUsd((step >= 4 ? deal.sell! : eurUsd))}/t</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Implied selling diff vs London (now)</span><span className="text-brand-cyan font-bold">{dfmt((step >= 4 ? deal.sell! : eurUsd) - (deal.fFix ?? curFut), 0)}</span></div>
                {dSellImp !== null && (
                  <div className="flex justify-between border-t border-white/10 pt-1"><span className="text-slate-400">YOUR selling diff (locked at the buy-back)</span><span className="text-amber-300 font-bold">{dfmt(dSellImp, 0)}</span></div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT: actions, blotter, P&L */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            {ACTIONS.map(a => {
              const done = step >= a.n
              const isNext = step === a.n - 1
              return (
                <button key={a.n} onClick={act} disabled={!isNext}
                  className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                    done ? 'border-emerald-500/30 bg-emerald-500/[0.06]'
                    : isNext ? 'border-brand-blue/50 bg-brand-blue/10 hover:bg-brand-blue/20 cursor-pointer'
                    : 'border-white/5 bg-white/[0.01] opacity-40'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">{a.n}. {a.label}</span>
                    {done ? <span className="text-emerald-400 text-xs">✓ locked</span> : isNext ? <span className="chip !py-0.5 text-blue-200">execute</span> : null}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-slate-500">{a.detail}</div>
                </button>
              )
            })}
          </div>

          {/* Blotter */}
          {step > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums space-y-1">
              <div className="eyebrow mb-1">Deal blotter (locked at execution)</div>
              {mode === 'exporter' ? (
                <>
                  <div className="flex justify-between"><span className="text-slate-400">1 · Bought local{roundTag(0)}</span><span className="text-white">{deal.vnd?.toLocaleString()} VND/kg = {fmtUsd(deal.buy!, 1)}/t</span></div>
                  {step >= 2 && <div className="flex justify-between"><span className="text-slate-400">2 · Sold futures → buying diff{roundTag(1)}</span><span className="text-white">{fmtUsd(deal.fHedge!)} → {dfmt(dBuyExp!, 1)}</span></div>}
                  {step >= 3 && <div className="flex justify-between"><span className="text-slate-400">3 · Sold FOB (PTBF){roundTag(2)}</span><span className="text-white">London {dfmt(deal.sell!)}</span></div>}
                  {step >= 4 && <div className="flex justify-between"><span className="text-slate-400">4 · Fixed — invoice{roundTag(3)}</span><span className="text-white">{fmtUsd(deal.fFix!)} {deal.sell! < 0 ? '−' : '+'} {fmtUsd(Math.abs(deal.sell!))} = {fmtUsd(deal.fFix! + deal.sell!)}/t</span></div>}
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span className="text-slate-400">1 · Bought FOB (diff){roundTag(0)}</span><span className="text-white">London {dfmt(deal.dBuy!)} · price TBF</span></div>
                  {step >= 2 && <div className="flex justify-between"><span className="text-slate-400">2 · Freight booked{roundTag(1)}</span><span className="text-white">${deal.freight}/t + ${CIF_INSTORE} instore</span></div>}
                  {step >= 3 && <div className="flex justify-between"><span className="text-slate-400">3 · Fixed & hedged{roundTag(2)}</span><span className="text-white">{fmtUsd(deal.fHedge!)} → purchase {fmtUsd(impInvoice!)}/t</span></div>}
                  {step >= 4 && <div className="flex justify-between"><span className="text-slate-400">4 · Sold outright{roundTag(3)}</span><span className="text-white">{fmtEur(deal.eur!)}/t = {fmtUsd(deal.sell!)}/t</span></div>}
                  {step >= 5 && <div className="flex justify-between"><span className="text-slate-400">5 · Bought futures → selling diff{roundTag(4)}</span><span className="text-white">{fmtUsd(deal.fFix!)} → {dfmt(dSellImp!, 0)}</span></div>}
                </>
              )}
            </div>
          )}

          {/* P&L */}
          {complete && total !== null && (
            <div className={`rounded-xl p-4 border font-mono text-xs tabular-nums ${total >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'}`}>
              <div className="eyebrow mb-2">Trade P&L ($/t)</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">Physical P&L {mode === 'exporter' ? '(invoice − VND buy)' : '(outright sale − purchase)'}</span><span className={physical! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(physical!, 1)}</span></div>
                {mode === 'importer' && <div className="flex justify-between"><span className="text-slate-400">Freight + instore costs</span><span className="text-rose-300">{sgn(costs)}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Futures P&L (sold − bought back)</span><span className={futures! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(futures!, 0)}</span></div>
                <div className="flex justify-between border-t border-white/15 pt-1.5">
                  <span className="text-white font-bold">Net · × {TONNES} t</span>
                  <span className={`font-bold text-base ${total >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(total, 1)}/t · {sgn(total * TONNES)}</span>
                </div>
                <p className="pt-1 text-slate-400">
                  {mode === 'exporter'
                    ? `= sell diff ${dfmt(deal.sell!)} − buying diff ${dfmt(dBuyExp!, 1)}: the whole trade was a differential.`
                    : `= selling diff ${dfmt(dSellImp!, 0)} − buying diff ${dfmt(deal.dBuy!)} − costs $${deal.freight! + CIF_INSTORE}: a pair trade with a freight bill.`}
                </p>
              </div>
            </div>
          )}

          {step > 0 && (
            <div className="flex flex-wrap gap-2">
              {complete && (
                <button onClick={recordTrade} className="btn-primary !px-3 !py-1.5 text-xs">
                  ✓ Record trade · start next
                </button>
              )}
              <button onClick={() => setDeal({})} className="btn-ghost !px-3 !py-1.5 text-xs">
                {complete ? 'Discard (don’t record)' : 'Reset trade'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trade log — every recorded trade of the session */}
      {history.length > 0 && (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="eyebrow">
              Trade log · session total{' '}
              <span className={sessionTotal >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(sessionTotal)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={exportReport} className="btn-ghost !px-3 !py-1 text-xs">↓ Export report</button>
              <button onClick={() => setHistory([])} className="btn-ghost !px-3 !py-1 text-xs text-rose-300 hover:!border-rose-400/40">Clear log</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px] tabular-nums">
              <thead>
                <tr className="border-b border-white/10 text-slate-500">
                  <th className="py-1.5 pr-2 text-left font-normal">#</th>
                  <th className="px-2 text-left font-normal">Trade</th>
                  <th className="px-2 text-left font-normal">Route</th>
                  <th className="px-2 text-left font-normal">Rounds</th>
                  <th className="px-2 text-right font-normal">Net $/t</th>
                  <th className="pl-2 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {history.map((t, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-1.5 pr-2 text-slate-400">#{i + 1}</td>
                    <td className="px-2 text-slate-300">{t.mode === 'exporter' ? 'Exporter' : 'Importer'}</td>
                    <td className="px-2 text-slate-400">
                      {t.mode === 'exporter'
                        ? `${t.deal.vnd?.toLocaleString('en-US')} VND → FOB ${dfmt(t.deal.sell!)}`
                        : `FOB ${dfmt(t.deal.dBuy!)} → ${fmtEur(t.deal.eur!)}`}
                    </td>
                    <td className="px-2 text-slate-500">
                      {t.deal.stamps ? `${LIVE_SCRIPT[t.deal.stamps[0]].label} → ${LIVE_SCRIPT[t.deal.stamps[t.deal.stamps.length - 1]].label}` : 'manual'}
                    </td>
                    <td className={`px-2 text-right ${t.net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(t.net, 1)}</td>
                    <td className={`pl-2 text-right font-bold ${t.net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(t.net * t.tonnes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
