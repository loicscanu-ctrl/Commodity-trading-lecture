// Six real futures contracts in one aligned matrix — the point is the
// CONTRAST across each row: origin specs from "US-grown only" to ~28
// origins to none at all; delivery from ex-warehouse warrants to FOB the
// buyer's vessel to a pipeline hub to pure cash settlement; quotes in
// ¢/lb, €/t and $/bbl. Months & prices are indicative, anchored to the
// course's mid-November trading date; specs summarise the exchange
// rulebooks (verify before use).
type Contract = {
  key: string
  name: string
  symbol: string
  exchange: string
  size: string
  quote: string
  months: string[]
  curve: string
  origin: string
  quality: string
  delivery: string
  incoterm: string
  accent: string
}

const CONTRACTS: Contract[] = [
  {
    key: 'arabica', name: 'Arabica Coffee "C"', symbol: 'KC', exchange: 'ICE Futures US',
    size: '37,500 lb', quote: '¢/lb',
    months: ['Dec Z · 250.00', 'Mar H · 253.50', 'May K · 255.80', 'Jul N · 257.60', 'Sep U · 259.10'],
    curve: 'contango — the curve finances storage',
    origin: '~20 licensed growths (Mexico, Guatemala, Honduras, Colombia, Kenya…). Colombia +2¢/lb premium, several growths at discounts; Brazilian naturals not deliverable.',
    quality: 'Washed arabica, exchange-graded on green defects and cup against the basis "C" grade.',
    delivery: 'Licensed warehouses in the US (NY area, New Orleans, Houston, Miami) and Europe (Antwerp, Hamburg/Bremen, Barcelona).',
    incoterm: 'Physical — in-store warehouse warrant (ex-warehouse).',
    accent: '#f59e0b',
  },
  {
    key: 'cotton', name: 'Cotton No. 2', symbol: 'CT', exchange: 'ICE Futures US',
    size: '50,000 lb (~100 bales)', quote: '¢/lb',
    months: ['Dec Z · 70.20', 'Mar H · 71.50', 'May K · 72.40', 'Jul N · 73.10', 'Oct V · 73.80'],
    curve: 'contango — storable, like coffee',
    origin: 'US-grown cotton ONLY — a single-origin contract: one country’s crop defines the world benchmark.',
    quality: 'Base grade Strict Low Middling (SLM), staple 1‑2/32″, every bale USDA-classed; fixed grade/staple differentials.',
    delivery: 'USDA-licensed warehouses at 5 US points: Galveston, Houston, New Orleans, Memphis, Greenville/Spartanburg.',
    incoterm: 'Physical — electronic warehouse receipt (in-warehouse, US).',
    accent: '#e2e8f0',
  },
  {
    key: 'sugar', name: 'Sugar No. 11', symbol: 'SB', exchange: 'ICE Futures US',
    size: '112,000 lb (50 long tons)', quote: '¢/lb',
    months: ['Mar H · 21.40', 'May K · 20.90', 'Jul N · 20.30', 'Oct V · 19.80', 'Mar+1 · 19.60'],
    curve: 'backwardation — only 4 delivery months a year',
    origin: '~28 listed origins (Brazil, Thailand, Australia, India, Guatemala…) — the widest origin menu here.',
    quality: 'Raw centrifugal cane sugar, average 96° polarization.',
    delivery: 'No warehouses: a port in the country of origin — the BUYER charters the vessel and collects.',
    incoterm: 'Physical — FOB receiver’s vessel, stowed & trimmed, origin port. The only true FOB of the six.',
    accent: '#34d399',
  },
  {
    key: 'wheat', name: 'Milling Wheat No. 2 ("blé MATIF")', symbol: 'EBM', exchange: 'Euronext Paris',
    size: '50 t', quote: '€/t — the only euro contract here',
    months: ['Dec Z · 228.50', 'Mar H · 232.00', 'May K · 234.75', 'Sep U · 219.25', 'Dec+1 · 223.00'],
    curve: 'carry within the crop year — then the NEW-CROP break at Sep',
    origin: 'EU-grown milling wheat — the benchmark every French farmer and cooperative hedges on.',
    quality: 'Milling wheat: min 76 kg/hl specific weight, max 15% moisture, capped broken/sprouted grains & impurities.',
    delivery: 'Approved silos in Rouen and Dunkirk (France) — the export ports of the French wheat belt.',
    incoterm: 'Physical — in-silo delivery (ex-silo warrant).',
    accent: '#8b5cf6',
  },
  {
    key: 'brent', name: 'Brent Crude', symbol: 'B', exchange: 'ICE Futures Europe',
    size: '1,000 bbl', quote: '$/bbl',
    months: ['Jan F · 78.50', 'Feb G · 78.10', 'Mar H · 77.80', 'Apr J · 77.50', 'May K · 77.20'],
    curve: 'backwardation — monthly cycle, unlike the ags',
    origin: 'No deliverable origins at all — a light, sweet North Sea benchmark referencing the BFOET basket (see the oil track).',
    quality: 'None to tender — nothing is physically graded because nothing is physically delivered.',
    delivery: 'None. CASH-SETTLED against the ICE Brent Index at expiry; physical players convert via EFPs.',
    incoterm: 'n/a — pure financial settlement: the “delivery” is a cash difference.',
    accent: '#3b82f6',
  },
  {
    key: 'wti', name: 'WTI Crude', symbol: 'CL', exchange: 'NYMEX (CME)',
    size: '1,000 bbl', quote: '$/bbl',
    months: ['Jan F · 74.60', 'Feb G · 74.30', 'Mar H · 74.05', 'Apr J · 73.85', 'May K · 73.70'],
    curve: 'backwardation — monthly cycle, trades under Brent',
    origin: 'US domestic light sweet crude streams, delivered at the Cushing hub.',
    quality: '37–42° API gravity, ≤ 0.42% sulphur — “light sweet” by specification.',
    delivery: 'One point only: Cushing, Oklahoma — pipeline or in-tank transfer at the inland storage hub.',
    incoterm: 'Physical — free-in-pipeline / in-tank transfer at Cushing (April 2020’s negative print was this mechanism at work).',
    accent: '#22d3ee',
  },
]

const ROWS: { label: string; get: (c: Contract) => string | string[] }[] = [
  { label: 'Exchange', get: c => c.exchange },
  { label: 'Lot size', get: c => c.size },
  { label: 'Quotation', get: c => c.quote },
  { label: 'Next 5 contracts', get: c => c.months },
  { label: 'Term structure', get: c => c.curve },
  { label: 'Origin spec', get: c => c.origin },
  { label: 'Quality spec', get: c => c.quality },
  { label: 'Delivery points', get: c => c.delivery },
  { label: 'Incoterm / settlement', get: c => c.incoterm },
]

export default function ContractExplorer() {
  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3">One word — &ldquo;futures&rdquo; — six very different contracts</div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-[11px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-32 bg-[#101321] p-2 text-left align-bottom font-mono text-[10px] uppercase tracking-wide text-slate-500">Spec</th>
              {CONTRACTS.map(c => (
                <th key={c.key} className="border-b border-white/15 p-2 text-left align-bottom">
                  <div className="font-mono text-xs font-bold" style={{ color: c.accent }}>{c.name}</div>
                  <div className="font-mono text-[10px] text-slate-500">{c.symbol}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => (
              <tr key={row.label} className="align-top">
                <td className="sticky left-0 z-10 w-32 bg-[#101321] p-2 font-mono text-[10px] uppercase tracking-wide text-slate-500">{row.label}</td>
                {CONTRACTS.map(c => {
                  const v = row.get(c)
                  return (
                    <td key={c.key} className="border-b border-white/5 p-2 leading-relaxed text-slate-300">
                      {Array.isArray(v) ? (
                        <div className="space-y-0.5 font-mono tabular-nums">
                          {v.map((m, i) => (
                            <div key={m} className={i === 0 ? 'font-bold text-white' : 'text-slate-400'}>
                              {m}{i === 0 && <span className="ml-1 text-[9px] text-slate-500">front</span>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>{v}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Read across each row: <span className="text-slate-300">origin</span> runs from &ldquo;US-grown only&rdquo; (Cotton) to ~28 origins (Sugar) to none at all (Brent); <span className="text-slate-300">delivery</span> runs from an ex-warehouse warrant (Coffee, Cotton, Wheat) to FOB the buyer&rsquo;s vessel at origin (Sugar) to one inland pipeline hub (WTI) to a cash difference (Brent). Note the pairs: <span className="text-slate-300">Brent vs WTI</span> — same size, same quote, yet one is cash-settled against a seaborne basket and the other physically delivered at a single inland hub, which is exactly why they can diverge; and <span className="text-slate-300">Wheat</span> — the one euro-denominated contract, with the tell-tale new-crop break at September that no monthly energy curve has. Prices and months are indicative, anchored to the course&rsquo;s mid-November date; always verify current specs in the exchange rulebook.
      </p>
    </div>
  )
}
