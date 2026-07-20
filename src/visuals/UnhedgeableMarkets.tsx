'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'The markets that never got one' },
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
  defence: {
    label: 'Failed defences note',
    multiline: true,
    value: 'And the physical defences fail too: your tanks hold ~1 month of supply (you cannot stock your way out), and buying forward bilaterally just concentrates counterparty risk exactly where it will default.',
  },
  riceNote: { label: 'Rice one-liner', multiline: true, value: 'Export bans, no global hedge: panic did the pricing — ×3 in months, then collapse.' },
  pepperNote: { label: 'Pepper one-liner', multiline: true, value: 'Planted at $10,000 with no curve to warn of the supply wall — sold under $2,000.' },
  onionNote: { label: 'Onion one-liner', multiline: true, value: 'Futures BANNED in 1958 — volatility went UP: the natural experiment, still running.' },
  caption: {
    label: 'Closing caption',
    multiline: true,
    value: 'Pepper, rice, olive oil, onions — big markets with no liquid futures. The volatility is not bigger than coffee’s; the difference is that nobody can lay it off. That is what an exchange is FOR.',
  },
})

// Illustrative extra-virgin olive-oil prices, ex-mill Spain, €/t
const OIL: [number, number][] = [
  [2019, 2100],
  [2020, 1900],
  [2021, 3200],
  [2022, 4000],
  [2023, 7500],
  [2024, 8900],
  [2025, 3900],
]

// Mini-cases: illustrative price paths (indexed / $ per tonne)
const RICE: [string, number][] = [['2006', 300], ['2007', 335], ['2008', 1000], ['2009', 550]]
const PEPPER: [string, number][] = [['2013', 6500], ['2015', 10000], ['2017', 4500], ['2019', 1900]]
// Onions: relative price volatility, before vs after the 1958 futures ban
const ONIONS: [string, number][] = [['with futures (pre-1958)', 100], ['after the ban', 160]]

const PROBLEM_DOTS = ['#f43f5e', '#f59e0b', '#22d3ee', '#34d399']

function MiniLine({ data, color, unit }: { data: [string, number][]; color: string; unit: string }) {
  const W = 150, H = 64, ml = 4, mt = 8, pw = W - 8, ph = H - 24
  const vals = data.map(d => d[1])
  const min = Math.min(...vals), max = Math.max(...vals)
  const x = (i: number) => ml + (i / (data.length - 1)) * pw
  const y = (v: number) => mt + (1 - (v - min) / (max - min)) * ph
  const path = data.map(([, v], i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const peak = vals.indexOf(max)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '72px' }}>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map(([label, v], i) => (
        <g key={label}>
          <circle cx={x(i)} cy={y(v)} r="2.5" fill={color} stroke="#070912" strokeWidth="0.8">
            <title>{`${label} · ${v.toLocaleString('en-US')} ${unit}`}</title>
          </circle>
          <text x={x(i)} y={H - 3} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} fill="#64748b" fontSize="7" fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
      <text x={x(peak)} y={y(vals[peak]) - 4} textAnchor={peak > data.length / 2 ? 'end' : 'middle'} fill={color} fontSize="7.5" fontFamily="monospace" fontWeight="bold">
        {vals[peak].toLocaleString('en-US')}
      </text>
    </svg>
  )
}

export default function UnhedgeableMarkets() {
  const t = useVisualText(textDef)

  // Olive-oil chart geometry
  const W = 480, H = 170
  const ml = 48, mr = 24, mt = 18, mb = 28
  const pw = W - ml - mr
  const ph = H - mt - mb
  const PMIN = 1500, PMAX = 9500
  const cx = (i: number) => ml + (i / (OIL.length - 1)) * pw
  const cy = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph
  const axisBottom = mt + ph
  const yTicks = [2000, 4000, 6000, 8000]
  const oilPath = OIL.map(([, v], i) => `${i === 0 ? 'M' : 'L'}${cx(i).toFixed(1)},${cy(v).toFixed(1)}`).join(' ')
  const peakI = 5 // 2024 · €8,900

  const problems = [t('prob1'), t('prob2'), t('prob3'), t('prob4')]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-amber-400 mb-3">{t('heading')}</div>

      {/* The deep case: olive oil */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.07] p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '190px' }}>
          <text x={ml} y={11} fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
            Extra-virgin olive oil · illustrative, ex-mill Spain · €/t
          </text>
          {yTicks.map(v => (
            <g key={`yt-${v}`}>
              <line x1={ml} y1={cy(v)} x2={ml + pw} y2={cy(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={ml - 6} y={cy(v) + 3} textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily="monospace">
                {v.toLocaleString('en-US')}
              </text>
            </g>
          ))}
          <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <path d={oilPath} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
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
          <text x={cx(peakI) - 9} y={cy(OIL[peakI][1]) + 3} textAnchor="end" fill="#f59e0b" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
            ×4.7 top-to-bottom in five years
          </text>
        </svg>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t('defence')}</p>
      </div>

      {/* The same story elsewhere: rice, pepper — and the onion experiment */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="font-mono text-[10px] font-bold text-cyan-300">Rice · world price, $/t · 2008</div>
          <MiniLine data={RICE} color="#22d3ee" unit="$/t" />
          <p className="mt-1 text-[10.5px] leading-relaxed text-slate-400">{t('riceNote')}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="font-mono text-[10px] font-bold text-emerald-300">Vietnamese pepper · $/t · boom → bust</div>
          <MiniLine data={PEPPER} color="#34d399" unit="$/t" />
          <p className="mt-1 text-[10.5px] leading-relaxed text-slate-400">{t('pepperNote')}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="font-mono text-[10px] font-bold text-rose-300">US onions · price volatility (indexed)</div>
          <div className="mt-2 space-y-2">
            {ONIONS.map(([label, v]) => (
              <div key={label}>
                <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                  <span>{label}</span>
                  <span className="font-bold text-slate-200">{v}</span>
                </div>
                <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full" style={{ width: `${(v / 160) * 100}%`, background: v > 100 ? '#f43f5e' : '#34d399' }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10.5px] leading-relaxed text-slate-400">{t('onionNote')}</p>
        </div>
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
  )
}
