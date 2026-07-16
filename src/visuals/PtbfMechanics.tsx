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

// Full PTBF round trip: buy Vietnamese robusta FOB HCM, hedge, ship to
// Antwerp, sell instore in differential, fix. 100 t = 10 lots.
const FX = 25500        // VND per USD (kept fixed for clarity)
const CIF_INSTORE = 100 // $/t from CIF Antwerp to instore (insurance, port, handling)
const TONNES = 100

type Deal = {
  dBuy?: number; f1?: number          // step 1: buy physical FOB (diff) + freight booked
  freight?: number
  f2?: number                          // step 2: sell futures (hedge)
  dSell?: number; f3?: number          // step 3: sell physical instore (diff)
  f4?: number                          // step 4: fix — buy futures back
}

const STATUS = [
  { label: 'No position', cls: 'border-white/10 bg-white/[0.03] text-slate-400' },
  { label: 'UNHEDGED — long flat + long diff', cls: 'border-rose-500/40 bg-rose-500/[0.10] text-rose-300' },
  { label: 'Hedged — long the basis', cls: 'border-brand-cyan/40 bg-brand-cyan/10 text-cyan-200' },
  { label: 'Diff locked — fixing pending', cls: 'border-amber-500/40 bg-amber-500/[0.10] text-amber-300' },
  { label: 'FLAT — trade complete', cls: 'border-emerald-500/40 bg-emerald-500/[0.10] text-emerald-300' },
]

export default function PtbfMechanics() {
  // Live market
  const [vnd, setVnd] = useState(120000)     // VND/kg, spot HCM
  const [fut, setFut] = useState(4800)       // London RC, $/t
  const [fobDiff, setFobDiff] = useState(-60)
  const [freight, setFreight] = useState(70)
  const [antwerpDiff, setAntwerpDiff] = useState(120)

  const [deal, setDeal] = useState<Deal>({})
  const step = deal.f4 !== undefined ? 4 : deal.dSell !== undefined ? 3 : deal.f2 !== undefined ? 2 : deal.dBuy !== undefined ? 1 : 0

  // Local market converted: VND/kg → $/t, and its implied differential vs London
  const localUsd = (vnd * 1000) / FX
  const localDiff = localUsd - fut

  const usd0 = (n: number) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US')
  const sgn = (n: number) => (n >= 0 ? '+' : '−') + usd0(n)
  const dfmt = (n: number) => `${n >= 0 ? '+' : '−'}$${Math.abs(Math.round(n))}`

  function act() {
    if (step === 0) setDeal({ dBuy: fobDiff, f1: fut, freight })
    else if (step === 1) setDeal(d => ({ ...d, f2: fut }))
    else if (step === 2) setDeal(d => ({ ...d, dSell: antwerpDiff, f3: fut }))
    else if (step === 3) setDeal(d => ({ ...d, f4: fut }))
  }

  // Final P&L (per tonne) once complete
  const diffLeg = step >= 3 ? (deal.dSell! - deal.dBuy!) : null
  const costs = step >= 1 ? -(deal.freight! + CIF_INSTORE) : null
  const slippage = step >= 4 ? (deal.f2! - deal.f1!) + (deal.f3! - deal.f4!) : null
  const net = step >= 4 ? diffLeg! + costs! + slippage! : null

  const ACTIONS = [
    { n: 1, label: 'Buy physical', detail: `FOB HCM at London ${dfmt(fobDiff)} · book freight $${freight}/t` },
    { n: 2, label: 'Sell futures', detail: `hedge 10 lots at $${fut.toLocaleString()}` },
    { n: 3, label: 'Sell physical', detail: `instore Antwerp at London ${dfmt(antwerpDiff)} (PTBF)` },
    { n: 4, label: 'Fix it — buy futures', detail: `buy back 10 lots at $${fut.toLocaleString()}` },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Full PTBF Round Trip · 100 t Robusta, HCM → Antwerp</div>
        <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${STATUS[step].cls}`}>{STATUS[step].label}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: the market (live) */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">The market — move it between steps</div>
          <Slider label="Spot HCM (VND/kg)" value={vnd} min={80000} max={160000} step={1000} onChange={setVnd} display={vnd.toLocaleString('en-US')} />
          <Slider label="London futures ($/t)" value={fut} min={3500} max={6000} step={10} onChange={setFut} display={'$' + fut.toLocaleString()} />
          <Slider label="FOB HCM differential ($/t)" value={fobDiff} min={-400} max={200} step={5} onChange={setFobDiff} display={dfmt(fobDiff)} />
          <Slider label="Freight HCM → Antwerp ($/t)" value={freight} min={40} max={150} step={5} onChange={setFreight} display={'$' + freight} />
          <Slider label="Spot Antwerp instore, differential ($/t)" value={antwerpDiff} min={-200} max={300} step={5} onChange={setAntwerpDiff} display={dfmt(antwerpDiff)} />

          {/* Derived local market */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums space-y-1">
            <div className="eyebrow mb-1">Local market, converted</div>
            <div className="flex justify-between"><span className="text-slate-400">{vnd.toLocaleString()} VND/kg ÷ {FX.toLocaleString()} VND/USD</span><span className="text-white">{usd0(localUsd)}/t</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Theoretical local buying differential</span><span className="text-brand-cyan font-bold">{dfmt(localDiff)} vs London</span></div>
            <div className="flex justify-between"><span className="text-slate-400">FOB diff − local diff (origination margin)</span><span className={fobDiff - localDiff >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{dfmt(fobDiff - localDiff)}</span></div>
            <p className="text-slate-500 pt-1">CIF → instore Antwerp costs fixed at ${CIF_INSTORE}/t on top of freight.</p>
          </div>
        </div>

        {/* RIGHT: actions + blotter + P&L */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            {ACTIONS.map(a => {
              const done = step >= a.n
              const isNext = step === a.n - 1
              return (
                <button key={a.n} onClick={act} disabled={!isNext}
                  className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                    done ? 'border-emerald-500/30 bg-emerald-500/[0.06]'
                    : isNext ? 'border-brand-blue/50 bg-brand-blue/10 hover:bg-brand-blue/20 cursor-pointer'
                    : 'border-white/5 bg-white/[0.01] opacity-40'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">{a.n}. {a.label}</span>
                    {done && <span className="text-emerald-400 text-xs">✓</span>}
                    {isNext && <span className="chip !py-0.5 text-blue-200">execute</span>}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-slate-500">{a.detail}</div>
                </button>
              )
            })}
          </div>

          {/* Blotter */}
          {step > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums space-y-1">
              <div className="eyebrow mb-1">Deal blotter (stamped at execution)</div>
              <div className="flex justify-between"><span className="text-slate-400">1 · Bought FOB HCM</span><span className="text-white">Ldn {dfmt(deal.dBuy!)} (F {usd0(deal.f1!)}) · freight ${deal.freight}</span></div>
              {step >= 2 && <div className="flex justify-between"><span className="text-slate-400">2 · Sold futures</span><span className="text-white">{usd0(deal.f2!)}</span></div>}
              {step >= 3 && <div className="flex justify-between"><span className="text-slate-400">3 · Sold instore Antwerp</span><span className="text-white">Ldn {dfmt(deal.dSell!)} (F {usd0(deal.f3!)})</span></div>}
              {step >= 4 && <div className="flex justify-between"><span className="text-slate-400">4 · Fixed (bought futures)</span><span className="text-white">{usd0(deal.f4!)}</span></div>}
            </div>
          )}

          {/* Final P&L */}
          {step >= 4 && (
            <div className={`rounded-xl p-4 border font-mono text-xs tabular-nums ${net! >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'}`}>
              <div className="eyebrow mb-2">Trade P&L ($/t)</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">Differential leg (sell − buy)</span><span className="text-white">{sgn(diffLeg!)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Freight + CIF→instore</span><span className="text-rose-300">{sgn(costs!)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Flat-price slippage (hedge & fix timing)</span><span className={slippage! === 0 ? 'text-emerald-300' : 'text-amber-300'}>{slippage! === 0 ? 'none — clean pair trade' : sgn(slippage!)}</span></div>
                <div className="flex justify-between border-t border-white/15 pt-1.5">
                  <span className="text-white font-bold">Net · × {TONNES} t</span>
                  <span className={`font-bold text-base ${net! >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(net!)}/t · {sgn(net! * TONNES)}</span>
                </div>
              </div>
            </div>
          )}

          {step > 0 && (
            <button onClick={() => setDeal({})} className="btn-ghost !px-3 !py-1.5 text-xs">Reset trade</button>
          )}
        </div>
      </div>
    </div>
  )
}
