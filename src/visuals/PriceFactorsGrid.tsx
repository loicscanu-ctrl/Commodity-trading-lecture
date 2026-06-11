'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  supplyLabel: { label: 'Header · supply', value: 'SUPPLY' },
  demandLabel: { label: 'Header · demand', value: 'DEMAND' },
  factor1: { label: 'Factor 1', value: 'Stocks' },
  factor2: { label: 'Factor 2', value: 'Geopolitics' },
  factor3: { label: 'Factor 3', value: 'Transport' },
  factor4: { label: 'Factor 4', value: 'Seasonality' },
  factor5: { label: 'Factor 5', value: 'Refining' },
  factor6: { label: 'Factor 6', value: 'Quality / Location' },
  factor7: { label: 'Factor 7', value: 'Alternatives' },
  factor8: { label: 'Factor 8', value: 'Taxation' },
  factor9: { label: 'Factor 9', value: 'Environment' },
  factor10: { label: 'Factor 10', value: 'Renewables' },
  factor11: { label: 'Factor 11', value: 'Regulation' },
  factor12: { label: 'Factor 12', value: 'USD' },
  priceLabel: { label: 'Price label', value: 'PRICE' },
  caption: { label: 'Caption', multiline: true, value: 'Analysis of these fundamental factors helps determine if the market is balanced, oversupplied, or undersupplied.' },
})

export default function PriceFactorsGrid() {
  const t = useVisualText(textDef)
  const FACTORS = [
    { label: t('factor1'), color: 'bg-emerald-600' },
    { label: t('factor2'), color: 'bg-sky-500' },
    { label: t('factor3'), color: 'bg-amber-500' },
    { label: t('factor4'), color: 'bg-amber-500' },
    { label: t('factor5'), color: 'bg-emerald-600' },
    { label: t('factor6'), color: 'bg-sky-500' },
    { label: t('factor7'), color: 'bg-emerald-600' },
    { label: t('factor8'), color: 'bg-amber-500' },
    { label: t('factor9'), color: 'bg-zinc-500' },
    { label: t('factor10'), color: 'bg-zinc-500' },
    { label: t('factor11'), color: 'bg-sky-500' },
    { label: t('factor12'), color: 'bg-emerald-600' },
  ]
  return (
    <div className="mt-6">
      {/* Supply → Demand header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full bg-amber-500 text-black font-bold text-sm px-6 py-3 font-mono shadow-glow">{t('supplyLabel')}</div>
        <div className="flex-1 h-px bg-white/15" />
        <div className="rounded-full bg-sky-500 text-black font-bold text-sm px-6 py-3 font-mono shadow-glow">{t('demandLabel')}</div>
      </div>

      {/* 3-column factor grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
        {FACTORS.map((f) => (
          <div key={f.label} className={`${f.color} rounded-xl text-white text-sm font-semibold text-center py-3 px-2 transition-all hover:-translate-y-0.5 hover:brightness-110`}>
            {f.label}
          </div>
        ))}
      </div>

      {/* Price at bottom */}
      <div className="flex justify-center mt-2.5">
        <div className="rounded-full bg-white/10 text-white font-bold text-sm px-16 py-3 font-mono">{t('priceLabel')}</div>
      </div>

      <p className="text-slate-500 text-xs mt-4 text-center">
        {t('caption')}
      </p>
    </div>
  )
}
