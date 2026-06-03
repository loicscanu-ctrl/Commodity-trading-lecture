'use client'

import { useState } from 'react'

function fmtUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-slate-400 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
      />
    </div>
  )
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`font-semibold ${color ?? 'text-white'}`}>{value}</span>
    </div>
  )
}

export default function HedgingCalculator() {
  const [lots, setLots] = useState(100)
  const [lotSizeMT, setLotSizeMT] = useState(10)
  const [pricePerMT, setPricePerMT] = useState(2450)
  const [hedgeRatio, setHedgeRatio] = useState(80)

  const totalMT = lots * lotSizeMT
  const totalUSD = totalMT * pricePerMT
  const coveredUSD = totalUSD * (hedgeRatio / 100)
  const uncoveredUSD = totalUSD - coveredUSD

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-xl font-bold text-amber-400 mb-6">Hedging Exposure Calculator</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Position (lots)" value={lots} onChange={setLots} min={1} />
        <Field label="Lot size (MT)" value={lotSizeMT} onChange={setLotSizeMT} min={1} />
        <Field label="Price ($/MT)" value={pricePerMT} onChange={setPricePerMT} min={0} />
        <Field label="Hedge ratio (%)" value={hedgeRatio} onChange={setHedgeRatio} min={0} max={100} />
      </div>
      <div className="bg-slate-800 rounded-xl p-6 space-y-3">
        <Row label="Total exposure (MT)" value={`${totalMT.toLocaleString()} MT`} />
        <Row label="Total exposure (USD)" value={fmtUSD(totalUSD)} />
        <div className="border-t border-slate-700 pt-3 space-y-3">
          <Row label="Covered" value={fmtUSD(coveredUSD)} color="text-green-400" />
          <Row label="Uncovered" value={fmtUSD(uncoveredUSD)} color="text-red-400" />
        </div>
      </div>
    </div>
  )
}
