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

const RULES = [
  {
    key: 'positionLimits',
    label: '1. Position Limits',
    tag: 'EX-ANTE',
    tagColor: 'text-blue-400',
    sub: 'C_eff = min(C, 0.20)',
  },
  {
    key: 'lending',
    label: '2. LME Lending Rules',
    tag: 'EX-POST',
    tagColor: 'text-orange-400',
    sub: 'Spread × 0.5',
  },
  {
    key: 'cap',
    label: '3. Backwardation Cap',
    tag: 'EX-POST',
    tagColor: 'text-orange-400',
    sub: 'Spread ≤ $50',
  },
]

export default function SqueezeSimulator() {
  const [supply, setSupply] = useState(50)
  const [demand, setDemand] = useState(100)
  const [concentration, setConcentration] = useState(40)
  const [rulePositionLimits, setRulePositionLimits] = useState(false)
  const [ruleLending, setRuleLending] = useState(false)
  const [ruleCap, setRuleCap] = useState(false)

  // Baseline deferred forward curve
  const p1M = 98, p2M = 96, p3M = 95, p6M = 93
  const k = 3

  // ── Unconstrained free-market formula ──────────────────────────────
  // P_spot = P_1M + (D / S) × e^(k × C)
  const cFree = concentration / 100
  const rawSpotFree = p1M + (demand / supply) * Math.exp(k * cFree)

  // ── Regulated cascade ──────────────────────────────────────────────
  // Step 1 — Position Limits (ex-ante): C_eff = min(C, 0.20)
  const cEffective = rulePositionLimits ? Math.min(cFree, 0.20) : cFree
  const rawSpotReg = p1M + (demand / supply) * Math.exp(k * cEffective)

  // Step 2 — Spread from 1M forward
  let spread = rawSpotReg - p1M

  // Step 3 — Lending Rules (ex-post): Spread_constrained = Spread × 0.5
  if (ruleLending) spread = spread * 0.5

  // Step 4 — Backwardation Cap (ex-post): P_spot = min(P_spot, P_1M + 50)
  if (ruleCap) spread = Math.min(spread, 50)

  const finalSpotReg = p1M + spread

  const chartData = [
    { month: 'Spot', FreeMarket: Math.round(rawSpotFree), Regulated: Math.round(finalSpotReg) },
    { month: '1M', FreeMarket: p1M, Regulated: p1M },
    { month: '2M', FreeMarket: p2M, Regulated: p2M },
    { month: '3M', FreeMarket: p3M, Regulated: p3M },
    { month: '6M', FreeMarket: p6M, Regulated: p6M },
  ]

  // Formula string for display
  const dsRatio = (demand / supply).toFixed(2)
  const expArg = (k * cEffective).toFixed(2)
  const expVal = Math.exp(k * cEffective).toFixed(2)
  const rawSpread = (demand / supply) * Math.exp(k * cEffective)

  return (
    <div className="mt-5 bg-zinc-950 border border-zinc-700 p-5">
      <div className="text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
        Market Squeeze &amp; Intervention Simulator
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT: Controls */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">

          {/* Market fundamentals */}
          <div className="bg-zinc-900 border border-zinc-800 p-4">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-3">Market Fundamentals</div>
            <div className="space-y-3">
              <SliderRow label={`Deliverable Supply (S): ${supply}`} value={supply} min={5} max={150} onChange={setSupply} />
              <SliderRow label={`Short Covering Demand (D): ${demand}`} value={demand} min={10} max={200} onChange={setDemand} />
              <SliderRow label={`Long Concentration (C): ${concentration}%`} value={concentration} min={0} max={100} onChange={setConcentration} />
            </div>
          </div>

          {/* Exchange rules */}
          <div className="bg-zinc-900 border border-amber-900 p-4">
            <div className="text-amber-400 text-xs font-mono uppercase tracking-wider mb-3">Exchange Interventions</div>
            <div className="space-y-3">
              {RULES.map((r, i) => {
                const states = [rulePositionLimits, ruleLending, ruleCap]
                const toggles = [
                  () => setRulePositionLimits(v => !v),
                  () => setRuleLending(v => !v),
                  () => setRuleCap(v => !v),
                ]
                const active = states[i]
                return (
                  <label key={r.key} className="flex items-start gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={active} onChange={toggles[i]}
                      className="accent-amber-500 w-4 h-4 cursor-pointer shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono ${active ? 'text-amber-400' : 'text-zinc-400'}`}>{r.label}</span>
                        <span className={`text-xs font-mono ${r.tagColor} opacity-70`}>{r.tag}</span>
                      </div>
                      <div className="text-zinc-600 font-mono text-xs">{r.sub}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Spot price readout */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black border border-zinc-800 p-3">
              <div className="text-zinc-600 text-xs font-mono uppercase mb-1">Free Market</div>
              <div className="text-red-400 font-mono font-bold text-xl">${Math.round(rawSpotFree)}</div>
              <div className="text-zinc-700 text-xs font-mono">unconstrained</div>
            </div>
            <div className="bg-black border border-zinc-800 p-3">
              <div className="text-zinc-600 text-xs font-mono uppercase mb-1">Regulated</div>
              <div className="text-green-400 font-mono font-bold text-xl">${Math.round(finalSpotReg)}</div>
              <div className="text-zinc-700 text-xs font-mono">with rules</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Chart + formula */}
        <div className="flex-1 space-y-3">

          {/* Formula breakdown */}
          <div className="bg-black border border-zinc-800 p-3 font-mono text-xs">
            <div className="text-zinc-500 uppercase tracking-wider mb-2">Active Formula</div>
            <div className="text-zinc-400">
              P<sub>spot</sub> = P<sub>1M</sub> + (D/S) × e<sup>k·C</sup>
            </div>
            <div className="text-zinc-600 mt-1">
              = {p1M} + ({dsRatio}) × e<sup>{expArg}</sup>
              = {p1M} + {dsRatio} × {expVal}
              = <span className={rulePositionLimits || ruleLending || ruleCap ? 'text-zinc-400' : 'text-red-400 font-bold'}>${Math.round(rawSpotFree)}</span>
            </div>

            {(rulePositionLimits || ruleLending || ruleCap) && (
              <div className="border-t border-zinc-800 mt-2 pt-2 space-y-1 text-zinc-600">
                {rulePositionLimits && (
                  <div className="text-blue-400">
                    Ex-ante: C<sub>eff</sub> = min({cFree.toFixed(2)}, 0.20) = {cEffective.toFixed(2)}
                    → raw spread = ${rawSpread.toFixed(2)}
                  </div>
                )}
                {ruleLending && (
                  <div className="text-orange-400">
                    Ex-post (Lending): Spread × 0.5 = ${(spread * (ruleCap ? 1 : 1)).toFixed(2)}
                  </div>
                )}
                {ruleCap && (
                  <div className="text-orange-400">
                    Ex-post (Cap): min(spread, $50) → spread = ${spread.toFixed(2)}
                  </div>
                )}
                <div className="text-green-400 font-bold">
                  P<sub>spot</sub> = {p1M} + ${spread.toFixed(2)} = <span>${Math.round(finalSpotReg)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="bg-black border border-zinc-800 p-4" style={{ minHeight: '260px' }}>
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-3">
              Forward Curve — Spot to 6 Months
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month"
                  tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#3f3f46' }} tickLine={false} />
                <YAxis domain={['auto', 'auto']}
                  tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #3f3f46', fontFamily: 'monospace', fontSize: '11px' }}
                  labelStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`$${value}`, undefined]}
                />
                <Legend iconSize={10}
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#71717a', paddingTop: '4px' }} />
                <Line type="monotone" dataKey="FreeMarket" name="Unconstrained Market"
                  stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5"
                  dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Regulated" name="With Exchange Rules"
                  stroke="#22c55e" strokeWidth={2.5}
                  dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Teaching note */}
          <div className="text-zinc-600 text-xs font-mono border-t border-zinc-800 pt-2">
            <span className="text-blue-400">EX-ANTE</span> rules constrain C before the squeeze forms (prevent).
            &nbsp;<span className="text-orange-400">EX-POST</span> rules treat the spread after it forms (cure).
          </div>
        </div>

      </div>
    </div>
  )
}
