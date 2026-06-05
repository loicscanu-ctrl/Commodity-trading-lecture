'use client'

import { useState } from 'react'

type CompanyInfo = {
  full: string
  type: string
  hq: string
  stat: string
  description: string
}

const INFO: Record<string, CompanyInfo> = {
  // ── INTEGRATED ──
  'Shell':        { full: 'Shell plc', type: 'Integrated Major', hq: 'London / The Hague', stat: '$380B+ revenue', description: 'One of the five "Supermajors". Exploration, refining, LNG, chemicals and retail. Major trader of crude and petroleum products globally.' },
  'BP':           { full: 'BP plc', type: 'Integrated Major', hq: 'London', stat: '$250B+ revenue', description: 'Supermajor undergoing energy transition. Strong in North Sea, Azerbaijan, Gulf of Mexico. One of the first majors to announce net-zero targets.' },
  'ExxonMobil':   { full: 'ExxonMobil Corporation', type: 'Integrated Major', hq: 'Spring, Texas', stat: '$400B+ revenue', description: 'Largest US oil company. Vertically integrated in refining & petrochemicals. Major producer in the Permian Basin and Guyana.' },
  'Chevron':      { full: 'Chevron Corporation', type: 'Integrated Major', hq: 'San Ramon, California', stat: '$200B+ revenue', description: 'US integrated major, strong in Permian, Gulf of Mexico, Kazakhstan (Tengiz). Acquired Hess in 2024 for Guyana access.' },
  'TotalEnergies':{ full: 'TotalEnergies SE', type: 'Integrated Major', hq: 'Courbevoie, France', stat: '€240B+ revenue', description: 'French Supermajor — rebranded from Total. European leader in LNG trading. Strong presence in Africa and Middle East.' },
  // ── PRODUCERS ──
  'Aramco':       { full: 'Saudi Aramco', type: 'National Oil Company', hq: 'Dhahran, Saudi Arabia', stat: '$600B+ revenue · 12 Mbbl/day', description: 'Largest oil company in the world by production and market cap ($2T+). Saudi state-owned. Controls the world\'s second-largest proven reserves.' },
  'ADNOC':        { full: 'Abu Dhabi National Oil Company', type: 'National Oil Company', hq: 'Abu Dhabi, UAE', stat: '4 Mbbl/day capacity', description: 'UAE\'s state oil company. Aggressively expanding refining, petrochemicals and LNG capacity. Increasingly active in international trading.' },
  'Codelco':      { full: 'Corporación Nacional del Cobre de Chile', type: 'National Mining Company', hq: 'Santiago, Chile', stat: '~1.7M MT copper/year', description: 'World\'s largest copper producer. Chilean state-owned. Pivotal to global copper supply — its production data moves the market.' },
  'Vale':         { full: 'Vale S.A.', type: 'Mining Giant', hq: 'Rio de Janeiro, Brazil', stat: '$54B revenue', description: 'World\'s largest iron ore and nickel producer. Major supplier to Chinese steel mills. Brumadinho dam disaster (2019) reshaped its ESG obligations.' },
  'BHP':          { full: 'BHP Group', type: 'Mining Giant', hq: 'Melbourne, Australia', stat: '$55B+ revenue', description: 'Diversified Australian-British miner. Iron ore, copper, coal and potash. One of the largest suppliers to Asian commodity markets.' },
  // ── END INDUSTRY ──
  'Nestlé':       { full: 'Nestlé S.A.', type: 'Agri End-User', hq: 'Vevey, Switzerland', stat: 'CHF 93B revenue', description: 'World\'s largest food company. One of the biggest buyers of coffee, cocoa and dairy. Drives sustainability standards upstream (EUDR, Rainforest Alliance).' },
  "JDE Peet's":   { full: 'Jacobs Douwe Egberts Peet\'s', type: 'Coffee End-User', hq: 'Amsterdam', stat: '€9B+ revenue', description: 'World\'s largest pure-play coffee company. Owns Douwe Egberts, L\'Or, Senseo. One of the largest Robusta and Arabica buyers in Europe.' },
  'Panzani':      { full: 'Panzani SAS', type: 'Agri End-User', hq: 'Lyon, France', stat: 'Subsidiary of Ebro Foods', description: 'Major French pasta manufacturer and significant durum wheat buyer. Sensitive to wheat price movements and origins.' },
  'Danone':       { full: 'Danone S.A.', type: 'Agri End-User', hq: 'Paris, France', stat: '€27B revenue', description: 'French food multinational — dairy, waters, nutrition. Major buyer of sugar, milk powder, vegetable oils. Active in sustainable sourcing.' },
  'AB InBev':     { full: 'Anheuser-Busch InBev', type: 'Agri End-User', hq: 'Leuven, Belgium', stat: '$59B revenue', description: 'World\'s largest brewer. Major buyer of barley, hops, corn, rice. Deeply involved in agricultural supply chain management globally.' },
  // ── AGRI GIANTS ──
  'ADM':          { full: 'Archer Daniels Midland', type: 'Agri Trading House', hq: 'Chicago, USA', stat: '$100B+ revenue', description: 'One of the ABCD giants. Grain origination, oilseed processing, ethanol. Major in North American corn and soy supply chains.' },
  'Bunge':        { full: 'Bunge Limited', type: 'Agri Trading House', hq: 'St. Louis, USA', stat: '$67B revenue', description: 'Global agri supply chain — oilseed processing, grain trading. Strong in Brazil and Argentina origination. Merging with Viterra.' },
  'Cargill':      { full: 'Cargill, Incorporated', type: 'Agri Trading House', hq: 'Minnetonka, USA', stat: '$165B revenue (private)', description: 'Largest private company in the US. Grains, oilseeds, meat, financial. Presence in 70+ countries across the entire food chain.' },
  'Dreyfus':      { full: 'Louis Dreyfus Company', type: 'Agri Trading House', hq: 'Amsterdam', stat: '$55B+ revenue', description: 'The "D" in ABCD. 160+ years of trading. Coffee, cotton, grains, sugar, juice. Dutch holding, family-controlled.' },
  'COFCO':        { full: 'COFCO International', type: 'State Agri Trading House', hq: 'Beijing / Geneva', stat: '$60B+ revenue', description: 'Chinese state-owned agri giant. Emerged as a global ABCD-level player after acquiring Noble Agri and Nidera. Controls key port terminals in South America.' },
  // ── ENERGY GIANTS ──
  'Vitol':        { full: 'Vitol Group', type: 'Energy Trading House', hq: 'Rotterdam / Geneva', stat: '$500B+ revenue', description: 'World\'s largest independent energy trader. Over 7 million barrels traded per day. Privately held by its employees. Major in crude, products, LNG.' },
  'Trafigura':    { full: 'Trafigura Group', type: 'Energy & Metals Trader', hq: 'Geneva', stat: '$318B revenue', description: 'Second-largest independent oil trader. Active in metals (copper, zinc). Owns ports, storage and logistics infrastructure globally.' },
  'Gunvor':       { full: 'Gunvor Group', type: 'Energy Trading House', hq: 'Geneva', stat: '$100B+ revenue', description: 'Swiss-based energy trader. Originally strong in Russian crude, now diversified into LNG and global oil trading. Founded by Torbjørn Törnqvist.' },
  'Mercuria':     { full: 'Mercuria Energy Group', type: 'Energy Trading House', hq: 'Geneva', stat: '$135B revenue', description: 'Founded in 2004, rapidly became one of the top 5 energy traders. Expanded into metals and financial services. Acquired JP Morgan\'s physical commodity business.' },
  // ── METALS ──
  'Glencore':     { full: 'Glencore plc', type: 'Mining & Trading House', hq: 'Baar, Switzerland', stat: '$256B revenue', description: 'Unique dual model: largest listed diversified natural resource company AND a major trading house. Copper, cobalt, coal, zinc, oil. Controls critical infrastructure globally.' },
  'Rio Tinto':    { full: 'Rio Tinto Group', type: 'Mining Giant', hq: 'London / Melbourne', stat: '$54B revenue', description: 'One of the world\'s largest metals and mining corporations. Leader in iron ore, aluminium, copper and lithium. Key supplier to global steel and EV supply chains.' },
  'Teck':         { full: 'Teck Resources Limited', type: 'Mining Company', hq: 'Vancouver, Canada', stat: '$11B revenue', description: 'Canadian diversified miner — copper, zinc, steelmaking coal. Acquiring copper assets ahead of the energy transition.' },
  // ── SPECIALISTS ──
  'Olam':         { full: 'Olam International', type: 'Agri Specialist Trader', hq: 'Singapore', stat: '$40B+ revenue', description: 'Specialty agriculture — coffee, cocoa, nuts, spices. Origin-focused business model. Split into Olam Agri and ofi (Olam Food Ingredients).' },
  'Wilmar':       { full: 'Wilmar International', type: 'Agri Processing & Trading', hq: 'Singapore', stat: '$75B revenue', description: 'Asia\'s leading agribusiness group. Dominates palm oil. Also wheat, rice, sugar. Massive distribution network in China and Southeast Asia.' },
  'Sucden':       { full: 'Sucres et Denrées (Sucden)', type: 'Soft Commodity Trader', hq: 'Paris', stat: 'Private, ~$5B+', description: 'French trading house specializing in sugar, coffee, cocoa and grains. Family-owned since 1952. One of the most active Robusta traders in Europe.' },
  // ── COFFEE & SOFTS ──
  'Efico':        { full: 'Efico Group', type: 'Coffee Import/Export', hq: 'Antwerp, Belgium', stat: 'Private · ~1M MT/year', description: 'Belgian coffee trader with deep expertise in Robusta origins (Vietnam, Indonesia, Uganda). One of the most active physical Robusta houses in Europe.' },
  'Sopex':        { full: 'Sopex S.A.', type: 'Coffee & Cocoa Trader', hq: 'Paris, France', stat: 'Private', description: 'French trading house with long-standing relationships in African origins. Active in Arabica (Ethiopia, Kenya) and Robusta (Côte d\'Ivoire).' },
  'Touton':       { full: 'Touton S.A.', type: 'Coffee & Cocoa Trader', hq: 'Bordeaux, France', stat: 'Private · 170+ years', description: 'One of France\'s oldest trading houses. Specializes in premium origins: Ethiopian Arabica, Peruvian specialty coffee, vanilla. Heritage in Bordeaux wine trade.' },
  'Neumann Gruppe':{ full: 'Neumann Gruppe GmbH', type: 'Coffee Trader', hq: 'Hamburg, Germany', stat: 'Largest coffee trader by volume', description: 'World\'s largest coffee trading company by volume. Manages over 1 million MT of green coffee annually. Owns farms, mills and export stations in origin countries.' },
  'Volcafé':      { full: 'Volcafé Ltd', type: 'Coffee Trader', hq: 'Winterthur, Switzerland', stat: 'Subsidiary of ED&F Man', description: 'One of the world\'s largest green coffee traders. Subsidiary of StoneX (former ED&F Man). Strong in Arabica — Colombia, Central America, East Africa.' },
  // ── QUANT FUNDS ──
  'Squarepoint':  { full: 'Squarepoint Capital', type: 'Quantitative Fund', hq: 'Geneva / London / New York', stat: '$100B+ AUM', description: 'Systematic quantitative investment fund. Active in commodity futures using statistical arbitrage and machine learning models. Spun out from BlueCrest Capital.' },
  'Renaissance':  { full: 'Renaissance Technologies', type: 'Quantitative Fund', hq: 'East Setauket, New York', stat: 'Medallion: 66% returns (avg)', description: 'Most successful quant fund in history. Medallion Fund uses statistical models across all asset classes including commodities. Founded by Jim Simons.' },
  'Two Sigma':    { full: 'Two Sigma Investments', type: 'Quantitative Fund', hq: 'New York', stat: '$60B+ AUM', description: 'Technology-driven hedge fund. Uses data science, machine learning and distributed computing across futures markets including commodities.' },
  'AQR':          { full: 'AQR Capital Management', type: 'Quantitative Fund', hq: 'Greenwich, Connecticut', stat: '$100B+ AUM', description: 'Factor-based systematic fund. Commodity carry and trend-following strategies. Publishes academic research on commodity risk premia.' },
  'Winton':       { full: 'Winton Group', type: 'CTA / Systematic Fund', hq: 'London', stat: '$20B+ AUM', description: 'Leading CTA (Commodity Trading Advisor). Trend-following across commodity futures. Founded by David Harding, former co-founder of Man AHL.' },
  // ── BANKS ──
  'Goldman Sachs':{ full: 'Goldman Sachs Group', type: 'Investment Bank', hq: 'New York', stat: 'GSCI creator', description: 'Created the Goldman Sachs Commodity Index (GSCI), now S&P GSCI. One of the dominant commodity desks on Wall Street. Significant in oil, metals, agriculture.' },
  'Morgan Stanley':{ full: 'Morgan Stanley', type: 'Investment Bank', hq: 'New York', stat: 'Historically top commodity desk', description: 'Historically had one of the largest physical oil trading operations on Wall Street. Still a major commodity derivatives dealer.' },
  'JP Morgan':    { full: 'JPMorgan Chase & Co.', type: 'Investment Bank', hq: 'New York', stat: 'Commodity banking leader', description: 'Major commodity finance and derivatives bank. Sold its physical commodity business to Mercuria in 2014. Still dominates structured commodity products.' },
  // ── CHINESE PROP ──
  'Zhejiang merchants': { full: 'Zhejiang Merchant Groups', type: 'Chinese Prop Trading', hq: 'Zhejiang Province, China', stat: 'SHFE / DCE dominant', description: 'Network of proprietary trading groups from Zhejiang province. Historically dominant force on Shanghai Futures Exchange (SHFE). Known for coordinated positioning in copper and zinc.' },
  'Shenzhen desks':     { full: 'Shenzhen Prop Trading Desks', type: 'Chinese Prop Trading', hq: 'Shenzhen, China', stat: 'ZCE specialists', description: 'Technology-driven prop desks based in Shenzhen. Active on ZCE (Zhengzhou) and DCE (Dalian). Increasingly using algorithmic strategies on agricultural and energy futures.' },
  'COFCO Finance':      { full: 'COFCO Financial Holdings', type: 'State Prop Trading', hq: 'Beijing', stat: 'State-backed', description: 'Financial arm of COFCO Group. Trades commodity futures to manage the parent company\'s physical exposure and engages in proprietary commodity speculation.' },
  // ── RETAIL ──
  'CME retail':   { full: 'CME Group Retail Traders', type: 'Retail Speculators', hq: 'Global', stat: 'Millions of accounts', description: 'Individual traders accessing WTI, Gold, Corn and other futures via CME Group. Typically hold positions for hours to weeks. Provide liquidity but are usually net losers long-term.' },
  'IB users':     { full: 'Interactive Brokers Commodity Traders', type: 'Retail / Semi-Pro', hq: 'Global', stat: 'Multi-asset platform', description: 'Semi-professional retail traders using Interactive Brokers\' low-cost commodity futures platform. Access to all major exchanges. More sophisticated than typical retail.' },
  'Algo traders': { full: 'Algorithmic Retail Traders', type: 'Retail Algo / Small Funds', hq: 'Global', stat: 'Growing segment', description: 'Small-scale algorithmic traders using Python, MetaTrader or proprietary systems. Access commodity futures via retail brokers. Increasingly common since 2015.' },
  // ── EXPORTERS / IMPORTERS (generic) ──
  'Origin agents':         { full: 'Origin Export Agents', type: 'Export Specialist', hq: 'Origin countries', stat: 'Country-specific', description: 'Local agents who aggregate production from smallholder farmers, manage export documentation, quality inspection and logistics to port of export.' },
  'Port agents':           { full: 'Port & Shipping Agents', type: 'Logistics Intermediary', hq: 'Various ports', stat: 'Operational layer', description: 'Coordinate vessel operations at port: customs, loading/discharge, surveying. Bridge between physical commodity and shipping.' },
  'Local roasters':        { full: 'Local Coffee Roasters', type: 'Importer / End Buyer', hq: 'Consuming countries', stat: 'Growing segment', description: 'Small to mid-size specialty roasters who import directly from origin, bypassing the trading house layer. Represent the "direct trade" movement.' },
  'Cooperative exporters': { full: 'Producer Cooperative Exporters', type: 'Export Cooperative', hq: 'Origin countries', stat: 'Farmer-owned', description: 'Farmer-owned cooperatives that export directly, capturing more of the value chain. Examples: Coopedota (Costa Rica), SCFCU (Ethiopia).' },
}

type CompanyKey = { name: string; note?: string }
type Group = { sub: string; companies: CompanyKey[] }
type Tier = {
  num: string
  label: string
  sub: string
  physical: boolean
  color: string
  chipColor: string
  groups: Group[]
}

const TIERS: Tier[] = [
  {
    num: '01', label: 'INDUSTRY', sub: 'The physical economy — real supply & demand', physical: true,
    color: 'amber', chipColor: 'border-amber-600/40 bg-amber-500/8 hover:border-amber-400 hover:bg-amber-500/15',
    groups: [
      { sub: 'Integrated', companies: [{ name: 'Shell' }, { name: 'BP' }, { name: 'ExxonMobil' }, { name: 'Chevron' }, { name: 'TotalEnergies', note: 'Mag 5' }] },
      { sub: 'Producers', companies: [{ name: 'Aramco' }, { name: 'ADNOC' }, { name: 'Codelco' }, { name: 'Vale' }, { name: 'BHP' }] },
      { sub: 'End Industry', companies: [{ name: 'Nestlé' }, { name: "JDE Peet's" }, { name: 'Panzani' }, { name: 'Danone' }, { name: 'AB InBev' }] },
    ],
  },
  {
    num: '02', label: 'TRADING HOUSES', sub: 'Physical intermediaries — buy, move, store, sell', physical: true,
    color: 'blue', chipColor: 'border-blue-600/40 bg-blue-500/8 hover:border-blue-400 hover:bg-blue-500/15',
    groups: [
      { sub: 'Agri Giants', companies: [{ name: 'ADM' }, { name: 'Bunge' }, { name: 'Cargill' }, { name: 'Dreyfus' }, { name: 'COFCO', note: 'China' }] },
      { sub: 'Energy Giants', companies: [{ name: 'Vitol' }, { name: 'Trafigura' }, { name: 'Gunvor' }, { name: 'Mercuria' }] },
      { sub: 'Metals Giants', companies: [{ name: 'Glencore' }, { name: 'Rio Tinto' }, { name: 'Teck' }] },
      { sub: 'Specialists', companies: [{ name: 'Olam' }, { name: 'Wilmar' }, { name: 'Sucden' }] },
    ],
  },
  {
    num: '03', label: 'IMPORT / EXPORT', sub: 'Regional connectors — bridge origin to destination', physical: true,
    color: 'emerald', chipColor: 'border-emerald-600/40 bg-emerald-500/8 hover:border-emerald-400 hover:bg-emerald-500/15',
    groups: [
      { sub: 'Coffee & Softs', companies: [{ name: 'Efico' }, { name: 'Sopex' }, { name: 'Touton' }, { name: 'Neumann Gruppe' }, { name: 'Volcafé' }] },
      { sub: 'Regional Operators', companies: [{ name: 'Origin agents' }, { name: 'Port agents' }, { name: 'Local roasters' }, { name: 'Cooperative exporters' }] },
    ],
  },
  {
    num: '04', label: 'FINANCIAL TRADERS', sub: 'Paper only — futures & derivatives, no physical delivery', physical: false,
    color: 'violet', chipColor: 'border-violet-600/40 bg-violet-500/8 hover:border-violet-400 hover:bg-violet-500/15',
    groups: [
      { sub: 'Quant Funds', companies: [{ name: 'Squarepoint' }, { name: 'Renaissance' }, { name: 'Two Sigma' }, { name: 'AQR' }, { name: 'Winton' }] },
      { sub: 'Investment Banks', companies: [{ name: 'Goldman Sachs' }, { name: 'Morgan Stanley' }, { name: 'JP Morgan' }] },
      { sub: 'Chinese Prop Desks', companies: [{ name: 'Zhejiang merchants' }, { name: 'Shenzhen desks' }, { name: 'COFCO Finance' }] },
      { sub: 'Retail', companies: [{ name: 'CME retail' }, { name: 'IB users' }, { name: 'Algo traders' }] },
    ],
  },
]

const LABEL_COLOR: Record<string, string> = {
  amber: 'text-amber-400', blue: 'text-blue-400', emerald: 'text-emerald-400', violet: 'text-violet-400',
}
const NUM_COLOR: Record<string, string> = {
  amber: 'text-amber-500/25', blue: 'text-blue-500/25', emerald: 'text-emerald-500/25', violet: 'text-violet-500/25',
}
const RAIL: Record<string, string> = {
  amber: 'bg-amber-500', blue: 'bg-blue-500', emerald: 'bg-emerald-500', violet: 'bg-violet-500',
}

export default function TraderTypes() {
  const [selected, setSelected] = useState<string | null>(null)
  const info = selected ? INFO[selected] : null

  return (
    <div className="mt-4 space-y-1.5">

      {/* Company info modal */}
      {selected && info && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="glass relative z-10 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white text-lg transition-colors">✕</button>

            {/* Header */}
            <div className="mb-4">
              <div className="text-white font-semibold tracking-tight text-xl leading-tight mb-1">{selected}</div>
              <div className="text-slate-400 text-sm">{info.full}</div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="chip border-white/15 text-slate-300">{info.type}</span>
              <span className="chip border-white/15 text-slate-400">🏢 {info.hq}</span>
              <span className="chip border-amber-500/30 bg-amber-500/10 text-amber-400">{info.stat}</span>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed">{info.description}</p>

            <div className="mt-4 text-slate-600 text-xs font-mono">Click anywhere to close</div>
          </div>
        </div>
      )}

      {/* Tiers */}
      {TIERS.map((tier, ti) => (
        <div key={tier.num}>
          <div className="glass relative overflow-hidden rounded-2xl p-5">
            <span className={`absolute left-0 top-0 h-full w-[3px] ${RAIL[tier.color]}`} />
            <div className="flex gap-4 items-start">

              {/* Left: number + label */}
              <div className="shrink-0 w-28 xl:w-32">
                <div className={`font-black text-5xl leading-none ${NUM_COLOR[tier.color]} font-mono select-none`}>{tier.num}</div>
                <div className={`font-semibold tracking-tight text-xs uppercase mt-1.5 ${LABEL_COLOR[tier.color]}`}>{tier.label}</div>
                <div className="eyebrow mt-1">{tier.physical ? 'PHYSICAL' : 'PAPER ONLY'}</div>
              </div>

              {/* Right: groups */}
              <div className="flex-1 min-w-0 space-y-3">
                {tier.groups.map(group => (
                  <div key={group.sub}>
                    <div className="eyebrow mb-1.5">{group.sub}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.companies.map(c => (
                        <button
                          key={c.name}
                          onClick={() => INFO[c.name] ? setSelected(c.name) : undefined}
                          disabled={!INFO[c.name]}
                          className={`group relative rounded-xl px-3 py-2 border transition-all text-left ${tier.chipColor} ${INFO[c.name] ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default opacity-60'}`}
                        >
                          {/* Floating tooltip */}
                          {INFO[c.name] && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full px-2 py-1 bg-white/[0.06] border border-white/20 text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                              info →
                            </div>
                          )}
                          <div className="text-white text-xs font-semibold leading-tight whitespace-nowrap">{c.name}</div>
                          {c.note && <div className="text-slate-500 text-xs mt-0.5">{c.note}</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {ti < TIERS.length - 1 && (
            <div className="flex justify-center h-3">
              <div className="w-px bg-white/[0.06]" />
            </div>
          )}
        </div>
      ))}

      {/* Legend */}
      <div className="flex gap-6 pt-3 mt-1.5 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-slate-500 text-xs">Physical participant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span className="text-slate-500 text-xs">Paper only</span>
        </div>
        <div className="text-slate-600 text-xs font-mono ml-auto">Click any company for details</div>
      </div>
    </div>
  )
}
