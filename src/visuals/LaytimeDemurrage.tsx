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

type Port = { id: string; label: string; side: 'load' | 'disport'; qty: number }
const PORTS: Port[] = [
  { id: 'A', label: 'LP1 · Supplier A', side: 'load', qty: 40 },
  { id: 'B', label: 'LP2 · Supplier B', side: 'load', qty: 60 },
  { id: 'C', label: 'DP1 · Buyer C', side: 'disport', qty: 50 },
  { id: 'D', label: 'DP2 · Buyer D', side: 'disport', qty: 50 },
]

export default function LaytimeDemurrage() {
  const [used, setUsed] = useState<number[]>([20, 30, 20, 40])
  const [cpLaytime, setCpLaytime] = useState(72)
  const [rate, setRate] = useState(50000) // pdpr
  const [exception, setException] = useState(false) // Buyer D bad clause

  const loadQty = PORTS.filter(p => p.side === 'load').reduce((s, p) => s + p.qty, 0)
  const disportQty = PORTS.filter(p => p.side === 'disport').reduce((s, p) => s + p.qty, 0)
  const sideLaytime = cpLaytime / 2

  const rows = PORTS.map((p, i) => {
    const sideQty = p.side === 'load' ? loadQty : disportQty
    let laytime = sideLaytime * (p.qty / sideQty) // prorated
    let partyRate = rate
    if (exception && p.id === 'D') {
      laytime = 0.5 * cpLaytime               // 50% of full C/P laytime
      partyRate = rate * (p.qty / disportQty) // rate prorated for part cargo
    }
    const onDem = Math.max(0, used[i] - laytime)
    const collected = (onDem / 24) * partyRate
    return { ...p, used: used[i], laytime, partyRate, onDem, collected }
  })

  const totalUsed = used.reduce((s, v) => s + v, 0)
  const totalCollected = rows.reduce((s, r) => s + r.collected, 0)
  const ownersOnDem = Math.max(0, totalUsed - cpLaytime)
  const ownersClaim = (ownersOnDem / 24) * rate
  const exposure = totalCollected - ownersClaim
  const protectedOk = Math.abs(exposure) < 1

  const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="eyebrow">Laytime &amp; Demurrage Exposure</div>
        <div className="flex flex-wrap gap-1.5">
          <span className="chip bg-white/5 text-slate-300">C/P laytime {cpLaytime}h</span>
          <span className="chip bg-white/5 text-slate-300">{usd(rate)} pdpr</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: controls */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">Time used at each port</div>
          {PORTS.map((p, i) => (
            <Slider key={p.id} label={p.label} value={used[i]} min={0} max={60} step={1}
              onChange={v => setUsed(u => u.map((x, j) => (j === i ? v : x)))} display={`${used[i]}h`} />
          ))}
          <div className="border-t border-white/10 pt-3 space-y-3">
            <Slider label="C/P laytime allowed" value={cpLaytime} min={24} max={120} step={1} onChange={setCpLaytime} display={`${cpLaytime}h`} />
            <Slider label="Demurrage rate (pdpr)" value={rate} min={10000} max={100000} step={2500} onChange={setRate} display={usd(rate)} />
          </div>

          {/* Buyer D clause toggle */}
          <button
            onClick={() => setException(e => !e)}
            className={`w-full rounded-xl border p-3 text-left transition-colors ${
              exception ? 'border-rose-500/40 bg-rose-500/[0.08]' : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Buyer D sales clause</span>
              <span className={`chip ${exception ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/15 text-emerald-400'}`}>
                {exception ? 'Bad clause' : 'Back-to-back'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              {exception
                ? '“Laytime: 50% of C/P laytime · demurrage rate as per C/P, prorated for part cargo.” Tap to revert.'
                : 'Prorated laytime at full C/P rate — mirrors the charter party. Tap to apply Buyer D’s generous clause.'}
            </p>
          </button>
        </div>

        {/* RIGHT: result */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 font-mono text-xs tabular-nums space-y-1.5">
            <div className="flex justify-between"><span className="text-slate-400">Total time used</span><span className="text-white">{totalUsed.toFixed(0)}h</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Laytime allowed</span><span className="text-white">{cpLaytime}h</span></div>
            <div className="flex justify-between"><span className="text-slate-400">On demurrage (vs C/P)</span><span className="text-white">{ownersOnDem.toFixed(0)}h</span></div>
            <div className="flex justify-between border-t border-white/10 pt-1.5"><span className="text-slate-300">Demurrage claimed by Owners</span><span className="text-rose-300 font-bold">{usd(ownersClaim)}</span></div>
            <div className="flex justify-between"><span className="text-slate-300">Collected from buyers/sellers</span><span className="text-emerald-300 font-bold">{usd(totalCollected)}</span></div>
          </div>

          <div className={`rounded-xl p-4 border tabular-nums font-mono text-xs transition-colors ${
            protectedOk
              ? 'border-emerald-500/30 bg-emerald-500/[0.08]'
              : 'border-rose-500/40 bg-rose-500/[0.10]'
          }`}>
            <div className={`eyebrow mb-1 ${protectedOk ? 'text-emerald-400' : 'text-rose-400'}`}>Trader demurrage exposure</div>
            <div className={`font-bold text-3xl ${protectedOk ? 'text-emerald-300' : 'text-rose-300'}`}>
              {exposure < -0.5 ? '−' : ''}{usd(Math.abs(exposure))}
            </div>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              {protectedOk
                ? 'Back-to-back: what you collect exactly covers the Owners’ claim. Zero exposure.'
                : 'One generous clause breaks the match — the trader eats the gap on a single voyage.'}
            </p>
          </div>
        </div>
      </div>

      {/* Per-party breakdown */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-[11px] font-mono tabular-nums">
          <thead>
            <tr className="text-slate-500 border-b border-white/10">
              <th className="text-left font-normal py-2 pr-2">Party</th>
              <th className="text-right font-normal px-2">Qty</th>
              <th className="text-right font-normal px-2">Laytime</th>
              <th className="text-right font-normal px-2">Used</th>
              <th className="text-right font-normal px-2">On dem.</th>
              <th className="text-right font-normal pl-2">Collected</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const flagged = exception && r.id === 'D'
              return (
                <tr key={r.id} className={`border-b border-white/5 ${flagged ? 'bg-rose-500/[0.06]' : ''}`}>
                  <td className="text-left py-2 pr-2 text-slate-300">{r.label}</td>
                  <td className="text-right px-2 text-slate-400">{r.qty}kt</td>
                  <td className={`text-right px-2 ${flagged ? 'text-rose-300' : 'text-slate-400'}`}>{r.laytime.toFixed(1)}h</td>
                  <td className="text-right px-2 text-slate-200">{r.used}h</td>
                  <td className="text-right px-2 text-slate-200">{r.onDem.toFixed(1)}h</td>
                  <td className="text-right pl-2 text-emerald-300">{usd(r.collected)}</td>
                </tr>
              )
            })}
            <tr className="font-bold text-white">
              <td className="text-left py-2 pr-2">Total</td>
              <td className="text-right px-2">{loadQty}/{disportQty}kt</td>
              <td className="px-2"></td>
              <td className="text-right px-2">{totalUsed.toFixed(0)}h</td>
              <td className="px-2"></td>
              <td className="text-right pl-2 text-emerald-300">{usd(totalCollected)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
