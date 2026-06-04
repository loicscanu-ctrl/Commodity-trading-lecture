type Group = { name: string; desc: string; examples: string[] }

type Tier = {
  label: string
  sublabel: string
  borderColor: string
  textColor: string
  gridCols: string
  groups: Group[]
}

const TIERS: Tier[] = [
  {
    label: 'TIER 1 — INDUSTRY',
    sublabel: 'The Physical Economy — real supply & demand',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-400',
    gridCols: 'grid-cols-1 sm:grid-cols-3',
    groups: [
      {
        name: 'Integrated',
        desc: '"Mag 5" — own production, refining & retail',
        examples: ['Shell', 'BP', 'ExxonMobil', 'Chevron', 'TotalEnergies'],
      },
      {
        name: 'Producers',
        desc: 'National oil companies, miners, farmers',
        examples: ['Aramco', 'ADNOC', 'Codelco', 'Vale'],
      },
      {
        name: 'End Industry',
        desc: 'Manufacturers & processors (the demand side)',
        examples: ["Nestlé", "JDE Peet's", 'Panzani', 'Danone'],
      },
    ],
  },
  {
    label: 'TIER 2 — TRADING HOUSES',
    sublabel: 'Physical intermediaries — buy, move, store, sell',
    borderColor: 'border-blue-600',
    textColor: 'text-blue-400',
    gridCols: 'grid-cols-2 sm:grid-cols-4',
    groups: [
      {
        name: 'Agri Giants',
        desc: 'Grains, oilseeds, softs',
        examples: ['ADM', 'Bunge', 'Cargill', 'Dreyfus'],
      },
      {
        name: 'Energy Giants',
        desc: 'Crude, products, LNG',
        examples: ['Vitol', 'Trafigura', 'Gunvor', 'Mercuria'],
      },
      {
        name: 'Metals Giants',
        desc: 'Base metals, minerals, coal',
        examples: ['Glencore', 'Rio Tinto', 'Teck'],
      },
      {
        name: 'Specialists',
        desc: 'Niche origins & processing',
        examples: ['Olam', 'COFCO', 'Wilmar', 'Louis Dreyfus Softs'],
      },
    ],
  },
  {
    label: 'TIER 3 — IMPORTERS & EXPORTERS',
    sublabel: 'Regional connectors — bridge origin to destination',
    borderColor: 'border-emerald-600',
    textColor: 'text-emerald-400',
    gridCols: 'grid-cols-1 sm:grid-cols-2',
    groups: [
      {
        name: 'Exporters',
        desc: 'Bridge local producers to international markets. Often origin-country specialists.',
        examples: ['Origin agents', 'Local export companies', 'Cooperative exporters'],
      },
      {
        name: 'Importers',
        desc: 'Distribute foreign commodity in domestic markets. Last mile before the factory.',
        examples: ['Port agents', 'Local distributors', 'Roasters & processors'],
      },
    ],
  },
  {
    label: 'TIER 4 — FINANCIAL TRADERS',
    sublabel: 'Paper only — futures & derivatives, no physical delivery',
    borderColor: 'border-violet-600',
    textColor: 'text-violet-400',
    gridCols: 'grid-cols-2 sm:grid-cols-4',
    groups: [
      {
        name: 'Quant Funds',
        desc: 'Systematic, model-driven strategies across the forward curve',
        examples: ['Renaissance', 'Two Sigma', 'AQR', 'Winton'],
      },
      {
        name: 'Banks',
        desc: 'Commodity index products, structured notes, prop desks',
        examples: ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan'],
      },
      {
        name: 'Chinese Prop',
        desc: 'Proprietary trading on SHFE, DCE, ZCE — massive volumes',
        examples: ['Zhejiang merchants', 'Shenzhen prop desks', 'COFCO Finance'],
      },
      {
        name: 'Retail',
        desc: 'Individual speculators via futures platforms',
        examples: ['CME retail', 'Interactive Brokers users', 'Robinhood traders'],
      },
    ],
  },
]

export default function TraderTypes() {
  return (
    <div className="mt-5 space-y-2">
      {TIERS.map((tier, ti) => (
        <div key={tier.label}>
          {/* Tier header */}
          <div className={`border-l-2 ${tier.borderColor} pl-3 mb-2 flex items-baseline gap-3`}>
            <span className={`text-xs font-mono font-bold ${tier.textColor} tracking-wider`}>{tier.label}</span>
            <span className="text-zinc-600 text-xs font-mono">{tier.sublabel}</span>
          </div>

          {/* Groups */}
          <div className={`grid ${tier.gridCols} gap-2`}>
            {tier.groups.map(group => (
              <div key={group.name} className="bg-zinc-900 border border-zinc-800 p-3">
                <div className={`text-xs font-mono font-bold ${tier.textColor} mb-1 uppercase tracking-wide`}>
                  {group.name}
                </div>
                <div className="text-zinc-500 text-xs mb-2 leading-relaxed">{group.desc}</div>
                <div className="flex flex-wrap gap-1">
                  {group.examples.map(ex => (
                    <span key={ex} className="text-zinc-400 text-xs bg-zinc-800 border border-zinc-700 px-1.5 py-0.5">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Downward arrow between tiers */}
          {ti < TIERS.length - 1 && (
            <div className="flex justify-center py-1">
              <svg width="20" height="14" viewBox="0 0 20 14">
                <line x1="10" y1="0" x2="10" y2="8" stroke="#3f3f46" strokeWidth="1.5" />
                <polyline points="4,5 10,13 16,5" fill="none" stroke="#3f3f46" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
