'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading1: { label: 'Part 1 · heading', value: 'A world with and without the exchange' },
  takeaway: {
    label: 'Part 1 · takeaway',
    multiline: true,
    value: 'Add a participant to the bilateral world and the negotiation burden explodes quadratically; add one to the exchange and it grows by exactly one line.',
  },
  heading2: { label: 'Part 2 · heading', value: 'The markets that never got one' },
  prob1: {
    label: 'Problem 1',
    multiline: true,
    value: 'No hedge — the volatility lands on YOUR margin: a roaster can fix coffee, an olive-oil bottler just eats €2,100→€8,900.',
  },
  prob2: {
    label: 'Problem 2',
    multiline: true,
    value: 'No transparent price — quotes by phone, wide spreads, every negotiation starts blind.',
  },
  prob3: {
    label: 'Problem 3',
    multiline: true,
    value: 'No buyer of last resort — unsold stock has no exchange to tender to.',
  },
  prob4: {
    label: 'Problem 4',
    multiline: true,
    value: 'Contract performance risk — when the price triples, suppliers walk away from old commitments (and buyers do, when it crashes).',
  },
  caption: {
    label: 'Closing caption',
    multiline: true,
    value: 'Pepper, rice, olive oil — big, global markets with no liquid futures. The volatility is not bigger than coffee’s; the difference is that nobody can lay it off. That is what an exchange is FOR.',
  },
})

// ---------------------------------------------------------------------------
// Part 1 · network geometry (viewBox 480 x 260)
// ---------------------------------------------------------------------------
const NET = { w: 480, h: 260, leftX: 32, rightX: 448, topY: 34, bottomY: 244 }
const HUB = { x: 240, y: (NET.topY + NET.bottomY) / 2, r: 28 }

function columnYs(count: number): number[] {
  return Array.from({ length: count }, (_, i) =>
    NET.topY + (count === 1 ? 0.5 : i / (count - 1)) * (NET.bottomY - NET.topY),
  )
}

// ---------------------------------------------------------------------------
// Part 2 · illustrative extra-virgin olive-oil prices, ex-mill Spain, €/t
// ---------------------------------------------------------------------------
const OIL: [number, number][] = [
  [2019, 2100],
  [2020, 1900],
  [2021, 3200],
  [2022, 4000],
  [2023, 7500],
  [2024, 8900],
  [2025, 3900],
]

const PROBLEM_DOTS = ['#f43f5e', '#f59e0b', '#22d3ee', '#34d399']

export default function NetworkExplosion() {
  const t = useVisualText(textDef)
  const [mode, setMode] = useState<'bilateral' | 'exchange'>('bilateral')
  const [n, setN] = useState(14)

  const half = n / 2
  const producerYs = columnYs(half)
  const buyerYs = columnYs(half)
  const bilateralLinks = half * half

  // --- Chart geometry (ContangoChart-style margins) ---
  const W = 480, H = 170
  const ml = 48, mr = 24, mt = 18, mb = 28
  const pw = W - ml - mr
  const ph = H - mt - mb
  const PMIN = 1500, PMAX = 9500
  const cx = (i: number) => ml + (i / (OIL.length - 1)) * pw
  const cy = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph
  const axisBottom = mt + ph
  const yTicks = [2000, 4000, 6000, 8000]
  const oilPath = OIL
    .map(([, v], i) => `${i === 0 ? 'M' : 'L'}${cx(i).toFixed(1)},${cy(v).toFixed(1)}`)
    .join(' ')
  const peakI = 5 // 2024 · €8,900

  const problems = [t('prob1'), t('prob2'), t('prob3'), t('prob4')]

  return (
    <div className="glass mt-5 p-5 text-white">
      {/* ------------------------------------------------------------------ */}
      {/* Part 1 — bilateral spaghetti vs one exchange                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="eyebrow text-brand-cyan mb-3">{t('heading1')}</div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex gap-2">
          {([
            ['bilateral', 'Bilateral world'],
            ['exchange', 'One exchange'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                mode === key
                  ? 'border-blue-400/50 bg-blue-500/20 text-white'
                  : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 text-xs text-slate-400">
          <span>Market participants</span>
          <input
            type="range"
            min={6}
            max={30}
            step={2}
            value={n}
            onChange={e => setN(Number(e.target.value))}
            className="w-36 accent-blue-500"
          />
          <span className="font-mono text-slate-300 tabular-nums w-6 text-right">{n}</span>
        </label>
      </div>

      <svg viewBox={`0 0 ${NET.w} ${NET.h}`} className="mt-3 w-full" style={{ maxHeight: '260px' }}>
        {/* Column headers */}
        <text x={NET.leftX} y={16} textAnchor="start" fill="#34d399" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
          Producers ({half})
        </text>
        <text x={NET.rightX} y={16} textAnchor="end" fill="#f59e0b" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
          Buyers ({half})
        </text>

        {/* Links (under the dots) */}
        {mode === 'bilateral'
          ? producerYs.map((py, i) =>
              buyerYs.map((by, j) => (
                <line key={`b-${i}-${j}`} x1={NET.leftX} y1={py} x2={NET.rightX} y2={by}
                  stroke="rgba(244,63,94,0.25)" strokeWidth="0.8" />
              )),
            )
          : (
            <g>
              {producerYs.map((py, i) => (
                <line key={`pl-${i}`} x1={NET.leftX} y1={py} x2={HUB.x} y2={HUB.y}
                  stroke="#22d3ee" strokeWidth="0.9" opacity="0.55" />
              ))}
              {buyerYs.map((by, i) => (
                <line key={`bl-${i}`} x1={HUB.x} y1={HUB.y} x2={NET.rightX} y2={by}
                  stroke="#22d3ee" strokeWidth="0.9" opacity="0.55" />
              ))}
            </g>
          )}

        {/* Central exchange node */}
        {mode === 'exchange' && (
          <g>
            <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="#3b82f6" opacity="0.9" />
            <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <text x={HUB.x} y={HUB.y + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
              ICE
            </text>
          </g>
        )}

        {/* Participant dots */}
        {producerYs.map((py, i) => (
          <circle key={`p-${i}`} cx={NET.leftX} cy={py} r="4" fill="#34d399" stroke="#070912" strokeWidth="1" />
        ))}
        {buyerYs.map((by, i) => (
          <circle key={`y-${i}`} cx={NET.rightX} cy={by} r="4" fill="#f59e0b" stroke="#070912" strokeWidth="1" />
        ))}
      </svg>

      <div className="mt-3 font-mono text-slate-400 text-sm">
        Prices to negotiate:{' '}
        {mode === 'bilateral' ? (
          <>
            <span className="text-xl font-bold text-rose-400 tabular-nums">{bilateralLinks}</span>
            <span className="text-slate-300"> bilateral links</span>
          </>
        ) : (
          <>
            <span className="text-xl font-bold text-cyan-300 tabular-nums">{n}</span>
            <span className="text-slate-300"> links to one transparent price</span>
          </>
        )}
      </div>

      <p className="mt-2 text-slate-400 text-sm leading-relaxed">{t('takeaway')}</p>

      {/* ------------------------------------------------------------------ */}
      {/* Part 2 — the markets that never got one (olive oil)                */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-7 border-t border-white/[0.07] pt-5">
        <div className="eyebrow text-amber-400 mb-3">{t('heading2')}</div>

        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.07] p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '190px' }}>
            {/* Chart label */}
            <text x={ml} y={11} fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
              Extra-virgin olive oil · illustrative, ex-mill Spain · €/t
            </text>

            {/* Y grid + tick labels */}
            {yTicks.map(v => (
              <g key={`yt-${v}`}>
                <line x1={ml} y1={cy(v)} x2={ml + pw} y2={cy(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <text x={ml - 6} y={cy(v) + 3} textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily="monospace">
                  {v.toLocaleString('en-US')}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

            {/* Price line */}
            <path d={oilPath} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

            {/* Points + x labels */}
            {OIL.map(([year, v], i) => (
              <g key={year}>
                <circle cx={cx(i)} cy={cy(v)} r="3.5" fill="#f59e0b" stroke="#070912" strokeWidth="1">
                  <title>{`${year} · €${v.toLocaleString('en-US')}/t`}</title>
                </circle>
                <text x={cx(i)} y={axisBottom + 12} textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                  {year}
                </text>
              </g>
            ))}

            {/* Annotation near the peak */}
            <text x={cx(peakI) - 9} y={cy(OIL[peakI][1]) + 3} textAnchor="end" fill="#f59e0b" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              ×4.7 top-to-bottom in five years
            </text>
          </svg>
        </div>

        {/* What importers face without an exchange */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {problems.map((text, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <span className="mb-2 inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PROBLEM_DOTS[i] }} />
              <p className="text-slate-300 text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-slate-400 text-sm leading-relaxed">{t('caption')}</p>
      </div>
    </div>
  )
}
