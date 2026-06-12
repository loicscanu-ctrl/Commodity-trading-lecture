'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Eyebrow · heading', value: 'Demurrage — who pays whom' },
  caption: { label: 'Caption', multiline: true, value: 'Demurrage flows along the contractual chain — each party recovers from the next.' },
  colBlank: { label: 'Column · blank header', value: '' },
  colPayor: { label: 'Column · payor header', value: 'Payor (gets the invoice)' },
  colPayee: { label: 'Column · payee header', value: 'Payee (sends the invoice)' },
  rowLoadLabel: { label: 'Row load · label', value: 'At load port' },
  rowLoadPayor: { label: 'Row load · payor', value: 'FOB Seller' },
  rowLoadPayee: { label: 'Row load · payee', value: 'FOB Buyer' },
  rowDischargeLabel: { label: 'Row discharge · label', value: 'At discharge port' },
  rowDischargePayor: { label: 'Row discharge · payor', value: 'CIF / CFR / DES Buyer' },
  rowDischargePayee: { label: 'Row discharge · payee', value: 'CIF / CFR / DES Seller' },
  rowVoyageLabel: { label: 'Row voyage · label', value: 'Voyage (charter party)' },
  rowVoyagePayor: { label: 'Row voyage · payor', value: 'Charterer' },
  rowVoyagePayee: { label: 'Row voyage · payee', value: 'Shipowner' },
})

export default function DemurrageWhoPays() {
  const t = useVisualText(textDef)
  const rows = [
    { label: t('rowLoadLabel'), payor: t('rowLoadPayor'), payee: t('rowLoadPayee') },
    { label: t('rowDischargeLabel'), payor: t('rowDischargePayor'), payee: t('rowDischargePayee') },
    { label: t('rowVoyageLabel'), payor: t('rowVoyagePayor'), payee: t('rowVoyagePayee') },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-emerald-400 mb-4">{t('heading')}</div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-emerald-500/10">
              <th className="text-left font-semibold text-emerald-300 px-4 py-3 rounded-l-lg">{t('colBlank')}</th>
              <th className="text-left font-semibold text-emerald-300 px-4 py-3">{t('colPayor')}</th>
              <th className="text-left font-semibold text-emerald-300 px-4 py-3 rounded-r-lg">{t('colPayee')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-white/10 last:border-b-0">
                <td className="px-4 py-3 font-medium text-slate-300">{r.label}</td>
                <td className="px-4 py-3 text-white">{r.payor}</td>
                <td className="px-4 py-3 text-white">{r.payee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-500 text-xs mt-4">{t('caption')}</p>
    </div>
  )
}
