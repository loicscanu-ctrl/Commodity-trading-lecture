'use client'

import { useState } from 'react'

export default function BasisCalculator() {
  const [futuresPrice, setFuturesPrice] = useState(2500)
  const [differential, setDifferential] = useState(35)
  const [fxRate, setFxRate] = useState(1)

  const physicalUSD = futuresPrice + differential
  const physicalLocal = physicalUSD * fxRate
  const diffColor = differential >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-amber-400 text-xs font-mono tracking-widest uppercase mb-6 border-b border-zinc-800 pb-3">
        Basis / Differential Calculator
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Futures price ($/MT)', value: futuresPrice, set: setFuturesPrice, step: 1 },
          { label: 'Differential (±$/MT)', value: differential, set: setDifferential, step: 1 },
          { label: 'FX rate (USD → local)', value: fxRate, set: setFxRate, step: 0.01 },
        ].map(({ label, value, set, step }) => {
          const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          return (
            <div key={label}>
              <label htmlFor={id} className="block text-xs font-mono text-zinc-500 mb-1 uppercase tracking-wider">{label}</label>
              <input
                id={id}
                type="number"
                value={value}
                step={step}
                onChange={e => set(Number(e.target.value))}
                className="w-full bg-black text-amber-400 font-mono px-3 py-2 border border-zinc-700 focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
          )
        })}
      </div>
      <div className="bg-black border border-zinc-800 p-4 space-y-1">
        <div className="flex justify-between py-1">
          <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Futures price</span>
          <span className="text-white font-mono font-bold text-sm">${futuresPrice.toLocaleString()}/MT</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Differential</span>
          <span className={`font-mono font-bold text-sm ${diffColor}`}>
            {differential >= 0 ? '+' : ''}${differential}/MT
          </span>
        </div>
        <div className="border-t border-zinc-800 my-2" />
        <div className="flex justify-between py-1">
          <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Physical price (USD)</span>
          <span className="text-amber-400 font-mono font-bold text-lg">${physicalUSD.toLocaleString()}/MT</span>
        </div>
        {fxRate !== 1 && (
          <div className="flex justify-between py-1">
            <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Physical (local)</span>
            <span className="text-white font-mono font-bold text-sm">{physicalLocal.toLocaleString('en-US', { maximumFractionDigits: 2 })}/MT</span>
          </div>
        )}
      </div>
    </div>
  )
}
