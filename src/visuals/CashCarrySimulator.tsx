'use client'

import { useState } from 'react'

function Slider({ label, value, min, max, step, onChange, display, amber }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string; amber?: boolean
}) {
  return (
    <div>
      <div className="flex justify-between mb-0.5">
        <span className={`text-xs font-mono ${amber ? 'text-amber-400' : 'text-zinc-500'}`}>{label}</span>
        <span className={`text-xs font-mono font-bold ${amber ? 'text-amber-400' : 'text-white'}`}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-amber-500 h-1 cursor-pointer" />
    </div>
  )
}

export default function CashCarrySimulator() {
  const [spot, setSpot] = useState(80)
  const [storagePM, setStoragePM] = useState(0.5)
  const [rateAnnual, setRateAnnual] = useState(5)
  const [months, setMonths] = useState(6)
  const [marketFwd, setMarketFwd] = useState(85)

  const totalStorage = storagePM * months
  const financing = spot * (rateAnnual / 100) * (months / 12)
  const fairFwd = spot + totalStorage + financing
  const profit = marketFwd - fairFwd
  const hasArbitrage = profit > 0.01

  // SVG bar chart dimensions
  const SVG_W = 260, SVG_H = 220
  const BASE_Y = 185 // baseline (x-axis y position)
  const maxVal = Math.max(fairFwd, marketFwd) * 1.12
  const sc = (v: number) => Math.max(0, (v / maxVal) * BASE_Y)

  const fairTop = BASE_Y - sc(fairFwd)
  const mktTop = BASE_Y - sc(marketFwd)

  return (
    <div className="mt-5 bg-zinc-950 border border-zinc-700 p-5 text-white">
      <div className="text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
        Cash-and-Carry Arbitrage Simulator
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Controls */}
        <div className="space-y-3">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">Market Inputs</div>
          <Slider label="Spot Price" value={spot} min={50} max={150} step={1} onChange={setSpot} display={`$${spot}`} />
          <Slider label="Storage cost / month" value={storagePM} min={0} max={5} step={0.1} onChange={setStoragePM} display={`$${storagePM.toFixed(1)}`} />
          <Slider label="Annual interest rate" value={rateAnnual} min={0} max={15} step={0.5} onChange={setRateAnnual} display={`${rateAnnual.toFixed(1)}%`} />
          <Slider label="Months to maturity" value={months} min={1} max={12} step={1} onChange={setMonths} display={`${months}m`} />

          <div className="border-t border-zinc-800 pt-3">
            <div className="text-amber-400 text-xs font-mono uppercase tracking-wider mb-1">Drag this ↓</div>
            <Slider label="Market Forward Price" value={marketFwd} min={50} max={140} step={0.5} onChange={setMarketFwd} display={`$${marketFwd.toFixed(1)}`} amber />
          </div>

          {/* Cost breakdown table */}
          <div className="bg-black border border-zinc-800 p-3 font-mono text-xs mt-1">
            <div className="text-zinc-500 uppercase tracking-wider mb-2">Cost of Carry</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-blue-500"></span><span className="text-zinc-300">Spot</span></span>
                <span className="text-white">${spot.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-yellow-500"></span><span className="text-zinc-300">Storage ({months}m)</span></span>
                <span className="text-white">+${totalStorage.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-orange-500"></span><span className="text-zinc-300">Financing</span></span>
                <span className="text-white">+${financing.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-700 pt-1.5">
                <span className="text-white font-bold">Fair Forward</span>
                <span className="text-white font-bold">${fairFwd.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Visualization */}
        <div>
          {/* SVG Bar Chart */}
          <div className="bg-black border border-zinc-800 p-4 mb-3">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ maxHeight: '210px' }}>

              {/* Baseline */}
              <line x1="10" y1={BASE_Y} x2={SVG_W - 10} y2={BASE_Y} stroke="#3f3f46" strokeWidth="1" />

              {/* ── Fair Forward stacked bar (left) ── */}
              {/* Spot — blue, at the base */}
              <rect x="25" y={BASE_Y - sc(spot)} width="85" height={sc(spot)} fill="#1d4ed8" />
              {/* Storage — yellow, stacked above spot */}
              {sc(totalStorage) > 0 && (
                <rect x="25" y={BASE_Y - sc(spot + totalStorage)} width="85" height={sc(totalStorage)} fill="#b45309" />
              )}
              {/* Financing — orange, at top */}
              {sc(financing) > 0 && (
                <rect x="25" y={fairTop} width="85" height={sc(financing)} fill="#c2410c" />
              )}
              {/* Fair forward value */}
              <text x="67" y={Math.max(10, fairTop - 6)} textAnchor="middle"
                fill="white" fontSize="11" fontFamily="monospace" fontWeight="bold">
                ${fairFwd.toFixed(2)}
              </text>
              <text x="67" y={BASE_Y + 14} textAnchor="middle"
                fill="#71717a" fontSize="9" fontFamily="monospace">FAIR VALUE</text>

              {/* ── Market Forward bar (right) ── */}
              <rect x="150" y={mktTop} width="85" height={sc(marketFwd)}
                fill={hasArbitrage ? '#7c3aed' : '#52525b'} />
              {/* Market forward value */}
              <text x="192" y={Math.max(10, mktTop - 6)} textAnchor="middle"
                fill={hasArbitrage ? '#c084fc' : 'white'} fontSize="11" fontFamily="monospace" fontWeight="bold">
                ${marketFwd.toFixed(1)}
              </text>
              <text x="192" y={BASE_Y + 14} textAnchor="middle"
                fill="#71717a" fontSize="9" fontFamily="monospace">MARKET FWD</text>

              {/* Arbitrage profit bracket */}
              {hasArbitrage && sc(profit) > 6 && (
                <g>
                  {/* Horizontal line at fair forward top */}
                  <line x1="112" y1={fairTop} x2="148" y2={fairTop}
                    stroke="#4ade80" strokeWidth="1" strokeDasharray="3 2" />
                  {/* Profit label */}
                  <text x="130" y={Math.max(10, (fairTop + mktTop) / 2 + 4)} textAnchor="middle"
                    fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    +${profit.toFixed(2)}
                  </text>
                  {/* Arrow line */}
                  <line x1="130" y1={fairTop} x2="130" y2={mktTop}
                    stroke="#4ade80" strokeWidth="1" />
                </g>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-3">
            {[['#1d4ed8','Spot'],['#b45309','Storage'],['#c2410c','Financing'],['#7c3aed','Market Fwd']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: c }} />
                <span className="text-zinc-500 text-xs font-mono">{l}</span>
              </div>
            ))}
          </div>

          {/* Result */}
          <div className={`p-3 border font-mono text-xs transition-colors duration-200 ${
            hasArbitrage
              ? 'border-green-700 bg-green-950 text-green-400'
              : 'border-zinc-700 bg-zinc-900 text-zinc-400'
          }`}>
            {hasArbitrage ? (
              <>
                <div className="text-green-300 font-bold mb-1">⚠ ARBITRAGE OPPORTUNITY</div>
                <div>Market fwd ${marketFwd.toFixed(1)} &gt; fair value ${fairFwd.toFixed(2)}</div>
                <div className="text-green-300 font-bold mt-1">Risk-free profit: +${profit.toFixed(2)} / unit</div>
                <div className="text-zinc-500 mt-1">→ Sell forward at ${marketFwd.toFixed(1)}, buy spot at ${spot} and store for ${(totalStorage + financing).toFixed(2)}</div>
              </>
            ) : (
              <>
                <div className="text-zinc-200 font-bold mb-1">NO CASH-AND-CARRY ARBITRAGE</div>
                <div>Market fwd ${marketFwd.toFixed(1)} ≤ fair cost of carry ${fairFwd.toFixed(2)}</div>
                <div className="text-zinc-600 mt-1">Storing the physical commodity is not economic at this spread.</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
