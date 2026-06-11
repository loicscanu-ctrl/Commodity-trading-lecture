'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  cat1Header: { label: 'Category 1 · header', value: 'Conventional Dead Ends' },
  c1t1Label: { label: 'Cat 1 · Tile 1 · label', value: 'FINANCE & PAPER' },
  c1t1Body: { label: 'Cat 1 · Tile 1 · body', multiline: true, value: 'Any fiat currency or credit instrument eventually goes to zero. No empire has survived 2,000 years without a fiduciary collapse.' },
  c1t2Label: { label: 'Cat 1 · Tile 2 · label', value: 'LAND & INDUSTRY' },
  c1t2Verdict: { label: 'Cat 1 · Tile 2 · verdict', value: 'FIXED ASSET — RULE 3' },
  c1t2Body: { label: 'Cat 1 · Tile 2 · body', multiline: true, value: 'Fixed assets are targets. Without an army, land and factories are confiscated or burned at every border shift.' },
  c1t3Label: { label: 'Cat 1 · Tile 3 · label', value: 'HOARDING — GOLD' },
  c1t3Verdict: { label: 'Cat 1 · Tile 3 · verdict', value: 'STERILE — RULE 3' },
  c1t3Body: { label: 'Cat 1 · Tile 3 · body', multiline: true, value: 'Gold is the guardian of value, but it is sterile. It produces no compound interest by itself.' },

  cat2Header: { label: 'Category 2 · header', value: 'Institutional Dead Ends' },
  c2t1Label: { label: 'Cat 2 · Tile 1 · label', value: 'THE INSTITUTION' },
  c2t1Verdict: { label: 'Cat 2 · Tile 1 · verdict', value: 'TOO VISIBLE' },
  c2t1Body: { label: 'Cat 2 · Tile 1 · body', multiline: true, value: 'Too visible. The Templars learned this at their expense: the State always ends up expropriating super-institutional powers.' },
  c2t2Label: { label: 'Cat 2 · Tile 2 · label', value: 'NATURE — FORESTS' },
  c2t2Verdict: { label: 'Cat 2 · Tile 2 · verdict', value: 'REQUISITIONED — RULE 3' },
  c2t2Body: { label: 'Cat 2 · Tile 2 · body', multiline: true, value: 'Strategic resource requisitioned by Kings to build their fleets. Incompatible with the Anonymity of the Servant.' },
  c2t3Label: { label: 'Cat 2 · Tile 3 · label', value: 'HUMAN CAPITAL' },
  c2t3Verdict: { label: 'Cat 2 · Tile 3 · verdict', value: 'NON-TRANSFERABLE' },
  c2t3Body: { label: 'Cat 2 · Tile 3 · body', multiline: true, value: 'Knowledge dies with the man. Transmission is subject to the Anonymity Rule and does not capitalise the initial asset.' },

  cat3Header: { label: 'Category 3 · header', value: 'Dynamic Dead Ends — The Flow Traps' },
  c3t1Label: { label: 'Cat 3 · Tile 1 · label', value: 'PURE FX — CURRENCY ARBITRAGE' },
  c3t1Verdict: { label: 'Cat 3 · Tile 1 · verdict', value: 'AUDIT FAILURE' },
  c3t1Body: { label: 'Cat 3 · Tile 1 · body', multiline: true, value: 'For 1,000 years, the Church condemned money making money without real physical risk. Usury — grounds for excommunication and seizure.' },
  c3t2Label: { label: 'Cat 3 · Tile 2 · label', value: 'PURE LOGISTICS — OWNING SHIPS' },
  c3t2Verdict: { label: 'Cat 3 · Tile 2 · verdict', value: 'RISK FAILURE — RULE 3' },
  c3t2Body: { label: 'Cat 3 · Tile 2 · body', multiline: true, value: 'Heavy fixed assets (ship, cart) are systematically requisitioned by the State in times of war. The shipowner loses everything. The trader simply changes ships.' },
})

type Tile = { label: string; verdict?: string; body: string }
type Category = { header: string; color: string; tiles: Tile[] }

const ACCENT: Record<string, { rail: string; dot: string }> = {
  rose: { rail: 'bg-rose-500', dot: 'bg-rose-400' },
  amber: { rail: 'bg-amber-500', dot: 'bg-amber-400' },
  violet: { rail: 'bg-violet-500', dot: 'bg-violet-400' },
}

export default function DeadEnds() {
  const t = useVisualText(textDef)
  const CATEGORIES: Category[] = [
    {
      header: t('cat1Header'),
      color: 'rose',
      tiles: [
        { label: t('c1t1Label'), body: t('c1t1Body') },
        { label: t('c1t2Label'), verdict: t('c1t2Verdict'), body: t('c1t2Body') },
        { label: t('c1t3Label'), verdict: t('c1t3Verdict'), body: t('c1t3Body') },
      ],
    },
    {
      header: t('cat2Header'),
      color: 'amber',
      tiles: [
        { label: t('c2t1Label'), verdict: t('c2t1Verdict'), body: t('c2t1Body') },
        { label: t('c2t2Label'), verdict: t('c2t2Verdict'), body: t('c2t2Body') },
        { label: t('c2t3Label'), verdict: t('c2t3Verdict'), body: t('c2t3Body') },
      ],
    },
    {
      header: t('cat3Header'),
      color: 'violet',
      tiles: [
        { label: t('c3t1Label'), verdict: t('c3t1Verdict'), body: t('c3t1Body') },
        { label: t('c3t2Label'), verdict: t('c3t2Verdict'), body: t('c3t2Body') },
      ],
    },
  ]

  return (
    <div className="mt-5 space-y-6">
      {CATEGORIES.map(cat => {
        const accent = ACCENT[cat.color] ?? ACCENT.rose
        return (
        <div key={cat.header}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
            <span className="eyebrow">{cat.header}</span>
          </div>
          <div className={`grid gap-3 ${cat.tiles.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {cat.tiles.map(tile => (
              <div key={tile.label} className="glass glass-hover relative overflow-hidden rounded-2xl p-5">
                <span className={`absolute left-0 top-0 h-full w-[3px] ${accent.rail}`} />
                <div className="eyebrow mb-2">{tile.label}</div>
                {tile.verdict && (
                  <div className="chip border-rose-500/30 bg-rose-500/10 text-rose-400 mb-2">{tile.verdict}</div>
                )}
                <p className="text-slate-400 text-xs leading-relaxed">{tile.body}</p>
              </div>
            ))}
          </div>
        </div>
        )
      })}
    </div>
  )
}
