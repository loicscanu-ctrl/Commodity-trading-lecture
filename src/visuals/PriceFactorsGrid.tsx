'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

// The factors that drive a commodity price, grouped by WHERE they act:
// supply side, demand side, the exchange itself, and the macro backdrop.
// Every one of these becomes a headline on the live futures screen.
export const textDef = defineVisualText({
  s1: { label: 'Supply 1', value: 'Weather & seasonality' },
  s2: { label: 'Supply 2', value: 'Crop cycles & harvests' },
  s3: { label: 'Supply 3', value: 'Origin stocks' },
  s4: { label: 'Supply 4', value: 'Logistics & freight' },
  s5: { label: 'Supply 5', value: 'Geopolitics at origin' },
  d1: { label: 'Demand 1', value: 'Consumption trends' },
  d2: { label: 'Demand 2', value: 'Substitution & alternatives' },
  d3: { label: 'Demand 3', value: 'Quality & location preferences' },
  d4: { label: 'Demand 4', value: 'Processor margins' },
  e1: { label: 'Exchange 1', value: 'Certified stocks' },
  e2: { label: 'Exchange 2', value: 'Fund positioning' },
  e3: { label: 'Exchange 3', value: 'Deliveries & squeezes' },
  e4: { label: 'Exchange 4', value: 'Contract & rule changes' },
  m1: { label: 'Macro 1', value: 'USD & FX' },
  m2: { label: 'Macro 2', value: 'Interest rates & financing' },
  m3: { label: 'Macro 3', value: 'Taxation & tariffs' },
  m4: { label: 'Macro 4', value: 'Environment & regulation (EUDR)' },
  priceLabel: { label: 'Price label', value: 'PRICE' },
  caption: {
    label: 'Caption',
    multiline: true,
    value: 'Four families of forces, one price. Analysis means asking, for each headline: which box is it in — and is the market balanced, oversupplied or undersupplied once it lands?',
  },
  crossref: {
    label: 'Cross-reference',
    multiline: true,
    value: 'Remember these boxes: on the futures screen two sessions from now, every news flash you trade is one of these factors wearing a headline.',
  },
})

const CATS = [
  { key: 'SUPPLY', color: '#34d399', keys: ['s1', 's2', 's3', 's4', 's5'] as const },
  { key: 'DEMAND', color: '#22d3ee', keys: ['d1', 'd2', 'd3', 'd4'] as const },
  { key: 'EXCHANGE-RELATED', color: '#f59e0b', keys: ['e1', 'e2', 'e3', 'e4'] as const },
  { key: 'MACRO & POLICY', color: '#8b5cf6', keys: ['m1', 'm2', 'm3', 'm4'] as const },
]

export default function PriceFactorsGrid() {
  const t = useVisualText(textDef)
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATS.map(cat => (
          <div key={cat.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
              <span className="font-mono text-[11px] font-bold tracking-wide" style={{ color: cat.color }}>{cat.key}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.keys.map(k => (
                <span key={k} className="rounded-lg border px-2 py-1 text-xs font-medium text-slate-200 transition-all hover:-translate-y-0.5"
                  style={{ borderColor: `${cat.color}44`, background: `${cat.color}12` }}>
                  {t(k)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* All four families feed one number */}
      <div className="mt-3 flex flex-col items-center">
        <div className="flex gap-6">
          {CATS.map(c => (
            <span key={c.key} className="h-5 w-px" style={{ background: `${c.color}88` }} />
          ))}
        </div>
        <div className="rounded-full bg-white/10 px-16 py-3 font-mono text-sm font-bold text-white">{t('priceLabel')}</div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">{t('caption')}</p>
      <p className="mt-2 text-center text-xs font-medium text-brand-cyan">{t('crossref')}</p>
    </div>
  )
}
