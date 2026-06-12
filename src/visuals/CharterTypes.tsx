'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Eyebrow · heading', value: 'Types of charter party' },
  c1Title: { label: 'Card 1 · title', value: 'Voyage / Spot charter' },
  c1What: { label: 'Card 1 · what it is', multiline: true, value: 'Owner provides vessel + crew for ONE voyage between named ports.' },
  c1Detail: { label: 'Card 1 · detail', multiline: true, value: 'Owner bears bunkers & port costs; charterer pays freight per MT (or lumpsum).' },
  c1Risk: { label: 'Card 1 · risk chip', value: 'Highest exposure — market volatility, demurrage, deadfreight' },
  c2Title: { label: 'Card 2 · title', value: 'Time charter' },
  c2What: { label: 'Card 2 · what it is', multiline: true, value: 'Hire of the whole vessel for an agreed period, within an agreed trading range.' },
  c2Detail: { label: 'Card 2 · detail', multiline: true, value: "Paid at an agreed $/day; bunkers & port costs are extra. Duration often '6 chop 6' (6 months + 6-month option)." },
  c2Risk: { label: 'Card 2 · risk chip', value: 'Medium — you direct employment' },
  c3Title: { label: 'Card 3 · title', value: 'Contract of Affreightment (COA)' },
  c3What: { label: 'Card 3 · what it is', multiline: true, value: 'A term contract of freight: agreed volume, agreed voyages, over a set period.' },
  c3Detail: { label: 'Card 3 · detail', multiline: true, value: "Charterer nominates cargoes; owner nominates suitable vessels. 'Take-or-pay'." },
  c3Risk: { label: 'Card 3 · risk chip', value: 'Lower risk — at a premium cost' },
  c4Title: { label: 'Card 4 · title', value: 'Bareboat charter' },
  c4What: { label: 'Card 4 · what it is', multiline: true, value: 'Owner provides the vessel only; charterer crews and operates it.' },
  c4Detail: { label: 'Card 4 · detail', multiline: true, value: 'Long duration (>3 years), specialist ships (LNG etc). Relatively rare.' },
  c4Risk: { label: 'Card 4 · risk chip', value: 'Full operational control' },
})

export default function CharterTypes() {
  const t = useVisualText(textDef)
  const cards = [
    { title: t('c1Title'), what: t('c1What'), detail: t('c1Detail'), risk: t('c1Risk'), accent: 'bg-rose-500', accentText: 'text-rose-400', chip: 'border-rose-500/30 bg-rose-500/10 text-rose-300' },
    { title: t('c2Title'), what: t('c2What'), detail: t('c2Detail'), risk: t('c2Risk'), accent: 'bg-amber-500', accentText: 'text-amber-400', chip: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
    { title: t('c3Title'), what: t('c3What'), detail: t('c3Detail'), risk: t('c3Risk'), accent: 'bg-emerald-500', accentText: 'text-emerald-400', chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
    { title: t('c4Title'), what: t('c4What'), detail: t('c4Detail'), risk: t('c4Risk'), accent: 'bg-slate-500', accentText: 'text-slate-300', chip: 'border-slate-500/30 bg-slate-500/10 text-slate-300' },
  ]

  return (
    <div className="mt-6">
      <div className="eyebrow text-brand-cyan mb-4">{t('heading')}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="glass glass-hover relative overflow-hidden rounded-2xl p-5 flex flex-col">
            <span className={`absolute left-0 top-0 h-full w-[3px] ${c.accent}`} />
            <h3 className={`font-semibold tracking-tight text-sm uppercase mb-2 ${c.accentText}`}>{c.title}</h3>
            <p className="text-white text-sm leading-relaxed mb-2">{c.what}</p>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">{c.detail}</p>
            <div className="mt-auto">
              <span className={`chip inline-block rounded-full border px-3 py-1 text-xs font-medium ${c.chip}`}>{c.risk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
