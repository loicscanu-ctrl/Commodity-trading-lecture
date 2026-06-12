'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  title: { label: 'Eyebrow title', value: 'CFD Curve · 26 Jul 2017 · vs OCT BFOE' },
  caption: {
    label: 'Caption',
    multiline: true,
    value: 'Dated Brent trades below the forward, and the discount narrows over time — a contango-shaped CFD curve.',
  },
})

// Real CFD quotes from 26 July 2017 (weekly pricing window → CFD $/bbl vs OCT BFOE).
const DATA: [string, number][] = [
  ['Jul 30–Aug 3', -1.26],
  ['Aug 6–10', -1.02],
  ['Aug 13–17', -0.86],
  ['Aug 20–24', -0.80],
  ['Aug 27–31', -0.73],
  ['Sep 3–7', -0.66],
  ['Sep 10–14', -0.53],
  ['Sep 17–21', -0.50],
]

export default function CfdCurve() {
  const t = useVisualText(textDef)

  const W = 580, H = 280
  const ml = 48, mr = 24, mt = 20, mb = 76
  const pw = W - ml - mr
  const ph = H - mt - mb

  const N = DATA.length
  const PMIN = -1.4, PMAX = 0

  const x = (i: number) => ml + (N === 1 ? 0.5 : i / (N - 1)) * pw
  const y = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph

  const axisBottom = mt + ph
  const zeroY = y(0)

  // Y-axis ticks
  const yTicks = [0, -0.35, -0.7, -1.05, -1.4]

  const path = DATA
    .map(([, v], i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(' ')

  return (
    <div className="mt-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] p-4">
      <div className="eyebrow mb-3 px-1">{t('title')}</div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '260px' }}>
        {/* Vertical grid */}
        {DATA.map((_, i) => (
          <line key={`g-${i}`} x1={x(i)} y1={mt} x2={x(i)} y2={axisBottom}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}

        {/* Y grid + tick labels */}
        {yTicks.map(v => (
          <g key={`yt-${v}`}>
            <line x1={ml} y1={y(v)} x2={ml + pw} y2={y(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={ml - 6} y={y(v) + 3} textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily="monospace">
              {v.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Dashed zero line: Dated = Forward */}
        <line x1={ml} y1={zeroY} x2={ml + pw} y2={zeroY}
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
        <text x={ml + pw} y={zeroY - 5} textAnchor="end" fill="#22d3ee" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
          Dated = Forward
        </text>

        {/* Axes */}
        <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

        {/* Faint vertical drop bars from zero to each point */}
        {DATA.map(([, v], i) => (
          <line key={`d-${i}`} x1={x(i)} y1={zeroY} x2={x(i)} y2={y(v)}
            stroke="#fb923c" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
        ))}

        {/* CFD curve */}
        <path d={path} fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Markers + x labels */}
        {DATA.map(([label, v], i) => {
          const cx = x(i)
          const cy = y(v)
          const lx = cx, ly = axisBottom + 12
          return (
            <g key={`m-${i}`}>
              <line x1={cx} y1={axisBottom} x2={cx} y2={axisBottom + 5} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="3.5" fill="#f59e0b" stroke="#070912" strokeWidth="1" />
              <text x={lx} y={ly} textAnchor="end" fill="#94a3b8" fontSize="8.5" fontFamily="monospace"
                transform={`rotate(-45 ${lx} ${ly})`}>{label}</text>
            </g>
          )
        })}

        {/* Y-axis label */}
        <text x={11} y={mt + ph / 2} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace"
          transform={`rotate(-90 11 ${mt + ph / 2})`}>CFD $/bbl</text>

        {/* Annotation: discount narrows */}
        <text x={x(3)} y={y(-0.8) + 22} fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">
          Dated below forward
        </text>
        <text x={x(3)} y={y(-0.8) + 34} fill="#94a3b8" fontSize="8" fontFamily="monospace">
          discount narrows over time
        </text>
      </svg>

      <p className="text-slate-400 text-sm leading-relaxed mt-3 px-1">{t('caption')}</p>
    </div>
  )
}
