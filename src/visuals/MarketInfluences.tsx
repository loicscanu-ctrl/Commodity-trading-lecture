'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  item1Label: { label: 'Item 1 · label', value: 'Applying Information to the Present' },
  item1Detail: { label: 'Item 1 · detail', multiline: true, value: 'What does the future hold? Current data (production reports, weather, geopolitics) is immediately priced into the curve.' },
  item2Label: { label: 'Item 2 · label', value: 'Outright Price Level' },
  item2Detail: { label: 'Item 2 · detail', multiline: true, value: 'The absolute spot price determines the financing cost component of the forward curve. Higher prices → higher carry costs → steeper contango.' },
  item3Label: { label: 'Item 3 · label', value: 'Balance of Supply vs Demand' },
  item3Detail: { label: 'Item 3 · detail', multiline: true, value: 'The perception of future changes drives the shape. Oversupply today → stocks build → contango. Undersupply → stocks draw → backwardation.' },
  item4Label: { label: 'Item 4 · label', value: 'Seasonality' },
  item4Detail: { label: 'Item 4 · detail', multiline: true, value: 'Predictable seasonal demand peaks (heating oil in winter, gasoline in summer) or harvest seasonality compress or widen the calendar spread.' },
  item5Label: { label: 'Item 5 · label', value: 'Stock Levels' },
  item5Detail: { label: 'Item 5 · detail', multiline: true, value: 'Low inventory → tight nearby supply → backwardation. High inventory → abundant supply → contango. Inventory data (EIA, IEA, ICO) is the single most important weekly input.' },
})

export default function MarketInfluences() {
  const t = useVisualText(textDef)
  const influences = [
    { label: t('item1Label'), detail: t('item1Detail') },
    { label: t('item2Label'), detail: t('item2Detail') },
    { label: t('item3Label'), detail: t('item3Detail') },
    { label: t('item4Label'), detail: t('item4Detail') },
    { label: t('item5Label'), detail: t('item5Detail') },
  ]

  return (
    <div className="mt-6 space-y-3">
      {influences.map((item, i) => (
        <div key={i} className="glass glass-hover flex gap-4 rounded-2xl p-5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 font-mono text-xs text-brand-cyan">{String(i + 1).padStart(2, '0')}</div>
          <div>
            <div className="text-white font-semibold tracking-tight text-sm mb-1">{item.label}</div>
            <div className="text-slate-400 text-xs leading-relaxed">{item.detail}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
