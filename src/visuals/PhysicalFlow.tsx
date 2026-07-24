'use client'

import { useState } from 'react'

// The PHYSICAL trade flow: supplier → desk → warehouse → customer, drawn as
// three superimposed flows — GOODS forward, DOCUMENTS forward, MONEY back.
// Toggle a flow to isolate it; each hop names what actually moves and which
// office of the trading house touches it.
type Flow = 'goods' | 'docs' | 'cash'

const NODES = [
  { key: 'supplier', label: 'SUPPLIER', sub: 'Farmer co-op · Dak Lak', icon: '🌱' },
  { key: 'desk', label: 'TRADING HOUSE', sub: 'Exporter desk · HCM', icon: '🏢' },
  { key: 'warehouse', label: 'WAREHOUSE', sub: 'C. Steinweg · Antwerp', icon: '📦' },
  { key: 'customer', label: 'CUSTOMER', sub: 'Roaster · Hamburg', icon: '☕' },
]

// What moves on each hop, per flow (cash flows BACKWARD: customer pays last)
const HOPS: Record<Flow, { dir: 'fwd' | 'back'; labels: [string, string, string] }> = {
  goods: {
    dir: 'fwd',
    labels: ['green coffee, trucked & milled', 'container · vessel HCM → Antwerp', 'delivered instore, blended & roasted'],
  },
  docs: {
    dir: 'fwd',
    labels: ['purchase contract · weighbridge slip', 'B/L · quality & phyto certificates', 'sale contract · invoice · warrant'],
  },
  cash: {
    dir: 'back',
    labels: ['VND spot payment on delivery', 'financing carries the voyage (bank line)', 'USD/EUR against documents (LC or CAD)'],
  },
}

const FLOW_META: Record<Flow, { label: string; color: string; office: string }> = {
  goods: { label: 'GOODS →', color: '#34d399', office: 'moved by OPERATIONS (back office): trucks, stuffing, vessel bookings, instore handling' },
  docs: { label: 'DOCUMENTS →', color: '#22d3ee', office: 'issued & matched by BACK OFFICE: no clean documents, no payment — the paper IS the trade' },
  cash: { label: '← MONEY', color: '#f59e0b', office: 'moved by TREASURY: the customer pays against documents; the desk paid the farmer months earlier — financing bridges the gap' },
}

export default function PhysicalFlow() {
  const [focus, setFocus] = useState<Flow | 'all'>('all')

  const W = 560, H = 220, ml = 10, mr = 10, mt = 14
  const span = (W - ml - mr) / NODES.length
  const nodeX = (i: number) => ml + span * (i + 0.5)
  const flowY: Record<Flow, number> = { goods: 108, docs: 146, cash: 184 }
  const dim = (f: Flow) => focus !== 'all' && focus !== f

  const arrow = (f: Flow, hop: number) => {
    const meta = FLOW_META[f]
    const y = flowY[f]
    const x1 = nodeX(hop) + 34, x2 = nodeX(hop + 1) - 34
    const back = HOPS[f].dir === 'back'
    return (
      <g key={`${f}-${hop}`} opacity={dim(f) ? 0.18 : 1}>
        <line x1={back ? x2 : x1} y1={y} x2={back ? x1 : x2} y2={y}
          stroke={meta.color} strokeWidth="1.8" strokeDasharray={f === 'docs' ? '5 3' : undefined}
          markerEnd={`url(#pf-arrow-${f})`} />
        <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle" fill={meta.color} fontSize="7" fontFamily="monospace">
          {HOPS[f].labels[hop]}
        </text>
      </g>
    )
  }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">The physical flow — goods forward, documents forward, money back</div>
        <div className="flex gap-1.5">
          {(['all', 'goods', 'docs', 'cash'] as const).map(f => (
            <button key={f} type="button" onClick={() => setFocus(f)} aria-label={`Show ${f} flow`}
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold transition-colors ${
                focus === f ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              style={focus === f && f !== 'all' ? { color: FLOW_META[f as Flow].color } : undefined}>
              {f === 'all' ? 'ALL' : FLOW_META[f as Flow].label}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '230px' }}>
        <defs>
          {(Object.keys(FLOW_META) as Flow[]).map(f => (
            <marker key={f} id={`pf-arrow-${f}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 z" fill={FLOW_META[f].color} />
            </marker>
          ))}
        </defs>

        {/* the four parties */}
        {NODES.map((n, i) => (
          <g key={n.key}>
            <rect x={nodeX(i) - 52} y={mt} width={104} height={58} rx="12"
              fill={i === 1 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)'}
              stroke={i === 1 ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.12)'} strokeWidth="1.2" />
            <text x={nodeX(i)} y={mt + 20} textAnchor="middle" fontSize="13">{n.icon}</text>
            <text x={nodeX(i)} y={mt + 36} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace" fontWeight="bold">{n.label}</text>
            <text x={nodeX(i)} y={mt + 48} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">{n.sub}</text>
            {/* drop lines to the flow rows */}
            <line x1={nodeX(i)} y1={mt + 58} x2={nodeX(i)} y2={flowY.cash + 6} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </g>
        ))}

        {/* the three flows, hop by hop */}
        {(Object.keys(HOPS) as Flow[]).map(f => [0, 1, 2].map(h => arrow(f, h)))}

        {/* flow row labels */}
        {(Object.keys(FLOW_META) as Flow[]).map(f => (
          <text key={`lbl-${f}`} x={ml} y={flowY[f] + 3} fill={FLOW_META[f].color} fontSize="7.5" fontFamily="monospace" fontWeight="bold" opacity={dim(f) ? 0.25 : 1}>
            {FLOW_META[f].label.replace(' →', '').replace('← ', '')}
          </text>
        ))}
      </svg>

      {/* which office moves the focused flow */}
      <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-300">
        {focus === 'all' ? (
          <>Three flows, one trade: <span className="font-bold text-emerald-300">goods</span> travel forward over months,{' '}
          <span className="font-bold text-cyan-300">documents</span> chase them hop by hop, and{' '}
          <span className="font-bold text-amber-300">money</span> flows BACKWARD — the customer pays last, against clean documents.
          Click a flow to see which office owns it.</>
        ) : (
          <span>{FLOW_META[focus].office}.</span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        Notice the desk&rsquo;s position: it pays the farmer in November and is paid by the roaster months later —
        the trading house earns its margin by carrying <span className="text-slate-200">time, distance, documents and financing</span>,
        with the price risk hedged on the exchange the whole way. That gap between paying and being paid is
        exactly why treasury, financing lines and clean paperwork are desk jobs, not paperwork.
      </p>
    </div>
  )
}
