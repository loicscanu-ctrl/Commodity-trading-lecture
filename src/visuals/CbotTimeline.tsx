'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'From harvest chaos to the futures exchange — the chronology' },
  t1840s: {
    label: '1840s one-liner',
    multiline: true,
    value: 'Wagons of Midwest grain flood a city with too little storage: prices collapse at harvest (grain dumped in Lake Michigan), then soar by spring. No reference price, no protection in advance.',
  },
  t1848: {
    label: '1848 one-liner',
    multiline: true,
    value: '82 merchants found the Chicago Board of Trade: one floor, deals struck in public. The quoted, visible price replaces the private haggle.',
  },
  t1850s: {
    label: '1850s one-liner',
    multiline: true,
    value: 'The telegraph carries the Chicago quote across the country: one price, known by everyone, everywhere — the reference price scales.',
  },
  t1865: {
    label: '1865 one-liner',
    multiline: true,
    value: 'The CBOT standardises the "to-arrive" promises — fixed grades, lot sizes, delivery months — and requires MARGIN from both sides. The forward becomes a futures contract: tradeable and transferable.',
  },
  t1925: {
    label: '1925 one-liner',
    multiline: true,
    value: 'A full clearing house guarantees every CBOT trade: the exchange steps between buyer and seller. The olive-oil failure — your counterparty walks away exactly when the contract is worth most — becomes structurally impossible.',
  },
  today: {
    label: 'Today one-liner',
    multiline: true,
    value: 'Every modern exchange — CME, ICE, LME — is the same three-part invention: a public price, a way to fix it in advance, and a guarantee that the promise holds.',
  },
})

const STEPS = [
  { year: '1840s', title: 'Harvest chaos in Chicago', key: 't1840s' as const, tag: 'the problem', color: '#f43f5e' },
  { year: '1848', title: 'The CBOT is founded', key: 't1848' as const, tag: 'reference price', color: '#22d3ee' },
  { year: '1850s', title: 'The telegraph spreads the quote', key: 't1850s' as const, tag: 'reference price', color: '#22d3ee' },
  { year: '1865', title: '“To-arrive” becomes the futures contract', key: 't1865' as const, tag: 'protection in advance', color: '#f59e0b' },
  { year: '1925', title: 'The clearing house guarantee', key: 't1925' as const, tag: 'no counterparty risk', color: '#34d399' },
  { year: 'Today', title: 'CME · ICE · LME', key: 'today' as const, tag: 'the same invention', color: '#8b5cf6' },
]

export default function CbotTimeline() {
  const t = useVisualText(textDef)
  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-4">{t('heading')}</div>
      <div className="relative pl-6">
        {/* the spine */}
        <span className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-rose-500/60 via-amber-500/50 to-violet-500/60" />
        <div className="space-y-4">
          {STEPS.map(s => (
            <div key={s.year} className="relative">
              <span
                className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#070912]"
                style={{ background: s.color }}
              />
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border px-2 py-px font-mono text-[11px] font-bold tabular-nums"
                    style={{ borderColor: `${s.color}66`, color: s.color, background: `${s.color}14` }}>
                    {s.year}
                  </span>
                  <span className="font-semibold text-[13px] text-white">{s.title}</span>
                  <span className="ml-auto rounded bg-white/[0.05] px-1.5 py-px font-mono text-[9px] uppercase tracking-wide text-slate-400">
                    {s.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{t(s.key)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
