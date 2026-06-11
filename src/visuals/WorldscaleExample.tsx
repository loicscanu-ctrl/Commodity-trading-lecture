'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  explainTitle: { label: 'Explanation · title', value: 'What is Worldscale?' },
  explainBody: { label: 'Explanation · body', multiline: true, value: 'Worldscale (W) is a standard freight rate schedule used in tanker markets. W100 = the flat rate (Worldscale Association rate) for a specific route. The actual market freight is quoted as a percentage: W130 = 130% of the flat rate.' },
  formulaLabel: { label: 'Explanation · formula label', value: 'Formula' },
  formulaValue: { label: 'Explanation · formula value', value: 'Flat rate × (W / 100)' },
  voyageCostLabel: { label: 'Explanation · voyage cost label', value: 'Voyage cost' },
  voyageCostValue: { label: 'Explanation · voyage cost value', value: 'Cargo (MT) × Actual rate' },

  exampleTitle: { label: 'Example · title', value: 'Worked Example' },
  routeLabel: { label: 'Example · route label', value: 'Route' },
  routeValue: { label: 'Example · route value', value: 'Primorsk → Rotterdam' },
  cargoLabel: { label: 'Example · cargo label', value: 'Cargo' },
  cargoValue: { label: 'Example · cargo value', value: '80,000 MT' },
  flatRateLabel: { label: 'Example · flat rate label', value: 'Flat rate' },
  flatRateValue: { label: 'Example · flat rate value', value: '$4.68/MT' },
  marketRateLabel: { label: 'Example · market rate label', value: 'Market rate' },
  marketRateValue: { label: 'Example · market rate value', value: 'W130' },

  actualFreightLabel: { label: 'Example · actual freight label', value: 'Actual freight rate' },
  actualFreightPrefix: { label: 'Example · actual freight expression', value: '$4.68 × 130/100 = ' },
  actualFreightSuffix: { label: 'Example · actual freight unit', value: '/MT' },
  totalCostLabel: { label: 'Example · total cost label', value: 'Total voyage cost' },
  totalCostPrefix: { label: 'Example · total cost expression', value: '80,000 × $' },
  totalCostMid: { label: 'Example · total cost equals', value: ' = ' },

  keyTermsTitle: { label: 'Key terms · title', value: 'Key terms' },
  laytimeTerm: { label: 'Key terms · laytime', value: 'Laytime' },
  laytimeDef: { label: 'Key terms · laytime definition', multiline: true, value: ' — agreed time to load/discharge. Lay-can = layday + cancellation date.' },
  demurrageTerm: { label: 'Key terms · demurrage', value: 'Demurrage' },
  demurrageDef: { label: 'Key terms · demurrage definition', multiline: true, value: ' — penalty rate per day when laytime is exceeded during loading or discharge.' },
})

export default function WorldscaleExample() {
  const t = useVisualText(textDef)
  const flatRate = 4.68
  const marketRate = 130
  const cargo = 80000
  const actualRate = (flatRate * marketRate / 100)
  const voyageCost = cargo * actualRate

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Worldscale explanation */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 text-xs font-mono">
        <div className="eyebrow mb-3">{t('explainTitle')}</div>
        <div className="text-slate-300 leading-relaxed mb-3">
          {t('explainBody')}
        </div>
        <div className="border-t border-white/10 pt-3 space-y-1.5">
          <div className="flex justify-between"><span className="text-slate-500">{t('formulaLabel')}</span><span className="text-slate-100">{t('formulaValue')}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">{t('voyageCostLabel')}</span><span className="text-slate-100">{t('voyageCostValue')}</span></div>
        </div>
      </div>

      {/* Worked example */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.07] p-5 font-mono text-xs">
        <div className="eyebrow mb-3">{t('exampleTitle')}</div>
        <div className="space-y-1.5">
          <div className="flex justify-between"><span className="text-slate-500">{t('routeLabel')}</span><span className="text-slate-100">{t('routeValue')}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">{t('cargoLabel')}</span><span className="text-slate-100">{t('cargoValue')}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">{t('flatRateLabel')}</span><span className="text-slate-100">{t('flatRateValue')}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">{t('marketRateLabel')}</span><span className="text-amber-300 font-bold">{t('marketRateValue')}</span></div>
        </div>

        <div className="border-t border-white/10 mt-3 pt-3 space-y-2">
          <div>
            <div className="text-slate-500 mb-1">{t('actualFreightLabel')}</div>
            <div className="text-slate-100">{t('actualFreightPrefix')}<span className="text-amber-300 font-bold">${actualRate.toFixed(3)}{t('actualFreightSuffix')}</span></div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">{t('totalCostLabel')}</div>
            <div className="text-slate-100">{t('totalCostPrefix')}{actualRate.toFixed(3)}{t('totalCostMid')}<span className="text-emerald-300 font-bold">${voyageCost.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-3 pt-3 space-y-1">
          <div className="eyebrow mb-1.5">{t('keyTermsTitle')}</div>
          <div className="text-slate-400"><span className="text-slate-200">{t('laytimeTerm')}</span>{t('laytimeDef')}</div>
          <div className="text-slate-400 mt-1"><span className="text-slate-200">{t('demurrageTerm')}</span>{t('demurrageDef')}</div>
        </div>
      </div>
    </div>
  )
}
