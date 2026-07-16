'use client'

import { useState } from 'react'

function Slider({ label, value, min, max, step, onChange, display }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        <span className="text-xs font-mono font-bold tabular-nums text-white">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 cursor-pointer accent-brand-blue" />
    </div>
  )
}

// World coffee balance, USDA FAS December-2024 vintage (million 60-kg bags).
const BEGIN = 14.1
const BRAZIL = 66.4
const VIETNAM = 30.1
const OTHER = 78.4
const CONSUMPTION = 168.1

const BASE_PROD = BRAZIL + VIETNAM + OTHER
const BASE_END = BEGIN + BASE_PROD - CONSUMPTION
const BASE_STU = (BASE_END / CONSUMPTION) * 100

function band(stu: number) {
  if (stu >= 25) return { label: 'ample', cls: 'text-emerald-300', box: 'border-emerald-500/30 bg-emerald-500/[0.08]' }
  if (stu >= 15) return { label: 'balanced', cls: 'text-slate-200', box: 'border-white/10 bg-white/[0.03]' }
  return { label: 'tight', cls: 'text-rose-300', box: 'border-rose-500/40 bg-rose-500/[0.10]' }
}

export default function SdScenario() {
  const [bShock, setBShock] = useState(-5)
  const [vShock, setVShock] = useState(0)
  const [cGrowth, setCGrowth] = useState(0)

  const prod = BRAZIL * (1 + bShock / 100) + VIETNAM * (1 + vShock / 100) + OTHER
  const cons = CONSUMPTION * (1 + cGrowth / 100)
  const end = BEGIN + prod - cons
  const stu = (end / cons) * 100
  const dEnd = end - BASE_END
  const b = band(stu)

  const f1 = (n: number) => n.toFixed(1)

  // Comparison bars
  const maxEnd = Math.max(BASE_END, end, 30)
  const barW = (v: number) => `${Math.max(0, (v / maxEnd) * 100)}%`

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1">S&amp;D Scenario Lab · world coffee 2024/25</div>
      <p className="mb-4 text-[11px] text-slate-500">Baseline: USDA FAS, Dec-2024 vintage, million 60-kg bags. Shock the balance and watch the residual.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: shocks */}
        <div className="space-y-3">
          <Slider label={`Brazil production (${f1(BRAZIL)} M bags)`} value={bShock} min={-15} max={15} step={1} onChange={setBShock} display={`${bShock >= 0 ? '+' : ''}${bShock}%`} />
          <Slider label={`Vietnam production (${f1(VIETNAM)} M bags)`} value={vShock} min={-15} max={15} step={1} onChange={setVShock} display={`${vShock >= 0 ? '+' : ''}${vShock}%`} />
          <Slider label={`World consumption (${f1(CONSUMPTION)} M bags)`} value={cGrowth} min={-3} max={3} step={0.5} onChange={setCGrowth} display={`${cGrowth >= 0 ? '+' : ''}${cGrowth}%`} />

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums space-y-1.5">
            <div className="eyebrow mb-1">The identity</div>
            <div className="flex justify-between"><span className="text-slate-400">Beginning stocks</span><span className="text-white">{f1(BEGIN)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">+ Production</span><span className="text-white">{f1(prod)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">− Consumption</span><span className="text-white">{f1(cons)}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-1.5"><span className="text-white font-bold">= Ending stocks</span><span className="text-white font-bold">{f1(end)} M bags</span></div>
          </div>
        </div>

        {/* RIGHT: result */}
        <div className="space-y-3">
          {/* Ending-stock bars */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="eyebrow mb-2">Ending stocks (M bags)</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-0.5">
                  <span className="text-slate-400">Baseline</span><span className="text-slate-200 tabular-nums">{f1(BASE_END)} · STU {f1(BASE_STU)}%</span>
                </div>
                <div className="h-2.5 rounded bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded bg-slate-500" style={{ width: barW(BASE_END) }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-0.5">
                  <span className="text-brand-cyan">Scenario</span>
                  <span className="text-white tabular-nums">{f1(end)} · STU {f1(stu)}%</span>
                </div>
                <div className="h-2.5 rounded bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded bg-brand-blue" style={{ width: barW(end) }} />
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-4 border font-mono text-xs tabular-nums ${b.box}`}>
            <div className="eyebrow mb-1">Stocks-to-use</div>
            <div className={`font-bold text-3xl ${b.cls}`}>{f1(stu)}% <span className="text-sm font-normal text-slate-400">({b.label})</span></div>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              Ending stocks {dEnd >= 0 ? 'build' : 'draw'} {f1(Math.abs(dEnd))} M bags vs baseline ({f1((end / cons) * 365)} days of consumption in stock). Below ~15% every extra point of tightness moves price disproportionately — the convexity zone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
