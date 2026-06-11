'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  row1Era: { label: 'Row 1 · era', value: '500 AD · Byzantium' },
  row1Flow: { label: 'Row 1 · flow', value: 'Grain & Salt' },
  row1Value: { label: 'Row 1 · value', value: '6 gold Solidi' },
  row1Note: { label: 'Row 1 · note', value: 'price of a horse' },
  row2Era: { label: 'Row 2 · era', value: '1300 AD · Venice' },
  row2Flow: { label: 'Row 2 · flow', value: 'Spices & Wool' },
  row2Value: { label: 'Row 2 · value', value: '6 million Florins' },
  row2Note: { label: 'Row 2 · note', value: '' },
  row3Era: { label: 'Row 3 · era', value: '1700 AD · London' },
  row3Flow: { label: 'Row 3 · flow', value: 'Coffee & Copper' },
  row3Value: { label: 'Row 3 · value', value: 'Billions £ Sterling' },
  row3Note: { label: 'Row 3 · note', value: '' },
  row4Era: { label: 'Row 4 · era', value: '2026 · World' },
  row4Flow: { label: 'Row 4 · flow', value: 'Energy & Data' },
  row4Value: { label: 'Row 4 · value', value: '$100 Trillion' },
  row4Note: { label: 'Row 4 · note', value: 'mandate fulfilled' },

  formulaEyebrow: { label: 'Formula · eyebrow', value: 'The Only Calculation' },
  formulaValue: { label: 'Formula · big value', value: '1.61%' },
  formulaCaption: { label: 'Formula · caption', value: 'Net Annual Yield · Uninterrupted · 2,000 Years' },
  formulaEquation: { label: 'Formula · equation', value: 'V(t) = 1.50 × (1 + 0.0161)^1993' },

  bullet1: { label: 'Bullet 1', multiline: true, value: 'Trader owns neither field nor ship. Owns the temporary title to wheat, salt, oil.' },
  bullet2: { label: 'Bullet 2', multiline: true, value: 'If Rome burns, no factories to lose. The flow reroutes to Byzantium.' },
  bullet3: { label: 'Bullet 3', multiline: true, value: 'Physical trading is not a financial anomaly. It is the ultimate arbiter of time.' },

  tableTitle: { label: 'Table · title', value: 'Capital Through the Ages' },
  colEra: { label: 'Table · column Era', value: 'Era' },
  colFlow: { label: 'Table · column Flow', value: 'Flow Vector' },
  colValue: { label: 'Table · column Value', value: 'Value' },

  footerQuote: { label: 'Footer · quote', multiline: true, value: '“Physical commodity trading is the guardian of the world’s equilibrium.”' },
})

export default function MandateReveal() {
  const t = useVisualText(textDef)
  const TABLE = [
    { era: t('row1Era'), flow: t('row1Flow'), value: t('row1Value'), note: t('row1Note') },
    { era: t('row2Era'), flow: t('row2Flow'), value: t('row2Value'), note: t('row2Note') },
    { era: t('row3Era'), flow: t('row3Flow'), value: t('row3Value'), note: t('row3Note') },
    { era: t('row4Era'), flow: t('row4Flow'), value: t('row4Value'), note: t('row4Note') },
  ]

  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left: The formula + vehicle concept */}
      <div className="glass relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between">
        <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-500" />
        <div>
          <div className="eyebrow text-amber-400 mb-5">{t('formulaEyebrow')}</div>
          <div className="text-7xl font-mono font-bold text-amber-400 leading-none">{t('formulaValue')}</div>
          <div className="eyebrow mt-2 mb-5">{t('formulaCaption')}</div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 font-mono text-amber-300 text-sm text-center mb-5">
            {t('formulaEquation')}
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-slate-400">
            <span className="text-amber-400 shrink-0">→</span>
            <span>{t('bullet1')}</span>
          </div>
          <div className="flex items-start gap-2 text-slate-400">
            <span className="text-amber-400 shrink-0">→</span>
            <span>{t('bullet2')}</span>
          </div>
          <div className="flex items-start gap-2 text-slate-400">
            <span className="text-amber-400 shrink-0">→</span>
            <span>{t('bullet3')}</span>
          </div>
        </div>
      </div>

      {/* Right: Historical table */}
      <div className="glass rounded-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-3 border-b border-white/10">
          <div className="eyebrow">{t('tableTitle')}</div>
        </div>
        <table className="w-full text-xs font-mono flex-1">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-2.5 text-slate-500 font-normal text-left uppercase tracking-wider">{t('colEra')}</th>
              <th className="px-4 py-2.5 text-slate-500 font-normal text-left uppercase tracking-wider">{t('colFlow')}</th>
              <th className="px-4 py-2.5 text-slate-500 font-normal text-right uppercase tracking-wider">{t('colValue')}</th>
            </tr>
          </thead>
          <tbody>
            {TABLE.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.04]">
                <td className="px-4 py-3 text-slate-400">{row.era}</td>
                <td className="px-4 py-3 text-slate-300">{row.flow}</td>
                <td className="px-4 py-3 text-right">
                  <div className="text-amber-400 font-bold">{row.value}</div>
                  {row.note && <div className="text-slate-500 text-xs">{row.note}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-white/10 text-slate-500 text-xs italic">
          {t('footerQuote')}
        </div>
      </div>
    </div>
  )
}
