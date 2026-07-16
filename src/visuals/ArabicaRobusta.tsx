'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Eyebrow · heading', value: 'The two coffees the world trades' },
  aTitle: { label: 'Arabica · title', value: 'Arabica' },
  aBorn: { label: 'Arabica · born', value: 'Ethiopian highlands, East Africa' },
  aGrows: { label: 'Arabica · grows', multiline: true, value: 'High altitude (900–2,000 m), cool tropics' },
  aCup: { label: 'Arabica · cup', multiline: true, value: 'Aromatic, complex, mild — premium' },
  aCaffeine: { label: 'Arabica · caffeine', value: '~1.5%' },
  aShare: { label: 'Arabica · world share', value: '~60%' },
  aProducers: { label: 'Arabica · top producers', multiline: true, value: 'Brazil, Colombia, Ethiopia, Honduras' },
  aTraded: { label: 'Arabica · traded on chip', value: 'ICE New York · ¢/lb · 37,500 lb lots' },
  rTitle: { label: 'Robusta · title', value: 'Robusta' },
  rBorn: { label: 'Robusta · born', value: 'West & Central African lowland forests' },
  rGrows: { label: 'Robusta · grows', multiline: true, value: 'Low altitude (0–800 m), hot & humid — hardy, disease-resistant' },
  rCup: { label: 'Robusta · cup', multiline: true, value: 'Strong, bitter, earthy — espresso & instant' },
  rCaffeine: { label: 'Robusta · caffeine', value: '~2.7%' },
  rShare: { label: 'Robusta · world share', value: '~40%' },
  rProducers: { label: 'Robusta · top producers', multiline: true, value: "Vietnam, Brazil (conilon), Indonesia, Uganda, Côte d'Ivoire" },
  rTraded: { label: 'Robusta · traded on chip', value: 'ICE Europe (London) · $/MT · 10 MT lots' },
  caption: { label: 'Caption', multiline: true, value: 'Two species, two origin stories, two exchanges — the split that runs through every coffee book, blend and price.' },
})

const SPEC_LABELS = ['Born', 'Grows', 'Cup', 'Caffeine', 'World share', 'Top producers']

export default function ArabicaRobusta() {
  const t = useVisualText(textDef)
  const cards = [
    {
      title: t('aTitle'),
      specs: [t('aBorn'), t('aGrows'), t('aCup'), t('aCaffeine'), t('aShare'), t('aProducers')],
      traded: t('aTraded'),
      accent: 'bg-amber-500',
      accentText: 'text-amber-400',
      chip: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    },
    {
      title: t('rTitle'),
      specs: [t('rBorn'), t('rGrows'), t('rCup'), t('rCaffeine'), t('rShare'), t('rProducers')],
      traded: t('rTraded'),
      accent: 'bg-emerald-500',
      accentText: 'text-emerald-400',
      chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-4">{t('heading')}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(card => (
          <div key={card.title} className="glass glass-hover relative overflow-hidden rounded-2xl p-5 flex flex-col">
            <span className={`absolute left-0 top-0 h-full w-[3px] ${card.accent}`} />
            <h3 className={`font-semibold tracking-tight text-sm uppercase mb-3 ${card.accentText}`}>{card.title}</h3>
            <dl className="space-y-2 mb-4">
              {card.specs.map((value, i) => (
                <div key={SPEC_LABELS[i]} className="flex items-baseline justify-between gap-3">
                  <dt className="text-slate-500 text-xs uppercase tracking-wide shrink-0">{SPEC_LABELS[i]}</dt>
                  <dd className="text-slate-300 text-sm text-right leading-snug">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto">
              <span className={`chip inline-block rounded-full border px-3 py-1 text-xs font-medium ${card.chip}`}>{card.traded}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-sm leading-relaxed mt-4">{t('caption')}</p>
    </div>
  )
}
