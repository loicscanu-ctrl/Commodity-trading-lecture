'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Brent is a basket, not a single grade' },
  grade1Name: { label: 'Grade 1 · name', value: 'Brent Ninian Blend (BNB)' },
  grade2Name: { label: 'Grade 2 · name', value: 'Forties' },
  grade3Name: { label: 'Grade 3 · name', value: 'Oseberg' },
  grade4Name: { label: 'Grade 4 · name', value: 'Ekofisk' },
  grade5Name: { label: 'Grade 5 · name', value: 'Troll' },
  grade6Name: { label: 'Grade 6 · name', value: 'WTI (CIF Rotterdam, netted back)' },
  caption: { label: 'Caption', multiline: true, value: 'On any day the cheapest grade in the basket sets Dated Brent — the seller delivers the least valuable grade they can.' },
})

export default function BrentBasket() {
  const t = useVisualText(textDef)

  // Sample FOB values ($/bbl) — kept in code, not editable, so the min stays correct.
  const grades = [
    { name: t('grade1Name'), value: 82.10 },
    { name: t('grade2Name'), value: 81.85 },
    { name: t('grade3Name'), value: 82.40 },
    { name: t('grade4Name'), value: 82.30 },
    { name: t('grade5Name'), value: 82.55 },
    { name: t('grade6Name'), value: 82.20 },
  ]

  const minValue = Math.min(...grades.map(g => g.value))
  const winner = grades.find(g => g.value === minValue)!
  const fmt = (n: number) => `$${n.toFixed(2)}`

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-1">BFOET basket · 6 light crude grades</div>
      <h3 className="text-white font-semibold tracking-tight text-base mb-4">{t('heading')}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {grades.map((g, i) => {
          const isWinner = g.value === minValue
          return (
            <div
              key={i}
              className={
                'relative rounded-xl p-3 transition ' +
                (isWinner
                  ? 'border-2 border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40'
                  : 'glass glass-hover border border-white/5')
              }
            >
              {isWinner && (
                <span className="chip absolute -top-2 right-2 bg-amber-500 text-[10px] font-semibold text-black">
                  SETS DATED
                </span>
              )}
              <div className="text-slate-300 text-xs leading-snug min-h-[2.5rem]">{g.name}</div>
              <div
                className={
                  'mt-2 font-mono text-lg ' + (isWinner ? 'text-amber-400' : 'text-white')
                }
              >
                {fmt(g.value)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Funnel / arrow down to the result */}
      <div className="flex flex-col items-center my-4">
        <svg width="40" height="34" viewBox="0 0 40 34" aria-hidden="true">
          <path d="M4 2 L36 2 L23 20 L23 32 L17 32 L17 20 Z" fill="#f59e0b" fillOpacity="0.18" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="rounded-xl border-2 border-amber-500 bg-amber-500/10 p-4 text-center">
        <div className="eyebrow text-amber-400 mb-1">Published price</div>
        <div className="text-white font-semibold text-lg">
          Dated Brent = <span className="font-mono text-amber-400">{fmt(minValue)}</span>
          <span className="text-slate-300 font-normal text-sm"> — set by the cheapest grade ({winner.name})</span>
        </div>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed mt-4">{t('caption')}</p>
    </div>
  )
}
