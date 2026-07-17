'use client'

import { useState } from 'react'

// Follow ONE 100 t parcel of robusta from the farm gate to the roastery.
// At every hop: the price form it trades in, the margin captured, which
// price risks the holder carries, and how (or whether) they can hedge.
// Numbers per tonne, consistent with the course's PTBF examples.
type Tier = {
  name: string
  where: string
  buys: string
  sells: string
  form: string
  margin: string
  flat: boolean
  diff: boolean
  fx?: boolean
  riskNote: string
  hedge: string
  accent: string
}

const TIERS: Tier[] = [
  {
    name: 'Farmer', where: 'Dak Lak',
    buys: 'grows it — cash cost ≈ 45,000 VND/kg (≈ $1,765/t)',
    sells: '118,000 VND/kg (≈ $4,627/t) to the cooperative',
    form: 'VND/kg · outright',
    margin: '≈ +$2,860/t over cash cost — at today’s historic prices the farmer captures by far the fattest margin in the chain',
    flat: true, diff: true,
    riskNote: 'Carries EVERYTHING from flowering to sale: flat price, differential, weather, and has no direct access to the futures market.',
    hedge: 'No screen access — the only "hedges" are selling early, forward deals with the coop, or (increasingly) coop-run programs.',
    accent: '#34d399',
  },
  {
    name: 'Cooperative', where: 'Dak Lak',
    buys: '118,000 VND/kg from farmers',
    sells: '120,200 VND/kg (≈ $4,714/t) to the exporter',
    form: 'VND/kg · outright, both sides',
    margin: '≈ +$87/t — aggregation, quality sorting, logistics to HCM',
    flat: true, diff: true,
    riskNote: 'Both risks, but briefly — the coop’s protection is SPEED: buy and re-sell within days, back-to-back.',
    hedge: 'Back-to-back turnaround. Held stock is naked, so held stock is kept small.',
    accent: '#22d3ee',
  },
  {
    name: 'Exporter', where: 'Ho Chi Minh City',
    buys: '120,200 VND/kg (≈ $4,714/t) — outright',
    sells: 'FOB HCM at London Jan −$60 (≈ $4,740/t) — PTBF',
    form: 'buys VND outright → sells FOB differential',
    margin: '+$26/t — the origination margin',
    flat: false, diff: true, fx: true,
    riskNote: 'Hedges the futures leg at execution, so flat risk lives for minutes. What remains is the differential — and a risk nobody upstream had: CURRENCY. The exporter pays in VND but hedges and sells in USD; if the dollar weakens against the dong between purchase and receipt, the VND cost translates into more dollars and the $26 margin evaporates. Try it below.',
    hedge: 'Sells London futures the moment the VND purchase is done; unwinds via EFP at the buyer’s fixing. The currency leg is hedged separately — USD/VND forwards (offshore, as NDFs: the dong is not freely deliverable).',
    accent: '#f59e0b',
  },
  {
    name: 'Trade house', where: 'Geneva / Singapore desk',
    buys: 'FOB HCM at Jan −$60 — PTBF',
    sells: 'instore Antwerp at Jan +$120 (≈ $4,920/t) — PTBF',
    form: 'differential in, differential out — plus freight & instore costs (~$170/t)',
    margin: '+$50/t landed — thin, × hundreds of thousands of tonnes a year',
    flat: false, diff: true,
    riskNote: 'Fully hedged flat book (margin calls and all); runs differential risk, freight risk and claims across the whole voyage. This is the tier where the ABCD-style giants operate.',
    hedge: 'Futures for the flat leg; the diff, freight and quality risks are managed, not hedged — that is the trade house’s edge.',
    accent: '#3b82f6',
  },
  {
    name: 'Roaster', where: 'Hamburg',
    buys: 'instore at Jan +$120 — PTBF, buyer’s call (unfixed)',
    sells: 'roasted & retail-packed coffee at a consumer price set quarters ahead',
    form: 'buys PTBF → sells fixed retail: the exposure INVERTS',
    margin: 'transformation margin — roasting, brand, distribution (not a trading margin)',
    flat: true, diff: false,
    riskNote: 'The diff was locked at purchase; the FLAT leg floats until they fix. Selling at fixed retail prices against unfixed green coffee is real flat exposure.',
    hedge: 'The fixing right is a timing option — exercised via EFP; big roasters overlay futures and collars on their whole book.',
    accent: '#8b5cf6',
  },
]

function MiniRisk({ label, on }: { label: string; on: boolean }) {
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${on ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/[0.08] text-emerald-400/80'}`}>
      {label} {on ? 'AT RISK' : 'covered'}
    </span>
  )
}

// The exporter's currency exposure: coffee is bought at 120,200 VND/kg (fixed
// the day of purchase), but the FOB sale, the futures hedge and the margin all
// live in USD. Between purchase and receipt, USD/VND can move.
const FX_ENTRY = 25_500 // USD/VND on purchase day
const VND_COST_PER_T = 120_200 * 1_000 // VND per tonne
const FOB_SALE_USD = 4_740 // $/t, locked by the FOB sale + futures hedge
const PARCEL_T = 100

function FxMiniSim() {
  const [fx, setFx] = useState(FX_ENTRY)

  const costUsd = VND_COST_PER_T / fx
  const marginT = FOB_SALE_USD - costUsd
  const parcelPnl = marginT * PARCEL_T
  const usdMovePct = (fx / FX_ENTRY - 1) * 100
  const breakeven = Math.round(VND_COST_PER_T / FOB_SALE_USD) // ≈ 25,359

  const fmt = (v: number) => `${v < 0 ? '−' : '+'}$${Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="font-mono text-[10px] font-bold uppercase tracking-wide text-rose-300">
        The hidden third risk: currency
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
        The 120,200 VND/kg purchase is fixed — but the sale is in USD. Move the dollar between purchase day and payment day and watch what a &ldquo;fully hedged&rdquo; book does:
      </p>

      <div className="mt-2 flex items-center gap-3">
        <span className="font-mono text-[10px] text-slate-500 shrink-0">USD/VND</span>
        <input type="range" min={24_600} max={26_400} step={20} value={fx}
          onChange={e => setFx(Number(e.target.value))}
          aria-label="USD/VND exchange rate"
          className="w-full h-1.5 cursor-pointer accent-brand-cyan" />
        <span className="font-mono text-xs font-bold tabular-nums text-brand-cyan shrink-0 w-14 text-right">{fx.toLocaleString('en-US')}</span>
      </div>
      <div className="mt-0.5 text-right font-mono text-[9px] text-slate-500">
        USD {usdMovePct >= 0 ? '+' : '−'}{Math.abs(usdMovePct).toFixed(1)}% vs purchase day ({FX_ENTRY.toLocaleString('en-US')})
      </div>

      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[10px]">
        <div className="rounded-lg bg-white/[0.03] p-2">
          <div className="text-slate-500">VND cost in USD</div>
          <div className="mt-0.5 text-sm font-bold tabular-nums text-slate-200">${costUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}/t</div>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-2">
          <div className="text-slate-500">FOB sale (locked)</div>
          <div className="mt-0.5 text-sm font-bold tabular-nums text-slate-200">${FOB_SALE_USD.toLocaleString('en-US')}/t</div>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-2">
          <div className="text-slate-500">Margin</div>
          <div className={`mt-0.5 text-sm font-bold tabular-nums ${marginT < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{fmt(marginT)}/t</div>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-2">
          <div className="text-slate-500">On the 100 t parcel</div>
          <div className={`mt-0.5 text-sm font-bold tabular-nums ${parcelPnl < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{fmt(parcelPnl)}</div>
        </div>
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
        The futures hedge protects the <span className="text-slate-300">coffee</span> price, not the <span className="text-slate-300">currency</span>: every leg after the farm gate is in USD, so a weaker dollar makes the already-paid VND cost bigger in USD terms. Breakeven is USD/VND ≈ {breakeven.toLocaleString('en-US')} — a mere <span className="text-rose-300">−0.6% dollar slip erases the entire +$26/t origination margin</span>. That is why real exporters hedge the FX leg too.
      </p>
    </div>
  )
}

export default function ParcelJourney() {
  const [idx, setIdx] = useState(0)
  const t = TIERS[idx]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Follow the Parcel · 100 t of robusta, farm gate → roastery</div>
        {idx < TIERS.length - 1 ? (
          <button onClick={() => setIdx(i => i + 1)} className="btn-primary !px-3 !py-1.5 text-xs">Pass the parcel →</button>
        ) : (
          <button onClick={() => setIdx(0)} className="btn-ghost !px-3 !py-1.5 text-xs">Back to the farm</button>
        )}
      </div>

      {/* The chain */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {TIERS.map((tier, i) => (
          <div key={tier.name} className="flex items-center gap-1">
            <button onClick={() => setIdx(i)}
              className={`min-w-[86px] rounded-xl border p-2 text-center transition-all ${
                i === idx ? 'bg-white/[0.06]' : i < idx ? 'opacity-70' : 'opacity-40'
              }`}
              style={{ borderColor: i <= idx ? tier.accent + '80' : 'rgba(255,255,255,0.08)' }}>
              <div className="font-mono text-[11px] font-bold" style={{ color: tier.accent }}>{tier.name}</div>
              <div className="font-mono text-[9px] text-slate-500">{tier.where}</div>
            </button>
            {i < TIERS.length - 1 && (
              <span className={`font-mono text-xs ${i < idx ? 'text-slate-300' : 'text-slate-600'}`}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Current holder */}
      <div className="mt-3 rounded-xl border p-4" style={{ borderColor: t.accent + '55', backgroundColor: t.accent + '0d' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono text-sm font-bold" style={{ color: t.accent }}>{t.name} · {t.where}</div>
          <div className="flex gap-1.5">
            <MiniRisk label="FLAT" on={t.flat} />
            <MiniRisk label="DIFF" on={t.diff} />
            {t.fx !== undefined && <MiniRisk label="FX" on={t.fx} />}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[11px]">
          <div><span className="text-slate-500">ACQUIRES: </span><span className="text-slate-300">{t.buys}</span></div>
          <div><span className="text-slate-500">PASSES ON: </span><span className="text-slate-300">{t.sells}</span></div>
          <div><span className="text-slate-500">PRICE FORM: </span><span className="text-brand-cyan">{t.form}</span></div>
          <div><span className="text-slate-500">MARGIN: </span><span className="text-amber-300">{t.margin}</span></div>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400"><span className="font-bold text-slate-300">Risk: </span>{t.riskNote}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-400"><span className="font-bold text-slate-300">Hedge: </span>{t.hedge}</p>
        {t.fx && <FxMiniSim />}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Watch two things travel with the parcel: the <span className="text-slate-300">price form</span> mutates (VND outright → FOB differential → instore PTBF → fixed retail), and the <span className="text-slate-300">risk tiles</span> flip — the flat risk that the farmer carries naked is hedged away in the middle of the chain and re-appears, inverted, at the roaster who sells fixed retail against unfixed green. Every later topic in this course lives somewhere on this chain.
      </p>
    </div>
  )
}
