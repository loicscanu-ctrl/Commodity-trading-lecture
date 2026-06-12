'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Price · Volume · Open Interest' },
  caption: { label: 'Caption', multiline: true, value: 'Volume and open interest confirm — or undermine — what price is doing.' },
  col1: { label: 'Column 1', value: 'Price' },
  col2: { label: 'Column 2', value: 'Volume' },
  col3: { label: 'Column 3', value: 'Open Interest' },
  col4: { label: 'Column 4', value: 'Market signal' },
  // Row 1 — strong / bullish
  r1Price: { label: 'Row 1 · price', value: 'Rising' },
  r1Vol: { label: 'Row 1 · volume', value: 'Increasing' },
  r1Oi: { label: 'Row 1 · open interest', value: 'Up' },
  r1Signal: { label: 'Row 1 · signal', value: 'Strong / bullish' },
  // Row 2 — weak / bearish
  r2Price: { label: 'Row 2 · price', value: 'Falling' },
  r2Vol: { label: 'Row 2 · volume', value: 'Increasing' },
  r2Oi: { label: 'Row 2 · open interest', value: 'Up' },
  r2Signal: { label: 'Row 2 · signal', value: 'Weak / bearish' },
  // Row 3 — weakening / short covering
  r3Price: { label: 'Row 3 · price', value: 'Rising' },
  r3Vol: { label: 'Row 3 · volume', value: 'Decreasing' },
  r3Oi: { label: 'Row 3 · open interest', value: 'Down' },
  r3Signal: { label: 'Row 3 · signal', value: 'Weakening — short covering' },
  // Row 4 — strengthening / long liquidation
  r4Price: { label: 'Row 4 · price', value: 'Falling' },
  r4Vol: { label: 'Row 4 · volume', value: 'Decreasing' },
  r4Oi: { label: 'Row 4 · open interest', value: 'Down' },
  r4Signal: { label: 'Row 4 · signal', value: 'Strengthening — long liquidation' },
})

type Dir = 'up' | 'down'
type Sentiment = 'bull' | 'bear' | 'amber' | 'cyan'

const priceClass = (dir: Dir) =>
  dir === 'up' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'

const signalClass = (s: Sentiment) => {
  switch (s) {
    case 'bull': return 'bg-emerald-500/15 text-emerald-300'
    case 'bear': return 'bg-rose-500/15 text-rose-300'
    case 'amber': return 'bg-amber-500/15 text-amber-300'
    case 'cyan': return 'bg-cyan-500/15 text-cyan-300'
  }
}

export default function PriceVolumeOI() {
  const t = useVisualText(textDef)

  const rows: { price: string; priceDir: Dir; vol: string; oi: string; signal: string; sentiment: Sentiment }[] = [
    { price: t('r1Price'), priceDir: 'up', vol: t('r1Vol'), oi: t('r1Oi'), signal: t('r1Signal'), sentiment: 'bull' },
    { price: t('r2Price'), priceDir: 'down', vol: t('r2Vol'), oi: t('r2Oi'), signal: t('r2Signal'), sentiment: 'bear' },
    { price: t('r3Price'), priceDir: 'up', vol: t('r3Vol'), oi: t('r3Oi'), signal: t('r3Signal'), sentiment: 'amber' },
    { price: t('r4Price'), priceDir: 'down', vol: t('r4Vol'), oi: t('r4Oi'), signal: t('r4Signal'), sentiment: 'cyan' },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-cyan-300 mb-4">{t('heading')}</div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-white/[0.04] text-slate-300">
              <th className="text-left font-semibold px-4 py-3">{t('col1')}</th>
              <th className="text-left font-semibold px-4 py-3">{t('col2')}</th>
              <th className="text-left font-semibold px-4 py-3">{t('col3')}</th>
              <th className="text-left font-semibold px-4 py-3">{t('col4')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-white/[0.06]">
                <td className={`px-4 py-3 ${priceClass(r.priceDir)}`}>{r.price}</td>
                <td className="px-4 py-3 text-slate-300">{r.vol}</td>
                <td className="px-4 py-3 text-slate-300">{r.oi}</td>
                <td className="px-4 py-3">
                  <span className={`chip ${signalClass(r.sentiment)} font-medium`}>{r.signal}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-slate-500 text-xs mt-4">{t('caption')}</p>
    </div>
  )
}
