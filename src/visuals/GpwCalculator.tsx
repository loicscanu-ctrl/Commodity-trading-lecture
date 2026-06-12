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

// North Sea crude simple-distillation yields (% weight). 2% fuel & loss carries no value.
const YIELDS = [
  { key: 'naphtha', name: 'Naphtha', yield: 0.23, color: '#3b82f6', def: 530.00 },
  { key: 'kero', name: 'Kerosene', yield: 0.14, color: '#22d3ee', def: 597.25 },
  { key: 'gasoil', name: 'Gas oil', yield: 0.28, color: '#f59e0b', def: 558.25 },
  { key: 'fueloil', name: 'Fuel oil 1%', yield: 0.33, color: '#f43f5e', def: 315.00 },
] as const

const BBL_PER_MT = 7.55 // Brent

export default function GpwCalculator() {
  const [prices, setPrices] = useState<number[]>(YIELDS.map(y => y.def))
  const [crude, setCrude] = useState(59.16) // $/bbl

  const contributions = YIELDS.map((y, i) => y.yield * prices[i])
  const gpwMt = contributions.reduce((s, v) => s + v, 0)
  const gpwBbl = gpwMt / BBL_PER_MT
  const margin = gpwBbl - crude
  const positive = margin >= 0

  const maxContrib = Math.max(...contributions, 1)
  const usd = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">Gross Product Worth &amp; Refinery Margin</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: controls */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">Product prices ($/MT)</div>
          {YIELDS.map((y, i) => (
            <Slider key={y.key} label={`${y.name} · ${(y.yield * 100).toFixed(0)}% yield`} value={prices[i]}
              min={150} max={900} step={0.25} onChange={v => setPrices(p => p.map((x, j) => (j === i ? v : x)))}
              display={`$${usd(prices[i])}`} />
          ))}
          <div className="border-t border-white/10 pt-3">
            <div className="eyebrow text-brand-cyan mb-1">Crude cost ↓</div>
            <Slider label="Crude price ($/bbl)" value={crude} min={20} max={120} step={0.01} onChange={setCrude} display={`$${usd(crude)}`} amber />
          </div>
        </div>

        {/* RIGHT: results */}
        <div className="space-y-3">
          {/* Contribution bars */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="eyebrow mb-3">Value contribution (yield × price)</div>
            <div className="space-y-2">
              {YIELDS.map((y, i) => (
                <div key={y.key}>
                  <div className="flex justify-between text-[11px] font-mono mb-0.5">
                    <span className="text-slate-300">{y.name}</span>
                    <span className="text-white tabular-nums">${usd(contributions[i])}/MT</span>
                  </div>
                  <div className="h-2 rounded bg-white/[0.04] overflow-hidden">
                    <div className="h-full rounded" style={{ width: `${(contributions[i] / maxContrib) * 100}%`, backgroundColor: y.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-white/10 mt-3 pt-2 font-mono text-xs">
              <span className="text-white font-bold">Gross Product Worth</span>
              <span className="text-white font-bold tabular-nums">${usd(gpwMt)}/MT</span>
            </div>
            <div className="flex justify-between font-mono text-[11px] text-slate-400 mt-1">
              <span>÷ {BBL_PER_MT} bbl/MT</span>
              <span className="tabular-nums">${usd(gpwBbl)}/bbl</span>
            </div>
          </div>

          {/* Margin */}
          <div className={`rounded-xl p-4 border font-mono text-xs tabular-nums transition-colors ${
            positive ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'
          }`}>
            <div className={`eyebrow mb-1 ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>Refinery margin (GPW − crude)</div>
            <div className="text-slate-300">${usd(gpwBbl)}/bbl − ${usd(crude)}/bbl</div>
            <div className={`font-bold text-3xl mt-1 ${positive ? 'text-emerald-300' : 'text-rose-300'}`}>
              {margin < 0 ? '−' : '+'}${usd(Math.abs(margin))}<span className="text-base font-normal text-slate-400">/bbl</span>
            </div>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              {positive
                ? 'Positive margin — distilling this crude into products pays.'
                : 'Negative margin — the crude costs more than its product slate is worth; runs get cut.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
