'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'ICE Robusta Coffee (RC) — a deliverable, physically-settled benchmark' },
  leftTitle: { label: 'Left panel · title', value: 'Contract at a glance' },
  rightTitle: { label: 'Right panel · title', value: 'Quality ladder' },
  spec1: { label: 'Spec · symbol / size', value: 'RC · 10 tonnes per lot' },
  spec2: { label: 'Spec · quotation', value: 'US dollars per tonne (min. move $1/t)' },
  spec3: { label: 'Spec · delivery months', value: 'Jan · Mar · May · Jul · Sep · Nov' },
  spec4: { label: 'Spec · settlement', multiline: true, value: 'Physical delivery against an open futures position, via a Clearing Member' },
  spec5: { label: 'Spec · delivery points', multiline: true, value: 'ICE-registered warehouses in the EU, UK & USA' },
  spec6: { label: 'Spec · EU delivery', multiline: true, value: 'Held in a Customs Warehouse; goods retain non-Union status' },
  note: { label: 'Warehouse note', multiline: true, value: 'Delivery runs through ICE-registered warehouses: a warrant is created, sampled and graded, and can be delivered against a futures position.' },
  ladderCaption: { label: 'Ladder · caption', multiline: true, value: 'Class 1 is deliverable at the contract price; other classes settle at fixed premiums or discounts.' },
})

const SPEC_LABELS = ['Symbol · size', 'Quotation', 'Delivery months', 'Settlement', 'Delivery points', 'EU delivery']

// Quality ladder data (not editable)
const LADDER = [
  { cls: 'P', basis: '≤0.5% defects · screen 15', vsPar: '+$30/t', color: '#34d399', par: false },
  { cls: '1', basis: '≤3.0% defects · screen 14', vsPar: 'par', color: '#fff', par: true },
  { cls: '2', basis: '≤5.0% defects · screen 13', vsPar: '−$30/t', color: '#f43f5e', par: false },
  { cls: '3', basis: '≤7.5% defects · screen 13', vsPar: '−$60/t', color: '#f43f5e', par: false },
  { cls: '4', basis: '≤8.0% defects · screen 12', vsPar: '−$90/t', color: '#f43f5e', par: false },
]

export default function RobustaContract() {
  const t = useVisualText(textDef)
  const specs = [t('spec1'), t('spec2'), t('spec3'), t('spec4'), t('spec5'), t('spec6')]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-4">{t('heading')}</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT — contract specs */}
        <div className="glass glass-hover relative overflow-hidden rounded-2xl p-5 flex flex-col">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-emerald-500" />
          <h3 className="text-emerald-400 font-semibold tracking-tight text-sm uppercase mb-3">{t('leftTitle')}</h3>
          <dl className="space-y-2.5 mb-4">
            {specs.map((value, i) => (
              <div key={SPEC_LABELS[i]} className="flex items-baseline justify-between gap-3">
                <dt className="text-slate-500 text-xs uppercase tracking-wide shrink-0">{SPEC_LABELS[i]}</dt>
                <dd className="text-slate-300 text-sm text-right leading-snug">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3 flex items-start gap-2.5">
            <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 mt-0.5" fill="none" stroke="#f59e0b" strokeWidth="1.5">
              {/* warehouse: roof + walls + door */}
              <path d="M2 8 L10 3 L18 8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 8 V17 M16 8 V17 M4 17 H16" strokeLinecap="round" />
              <path d="M8 17 V12 H12 V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-slate-400 text-xs leading-relaxed">{t('note')}</p>
          </div>
        </div>

        {/* RIGHT — quality ladder */}
        <div className="glass glass-hover relative overflow-hidden rounded-2xl p-5 flex flex-col">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-500" />
          <h3 className="text-amber-400 font-semibold tracking-tight text-sm uppercase mb-3">{t('rightTitle')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-slate-500 text-xs uppercase tracking-wide font-medium py-2 pr-2">Class</th>
                <th className="text-left text-slate-500 text-xs uppercase tracking-wide font-medium py-2 pr-2">Quality basis</th>
                <th className="text-right text-slate-500 text-xs uppercase tracking-wide font-medium py-2">vs par</th>
              </tr>
            </thead>
            <tbody>
              {LADDER.map(row => (
                <tr key={row.cls} className={`border-b border-white/5 ${row.par ? 'bg-white/[0.06]' : ''}`}>
                  <td className={`py-2 pr-2 font-mono ${row.par ? 'text-white font-bold' : 'text-slate-300'}`}>{row.cls}</td>
                  <td className="py-2 pr-2 text-slate-400 text-xs leading-snug">{row.basis}</td>
                  <td className={`py-2 text-right font-mono ${row.par ? 'font-bold' : ''}`} style={{ color: row.color }}>{row.vsPar}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-auto pt-3 text-slate-500 text-xs leading-relaxed">{t('ladderCaption')}</p>
        </div>
      </div>
    </div>
  )
}
