'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  colNum: { label: 'Column · number', value: '#' },
  colType: { label: 'Column · type', value: 'Type' },
  colLength: { label: 'Column · length', value: 'Length' },
  colBeam: { label: 'Column · beam', value: 'Beam' },
  colDraft: { label: 'Column · draft', value: 'Draft' },
  colDwt: { label: 'Column · DWT', value: 'DWT' },
  colBbl: { label: 'Column · approx. bbl', value: 'Approx. bbl' },

  t1Rank: { label: 'Tanker 1 · rank', value: '1' },
  t1Name: { label: 'Tanker 1 · name', value: 'Coastal tankers' },
  t1Length: { label: 'Tanker 1 · length', value: '205 m' },
  t1Beam: { label: 'Tanker 1 · beam', value: '29 m' },
  t1Draft: { label: 'Tanker 1 · draft', value: '16 m' },
  t1Dwt: { label: 'Tanker 1 · DWT', value: '25,000–70,000' },
  t1Bbls: { label: 'Tanker 1 · bbl', value: '~180k–525k' },

  t2Rank: { label: 'Tanker 2 · rank', value: '2' },
  t2Name: { label: 'Tanker 2 · name', value: 'Aframax' },
  t2Length: { label: 'Tanker 2 · length', value: '245 m' },
  t2Beam: { label: 'Tanker 2 · beam', value: '34 m' },
  t2Draft: { label: 'Tanker 2 · draft', value: '20 m' },
  t2Dwt: { label: 'Tanker 2 · DWT', value: '80,000–120,000' },
  t2Bbls: { label: 'Tanker 2 · bbl', value: '~600k–900k' },

  t3Rank: { label: 'Tanker 3 · rank', value: '3' },
  t3Name: { label: 'Tanker 3 · name', value: 'Suezmax' },
  t3Length: { label: 'Tanker 3 · length', value: '285 m' },
  t3Beam: { label: 'Tanker 3 · beam', value: '45 m' },
  t3Draft: { label: 'Tanker 3 · draft', value: '23 m' },
  t3Dwt: { label: 'Tanker 3 · DWT', value: '120,000–160,000' },
  t3Bbls: { label: 'Tanker 3 · bbl', value: '~900k–1.125M' },

  t4Rank: { label: 'Tanker 4 · rank', value: '4' },
  t4Name: { label: 'Tanker 4 · name', value: 'VLCC' },
  t4Length: { label: 'Tanker 4 · length', value: '350 m' },
  t4Beam: { label: 'Tanker 4 · beam', value: '55 m' },
  t4Draft: { label: 'Tanker 4 · draft', value: '28 m' },
  t4Dwt: { label: 'Tanker 4 · DWT', value: '160,000–320,000' },
  t4Bbls: { label: 'Tanker 4 · bbl', value: '~1.2M–2.4M' },

  t5Rank: { label: 'Tanker 5 · rank', value: '5' },
  t5Name: { label: 'Tanker 5 · name', value: 'ULCC' },
  t5Length: { label: 'Tanker 5 · length', value: '415 m' },
  t5Beam: { label: 'Tanker 5 · beam', value: '63 m' },
  t5Draft: { label: 'Tanker 5 · draft', value: '35 m' },
  t5Dwt: { label: 'Tanker 5 · DWT', value: '320,000+' },
  t5Bbls: { label: 'Tanker 5 · bbl', value: '~2.4M+' },

  dwtUnit: { label: 'DWT cell suffix', value: 'DWT' },

  cleanTitle: { label: 'Clean tankers · title', value: 'Clean tankers' },
  cleanCargo: { label: 'Clean tankers · cargo', value: 'Gasoline · Naphtha · Gasoil · Jet fuel' },
  cleanNote: { label: 'Clean tankers · note', multiline: true, value: 'No prior dirty cargo — inspected & certified' },
  dirtyTitle: { label: 'Dirty tankers · title', value: 'Dirty tankers' },
  dirtyCargo: { label: 'Dirty tankers · cargo', value: 'Crude oil · Fuel oil · Heavy residuals' },
  dirtyNote: { label: 'Dirty tankers · note', multiline: true, value: 'Cannot carry clean products without full tank cleaning' },
})

export default function TankerTypes() {
  const t = useVisualText(textDef)
  const TANKERS = [
    { rank: t('t1Rank'), name: t('t1Name'), length: t('t1Length'), beam: t('t1Beam'), draft: t('t1Draft'), dwt: t('t1Dwt'), bbls: t('t1Bbls') },
    { rank: t('t2Rank'), name: t('t2Name'), length: t('t2Length'), beam: t('t2Beam'), draft: t('t2Draft'), dwt: t('t2Dwt'), bbls: t('t2Bbls') },
    { rank: t('t3Rank'), name: t('t3Name'), length: t('t3Length'), beam: t('t3Beam'), draft: t('t3Draft'), dwt: t('t3Dwt'), bbls: t('t3Bbls') },
    { rank: t('t4Rank'), name: t('t4Name'), length: t('t4Length'), beam: t('t4Beam'), draft: t('t4Draft'), dwt: t('t4Dwt'), bbls: t('t4Bbls') },
    { rank: t('t5Rank'), name: t('t5Name'), length: t('t5Length'), beam: t('t5Beam'), draft: t('t5Draft'), dwt: t('t5Dwt'), bbls: t('t5Bbls') },
  ]
  return (
    <div className="mt-6">
      <div className="glass rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-white/15">
              <th className="px-3 py-2 text-amber-400 text-left font-normal uppercase tracking-wider">{t('colNum')}</th>
              <th className="px-3 py-2 text-amber-400 text-left font-normal uppercase tracking-wider">{t('colType')}</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">{t('colLength')}</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">{t('colBeam')}</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">{t('colDraft')}</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">{t('colDwt')}</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">{t('colBbl')}</th>
            </tr>
          </thead>
          <tbody>
            {TANKERS.map((tk) => (
              <tr key={tk.rank} className="border-b border-white/10 last:border-0 hover:bg-white/[0.06] transition-colors">
                <td className="px-3 py-2.5 text-slate-500">{tk.rank}</td>
                <td className="px-3 py-2.5 text-white font-semibold">{tk.name}</td>
                <td className="px-3 py-2.5 text-slate-300 text-right">{tk.length}</td>
                <td className="px-3 py-2.5 text-slate-300 text-right">{tk.beam}</td>
                <td className="px-3 py-2.5 text-slate-300 text-right">{tk.draft}</td>
                <td className="px-3 py-2.5 text-slate-400 text-right">{tk.dwt} {t('dwtUnit')}</td>
                <td className="px-3 py-2.5 text-amber-400 text-right">{tk.bbls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="glass glass-hover relative overflow-hidden rounded-2xl p-4 text-xs">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-brand-cyan" />
          <div className="eyebrow text-brand-cyan mb-1.5">{t('cleanTitle')}</div>
          <div className="text-slate-300 font-mono">{t('cleanCargo')}</div>
          <div className="text-slate-500 text-xs mt-1">{t('cleanNote')}</div>
        </div>
        <div className="glass glass-hover relative overflow-hidden rounded-2xl p-4 text-xs">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-600" />
          <div className="eyebrow text-amber-400 mb-1.5">{t('dirtyTitle')}</div>
          <div className="text-slate-300 font-mono">{t('dirtyCargo')}</div>
          <div className="text-slate-500 text-xs mt-1">{t('dirtyNote')}</div>
        </div>
      </div>
    </div>
  )
}
