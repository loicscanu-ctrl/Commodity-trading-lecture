'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Eyebrow · heading', value: 'Crude supply vs demand by region · 2024 (mb/d)' },
  caption: { label: 'Caption', multiline: true, value: 'The Middle East and Russia produce far more than they burn; Asia-Pacific and Europe burn far more than they produce — so crude flows East.' },
  source: { label: 'Source note', value: 'Energy Institute' },
})

type Region = { name: string; supply: number; demand: number }

// Sorted by surplus (supply − demand): big exporters on top, big importers at bottom.
const DATA: Region[] = [
  { name: 'Middle East', supply: 30.36, demand: 9.65 },
  { name: 'Russia / CIS', supply: 13.87, demand: 4.23 },
  { name: 'North America', supply: 27.05, demand: 23.30 },
  { name: 'Africa', supply: 7.23, demand: 4.64 },
  { name: 'S. & C. America', supply: 7.28, demand: 6.45 },
  { name: 'Europe', supply: 3.23, demand: 13.90 },
  { name: 'Asia Pacific', supply: 7.37, demand: 38.06 },
]

export default function SupplyDemandRegion() {
  const t = useVisualText(textDef)

  const W = 580, H = 360
  const ml = 110, mr = 80, mt = 18, mb = 40
  const pw = W - ml - mr
  const ph = H - mt - mb

  const XMAX = 40
  const x = (v: number) => ml + (v / XMAX) * pw
  const axisBottom = mt + ph

  const rowH = ph / DATA.length
  const barH = Math.min(9, rowH * 0.3)
  const gap = 2

  const ticks = [0, 10, 20, 30, 40]

  const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-amber-400 mb-3">{t('heading')}</div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Gridlines */}
        {ticks.map(tk => (
          <line key={tk} x1={x(tk)} y1={mt} x2={x(tk)} y2={axisBottom}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}

        {/* Axis line */}
        <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

        {/* X tick labels */}
        {ticks.map(tk => (
          <text key={tk} x={x(tk)} y={axisBottom + 16} textAnchor="middle"
            fill="#64748b" fontSize="9" fontFamily="monospace">{tk}</text>
        ))}
        <text x={ml + pw / 2} y={H - 4} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">mb/d</text>

        {/* Rows */}
        {DATA.map((r, i) => {
          const cy = mt + rowH * i + rowH / 2
          const supplyY = cy - barH - gap / 2
          const demandY = cy + gap / 2
          const surplus = r.supply - r.demand
          const positive = surplus > 0
          const tagColor = positive ? '#34d399' : '#f43f5e'
          const tag = positive ? `+${fmt(surplus)} exports` : `−${fmt(-surplus)} imports`
          return (
            <g key={r.name}>
              {/* Region label */}
              <text x={ml - 10} y={cy + 3} textAnchor="end" fill="#cbd5e1" fontSize="10" fontWeight="600">{r.name}</text>

              {/* Supply bar (amber/orange) */}
              <rect x={ml} y={supplyY} width={Math.max(0, x(r.supply) - ml)} height={barH} rx="2" fill="#f59e0b" />
              <text x={x(r.supply) + 5} y={supplyY + barH - 1} fill="#fb923c" fontSize="8" fontFamily="monospace">{fmt(r.supply)}</text>

              {/* Demand bar (blue/cyan) */}
              <rect x={ml} y={demandY} width={Math.max(0, x(r.demand) - ml)} height={barH} rx="2" fill="#3b82f6" />
              <text x={x(r.demand) + 5} y={demandY + barH - 1} fill="#22d3ee" fontSize="8" fontFamily="monospace">{fmt(r.demand)}</text>

              {/* Surplus / deficit tag */}
              <text x={W - mr + 6} y={cy + 3} fill={tagColor} fontSize="9" fontFamily="monospace" fontWeight="bold">{tag}</text>
            </g>
          )
        })}
      </svg>

      {/* Legend chips */}
      <div className="flex items-center gap-4 mt-3 text-xs">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-3.5 rounded-sm" style={{ background: '#f59e0b' }} />
          <span className="text-slate-400">Supply</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-3.5 rounded-sm" style={{ background: '#3b82f6' }} />
          <span className="text-slate-400">Demand</span>
        </span>
      </div>

      <p className="text-slate-500 text-xs mt-3 leading-relaxed">{t('caption')}</p>
      <p className="text-slate-500 text-[10px] mt-1">Source: {t('source')}</p>
    </div>
  )
}
