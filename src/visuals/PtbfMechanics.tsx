'use client'

import { useState } from 'react'

// Two PTBF trades on 100 t of Robusta.
//  Exporter (4 steps): buy local VND (outright) → sell futures (sets the
//    buying diff) → sell FOB (diff) → fix (buy futures).
//  Importer (5 steps): buy FOB (diff only — unpriced) → buy freight →
//    fix before export (sell futures: prices the purchase AND hedges) →
//    sell spot outright in EUR (fixed 1.20 USD/EUR) → buy futures
//    (locks the selling differential).
// Every input is typeable (any value, even beyond the slider scale) and
// LOCKS when the action that consumes it executes.
const FX = 25500        // VND per USD
const EURUSD = 1.20     // USD per EUR (fixed)
const CIF_INSTORE = 100 // $/t CIF → instore
const TONNES = 100

type Mode = 'exporter' | 'importer'
type Deal = {
  vnd?: number; buy?: number          // exporter step 1
  dBuy?: number                        // importer step 1
  freight?: number                     // importer step 2
  fHedge?: number                      // futures sold (exporter step 2 / importer step 3)
  sell?: number                        // exporter step 3: FOB diff · importer step 4: sale in USD
  eur?: number                         // importer step 4: sale in EUR
  fFix?: number                        // futures bought back (final step)
}

const fmtUsd = (n: number, dp = 0) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
const fmtEur = (n: number) => '€' + Math.abs(n).toLocaleString('en-US')
const sgn = (n: number, dp = 0) => (n < 0 ? '−' : '+') + fmtUsd(n, dp)
const dfmt = (n: number, dp = 0) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`

function Field({ label, value, min, max, step, onChange, locked, lockedAt }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; locked: boolean; lockedAt?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div className={locked ? 'opacity-70' : ''}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        {locked ? (
          <span className="chip !py-0.5 border-amber-500/40 bg-amber-500/10 font-mono text-[10px] text-amber-300">locked {lockedAt}</span>
        ) : (
          <input
            type="number" value={draft ?? String(value)} step={step}
            onChange={e => {
              setDraft(e.target.value)
              const v = parseFloat(e.target.value)
              if (Number.isFinite(v)) onChange(v) // no clamping — type any value
            }}
            onBlur={() => setDraft(null)}
            aria-label={label}
            className="w-28 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-right font-mono text-xs tabular-nums text-white outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} disabled={locked}
        onChange={e => { setDraft(null); onChange(parseFloat(e.target.value)) }}
        className={`w-full h-1.5 ${locked ? 'cursor-not-allowed accent-slate-600' : 'cursor-pointer accent-brand-blue'}`} />
    </div>
  )
}

function RiskSquare({ label, on, active }: { label: string; on: boolean; active: boolean }) {
  return (
    <div
      data-testid={`risk-${label.toLowerCase()}`}
      title={`${label} price risk is ${on ? 'OPEN' : active ? 'covered' : 'not present'}`}
      className={`flex w-16 flex-col items-center rounded-lg border px-2 py-1 font-mono text-[10px] leading-tight ${
        on
          ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
          : active
            ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400'
            : 'border-white/10 bg-white/[0.02] text-slate-500'
      }`}
    >
      <span className="font-bold tracking-wide">{label}</span>
      <span>{on ? 'AT RISK' : active ? 'covered' : '—'}</span>
    </div>
  )
}

const EXP_STATUS = ['No position', 'Long physical (VND) — UNHEDGED', 'Hedged — buying diff locked', 'Sold FOB — fixing pending', 'FLAT — trade complete']
const IMP_STATUS = ['No position', 'Long the diff — unpriced PTBF, no flat risk yet', 'Freight booked — costs locked', 'Fixed & hedged — long the basis', 'Sold outright (EUR) — short futures open!', 'FLAT — trade complete']
const CHIP_CLS = (s: string) =>
  s === 'No position' ? 'border-white/10 bg-white/[0.03] text-slate-400'
  : s.includes('UNHEDGED') || s.includes('open!') ? 'border-rose-500/40 bg-rose-500/[0.10] text-rose-300'
  : s.includes('FLAT') ? 'border-emerald-500/40 bg-emerald-500/[0.10] text-emerald-300'
  : s.includes('pending') || s.includes('Freight') ? 'border-amber-500/40 bg-amber-500/[0.10] text-amber-300'
  : 'border-brand-cyan/40 bg-brand-cyan/10 text-cyan-200'

export default function PtbfMechanics() {
  const [mode, setMode] = useState<Mode>('exporter')

  // Live market
  const [vnd, setVnd] = useState(120000)     // VND/kg, local HCM
  const [fut, setFut] = useState(4800)       // London — hedge leg, $/t
  const [futFix, setFutFix] = useState(4800) // London — since the hedge, $/t
  const [fobDiff, setFobDiff] = useState(-60)
  const [freight, setFreight] = useState(70)
  const [eurSpot, setEurSpot] = useState(4100) // spot Antwerp, outright €/t

  const [deal, setDeal] = useState<Deal>({})

  // Step counters per mode
  const step = mode === 'exporter'
    ? (deal.fFix !== undefined ? 4 : deal.sell !== undefined ? 3 : deal.fHedge !== undefined ? 2 : deal.buy !== undefined ? 1 : 0)
    : (deal.fFix !== undefined ? 5 : deal.sell !== undefined ? 4 : deal.fHedge !== undefined ? 3 : deal.freight !== undefined ? 2 : deal.dBuy !== undefined ? 1 : 0)
  const lastStep = mode === 'exporter' ? 4 : 5
  const hedged = deal.fHedge !== undefined

  const localUsd = (vnd * 1000) / FX
  const eurUsd = eurSpot * EURUSD
  const curFut = hedged ? futFix : fut

  function switchMode(m: Mode) { setMode(m); setDeal({}) }

  function act() {
    if (mode === 'exporter') {
      if (step === 0) setDeal({ vnd, buy: localUsd })
      else if (step === 1) { setFutFix(fut); setDeal(d => ({ ...d, fHedge: fut })) }
      else if (step === 2) setDeal(d => ({ ...d, sell: fobDiff }))
      else if (step === 3) setDeal(d => ({ ...d, fFix: futFix }))
    } else {
      if (step === 0) setDeal({ dBuy: fobDiff })
      else if (step === 1) setDeal(d => ({ ...d, freight }))
      else if (step === 2) { setFutFix(fut); setDeal(d => ({ ...d, fHedge: fut })) }
      else if (step === 3) setDeal(d => ({ ...d, eur: eurSpot, sell: eurUsd }))
      else if (step === 4) setDeal(d => ({ ...d, fFix: futFix }))
    }
  }

  // Derived economics
  const dBuyExp = mode === 'exporter' && hedged ? deal.buy! - deal.fHedge! : null
  const impInvoice = mode === 'importer' && hedged ? deal.fHedge! + deal.dBuy! : null
  const dSellImp = mode === 'importer' && deal.fFix !== undefined ? deal.sell! - deal.fFix! : null

  const complete = step >= lastStep
  let physical: number | null = null, futures: number | null = null, costs = 0
  if (complete) {
    futures = deal.fHedge! - deal.fFix!
    if (mode === 'exporter') {
      physical = (deal.fFix! + deal.sell!) - deal.buy!
    } else {
      costs = -(deal.freight! + CIF_INSTORE)
      physical = deal.sell! - impInvoice!
    }
  }
  const total = physical !== null ? physical + futures! + costs : null

  const ACTIONS = mode === 'exporter'
    ? [
        { n: 1, label: 'Buy physical (VND)', detail: `${vnd.toLocaleString()} VND/kg = ${fmtUsd(localUsd, 1)}/t at ${FX.toLocaleString()} FX` },
        { n: 2, label: 'Sell futures', detail: `hedge 10 lots at ${fmtUsd(fut)} → sets your buying differential` },
        { n: 3, label: 'Sell physical FOB (diff)', detail: `London ${dfmt(fobDiff)} · PTBF` },
        { n: 4, label: 'Fix it (buy futures)', detail: `EFP at ${fmtUsd(curFut)} → invoice = fix + diff` },
      ]
    : [
        { n: 1, label: 'Buy physical FOB (diff)', detail: `London ${dfmt(fobDiff)} · PTBF — price still floating` },
        { n: 2, label: 'Buy freight', detail: `HCM → Antwerp at $${freight}/t (+$${CIF_INSTORE} CIF→instore)` },
        { n: 3, label: 'Fix before export (sell futures)', detail: `at ${fmtUsd(fut)} → purchase prices at fix + diff, and you are hedged` },
        { n: 4, label: 'Sell spot (outright, EUR)', detail: `${fmtEur(eurSpot)}/t × ${EURUSD.toFixed(2)} = ${fmtUsd(eurUsd)}/t` },
        { n: 5, label: 'Buy futures', detail: `at ${fmtUsd(curFut)} → locks your selling differential` },
      ]

  const STATUS = mode === 'exporter' ? EXP_STATUS : IMP_STATUS

  // Which risks are OPEN at each stage of the book:
  //  Exporter: 1 = outright VND long (flat+diff) · 2 = hedged, selling diff
  //  still open · 3-4 = PTBF sale offsets the short (EFP fix is riskless).
  //  Importer: 1-3 = diff open (selling side unsecured), no flat (unpriced
  //  PTBF, then hedged) · 4 = naked short futures (flat!) · 5 = flat book.
  const flatRisk = mode === 'exporter' ? step === 1 : step === 4
  const diffRisk = mode === 'exporter' ? step >= 1 && step <= 2 : step >= 1 && step <= 3

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Two PTBF Trades · 100 t Robusta</div>
        <div className="flex items-center gap-1.5">
          <RiskSquare label="FLAT" on={flatRisk} active={step > 0 && !complete} />
          <RiskSquare label="DIFF" on={diffRisk} active={step > 0 && !complete} />
          <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${CHIP_CLS(STATUS[step])}`}>{STATUS[step]}</span>
        </div>
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
        {/* LEFT: the market */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">The market — type any value or slide</div>

          {mode === 'exporter' ? (
            <Field label="Spot HCM (VND/kg)" value={vnd} min={80000} max={160000} step={500} onChange={setVnd}
              locked={step >= 1} lockedAt={step >= 1 ? `@ ${deal.vnd!.toLocaleString()}` : undefined} />
          ) : (
            <>
              <Field label="FOB HCM differential ($/t)" value={fobDiff} min={-350} max={1000} step={5} onChange={setFobDiff}
                locked={step >= 1} lockedAt={step >= 1 ? `@ ${dfmt(deal.dBuy!)}` : undefined} />
              <p className="-mt-1 text-[10px] text-slate-500">Scale floor −$350 ≈ tenderable parity: below it, delivering to the exchange beats the cash market.</p>
            </>
          )}

          {mode === 'importer' && (
            <Field label="Freight HCM → Antwerp ($/t)" value={freight} min={40} max={150} step={5} onChange={setFreight}
              locked={step >= 2} lockedAt={step >= 2 ? `@ $${deal.freight}` : undefined} />
          )}

          <Field label="London futures — hedge leg ($/t)" value={fut} min={3500} max={6000} step={5} onChange={setFut}
            locked={hedged} lockedAt={hedged ? `@ ${fmtUsd(deal.fHedge!)}` : undefined} />

          {hedged && (
            <Field label="London futures — since the hedge ($/t)" value={futFix} min={3500} max={6000} step={5} onChange={setFutFix}
              locked={deal.fFix !== undefined} lockedAt={deal.fFix !== undefined ? `@ ${fmtUsd(deal.fFix)}` : undefined} />
          )}

          {mode === 'exporter' ? (
            <>
              <Field label="FOB HCM differential ($/t)" value={fobDiff} min={-350} max={1000} step={5} onChange={setFobDiff}
                locked={step >= 3} lockedAt={step >= 3 ? `@ ${dfmt(deal.sell!)}` : undefined} />
              <p className="-mt-1 text-[10px] text-slate-500">Scale floor −$350 ≈ tenderable parity: below it, delivering to the exchange beats the cash market.</p>
            </>
          ) : (
            <Field label="Spot Antwerp, outright (€/t)" value={eurSpot} min={3200} max={5000} step={10} onChange={setEurSpot}
              locked={step >= 4} lockedAt={step >= 4 ? `@ ${fmtEur(deal.eur!)}` : undefined} />
          )}

          {/* Live conversion */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums space-y-1">
            <div className="eyebrow mb-1">Live conversion</div>
            {mode === 'exporter' ? (
              <>
                <div className="flex justify-between"><span className="text-slate-400">Local price in USD</span><span className="text-white">{fmtUsd(localUsd, 1)}/t</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Implied local diff vs London (now)</span><span className="text-brand-cyan font-bold">{dfmt(localUsd - curFut, 1)}</span></div>
                {dBuyExp !== null && (
                  <div className="flex justify-between border-t border-white/10 pt-1"><span className="text-slate-400">YOUR buying diff (VND buy vs hedge)</span><span className="text-amber-300 font-bold">{dfmt(dBuyExp, 1)}</span></div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between"><span className="text-slate-400">Purchase price</span><span className="text-white">{impInvoice !== null ? `${fmtUsd(impInvoice)}/t (fixed)` : 'floating — fix + diff'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">EUR sale in USD (× {EURUSD.toFixed(2)})</span><span className="text-white">{fmtUsd((step >= 4 ? deal.sell! : eurUsd))}/t</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Implied selling diff vs London (now)</span><span className="text-brand-cyan font-bold">{dfmt((step >= 4 ? deal.sell! : eurUsd) - (deal.fFix ?? curFut), 0)}</span></div>
                {dSellImp !== null && (
                  <div className="flex justify-between border-t border-white/10 pt-1"><span className="text-slate-400">YOUR selling diff (locked at the buy-back)</span><span className="text-amber-300 font-bold">{dfmt(dSellImp, 0)}</span></div>
                )}
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
                  {step >= 2 && <div className="flex justify-between"><span className="text-slate-400">2 · Sold futures → buying diff</span><span className="text-white">{fmtUsd(deal.fHedge!)} → {dfmt(dBuyExp!, 1)}</span></div>}
                  {step >= 3 && <div className="flex justify-between"><span className="text-slate-400">3 · Sold FOB (PTBF)</span><span className="text-white">London {dfmt(deal.sell!)}</span></div>}
                  {step >= 4 && <div className="flex justify-between"><span className="text-slate-400">4 · Fixed — invoice</span><span className="text-white">{fmtUsd(deal.fFix!)} {deal.sell! < 0 ? '−' : '+'} {fmtUsd(Math.abs(deal.sell!))} = {fmtUsd(deal.fFix! + deal.sell!)}/t</span></div>}
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span className="text-slate-400">1 · Bought FOB (diff)</span><span className="text-white">London {dfmt(deal.dBuy!)} · price TBF</span></div>
                  {step >= 2 && <div className="flex justify-between"><span className="text-slate-400">2 · Freight booked</span><span className="text-white">${deal.freight}/t + ${CIF_INSTORE} instore</span></div>}
                  {step >= 3 && <div className="flex justify-between"><span className="text-slate-400">3 · Fixed & hedged</span><span className="text-white">{fmtUsd(deal.fHedge!)} → purchase {fmtUsd(impInvoice!)}/t</span></div>}
                  {step >= 4 && <div className="flex justify-between"><span className="text-slate-400">4 · Sold outright</span><span className="text-white">{fmtEur(deal.eur!)}/t = {fmtUsd(deal.sell!)}/t</span></div>}
                  {step >= 5 && <div className="flex justify-between"><span className="text-slate-400">5 · Bought futures → selling diff</span><span className="text-white">{fmtUsd(deal.fFix!)} → {dfmt(dSellImp!, 0)}</span></div>}
                </>
              )}
            </div>
          )}

          {/* P&L */}
          {complete && total !== null && (
            <div className={`rounded-xl p-4 border font-mono text-xs tabular-nums ${total >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'}`}>
              <div className="eyebrow mb-2">Trade P&L ($/t)</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">Physical P&L {mode === 'exporter' ? '(invoice − VND buy)' : '(outright sale − purchase)'}</span><span className={physical! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(physical!, 1)}</span></div>
                {mode === 'importer' && <div className="flex justify-between"><span className="text-slate-400">Freight + instore costs</span><span className="text-rose-300">{sgn(costs)}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Futures P&L (sold − bought back)</span><span className={futures! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(futures!, 0)}</span></div>
                <div className="flex justify-between border-t border-white/15 pt-1.5">
                  <span className="text-white font-bold">Net · × {TONNES} t</span>
                  <span className={`font-bold text-base ${total >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(total, 1)}/t · {sgn(total * TONNES)}</span>
                </div>
                <p className="pt-1 text-slate-400">
                  {mode === 'exporter'
                    ? `= sell diff ${dfmt(deal.sell!)} − buying diff ${dfmt(dBuyExp!, 1)}: the whole trade was a differential.`
                    : `= selling diff ${dfmt(dSellImp!, 0)} − buying diff ${dfmt(deal.dBuy!)} − costs $${deal.freight! + CIF_INSTORE}: a pair trade with a freight bill.`}
                </p>
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
