'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  longTitle: { label: 'Long · title', value: 'Long' },
  longRule: { label: 'Long · rule', value: 'Price rises: you gain · Price falls: you lose' },
  shortTitle: { label: 'Short · title', value: 'Short' },
  shortRule: { label: 'Short · rule', value: 'Price rises: you lose · Price falls: you gain' },
  neutralTitle: { label: 'Neutral · title', value: 'Neutral' },
  neutralRule: { label: 'Neutral · rule', value: 'A price move tomorrow does not change your P&L' },
})

export default function ExposureLadder() {
  const t = useVisualText(textDef)

  const cards = [
    { title: t('longTitle'), rule: t('longRule'), border: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: t('shortTitle'), rule: t('shortRule'), border: 'border-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10' },
    { title: t('neutralTitle'), rule: t('neutralRule'), border: 'border-slate-500', text: 'text-slate-300', bg: 'bg-slate-500/10' },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-3">Price-risk P&amp;L</div>

      <div className="flex justify-center">
        <svg width="100%" viewBox="0 0 320 200" className="max-w-md" role="img" aria-label="P&L versus price for long, short and neutral exposure">
          {/* axes */}
          <line x1="30" y1="100" x2="300" y2="100" stroke="#475569" strokeWidth="1" />
          <line x1="40" y1="20" x2="40" y2="180" stroke="#475569" strokeWidth="1" />
          {/* axis labels */}
          <text x="300" y="115" fill="#64748b" fontSize="10" textAnchor="end">Price →</text>
          <text x="44" y="28" fill="#64748b" fontSize="10">P&amp;L</text>
          <text x="44" y="96" fill="#64748b" fontSize="9">0</text>

          {/* LONG: upward diagonal */}
          <line x1="50" y1="170" x2="295" y2="30" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          <text x="270" y="26" fill="#34d399" fontSize="11" fontWeight="600" textAnchor="end">LONG</text>

          {/* SHORT: downward diagonal */}
          <line x1="50" y1="30" x2="295" y2="170" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
          <text x="270" y="182" fill="#f43f5e" fontSize="11" fontWeight="600" textAnchor="end">SHORT</text>

          {/* NEUTRAL: flat line */}
          <line x1="50" y1="100" x2="295" y2="100" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />
          <text x="120" y="92" fill="#94a3b8" fontSize="11" fontWeight="600">NEUTRAL</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {cards.map((c, i) => (
          <div key={i} className={'rounded-xl border-l-[3px] ' + c.border + ' ' + c.bg + ' p-4'}>
            <div className={'font-semibold tracking-tight text-sm uppercase mb-2 ' + c.text}>{c.title}</div>
            <div className="text-slate-400 text-xs leading-relaxed">{c.rule}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
