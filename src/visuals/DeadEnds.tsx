type Tile = { label: string; verdict?: string; body: string }
type Category = { header: string; color: string; tiles: Tile[] }

const CATEGORIES: Category[] = [
  {
    header: 'Conventional Dead Ends',
    color: 'rose',
    tiles: [
      {
        label: 'FINANCE & PAPER',
        body: 'Any fiat currency or credit instrument eventually goes to zero. No empire has survived 2,000 years without a fiduciary collapse.',
      },
      {
        label: 'LAND & INDUSTRY',
        verdict: 'FIXED ASSET — RULE 3',
        body: 'Fixed assets are targets. Without an army, land and factories are confiscated or burned at every border shift.',
      },
      {
        label: 'HOARDING — GOLD',
        verdict: 'STERILE — RULE 3',
        body: 'Gold is the guardian of value, but it is sterile. It produces no compound interest by itself.',
      },
    ],
  },
  {
    header: 'Institutional Dead Ends',
    color: 'amber',
    tiles: [
      {
        label: 'THE INSTITUTION',
        verdict: 'TOO VISIBLE',
        body: 'Too visible. The Templars learned this at their expense: the State always ends up expropriating super-institutional powers.',
      },
      {
        label: 'NATURE — FORESTS',
        verdict: 'REQUISITIONED — RULE 3',
        body: 'Strategic resource requisitioned by Kings to build their fleets. Incompatible with the Anonymity of the Servant.',
      },
      {
        label: 'HUMAN CAPITAL',
        verdict: 'NON-TRANSFERABLE',
        body: 'Knowledge dies with the man. Transmission is subject to the Anonymity Rule and does not capitalise the initial asset.',
      },
    ],
  },
  {
    header: 'Dynamic Dead Ends — The Flow Traps',
    color: 'violet',
    tiles: [
      {
        label: 'PURE FX — CURRENCY ARBITRAGE',
        verdict: 'AUDIT FAILURE',
        body: 'For 1,000 years, the Church condemned money making money without real physical risk. Usury — grounds for excommunication and seizure.',
      },
      {
        label: 'PURE LOGISTICS — OWNING SHIPS',
        verdict: 'RISK FAILURE — RULE 3',
        body: 'Heavy fixed assets (ship, cart) are systematically requisitioned by the State in times of war. The shipowner loses everything. The trader simply changes ships.',
      },
    ],
  },
]

const ACCENT: Record<string, { rail: string; dot: string }> = {
  rose: { rail: 'bg-rose-500', dot: 'bg-rose-400' },
  amber: { rail: 'bg-amber-500', dot: 'bg-amber-400' },
  violet: { rail: 'bg-violet-500', dot: 'bg-violet-400' },
}

export default function DeadEnds() {
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
