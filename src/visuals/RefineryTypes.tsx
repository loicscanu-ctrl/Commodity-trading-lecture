'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Eyebrow · heading', value: 'Refinery complexity tiers' },
  caption: { label: 'Caption', multiline: true, value: 'Each tier costs more to build but can run cheaper, heavier crude and capture more margin.' },
  t1Title: { label: 'Tier 1 · title', value: 'Topping' },
  t1What: { label: 'Tier 1 · what it adds', multiline: true, value: 'The base: separates crude into straight-run cuts.' },
  t1Units: { label: 'Tier 1 · units', value: 'Crude Distillation Unit (CDU)' },
  t2Title: { label: 'Tier 2 · title', value: 'Hydro-skimming' },
  t2What: { label: 'Tier 2 · what it adds', multiline: true, value: 'Cleans and upgrades the cuts to on-spec products.' },
  t2Units: { label: 'Tier 2 · units', value: '+ Desulphurisation, Catalytic Reformer' },
  t3Title: { label: 'Tier 3 · title', value: 'Complex' },
  t3What: { label: 'Tier 3 · what it adds', multiline: true, value: 'Converts heavy gas oil into lighter, higher-value products.' },
  t3Units: { label: 'Tier 3 · units', value: '+ Vacuum Distillation, Fluid Catalytic Cracker (FCC), Isomerisation, Alkylation, MTBE' },
  t4Title: { label: 'Tier 4 · title', value: 'Deep conversion' },
  t4What: { label: 'Tier 4 · what it adds', multiline: true, value: 'Squeezes value from the bottom of the barrel (residue).' },
  t4Units: { label: 'Tier 4 · units', value: '+ Residue conversion, Visbreaker, Coker' },
})

export default function RefineryTypes() {
  const t = useVisualText(textDef)
  const tiers = [
    { title: t('t1Title'), what: t('t1What'), units: t('t1Units'), accent: 'text-slate-300', bar: 'bg-slate-400/70', ring: 'border-slate-400/30 bg-slate-400/10 text-slate-300' },
    { title: t('t2Title'), what: t('t2What'), units: t('t2Units'), accent: 'text-emerald-400', bar: 'bg-emerald-400/70', ring: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400' },
    { title: t('t3Title'), what: t('t3What'), units: t('t3Units'), accent: 'text-brand-blue', bar: 'bg-brand-blue/70', ring: 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue' },
    { title: t('t4Title'), what: t('t4What'), units: t('t4Units'), accent: 'text-violet-400', bar: 'bg-violet-400/70', ring: 'border-violet-400/30 bg-violet-400/10 text-violet-400' },
  ]
  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-amber-400 mb-4">{t('heading')}</div>
      <div className="space-y-3">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className="glass glass-hover relative overflow-hidden rounded-2xl p-4 pl-5"
            style={{ marginLeft: `${i * 1.25}rem` }}
          >
            <span className={`absolute left-0 top-0 h-full w-[3px] ${tier.bar}`} />
            <div className="flex items-start gap-4">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs ${tier.ring}`}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0">
                <h3 className={`font-semibold tracking-tight text-sm ${tier.accent}`}>{tier.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mt-1">{tier.what}</p>
                <p className="text-slate-300 text-xs leading-relaxed mt-2 font-mono">{tier.units}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-slate-500 text-xs mt-4 leading-relaxed">{t('caption')}</p>
    </div>
  )
}
