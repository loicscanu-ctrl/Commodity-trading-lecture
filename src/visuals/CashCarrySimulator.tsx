'use client'

import { useState } from 'react'

function SliderRow({ label, value, min, max, step, onChange, format, amber }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format: (v: number) => string; amber?: boolean
}) {
  return (
    <div>
      <div className="flex justify-between mb-0.5">
        <span className={`text-xs font-mono uppercase tracking-wider ${amber ? 'text-amber-400' : 'text-zinc-500'}`}>{label}</span>
        <span className={`text-xs font-mono font-bold ${amber ? 'text-amber-400' : 'text-white'}`}>{format(value)}</span>
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

  const BAR_H = 150
  const maxVal = Math.max(fairFwd, marketFwd) * 1.08
  const sc = (v: number) => Math.max(0, Math.round((v / maxVal) * BAR_H))

  const spotH = sc(spot)
  const storageH = sc(totalStorage)
  const financingH = sc(financing)
  const fairH = spotH + storageH + financingH
  const marketH = sc(marketFwd)

  const containerH = BAR_H + 44

  return (
    <div className="mt-5 bg-zinc-900 border border-zinc-700 p-5 text-white">
      <div className="text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
        Cash-and-Carry Arbitrage Simulator
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Controls */}
        <div className="space-y-3">
          <SliderRow label="Spot Price ($)" value={spot} min={50} max={150} step={1} onChange={setSpot} format={v => `$${v}`} />
          <SliderRow label="Storage cost / month" value={storagePM} min={0} max={5} step={0.1} onChange={setStoragePM} format={v => `$${v.toFixed(1)}`} />
          <SliderRow label="Annual interest rate" value={rateAnnual} min={0} max={15} step={0.5} onChange={setRateAnnual} format={v => `${v.toFixed(1)}%`} />
          <SliderRow label="Months to maturity" value={months} min={1} max={12} step={1} onChange={setMonths} format={v => `${v}m`} />
          <div className="border-t border-zinc-700 pt-3">
            <SliderRow label="Market forward price — drag this" value={marketFwd} min={50} max={140} step={0.5} onChange={setMarketFwd} format={v => `$${v.toFixed(1)}`} amber />
          </div>
          {/* Cost breakdown */}
          <div className="bg-zinc-950 border border-zinc-800 p-3 text-xs font-mono space-y-1 mt-2">
            <div className="text-zinc-500 uppercase tracking-wider mb-2">Cost of Carry Breakdown</div>
            <div className="flex justify-between"><span className="text-blue-400">Spot</span><span>${spot.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-yellow-400">Storage ({months}m)</span><span>+${totalStorage.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-orange-400">Financing</span><span>+${financing.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-zinc-700 pt-1 mt-1"><span className="text-white font-bold">Fair Forward</span><span className="text-white font-bold">${fairFwd.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Visualization */}
        <div>
          {/* Bar chart */}
          <div className="relative bg-black border border-zinc-800 mb-3" style={{ height: `${containerH}px` }}>

            {/* Fair forward stacked bar */}
            <div className="absolute bottom-8 left-8 flex flex-col-reverse" style={{ width: '36%', height: `${fairH}px` }}>
              <div className="w-full bg-blue-600 shrink-0 flex items-center justify-center" style={{ height: `${spotH}px` }}>
                {spotH > 14 && <span className="text-white text-xs font-mono">${spot}</span>}
              </div>
              <div className="w-full bg-yellow-500 shrink-0" style={{ height: `${storageH}px` }} />
              <div className="w-full bg-orange-500 shrink-0" style={{ height: `${financingH}px` }} />
            </div>
            {/* Fair forward value label */}
            <div className="absolute font-mono text-xs font-bold text-white"
              style={{ bottom: `${fairH + 34}px`, left: '8px', width: '36%', textAlign: 'center' }}>
              ${fairFwd.toFixed(2)}
            </div>
            <div className="absolute text-zinc-600 font-mono text-xs"
              style={{ bottom: '2px', left: '8px', width: '36%', textAlign: 'center' }}>
              FAIR VALUE
            </div>

            {/* Market forward bar */}
            <div className="absolute bottom-8 right-8 transition-all duration-200 shrink-0"
              style={{ width: '36%', height: `${marketH}px`, backgroundColor: hasArbitrage ? '#9333ea' : '#52525b' }}>
              {marketH > 14 && (
                <div className="flex items-center justify-center h-full">
                  <span className="text-white text-xs font-mono">${marketFwd.toFixed(1)}</span>
                </div>
              )}
            </div>
            {/* Market forward value label */}
            <div className={`absolute font-mono text-xs font-bold transition-all duration-200 ${hasArbitrage ? 'text-purple-400' : 'text-white'}`}
              style={{ bottom: `${marketH + 34}px`, right: '8px', width: '36%', textAlign: 'center' }}>
              ${marketFwd.toFixed(1)}
            </div>
            <div className="absolute text-zinc-600 font-mono text-xs"
              style={{ bottom: '2px', right: '8px', width: '36%', textAlign: 'center' }}>
              MARKET FWD
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-3">
            {[['#2563eb','Spot'],['#eab308','Storage'],['#f97316','Financing'],['#9333ea','Market Fwd']] .map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: c }} />
                <span className="text-zinc-500 text-xs font-mono">{l}</span>
              </div>
            ))}
          </div>

          {/* Result */}
          <div className={`p-3 border text-xs font-mono transition-colors duration-200 ${hasArbitrage ? 'border-green-700 bg-green-950 text-green-400' : 'border-zinc-700 bg-zinc-950 text-zinc-400'}`}>
            {hasArbitrage ? (
              <div>
                <div className="text-green-300 font-bold mb-1">⚠ ARBITRAGE OPPORTUNITY DETECTED</div>
                <div>Buy spot ${spot} → store ${totalStorage.toFixed(2)} → finance ${financing.toFixed(2)}</div>
                <div>Sell forward ${marketFwd.toFixed(1)} vs fair value ${fairFwd.toFixed(2)}</div>
                <div className="text-green-300 font-bold mt-1">Risk-free profit: +${profit.toFixed(2)} / unit</div>
                <div className="text-zinc-500 mt-1">→ Arbitrageurs sell the forward until price collapses back to ${fairFwd.toFixed(2)}</div>
              </div>
            ) : (
              <div>
                <div className="font-bold mb-1 text-zinc-300">NO CASH-AND-CARRY ARBITRAGE</div>
                <div>Market fwd ${marketFwd.toFixed(1)} ≤ fair cost of carry ${fairFwd.toFixed(2)}</div>
                <div className="mt-1 text-zinc-500">Physical storage is not economic at this spread. No risk-free trade exists.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
