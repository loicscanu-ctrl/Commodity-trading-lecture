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

// Entry: buy 100 t physical at London futures + entry diff, hedge by selling futures.
const F_ENTRY = 2400
const TONNES = 100

export default function BasisPnl() {
  const [dEntry, setDEntry] = useState(10)
  const [dExit, setDExit] = useState(-20)
  const [fExit, setFExit] = useState(2250)

  const buyPrice = F_ENTRY + dEntry
  const sellPrice = fExit + dExit
  const physical = sellPrice - buyPrice          // physical leg, $/t
  const futures = F_ENTRY - fExit                // short hedge leg, $/t
  const net = physical + futures                 // = dExit − dEntry
  const basisMove = dExit - dEntry

  const usd = (n: number) => (n < 0 ? '−' : '+') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US')
  const flat = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

  const rows = [
    { name: 'Physical leg', detail: `sell ${flat(sellPrice)} − buy ${flat(buyPrice)}`, v: physical },
    { name: 'Futures leg (short hedge)', detail: `sold ${flat(F_ENTRY)} − bought back ${flat(fExit)}`, v: futures },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">Hedged Trade P&amp;L · long the basis (100 t Robusta, $/t)</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: inputs */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs space-y-1.5">
            <div className="eyebrow mb-1">Entry (both legs at once)</div>
            <div className="flex justify-between"><span className="text-slate-400">Buy physical at</span><span className="text-white">London {flat(F_ENTRY)} + ${dEntry} = <b>{flat(buyPrice)}</b></span></div>
            <div className="flex justify-between"><span className="text-slate-400">Hedge: sell futures at</span><span className="text-white">{flat(F_ENTRY)}</span></div>
          </div>

          <Slider label="Entry differential ($/t)" value={dEntry} min={-100} max={100} step={5} onChange={setDEntry} display={`${dEntry >= 0 ? '+' : ''}${dEntry}`} />
          <Slider label="Exit differential ($/t)" value={dExit} min={-100} max={100} step={5} onChange={setDExit} display={`${dExit >= 0 ? '+' : ''}${dExit}`} />

          <div className="border-t border-white/10 pt-3">
            <div className="eyebrow text-brand-cyan mb-1">The flat price shouldn&apos;t matter — prove it ↓</div>
            <Slider label="Futures at exit ($/t)" value={fExit} min={1800} max={3000} step={10} onChange={setFExit} display={flat(fExit)} amber />
          </div>
        </div>

        {/* RIGHT: the three legs */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
            <div className="eyebrow mb-2">P&amp;L decomposition ($/t)</div>
            <div className="space-y-1.5">
              {rows.map(r => (
                <div key={r.name} className="flex justify-between gap-2">
                  <span className="text-slate-400">{r.name} <span className="text-slate-600">({r.detail})</span></span>
                  <span className={r.v >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{usd(r.v)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-white/15 pt-1.5">
                <span className="text-white font-bold">Net = basis move</span>
                <span className={`font-bold ${net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{usd(net)}/t</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-4 border font-mono text-xs tabular-nums ${
            net >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'
          }`}>
            <div className={`eyebrow mb-1 ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Basis {basisMove >= 0 ? 'strengthened' : 'weakened'} {usd(basisMove)}/t
            </div>
            <div className={`font-bold text-3xl ${net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {usd(net * TONNES)}
            </div>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              on {TONNES} t — exactly (exit diff {dExit >= 0 ? '+' : ''}{dExit}) − (entry diff {dEntry >= 0 ? '+' : ''}{dEntry}), whatever the flat price did. The hedged trader&apos;s whole P&amp;L <em>is</em> the differential.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
