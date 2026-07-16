'use client'

import { useState } from 'react'

// Two PTBF trades, four actions each, on 100 t of Robusta.
//  Exporter: buy local (VND, outright) → hedge → sell FOB (diff) → fix.
//  Importer: buy FOB (diff, priced at execution) → hedge → sell spot
//            outright to roasters → fix (unwind).
// Every market component is typeable (keyboard) and LOCKS the moment the
// action that consumes it executes.
const FX = 25500        // VND per USD
const CIF_INSTORE = 100 // $/t CIF → instore on the importer leg
const TONNES = 100

type Mode = 'exporter' | 'importer'
type Deal = Record<string, number | undefined>

const fmtUsd = (n: number, dp = 0) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
const sgn = (n: number, dp = 0) => (n < 0 ? '−' : '+') + fmtUsd(n, dp)
const dfmt = (n: number, dp = 0) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`

function Field({ label, value, min, max, step, onChange, locked, lockedAt }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; locked: boolean; lockedAt?: string
}) {
  return (
    <div className={locked ? 'opacity-70' : ''}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        {locked ? (
          <span className="chip !py-0.5 border-amber-500/40 bg-amber-500/10 font-mono text-[10px] text-amber-300">locked {lockedAt}</span>
        ) : (
          <input
            type="number" value={value} min={min} max={max} step={step}
            onChange={e => {
              const v = parseFloat(e.target.value)
              if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v)))
            }}
            aria-label={label}
            className="w-28 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-right font-mono text-xs tabular-nums text-white outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={value} disabled={locked}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 ${locked ? 'cursor-not-allowed accent-slate-600' : 'cursor-pointer accent-brand-blue'}`} />
    </div>
  )
}

const EXP_STATUS = ['No position', 'Long physical (VND) — UNHEDGED', 'Hedged — buying diff locked', 'Sold FOB — fixing pending', 'FLAT — trade complete']
const IMP_STATUS = ['No position', 'Long FOB (priced) — UNHEDGED', 'Hedged — long the basis', 'Sold outright — short futures still open!', 'FLAT — trade complete']
const STATUS_CLS = [
  'border-white/10 bg-white/[0.03] text-slate-400',
  'border-rose-500/40 bg-rose-500/[0.10] text-rose-300',
  'border-brand-cyan/40 bg-brand-cyan/10 text-cyan-200',
  'border-amber-500/40 bg-amber-500/[0.10] text-amber-300',
  'border-emerald-500/40 bg-emerald-500/[0.10] text-emerald-300',
]

export default function PtbfMechanics() {
  const [mode, setMode] = useState<Mode>('exporter')

  // Live market
  const [vnd, setVnd] = useState(120000)         // VND/kg, local HCM
  const [fut, setFut] = useState(4800)           // London RC, $/t
  const [fobDiff, setFobDiff] = useState(-60)    // FOB HCM vs London
  const [freight, setFreight] = useState(70)     // HCM → Antwerp, $/t
  const [spotOut, setSpotOut] = useState(4920)   // spot Antwerp, outright $/t

  const [deal, setDeal] = useState<Deal>({})
  const step = deal.f4 !== undefined ? 4 : deal.sell !== undefined ? 3 : deal.f2 !== undefined ? 2 : deal.buy !== undefined ? 1 : 0

  const localUsd = (vnd * 1000) / FX

  function switchMode(m: Mode) { setMode(m); setDeal({}) }

  function act() {
    if (mode === 'exporter') {
      if (step === 0) setDeal({ buy: localUsd, vnd })
      else if (step === 1) setDeal(d => ({ ...d, f2: fut }))
      else if (step === 2) setDeal(d => ({ ...d, sell: fobDiff }))
      else if (step === 3) setDeal(d => ({ ...d, f4: fut }))
    } else {
      if (step === 0) setDeal({ buy: fut + fobDiff, dBuy: fobDiff, f1: fut, freight })
      else if (step === 1) setDeal(d => ({ ...d, f2: fut }))
      else if (step === 2) setDeal(d => ({ ...d, sell: spotOut }))
      else if (step === 3) setDeal(d => ({ ...d, f4: fut }))
    }
  }

  // Derived economics
  const dBuyExp = step >= 2 && mode === 'exporter' ? deal.buy! - deal.f2! : null // exporter buying differential
  let physical: number | null = null
  let futures: number | null = null
  let costs = 0
  if (step >= 4) {
    futures = deal.f2! - deal.f4!
    if (mode === 'exporter') {
      physical = (deal.f4! + deal.sell!) - deal.buy!      // invoice (fix + diff) − VND purchase
    } else {
      costs = -(deal.freight! + CIF_INSTORE)
      physical = deal.sell! - deal.buy!                    // outright sale − priced FOB purchase
    }
  }
  const total = physical !== null ? physical + futures! + costs : null

  const ACTIONS = mode === 'exporter'
    ? [
        { n: 1, label: 'Buy physical (VND)', detail: `${vnd.toLocaleString()} VND/kg = ${fmtUsd(localUsd, 1)}/t at ${FX.toLocaleString()} FX` },
        { n: 2, label: 'Sell futures', detail: `hedge 10 lots at ${fmtUsd(fut)} → sets your buying differential` },
        { n: 3, label: 'Sell physical FOB (diff)', detail: `London ${dfmt(fobDiff)} · PTBF` },
        { n: 4, label: 'Fix it (buy futures)', detail: `EFP at ${fmtUsd(fut)} → invoice = fix + diff` },
      ]
    : [
        { n: 1, label: 'Buy physical FOB (diff)', detail: `London ${dfmt(fobDiff)} priced at ${fmtUsd(fut)} → ${fmtUsd(fut + fobDiff)}/t · freight $${freight} booked` },
        { n: 2, label: 'Sell futures', detail: `hedge 10 lots at ${fmtUsd(fut)}` },
        { n: 3, label: 'Sell physical spot (outright)', detail: `to local roasters at ${fmtUsd(spotOut)}/t instore` },
        { n: 4, label: 'Fix it (buy futures)', detail: `unwind the hedge at ${fmtUsd(fut)}` },
      ]

  const STATUS = mode === 'exporter' ? EXP_STATUS : IMP_STATUS

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Two PTBF Trades · 100 t Robusta</div>
        <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${STATUS_CLS[step]}`}>{STATUS[step]}</span>
      </div>

      {/* Trade selector */}
      <div className="mb-4 flex gap-1.5">
        {([['exporter', 'Exporter: buy VND → sell FOB'], ['importer', 'Importer: buy FOB → sell spot']] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => switchMode(m)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              mode === m ? 'border-brand-blue/60 bg-brand-blue/20 text-blue-100' : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: the market — type or slide; locks when consumed */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">The market — type a value or slide</div>

          {mode === 'exporter' && (
            <Field label="Spot HCM (VND/kg)" value={vnd} min={80000} max={160000} step={500} onChange={setVnd}
              locked={step >= 1} lockedAt={step >= 1 ? `@ ${deal.vnd!.toLocaleString()}` : undefined} />
          )}
          {mode === 'importer' && (
            <Field label="FOB HCM differential ($/t)" value={fobDiff} min={-400} max={200} step={5} onChange={setFobDiff}
              locked={step >= 1} lockedAt={step >= 1 ? `@ ${dfmt(deal.dBuy!)}` : undefined} />
          )}

          <Field label="London futures ($/t)" value={fut} min={3500} max={6000} step={5} onChange={setFut}
            locked={step >= 4} lockedAt={step >= 4 ? `@ ${fmtUsd(deal.f4!)}` : undefined} />

          {mode === 'exporter' && (
            <Field label="FOB HCM differential ($/t)" value={fobDiff} min={-400} max={200} step={5} onChange={setFobDiff}
              locked={step >= 3} lockedAt={step >= 3 ? `@ ${dfmt(deal.sell!)}` : undefined} />
          )}
          {mode === 'importer' && (
            <>
              <Field label="Freight HCM → Antwerp ($/t)" value={freight} min={40} max={150} step={5} onChange={setFreight}
                locked={step >= 1} lockedAt={step >= 1 ? `@ $${deal.freight}` : undefined} />
              <Field label="Spot Antwerp, outright ($/t)" value={spotOut} min={4000} max={5800} step={10} onChange={setSpotOut}
                locked={step >= 3} lockedAt={step >= 3 ? `@ ${fmtUsd(deal.sell!)}` : undefined} />
            </>
          )}

          {/* Context */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums space-y-1">
            <div className="eyebrow mb-1">Live conversion</div>
            {mode === 'exporter' ? (
              <>
                <div className="flex justify-between"><span className="text-slate-400">Local price in USD</span><span className="text-white">{fmtUsd(localUsd, 1)}/t</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Implied local diff vs London</span><span className="text-brand-cyan font-bold">{dfmt(localUsd - fut, 1)}</span></div>
                {dBuyExp !== null && (
                  <div className="flex justify-between border-t border-white/10 pt-1"><span className="text-slate-400">YOUR buying diff (VND buy vs hedge)</span><span className="text-amber-300 font-bold">{dfmt(dBuyExp, 1)}</span></div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between"><span className="text-slate-400">FOB priced (futures + diff)</span><span className="text-white">{fmtUsd(fut + fobDiff)}/t</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Landed cost (+ freight + ${CIF_INSTORE} instore)</span><span className="text-white">{fmtUsd(fut + fobDiff + freight + CIF_INSTORE)}/t</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Spot Antwerp vs landed</span><span className="text-brand-cyan font-bold">{dfmt(spotOut - (fut + fobDiff + freight + CIF_INSTORE), 0)}</span></div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: actions, blotter, P&L */}
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
                    {done ? <span className="text-emerald-400 text-xs">✓ locked</span> : isNext ? <span className="chip !py-0.5 text-blue-200">execute</span> : null}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-slate-500">{a.detail}</div>
                </button>
              )
            })}
          </div>

          {/* Blotter */}
          {step > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums space-y-1">
              <div className="eyebrow mb-1">Deal blotter (locked at execution)</div>
              {mode === 'exporter' ? (
                <>
                  <div className="flex justify-between"><span className="text-slate-400">1 · Bought local</span><span className="text-white">{deal.vnd?.toLocaleString()} VND/kg = {fmtUsd(deal.buy!, 1)}/t</span></div>
                  {step >= 2 && <div className="flex justify-between"><span className="text-slate-400">2 · Sold futures → buying diff</span><span className="text-white">{fmtUsd(deal.f2!)} → {dfmt(dBuyExp!, 1)}</span></div>}
                  {step >= 3 && <div className="flex justify-between"><span className="text-slate-400">3 · Sold FOB (PTBF)</span><span className="text-white">London {dfmt(deal.sell!)}</span></div>}
                  {step >= 4 && <div className="flex justify-between"><span className="text-slate-400">4 · Fixed — invoice</span><span className="text-white">{fmtUsd(deal.f4!)} {deal.sell! < 0 ? '−' : '+'} {fmtUsd(Math.abs(deal.sell!))} = {fmtUsd(deal.f4! + deal.sell!)}/t</span></div>}
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span className="text-slate-400">1 · Bought FOB</span><span className="text-white">Ldn {dfmt(deal.dBuy!)} @ {fmtUsd(deal.f1!)} = {fmtUsd(deal.buy!)}/t · frt ${deal.freight}</span></div>
                  {step >= 2 && <div className="flex justify-between"><span className="text-slate-400">2 · Sold futures</span><span className="text-white">{fmtUsd(deal.f2!)}</span></div>}
                  {step >= 3 && <div className="flex justify-between"><span className="text-slate-400">3 · Sold spot outright</span><span className="text-white">{fmtUsd(deal.sell!)}/t</span></div>}
                  {step >= 4 && <div className="flex justify-between"><span className="text-slate-400">4 · Fixed — bought futures</span><span className="text-white">{fmtUsd(deal.f4!)}</span></div>}
                </>
              )}
            </div>
          )}

          {/* P&L */}
          {step >= 4 && total !== null && (
            <div className={`rounded-xl p-4 border font-mono text-xs tabular-nums ${total >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'}`}>
              <div className="eyebrow mb-2">Trade P&L ($/t)</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">Physical P&L {mode === 'exporter' ? '(invoice − VND buy)' : '(outright sale − FOB buy)'}</span><span className={physical! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(physical!, 1)}</span></div>
                {mode === 'importer' && <div className="flex justify-between"><span className="text-slate-400">Freight + instore costs</span><span className="text-rose-300">{sgn(costs)}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Futures P&L (sold − bought back)</span><span className={futures! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(futures!, 0)}</span></div>
                <div className="flex justify-between border-t border-white/15 pt-1.5">
                  <span className="text-white font-bold">Net · × {TONNES} t</span>
                  <span className={`font-bold text-base ${total >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(total, 1)}/t · {sgn(total * TONNES)}</span>
                </div>
                {mode === 'exporter' && (
                  <p className="pt-1 text-slate-400">= sell diff {dfmt(deal.sell!)} − buying diff {dfmt(dBuyExp!, 1)}: the whole trade was a differential.</p>
                )}
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
