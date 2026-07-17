'use client'

import { useState } from 'react'

// Four real futures contracts side by side — the point is the CONTRAST:
// origin specs from "US-grown only" to ~28 origins, delivery from
// ex-warehouse warrants to FOB origin port to pure cash settlement.
// Months & prices are indicative, anchored to the course's mid-November
// trading date; specs summarise the exchange rulebooks (verify before use).
type Month = { code: string; label: string; price: string }
type Contract = {
  key: string
  tab: string
  name: string
  exchange: string
  months: Month[]
  curve: string
  specs: [string, string][]
  accent: string
}

const CONTRACTS: Contract[] = [
  {
    key: 'arabica',
    tab: 'Arabica',
    name: 'Coffee "C" — KC',
    exchange: 'ICE Futures US · 37,500 lb/lot · ¢/lb',
    months: [
      { code: 'Z', label: 'Dec', price: '250.00' },
      { code: 'H', label: 'Mar', price: '253.50' },
      { code: 'K', label: 'May', price: '255.80' },
      { code: 'N', label: 'Jul', price: '257.60' },
      { code: 'U', label: 'Sep', price: '259.10' },
    ],
    curve: 'contango — the curve carries the cost of storing coffee',
    specs: [
      ['Origin spec', 'Washed arabica from ~20 licensed growths (Mexico, Guatemala, Honduras, Colombia, Kenya, Peru…). Colombia tenders at a +2¢/lb premium, several growths at discounts — Brazilian naturals are not deliverable at all.'],
      ['Quality spec', 'Exchange-graded on green defects and cup against the basis "C" grade; premiums/discounts by growth and grading result.'],
      ['Delivery points', 'Exchange-licensed warehouses in the US (New York area, New Orleans, Houston, Miami…) and Europe (Antwerp, Hamburg/Bremen, Barcelona…).'],
      ['Incoterm / settlement', 'Physical delivery of an in-store warehouse warrant (ex-warehouse) — the seller delivers a graded warrant, not a shipment.'],
    ],
    accent: '#f59e0b',
  },
  {
    key: 'cotton',
    tab: 'Cotton',
    name: 'Cotton No. 2 — CT',
    exchange: 'ICE Futures US · 50,000 lb/lot (~100 bales) · ¢/lb',
    months: [
      { code: 'Z', label: 'Dec', price: '70.20' },
      { code: 'H', label: 'Mar', price: '71.50' },
      { code: 'K', label: 'May', price: '72.40' },
      { code: 'N', label: 'Jul', price: '73.10' },
      { code: 'V', label: 'Oct', price: '73.80' },
    ],
    curve: 'contango — storable, financed by the curve like coffee',
    specs: [
      ['Origin spec', 'US-grown cotton ONLY — a single-origin contract. One country’s crop defines the world benchmark.'],
      ['Quality spec', 'Base grade Strict Low Middling (SLM), staple 1‑2/32" — every bale USDA-classed; fixed premiums/discounts for grade and staple length.'],
      ['Delivery points', 'USDA-licensed warehouses at five US delivery points: Galveston, Houston, New Orleans, Memphis, Greenville/Spartanburg.'],
      ['Incoterm / settlement', 'Physical delivery of an electronic warehouse receipt (in-warehouse, US).'],
    ],
    accent: '#e2e8f0',
  },
  {
    key: 'brent',
    tab: 'Brent',
    name: 'Brent Crude — B',
    exchange: 'ICE Futures Europe · 1,000 bbl/lot · $/bbl',
    months: [
      { code: 'F', label: 'Jan', price: '78.50' },
      { code: 'G', label: 'Feb', price: '78.10' },
      { code: 'H', label: 'Mar', price: '77.80' },
      { code: 'J', label: 'Apr', price: '77.50' },
      { code: 'K', label: 'May', price: '77.20' },
    ],
    curve: 'backwardation — prompt barrels command the premium (monthly cycle, unlike the softs)',
    specs: [
      ['Origin spec', 'No deliverable origins at all — a light, sweet North Sea benchmark referencing the BFOET basket (see the oil track).'],
      ['Quality spec', 'None to tender: there is no physical grading, because nothing is physically tendered.'],
      ['Delivery points', 'None. The contract is CASH-SETTLED against the ICE Brent Index at expiry; physical players convert to cargoes via EFPs.'],
      ['Incoterm / settlement', 'n/a — pure financial settlement. The "delivery mechanism" is a cash difference.'],
    ],
    accent: '#3b82f6',
  },
  {
    key: 'sugar',
    tab: 'Sugar',
    name: 'Sugar No. 11 — SB',
    exchange: 'ICE Futures US · 112,000 lb/lot (50 long tons) · ¢/lb',
    months: [
      { code: 'H', label: 'Mar', price: '21.40' },
      { code: 'K', label: 'May', price: '20.90' },
      { code: 'N', label: 'Jul', price: '20.30' },
      { code: 'V', label: 'Oct', price: '19.80' },
      { code: 'H+1', label: 'Mar (next yr)', price: '19.60' },
    ],
    curve: 'backwardation — only four delivery months a year, prompt supply tight',
    specs: [
      ['Origin spec', 'Raw cane sugar from ~28 listed origins — Argentina, Australia, Brazil, Colombia, Guatemala, India, Thailand, Zimbabwe… The widest origin menu of the four.'],
      ['Quality spec', 'Raw centrifugal cane sugar, average 96° polarization.'],
      ['Delivery points', 'No warehouses: delivery is FOB the RECEIVER’S vessel at a port in the country of origin — the buyer charters the ship and collects.'],
      ['Incoterm / settlement', 'Physical, FOB stowed & trimmed at origin port — the only true FOB Incoterm of the four.'],
    ],
    accent: '#34d399',
  },
]

export default function ContractExplorer() {
  const [tab, setTab] = useState(0)
  const c = CONTRACTS[tab]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3">One word — &ldquo;futures&rdquo; — four very different contracts</div>

      {/* Commodity tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {CONTRACTS.map((x, i) => (
          <button key={x.key} onClick={() => setTab(i)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              tab === i ? 'border-brand-blue/60 bg-brand-blue/20 text-blue-100' : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
            }`}>
            {x.tab}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <span className="font-mono text-sm font-bold" style={{ color: c.accent }}>{c.name}</span>
          <span className="ml-2 font-mono text-[11px] text-slate-500">{c.exchange}</span>
        </div>
      </div>

      {/* Next five listed contracts */}
      <div className="mb-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="eyebrow mb-2">The next 5 listed contracts (indicative, from mid-November)</div>
        <div className="flex gap-2">
          {c.months.map((m, i) => (
            <div key={m.code} className={`min-w-[92px] flex-1 rounded-lg border p-2 text-center ${i === 0 ? 'border-white/25 bg-white/[0.06]' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="font-mono text-[10px] text-slate-500">{m.label} · <span className="font-bold" style={{ color: c.accent }}>{m.code}</span>{i === 0 && ' · front'}</div>
              <div className="mt-1 font-mono text-sm font-bold tabular-nums text-white">{m.price}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-slate-500">Term structure: {c.curve}</p>
      </div>

      {/* Spec table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <tbody>
            {c.specs.map(([k, v]) => (
              <tr key={k} className="border-b border-white/5 align-top">
                <td className="w-40 shrink-0 py-2 pr-3 font-mono text-[11px] uppercase tracking-wide text-slate-500">{k}</td>
                <td className="py-2 leading-relaxed text-slate-300">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Flip through the four tabs and compare the same rows: origin runs from <span className="text-slate-300">&ldquo;US-grown only&rdquo;</span> (Cotton) to <span className="text-slate-300">~28 origins</span> (Sugar) to <span className="text-slate-300">none at all</span> (Brent); delivery runs from an <span className="text-slate-300">ex-warehouse warrant</span> (Coffee, Cotton) to <span className="text-slate-300">FOB the buyer&rsquo;s vessel at origin</span> (Sugar) to <span className="text-slate-300">a cash difference</span> (Brent). &ldquo;A futures contract&rdquo; is one legal form wrapped around very different physical realities — always read the rulebook. Specs summarised from the ICE rulebooks; verify current details before trading.
      </p>
    </div>
  )
}
