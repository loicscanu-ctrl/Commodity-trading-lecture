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
      <label htmlFor={id} className="eyebrow block mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-sm tabular-nums text-white outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
      />
    </div>
  )
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="eyebrow">{label}</span>
      <span className={`font-mono font-bold text-sm tabular-nums ${color ?? 'text-white'}`}>{value}</span>
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
    <div className="glass max-w-2xl mx-auto px-6 py-8">
      <h2 className="eyebrow mb-6 border-b border-white/10 pb-3">
        Hedging Exposure Calculator
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Position (lots)" value={lots} onChange={setLots} min={1} />
        <Field label="Lot size (MT)" value={lotSizeMT} onChange={setLotSizeMT} min={1} />
        <Field label="Price ($/MT)" value={pricePerMT} onChange={setPricePerMT} min={0} />
        <Field label="Hedge ratio (%)" value={hedgeRatio} onChange={setHedgeRatio} min={0} max={100} />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
        <Row label="Total exposure (MT)" value={`${totalMT.toLocaleString()} MT`} />
        <Row label="Total exposure (USD)" value={fmtUSD(totalUSD)} />
        <div className="border-t border-white/10 my-2" />
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2.5">
            <div className="eyebrow text-emerald-400/80 mb-1">Covered</div>
            <div className="font-mono text-2xl font-bold tabular-nums text-emerald-400">{fmtUSD(coveredUSD)}</div>
          </div>
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2.5">
            <div className="eyebrow text-rose-400/80 mb-1">Uncovered</div>
            <div className="font-mono text-2xl font-bold tabular-nums text-rose-400">{fmtUSD(uncoveredUSD)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
