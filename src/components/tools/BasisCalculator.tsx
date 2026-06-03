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
      <h2 className="text-xl font-bold text-amber-400 mb-6">Basis / Differential Calculator</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Futures price ($/MT)', value: futuresPrice, set: setFuturesPrice, step: 1 },
          { label: 'Differential (±$/MT)', value: differential, set: setDifferential, step: 1 },
          { label: 'FX rate (USD → local)', value: fxRate, set: setFxRate, step: 0.01 },
        ].map(({ label, value, set, step }) => {
          const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          return (
            <div key={label}>
              <label htmlFor={id} className="block text-xs text-slate-400 mb-1">{label}</label>
              <input
                id={id}
                type="number"
                value={value}
                step={step}
                onChange={e => set(Number(e.target.value))}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )
        })}
      </div>
      <div className="bg-slate-800 rounded-xl p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-400 text-sm">Futures price</span>
          <span className="text-white font-semibold">${futuresPrice.toLocaleString()}/MT</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 text-sm">Differential</span>
          <span className={`font-semibold ${diffColor}`}>
            {differential >= 0 ? '+' : ''}${differential}/MT
          </span>
        </div>
        <div className="border-t border-slate-700 pt-3 flex justify-between">
          <span className="text-slate-400 text-sm">Physical price (USD)</span>
          <span className="text-amber-400 font-bold text-lg">${physicalUSD.toLocaleString()}/MT</span>
        </div>
        {fxRate !== 1 && (
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Physical price (local)</span>
            <span className="text-white font-semibold">{physicalLocal.toLocaleString('en-US', { maximumFractionDigits: 2 })}/MT</span>
          </div>
        )}
      </div>
    </div>
  )
}
