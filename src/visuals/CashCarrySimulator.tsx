'use client'

import { useState } from 'react'

function Slider({ label, value, min, max, step, onChange, display, amber }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string; amber?: boolean
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className={`text-xs font-mono ${amber ? 'text-brand-cyan' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-xs font-mono font-bold tabular-nums ${amber ? 'text-brand-cyan' : 'text-white'}`}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 cursor-pointer ${amber ? 'accent-brand-cyan' : 'accent-brand-blue'}`} />
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
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">
        Cash-and-Carry Arbitrage Simulator
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Controls */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">Market Inputs</div>
          <Slider label="Spot Price" value={spot} min={50} max={150} step={1} onChange={setSpot} display={`$${spot}`} />
          <Slider label="Storage cost / month" value={storagePM} min={0} max={5} step={0.1} onChange={setStoragePM} display={`$${storagePM.toFixed(1)}`} />
          <Slider label="Annual interest rate" value={rateAnnual} min={0} max={15} step={0.5} onChange={setRateAnnual} display={`${rateAnnual.toFixed(1)}%`} />
          <Slider label="Months to maturity" value={months} min={1} max={12} step={1} onChange={setMonths} display={`${months}m`} />

          <div className="border-t border-white/10 pt-3">
            <div className="eyebrow text-brand-cyan mb-1">Drag this ↓</div>
            <Slider label="Market Forward Price" value={marketFwd} min={50} max={140} step={0.5} onChange={setMarketFwd} display={`$${marketFwd.toFixed(1)}`} amber />
          </div>

          {/* Cost breakdown table */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs mt-1">
            <div className="eyebrow mb-2">Cost of Carry</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-sm bg-brand-blue"></span><span className="text-slate-300">Spot</span></span>
                <span className="text-white tabular-nums">${spot.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-sm bg-amber-500"></span><span className="text-slate-300">Storage ({months}m)</span></span>
                <span className="text-white tabular-nums">+${totalStorage.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-sm bg-orange-500"></span><span className="text-slate-300">Financing</span></span>
                <span className="text-white tabular-nums">+${financing.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/15 pt-1.5">
                <span className="text-white font-bold">Fair Forward</span>
                <span className="text-white font-bold tabular-nums">${fairFwd.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Visualization */}
        <div>
          {/* SVG Bar Chart */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-3">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ maxHeight: '210px' }}>

              {/* Baseline */}
              <line x1="10" y1={BASE_Y} x2={SVG_W - 10} y2={BASE_Y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

              {/* ── Fair Forward stacked bar (left) ── */}
              {/* Spot — blue, at the base */}
              <rect x="25" y={BASE_Y - sc(spot)} width="85" height={sc(spot)} fill="#3b82f6" />
              {/* Storage — yellow, stacked above spot */}
              {sc(totalStorage) > 0 && (
                <rect x="25" y={BASE_Y - sc(spot + totalStorage)} width="85" height={sc(totalStorage)} fill="#f59e0b" />
              )}
              {/* Financing — orange, at top */}
              {sc(financing) > 0 && (
                <rect x="25" y={fairTop} width="85" height={sc(financing)} fill="#fb923c" />
              )}
              {/* Fair forward value */}
              <text x="67" y={Math.max(10, fairTop - 6)} textAnchor="middle"
                fill="white" fontSize="11" fontFamily="monospace" fontWeight="bold">
                ${fairFwd.toFixed(2)}
              </text>
              <text x="67" y={BASE_Y + 14} textAnchor="middle"
                fill="#94a3b8" fontSize="9" fontFamily="monospace">FAIR VALUE</text>

              {/* ── Market Forward bar (right) ── */}
              <rect x="150" y={mktTop} width="85" height={sc(marketFwd)}
                fill={hasArbitrage ? '#8b5cf6' : '#475569'} />
              {/* Market forward value */}
              <text x="192" y={Math.max(10, mktTop - 6)} textAnchor="middle"
                fill={hasArbitrage ? '#c4b5fd' : 'white'} fontSize="11" fontFamily="monospace" fontWeight="bold">
                ${marketFwd.toFixed(1)}
              </text>
              <text x="192" y={BASE_Y + 14} textAnchor="middle"
                fill="#94a3b8" fontSize="9" fontFamily="monospace">MARKET FWD</text>

              {/* Arbitrage profit bracket */}
              {hasArbitrage && sc(profit) > 6 && (
                <g>
                  {/* Horizontal line at fair forward top */}
                  <line x1="112" y1={fairTop} x2="148" y2={fairTop}
                    stroke="#34d399" strokeWidth="1" strokeDasharray="3 2" />
                  {/* Profit label */}
                  <text x="130" y={Math.max(10, (fairTop + mktTop) / 2 + 4)} textAnchor="middle"
                    fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    +${profit.toFixed(2)}
                  </text>
                  {/* Arrow line */}
                  <line x1="130" y1={fairTop} x2="130" y2={mktTop}
                    stroke="#34d399" strokeWidth="1" />
                </g>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-3">
            {[['#3b82f6','Spot'],['#f59e0b','Storage'],['#fb923c','Financing'],['#7c3aed','Market Fwd']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: c }} />
                <span className="text-slate-400 text-xs font-mono">{l}</span>
              </div>
            ))}
          </div>

          {/* Result */}
          <div className={`rounded-xl p-3 border font-mono text-xs tabular-nums transition-colors duration-200 ${
            hasArbitrage
              ? 'border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-300'
              : 'border-white/10 bg-white/[0.03] text-slate-400'
          }`}>
            {hasArbitrage ? (
              <>
                <div className="text-emerald-400 font-bold mb-1">⚠ ARBITRAGE OPPORTUNITY</div>
                <div>Market fwd ${marketFwd.toFixed(1)} &gt; fair value ${fairFwd.toFixed(2)}</div>
                <div className="text-emerald-400 font-bold text-2xl mt-1.5">Risk-free profit: +${profit.toFixed(2)} / unit</div>
                <div className="text-slate-400 mt-1">→ Sell forward at ${marketFwd.toFixed(1)}, buy spot at ${spot} and store for ${(totalStorage + financing).toFixed(2)}</div>
              </>
            ) : (
              <>
                <div className="text-slate-100 font-bold mb-1">NO CASH-AND-CARRY ARBITRAGE</div>
                <div>Market fwd ${marketFwd.toFixed(1)} ≤ fair cost of carry ${fairFwd.toFixed(2)}</div>
                <div className="text-slate-500 mt-1">Storing the physical commodity is not economic at this spread.</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
