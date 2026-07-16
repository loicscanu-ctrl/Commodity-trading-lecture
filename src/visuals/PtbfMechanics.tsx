'use client'

import { useState } from 'react'

// Canonical PTBF example: exporter sells 100 t (10 lots RC) at "ICE Jan + $120/t",
// buyer's call. Futures trade at $4,500/t at signature; the exporter hedges there.
const DIFF = 120
const HEDGE = 4500
const TONNES = 100

export default function PtbfMechanics() {
  const [fix, setFix] = useState(4200) // the roaster's fixing level

  const invoice = fix + DIFF
  const hedgePnl = HEDGE - fix // short from 4,500, bought back at the fixing
  const exporterNet = invoice + hedgePnl // = HEDGE + DIFF, whatever `fix` is
  const timing = HEDGE - fix // roaster's gain vs fixing at signature

  const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">PTBF fixing simulator · &quot;ICE Jan + $120/t&quot;, buyer&apos;s call</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: the contract & the fixing */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs space-y-1.5">
            <div className="eyebrow mb-2">Fixed at signature (September)</div>
            <div className="flex justify-between"><span className="text-slate-400">Differential</span><span className="text-amber-300 font-bold">+${DIFF}/t</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Reference month</span><span className="text-white">ICE Robusta Jan</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Fixing right</span><span className="text-white">Buyer&apos;s call (before FND)</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Volume</span><span className="text-white">{TONNES} t (10 lots)</span></div>
            <div className="flex justify-between border-t border-white/10 pt-1.5"><span className="text-slate-400">Exporter hedge: sells futures at</span><span className="text-brand-cyan font-bold">{usd(HEDGE)}/t</span></div>
          </div>

          <div className="border-t border-white/10 pt-3">
            <div className="eyebrow text-brand-cyan mb-1">Fixed later — the roaster decides when ↓</div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-brand-cyan">Roaster fixes the futures leg at</span>
              <span className="text-xs font-mono font-bold tabular-nums text-brand-cyan">{usd(fix)}/t</span>
            </div>
            <input type="range" min={3600} max={5400} step={10} value={fix}
              onChange={e => setFix(parseFloat(e.target.value))}
              className="w-full h-1.5 cursor-pointer accent-brand-cyan" />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-slate-200 font-semibold">The pair trade:</span> once hedged, the exporter is <span className="text-emerald-300">long physical</span> + <span className="text-rose-300">short futures</span>. The outright price cancels out of their book — the only leg they still own is the <span className="text-amber-300">differential</span>.
          </div>
        </div>

        {/* RIGHT: who ends up where */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums space-y-1.5">
            <div className="eyebrow mb-2">Settlement</div>
            <div className="flex justify-between"><span className="text-slate-400">Invoice = fixing + differential</span><span className="text-white">{usd(fix)} + ${DIFF} = <span className="font-bold">{usd(invoice)}/t</span></span></div>
            <div className="flex justify-between"><span className="text-slate-400">Exporter hedge P&amp;L</span><span className={hedgePnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{hedgePnl >= 0 ? '+' : '−'}{usd(Math.abs(hedgePnl))}/t</span></div>
            <div className="flex justify-between border-t border-white/10 pt-1.5"><span className="text-slate-300 font-bold">Exporter net</span><span className="text-emerald-300 font-bold">{usd(exporterNet)}/t</span></div>
            <div className="flex justify-between"><span className="text-slate-300 font-bold">Roaster cost</span><span className="text-white font-bold">{usd(invoice)}/t</span></div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-4 font-mono text-xs tabular-nums">
            <div className="eyebrow text-emerald-400 mb-1">The exporter is locked</div>
            <div className="text-white font-bold text-2xl">{usd(exporterNet)}/t <span className="text-sm font-normal text-slate-400">= {usd(HEDGE)} + ${DIFF}</span></div>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              Drag the fixing anywhere: the hedged exporter&apos;s net never moves. They sold <em>futures + differential</em> the day they signed.
            </p>
          </div>

          <div className={`rounded-xl p-3 border font-mono text-xs tabular-nums ${
            timing > 0 ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300'
            : timing < 0 ? 'border-rose-500/40 bg-rose-500/[0.08] text-rose-300'
            : 'border-white/10 bg-white/[0.03] text-slate-400'
          }`}>
            {timing > 0
              ? `Roaster timing: fixed ${usd(Math.abs(timing))}/t below the market at signature — ${usd(Math.abs(timing) * TONNES)} saved on the parcel.`
              : timing < 0
                ? `Roaster timing: fixed ${usd(Math.abs(timing))}/t above the market at signature — ${usd(Math.abs(timing) * TONNES)} given up on the parcel.`
                : 'Roaster fixed exactly at the signature-day market: timing neither gained nor cost.'}
          </div>
        </div>
      </div>
    </div>
  )
}
