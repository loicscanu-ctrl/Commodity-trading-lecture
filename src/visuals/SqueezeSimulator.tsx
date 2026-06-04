'use client'

import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

function SliderRow({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="text-zinc-400 text-xs font-mono mb-1">{label}</div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-amber-500 h-1 cursor-pointer" />
    </div>
  )
}

export default function SqueezeSimulator() {
  const [supply, setSupply] = useState(50)
  const [demand, setDemand] = useState(100)
  const [concentration, setConcentration] = useState(40)
  const [rulePositionLimits, setRulePositionLimits] = useState(false)
  const [ruleLending, setRuleLending] = useState(false)
  const [ruleCap, setRuleCap] = useState(false)

  // Baseline deferred curve (no squeeze)
  const p1M = 98, p2M = 96, p3M = 95, p6M = 93

  // Unconstrained free market spot
  const cFree = concentration / 100
  const rawSpotFree = 100 + (demand / supply) * Math.exp(3 * cFree)

  // Regulated market spot (rules applied in cascade)
  const cEffective = rulePositionLimits ? Math.min(cFree, 0.20) : cFree
  const rawSpotReg = 100 + (demand / supply) * Math.exp(3 * cEffective)
  let spread = rawSpotReg - p1M
  if (ruleLending) spread = spread * 0.5
  if (ruleCap) spread = Math.min(spread, 50)
  const finalSpotReg = p1M + spread

  const chartData = [
    { month: 'Spot', FreeMarket: Math.round(rawSpotFree), Regulated: Math.round(finalSpotReg) },
    { month: '1M',   FreeMarket: p1M, Regulated: p1M },
    { month: '2M',   FreeMarket: p2M, Regulated: p2M },
    { month: '3M',   FreeMarket: p3M, Regulated: p3M },
    { month: '6M',   FreeMarket: p6M, Regulated: p6M },
  ]

  const rules = [
    { state: rulePositionLimits, toggle: () => setRulePositionLimits(v => !v), label: '1. Position Limits (cap at 20%)' },
    { state: ruleLending,        toggle: () => setRuleLending(v => !v),        label: '2. Lending Rules (−50% premium)' },
    { state: ruleCap,            toggle: () => setRuleCap(v => !v),            label: '3. Backwardation Cap (max $50 spread)' },
  ]

  return (
    <div className="mt-5 bg-zinc-950 border border-zinc-700 p-5">
      <div className="text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
        Market Squeeze &amp; Intervention Simulator
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT: Controls */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">

          <div className="bg-zinc-900 border border-zinc-800 p-4">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-3">Market Fundamentals</div>
            <div className="space-y-3">
              <SliderRow label={`Deliverable Supply: ${supply}`} value={supply} min={5} max={150} onChange={setSupply} />
              <SliderRow label={`Short Covering Demand: ${demand}`} value={demand} min={10} max={200} onChange={setDemand} />
              <SliderRow label={`Long Concentration: ${concentration}%`} value={concentration} min={0} max={100} onChange={setConcentration} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-amber-900 p-4">
            <div className="text-amber-400 text-xs font-mono uppercase tracking-wider mb-3">Exchange Interventions</div>
            <div className="space-y-2.5">
              {rules.map(r => (
                <label key={r.label} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={r.state}
                    onChange={r.toggle}
                    className="accent-amber-500 w-4 h-4 cursor-pointer shrink-0"
                  />
                  <span className={`text-xs font-mono transition-colors ${r.state ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                    {r.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black border border-zinc-800 p-3">
              <div className="text-zinc-600 text-xs font-mono uppercase mb-1">Free Market</div>
              <div className="text-red-400 font-mono font-bold text-xl">${Math.round(rawSpotFree)}</div>
              <div className="text-zinc-700 text-xs font-mono">spot</div>
            </div>
            <div className="bg-black border border-zinc-800 p-3">
              <div className="text-zinc-600 text-xs font-mono uppercase mb-1">Regulated</div>
              <div className="text-green-400 font-mono font-bold text-xl">${Math.round(finalSpotReg)}</div>
              <div className="text-zinc-700 text-xs font-mono">spot</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Chart */}
        <div className="flex-1 bg-black border border-zinc-800 p-4" style={{ minHeight: '320px' }}>
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-3">
            Forward Curve — Spot to 6 Months
          </div>
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#3f3f46' }}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #3f3f46', fontFamily: 'monospace', fontSize: '11px' }}
                labelStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`$${value}`, undefined]}
              />
              <Legend
                iconSize={10}
                wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#71717a', paddingTop: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="FreeMarket"
                name="Unconstrained Market"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Regulated"
                name="With Exchange Rules"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
