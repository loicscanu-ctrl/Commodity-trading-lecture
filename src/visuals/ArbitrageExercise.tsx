'use client'

import { useState } from 'react'

const CASES = [
  {
    id: '1',
    commodity: 'Arabica Coffee — ICE-US',
    unit: 'cents/lb',
    spot: '130.00 c/lb',
    forward: '135.00 c/lb (2-month forward)',
    financing: '3.0% per annum',
    storage: '$5.00 / MT / month',
    hint: 'Unit conversion required: 1 MT = 2,204.6 lbs → 1 c/lb = $22.046/MT',
    steps: [
      'Spot in $/MT: 130 × 22.046 = $2,865.98/MT',
      'Storage: $5.00 × 2 months = $10.00/MT',
      'Financing: $2,865.98 × 3% × 2/12 = $14.33/MT',
      'Cost of carry: $10.00 + $14.33 = $24.33/MT',
      'Fair Forward: $2,865.98 + $24.33 = $2,890.31/MT',
      'Fair Forward in c/lb: $2,890.31 ÷ 22.046 = 131.1 c/lb',
      'Market forward 135 c/lb > fair value 131.1 c/lb',
    ],
    answer: true,
    profit: '+3.9 c/lb ≈ +$86/MT risk-free',
  },
  {
    id: '2',
    commodity: 'WTI Crude Oil',
    unit: '$/bbl',
    spot: '$80.00/bbl',
    forward: '$80.50/bbl (1-month forward)',
    financing: '5.0% per annum',
    storage: '$6.50/MT (total cost of carry)',
    hint: 'Unit conversion required: WTI ≈ 7.45 bbl/MT',
    steps: [
      'Storage in $/bbl: $6.50/MT ÷ 7.45 bbl/MT = $0.87/bbl',
      'Financing: $80 × 5% × 1/12 = $0.33/bbl',
      'Total cost of carry: $0.87 + $0.33 = $1.20/bbl',
      'Fair Forward: $80.00 + $1.20 = $81.20/bbl',
      'Market forward $80.50/bbl < fair value $81.20/bbl',
    ],
    answer: false,
    profit: null,
  },
  {
    id: '3',
    commodity: 'Robusta Coffee — ICE-EU',
    unit: '$/MT',
    spot: '$2,500/MT',
    forward: '$2,545/MT (3-month forward)',
    financing: '4.0% per annum',
    storage: '$4.00/MT/month',
    hint: 'All prices already in $/MT — no unit conversion needed.',
    steps: [
      'Storage: $4.00 × 3 months = $12.00/MT',
      'Financing: $2,500 × 4% × 3/12 = $25.00/MT',
      'Total cost of carry: $12.00 + $25.00 = $37.00/MT',
      'Fair Forward: $2,500 + $37.00 = $2,537/MT',
      'Market forward $2,545/MT > fair value $2,537/MT',
    ],
    answer: true,
    profit: '+$8/MT risk-free',
  },
]

export default function ArbitrageExercise() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  return (
    <div className="mt-5 space-y-4">
      {CASES.map((c) => {
        const isRevealed = !!revealed[c.id]
        return (
          <div key={c.id} className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden transition-colors hover:border-white/20">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="chip text-amber-300">CASE {c.id}</span>
                <span className="text-slate-100 font-semibold text-sm">{c.commodity}</span>
              </div>
              <button
                onClick={() => setRevealed(r => ({ ...r, [c.id]: !r[c.id] }))}
                className="rounded-full text-xs font-mono border border-white/15 px-3.5 py-1.5 text-slate-300 hover:border-amber-400/60 hover:text-amber-300 hover:bg-white/[0.04] transition-colors"
              >
                {isRevealed ? 'Hide answer' : 'Reveal answer →'}
              </button>
            </div>

            {/* Case data */}
            <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-mono">
              <div className="flex justify-between"><span className="text-slate-500">Spot price</span><span className="text-slate-100">{c.spot}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Forward price</span><span className="text-slate-100">{c.forward}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Financing</span><span className="text-slate-100">{c.financing}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Storage</span><span className="text-slate-100">{c.storage}</span></div>
            </div>

            {c.hint && (
              <div className="px-4 pb-3">
                <div className="text-cyan-300/80 text-xs font-mono border-l-2 border-cyan-500/50 pl-2.5">{c.hint}</div>
              </div>
            )}

            {/* Revealed answer */}
            {isRevealed && (
              <div className={`border-t px-4 py-3.5 ${c.answer ? 'border-emerald-500/30 bg-emerald-500/[0.06]' : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-mono font-bold rounded-full px-3 py-1 border ${c.answer ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' : 'text-rose-300 border-rose-500/40 bg-rose-500/10'}`}>
                    {c.answer ? '✓ YES — ARBITRAGE EXISTS' : '✗ NO — NO ARBITRAGE'}
                  </span>
                  {c.profit && <span className="text-emerald-300 font-mono text-xs">{c.profit}</span>}
                </div>
                <div className="space-y-1">
                  {c.steps.map((step, i) => (
                    <div key={i} className="text-xs font-mono flex gap-2">
                      <span className="text-slate-600 shrink-0">{i + 1}.</span>
                      <span className={i === c.steps.length - 1 ? (c.answer ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold') : 'text-slate-300'}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
