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
  riskNote: string
  hedge: string
  accent: string
}

const TIERS: Tier[] = [
  {
    name: 'Farmer', where: 'Dak Lak',
    buys: 'grows it — cash cost ≈ 95,000 VND/kg (≈ $3,725/t)',
    sells: '118,000 VND/kg (≈ $4,627/t) to the cooperative',
    form: 'VND/kg · outright',
    margin: '≈ +$900/t over cash cost — the crop’s reward, and its risk',
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
    margin: '+$26/t — the origination margin (your simulator’s exporter trade)',
    flat: false, diff: true,
    riskNote: 'Hedges the futures leg at execution, so flat risk lives for minutes. What remains — and what the business IS — is the differential.',
    hedge: 'Sells London futures the moment the VND purchase is done; unwinds via EFP at the buyer’s fixing.',
    accent: '#f59e0b',
  },
  {
    name: 'Trade house', where: 'Geneva / Singapore desk',
    buys: 'FOB HCM at Jan −$60 — PTBF',
    sells: 'instore Antwerp at Jan +$120 (≈ $4,920/t) — PTBF',
    form: 'differential in, differential out — plus freight & instore costs (~$170/t)',
    margin: '+$10/t landed — thin, times a million tonnes a year',
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
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Watch two things travel with the parcel: the <span className="text-slate-300">price form</span> mutates (VND outright → FOB differential → instore PTBF → fixed retail), and the <span className="text-slate-300">risk tiles</span> flip — the flat risk that the farmer carries naked is hedged away in the middle of the chain and re-appears, inverted, at the roaster who sells fixed retail against unfixed green. Every later topic in this course lives somewhere on this chain.
      </p>
    </div>
  )
}
