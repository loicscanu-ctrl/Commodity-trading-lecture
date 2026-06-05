'use client'

import { useState } from 'react'

export default function BasisCalculator() {
  const [futuresPrice, setFuturesPrice] = useState(2500)
  const [differential, setDifferential] = useState(35)
  const [fxRate, setFxRate] = useState(1)

  const physicalUSD = futuresPrice + differential
  const physicalLocal = physicalUSD * fxRate
  const diffColor = differential >= 0 ? 'text-emerald-400' : 'text-rose-400'

  return (
    <div className="glass max-w-2xl mx-auto px-6 py-8">
      <h2 className="eyebrow mb-6 border-b border-white/10 pb-3">
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
              <label htmlFor={id} className="eyebrow block mb-1.5">{label}</label>
              <input
                id={id}
                type="number"
                value={value}
                step={step}
                onChange={e => set(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-sm tabular-nums text-white outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              />
            </div>
          )
        })}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
        <div className="flex justify-between py-1">
          <span className="eyebrow">Futures price</span>
          <span className="text-white font-mono font-bold text-sm tabular-nums">${futuresPrice.toLocaleString()}/MT</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="eyebrow">Differential</span>
          <span className={`font-mono font-bold text-sm tabular-nums ${diffColor}`}>
            {differential >= 0 ? '+' : ''}${differential}/MT
          </span>
        </div>
        <div className="border-t border-white/10 my-2" />
        <div className="flex justify-between items-baseline py-1">
          <span className="eyebrow">Physical price (USD)</span>
          <span className="text-brand-cyan font-mono font-bold text-3xl tabular-nums">${physicalUSD.toLocaleString()}/MT</span>
        </div>
        {fxRate !== 1 && (
          <div className="flex justify-between py-1">
            <span className="eyebrow">Physical (local)</span>
            <span className="text-white font-mono font-bold text-sm tabular-nums">{physicalLocal.toLocaleString('en-US', { maximumFractionDigits: 2 })}/MT</span>
          </div>
        )}
      </div>
    </div>
  )
}
