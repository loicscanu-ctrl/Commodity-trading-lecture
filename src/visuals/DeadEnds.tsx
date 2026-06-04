type Tile = { label: string; verdict?: string; body: string }
type Category = { header: string; color: string; tiles: Tile[] }

const CATEGORIES: Category[] = [
  {
    header: 'Conventional Dead Ends',
    color: 'border-red-800',
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
    color: 'border-orange-800',
    tiles: [
      {
        label: 'THE INSTITUTION',
        verdict: 'TOO VISIBLE — RULE 3',
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
]

export default function DeadEnds() {
  return (
    <div className="mt-5 space-y-4">
      {CATEGORIES.map(cat => (
        <div key={cat.header}>
          <div className={`text-zinc-500 text-xs font-mono uppercase tracking-widest border-b ${cat.color} pb-1 mb-3`}>
            {cat.header}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {cat.tiles.map(tile => (
              <div key={tile.label} className="bg-zinc-900 border border-zinc-800 p-4">
                <div className="text-zinc-500 font-mono text-xs tracking-wider mb-1">{tile.label}</div>
                {tile.verdict && (
                  <div className="text-red-500 font-mono text-xs mb-2">{tile.verdict}</div>
                )}
                <p className="text-zinc-400 text-xs leading-relaxed">{tile.body}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
