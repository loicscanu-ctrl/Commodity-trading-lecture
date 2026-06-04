type Company = { name: string; note?: string }
type Group = { sub: string; companies: Company[] }

type Tier = {
  num: string
  label: string
  sub: string
  physical: boolean
  numColor: string
  textColor: string
  chipBg: string
  chipBorder: string
  rowBg: string
  groups: Group[]
}

const TIERS: Tier[] = [
  {
    num: '01',
    label: 'INDUSTRY',
    sub: 'The physical economy — real supply & demand',
    physical: true,
    numColor: 'text-amber-500/25',
    textColor: 'text-amber-400',
    chipBg: 'bg-amber-500/10',
    chipBorder: 'border-amber-500/25',
    rowBg: 'bg-amber-500/5',
    groups: [
      {
        sub: 'Integrated',
        companies: [
          { name: 'Shell' }, { name: 'BP' }, { name: 'ExxonMobil' },
          { name: 'Chevron' }, { name: 'TotalEnergies', note: '"Mag 5"' },
        ],
      },
      {
        sub: 'Producers',
        companies: [
          { name: 'Aramco' }, { name: 'ADNOC' }, { name: 'Codelco' },
          { name: 'Vale' }, { name: 'BHP' },
        ],
      },
      {
        sub: 'End Industry',
        companies: [
          { name: 'Nestlé' }, { name: 'JDE Peet\'s' }, { name: 'Panzani' },
          { name: 'Danone' }, { name: 'AB InBev' },
        ],
      },
    ],
  },
  {
    num: '02',
    label: 'TRADING HOUSES',
    sub: 'Physical intermediaries — buy, move, store, sell',
    physical: true,
    numColor: 'text-blue-500/25',
    textColor: 'text-blue-400',
    chipBg: 'bg-blue-500/10',
    chipBorder: 'border-blue-500/25',
    rowBg: 'bg-blue-500/5',
    groups: [
      {
        sub: 'Agri Giants',
        companies: [
          { name: 'ADM' }, { name: 'Bunge' }, { name: 'Cargill' },
          { name: 'Dreyfus' }, { name: 'COFCO', note: 'Chinese state' },
        ],
      },
      {
        sub: 'Energy Giants',
        companies: [
          { name: 'Vitol' }, { name: 'Trafigura' },
          { name: 'Gunvor' }, { name: 'Mercuria' },
        ],
      },
      {
        sub: 'Metals Giants',
        companies: [
          { name: 'Glencore' }, { name: 'Rio Tinto' }, { name: 'Teck' },
        ],
      },
      {
        sub: 'Specialists',
        companies: [
          { name: 'Olam' }, { name: 'Wilmar' }, { name: 'Sucden' },
        ],
      },
    ],
  },
  {
    num: '03',
    label: 'IMPORT / EXPORT',
    sub: 'Regional connectors — bridge origin to destination market',
    physical: true,
    numColor: 'text-emerald-500/25',
    textColor: 'text-emerald-400',
    chipBg: 'bg-emerald-500/10',
    chipBorder: 'border-emerald-500/25',
    rowBg: 'bg-emerald-500/5',
    groups: [
      {
        sub: 'Coffee & Softs Specialists',
        companies: [
          { name: 'Efico' }, { name: 'Sopex' }, { name: 'Touton' },
          { name: 'Neumann Gruppe' }, { name: 'Volcafé' },
        ],
      },
      {
        sub: 'Regional Exporters / Importers',
        companies: [
          { name: 'Origin agents' }, { name: 'Port agents' },
          { name: 'Local roasters' }, { name: 'Cooperative exporters' },
        ],
      },
    ],
  },
  {
    num: '04',
    label: 'FINANCIAL TRADERS',
    sub: 'Paper only — futures & derivatives, no physical delivery',
    physical: false,
    numColor: 'text-violet-500/25',
    textColor: 'text-violet-400',
    chipBg: 'bg-violet-500/10',
    chipBorder: 'border-violet-500/25',
    rowBg: 'bg-violet-500/5',
    groups: [
      {
        sub: 'Quant Funds',
        companies: [
          { name: 'Squarepoint' }, { name: 'Renaissance' },
          { name: 'Two Sigma' }, { name: 'AQR' }, { name: 'Winton' },
        ],
      },
      {
        sub: 'Investment Banks',
        companies: [
          { name: 'Goldman Sachs' }, { name: 'Morgan Stanley' }, { name: 'JP Morgan' },
        ],
      },
      {
        sub: 'Chinese Prop Desks',
        companies: [
          { name: 'Zhejiang merchants' }, { name: 'Shenzhen desks' }, { name: 'COFCO Finance' },
        ],
      },
      {
        sub: 'Retail',
        companies: [
          { name: 'CME retail' }, { name: 'IB users' }, { name: 'Algo traders' },
        ],
      },
    ],
  },
]

export default function TraderTypes() {
  return (
    <div className="mt-4 space-y-1">
      {TIERS.map((tier, ti) => (
        <div key={tier.num}>
          {/* Tier row */}
          <div className={`${tier.rowBg} border border-zinc-800/60 p-4`}>
            <div className="flex gap-4 items-start">

              {/* Left: number + label */}
              <div className="shrink-0 w-32">
                <div className={`font-mono font-black text-4xl leading-none ${tier.numColor}`}>{tier.num}</div>
                <div className={`font-mono font-bold text-xs uppercase tracking-widest mt-1 ${tier.textColor}`}>{tier.label}</div>
                <div className="text-zinc-600 font-mono text-xs mt-1 leading-tight">{tier.physical ? 'PHYSICAL' : 'PAPER ONLY'}</div>
              </div>

              {/* Right: groups */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {tier.groups.map(group => (
                    <div key={group.sub}>
                      <div className="text-zinc-600 text-xs font-mono uppercase tracking-wider mb-2">{group.sub}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.companies.map(c => (
                          <div
                            key={c.name}
                            className={`${tier.chipBg} border ${tier.chipBorder} px-2.5 py-1`}
                          >
                            <span className="text-white text-xs font-medium">{c.name}</span>
                            {c.note && (
                              <span className="text-zinc-500 text-xs ml-1">· {c.note}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Connector arrow */}
          {ti < TIERS.length - 1 && (
            <div className="flex justify-center h-3">
              <div className="w-px bg-zinc-700" />
            </div>
          )}
        </div>
      ))}

      {/* Legend */}
      <div className="flex gap-6 pt-2 border-t border-zinc-800 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-zinc-500 text-xs font-mono">Physical participant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="text-zinc-500 text-xs font-mono">Paper only — no delivery</span>
        </div>
      </div>
    </div>
  )
}
