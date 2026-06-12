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

// The standard "Worldscale tanker" — the theoretical vessel every flat rate is built on.
const STANDARD_TANKER: [string, string][] = [
  ['Capacity', '75,000 MT dwt'],
  ['Average speed', '12.5 knots'],
  ['Bunkers — steaming', '30 mt/day'],
  ['Bunkers — in port', '5 mt/port'],
  ['Port time', '4 days / voyage'],
  ['Fixed hire', '$16,000 / day'],
]

export default function WorldscaleCalculator() {
  const [flat, setFlat] = useState(4.68)
  const [ws, setWs] = useState(130)
  const [cargo, setCargo] = useState(80000)

  const actualRate = flat * ws / 100
  const voyageCost = cargo * actualRate
  const premium = ws >= 100

  const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmt0 = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 })

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">Worldscale Freight Calculator</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: controls + standard tanker */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">Voyage Inputs</div>
          <Slider label="Flat rate — WS100 ($/MT)" value={flat} min={1} max={40} step={0.01} onChange={setFlat} display={`$${fmt2(flat)}`} />
          <Slider label="Cargo size (MT)" value={cargo} min={20000} max={300000} step={5000} onChange={setCargo} display={`${fmt0(cargo)} MT`} />

          <div className="border-t border-white/10 pt-3">
            <div className="eyebrow text-brand-cyan mb-1">Negotiated market rate ↓</div>
            <Slider label="Worldscale points (WS)" value={ws} min={20} max={300} step={1} onChange={setWs} display={`WS${ws}`} amber />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] mt-1">
            <div className="eyebrow mb-2">The Worldscale tanker</div>
            <div className="space-y-1">
              {STANDARD_TANKER.map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-slate-200 tabular-nums">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-500 mt-2 leading-relaxed">A theoretical 75kt vessel on a round-trip voyage. Its full cost ÷ cargo = the flat rate (WS100), recalculated annually.</p>
          </div>
        </div>

        {/* RIGHT: result */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 font-mono text-xs">
            <div className="eyebrow mb-3">Actual rate paid</div>
            <div className="text-slate-300 leading-relaxed">
              Flat rate × (WS ÷ 100)
            </div>
            <div className="text-slate-100 mt-1">
              ${fmt2(flat)} × {ws}/100 = <span className="text-amber-300 font-bold text-base">${actualRate.toFixed(3)}/MT</span>
            </div>
            <div className="mt-2">
              <span className={`chip ${premium ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                {premium ? `WS${ws} — ${ws}% of flat (premium)` : `WS${ws} — ${ws}% of flat (discount)`}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-4 font-mono text-xs tabular-nums">
            <div className="eyebrow text-emerald-400 mb-2">Total voyage freight</div>
            <div className="text-slate-300">{fmt0(cargo)} MT × ${actualRate.toFixed(3)}/MT</div>
            <div className="text-white font-bold text-2xl mt-1">${fmt0(voyageCost)}</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-slate-200 font-semibold">Order of operations:</span> Blue-page load-port extensions and <em>variable</em> differentials are added to the flat rate <span className="text-brand-cyan">before</span> the WS% is applied; <em>fixed</em> differentials are added <span className="text-amber-400">after</span>.
          </div>
        </div>
      </div>
    </div>
  )
}
