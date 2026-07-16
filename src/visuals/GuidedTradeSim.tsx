'use client'

import { useState } from 'react'

// Guided FOB→CIF simulation: 5 desk decisions on a 200 t robusta trade.
// Deterministic outcomes; every delta is $/t against the optimal path.
// Base economics: bought FOB HCM at Jan −60, target sale instore Antwerp
// Jan +120, freight 70 + instore costs 100 → paper margin +10/t.
const TONNES = 200
const BASE_MARGIN = 10

type Choice = { label: string; delta: number; outcome: string }
type Decision = { id: string; title: string; situation: string; choices: Choice[]; lesson: string }

const DECISIONS: Decision[] = [
  {
    id: 'hedge',
    title: '1 · The hedge',
    situation: 'This morning you bought 200 t FOB HCM at Jan −$60/t. London Jan trades $4,800. Your book is UNHEDGED: long flat + long diff.',
    choices: [
      { label: 'Sell 20 lots Jan at 4,800 — now', delta: 0, outcome: 'Done in one click. By the close London settled 4,730 — your futures leg is +$70/t, your physical −$70/t. You never noticed: you are long the basis, not the market.' },
      { label: 'Wait — the chart looks bullish', delta: -70, outcome: 'London settled 4,730. Your unhedged long just paid $70/t for your market view. The desk head wants a word.' },
      { label: 'Hedge half — 10 lots', delta: -35, outcome: 'Half protected, half opinion. The unhedged 100 t cost $70/t as London slid to 4,730: −$35/t on the parcel.' },
    ],
    lesson: 'Hedge at execution. A physical trader’s edge is the differential; flat-price views belong in a separate, limited spec book.',
  },
  {
    id: 'freight',
    title: '2 · The freight',
    situation: 'Forwarders quote HCM→Antwerp at $70/t. There is chatter about pre-Tet congestion. Your coffee ships in 3 weeks.',
    choices: [
      { label: 'Book now at $70/t', delta: 0, outcome: 'Booked. Next week the same box costs $85/t — congestion came. Your costs are locked at plan.' },
      { label: 'Float it — rates might ease', delta: -15, outcome: 'Rates spiked to $85/t on Tet congestion. Unbooked freight is an open position too.' },
      { label: 'Book half now, half later', delta: -7.5, outcome: 'Average paid: $77.5/t. Splitting reduced the damage but half your freight was still a punt.' },
    ],
    lesson: 'Every unpriced cost in the chain — freight, finance, fees — is exposure. The P&L doesn’t care whether you lost it on futures or on a bill of lading.',
  },
  {
    id: 'sale',
    title: '3 · The sale',
    situation: 'A roaster bids firm: instore Antwerp, Jan +$120/t, PTBF buyer’s call. Your trader instinct whispers that EUDR-compliant lots should fetch +135 soon.',
    choices: [
      { label: 'Hit the bid: sell 200 t at +120', delta: 0, outcome: 'Sold. The diff eased to +105 the following week — the firm bid was the top. Diff leg locked: 120 − (−60) = $180/t gross.' },
      { label: 'Hold out for +135', delta: -15, outcome: 'The bid faded. You sold a week later at +105. Holding inventory for a better diff is a basis-long position — you were long and it weakened.' },
      { label: 'Sell half at +120, hold half', delta: -7.5, outcome: 'Half at 120, the rest went at 105. Optionality has a price; this time you paid it.' },
    ],
    lesson: 'A differential is a market like any other: it strengthens and weakens. "Long the basis" is a position, not a parking spot.',
  },
  {
    id: 'fixing',
    title: '4 · The fixing',
    situation: 'The roaster wants to fix 20 lots against the PTBF sale. London Jan trades 4,690. You are short 20 lots from your hedge.',
    choices: [
      { label: 'Agree an EFP at 4,690', delta: 0, outcome: 'One registered transaction: your short transfers to the buyer at the agreed price, invoice fixes at 4,690 + 120. Both legs crystallised simultaneously — zero slippage.' },
      { label: 'Leg it on screen', delta: -8, outcome: 'You bought your futures back, then the buyer fixed 20 minutes later — 8 dollars higher. That gap is exactly what the EFP exists to remove.' },
      { label: 'Delay the paperwork a few days', delta: -5, outcome: 'The fixing deadline squeezed you into a worse level and an annoyed counterparty. Slow paper is expensive paper.' },
    ],
    lesson: 'EFPs price both legs at one number. Legging a fixing on screen turns a riskless transfer into two market orders.',
  },
  {
    id: 'claim',
    title: '5 · The claim',
    situation: 'Arrival sampling at Antwerp: 2.8% defects against a 2.5% contract max. The buyer claims a −$25/t allowance.',
    choices: [
      { label: 'Independent re-sampling, then settle', delta: -2, outcome: 'The re-test came back 2.55%. Claim settled at a token allowance plus the surveyor’s fee: −$2/t. Documents and process beat argument.' },
      { label: 'Accept −$25/t to protect the relationship', delta: -25, outcome: 'Paid in full, instantly. Relationships matter — but a claim accepted without verification becomes your counterparty’s pricing strategy next season.' },
      { label: 'Go straight to arbitration', delta: -18, outcome: 'You won on paper six weeks later. Fees, warehouse rent and financing ate $18/t of the victory.' },
    ],
    lesson: 'Quality claims are commercial negotiations anchored on evidence. Verify first, settle second, arbitrate last.',
  },
]

function grade(netPerT: number) {
  if (netPerT >= 5) return { label: 'Desk-ready — you traded the basis, not your opinions', cls: 'text-emerald-300', box: 'border-emerald-500/30 bg-emerald-500/[0.08]' }
  if (netPerT >= -20) return { label: 'Promising junior — read the debrief, then run it again', cls: 'text-amber-300', box: 'border-amber-500/40 bg-amber-500/[0.10]' }
  return { label: 'The market thanks you for the liquidity — run it again', cls: 'text-rose-300', box: 'border-rose-500/40 bg-rose-500/[0.10]' }
}

const fmt = (n: number) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 1 })}`

export default function GuidedTradeSim() {
  const [picks, setPicks] = useState<number[]>([])
  const step = picks.length
  const done = step >= DECISIONS.length

  const impact = picks.reduce((s, p, i) => s + DECISIONS[i].choices[p].delta, 0)
  const netPerT = BASE_MARGIN + impact
  const g = grade(netPerT)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Guided Simulation · 200 t, FOB HCM → instore Antwerp</div>
        <span className="chip !py-0.5 text-slate-300">target margin +${BASE_MARGIN}/t · decisions so far: {fmt(impact)}/t</span>
      </div>

      {/* Decisions played */}
      <div className="space-y-3">
        {DECISIONS.slice(0, step).map((d, i) => {
          const pick = d.choices[picks[i]]
          const best = pick.delta === Math.max(...d.choices.map(c => c.delta))
          return (
            <div key={d.id} className={`rounded-xl border p-3 ${best ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-rose-500/30 bg-rose-500/[0.05]'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-white">{d.title} — {pick.label}</span>
                <span className={`font-mono text-xs font-bold tabular-nums ${pick.delta === 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{pick.delta === 0 ? '±$0' : fmt(pick.delta)}/t</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{pick.outcome}</p>
            </div>
          )
        })}
      </div>

      {/* Current decision */}
      {!done && (
        <div className="mt-4 rounded-xl border border-brand-blue/40 bg-brand-blue/[0.06] p-4">
          <div className="font-mono text-sm font-bold text-white">{DECISIONS[step].title}</div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{DECISIONS[step].situation}</p>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {DECISIONS[step].choices.map((c, ci) => (
              <button key={ci} onClick={() => setPicks(p => [...p, ci])}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-xs font-medium text-slate-200 transition-all hover:border-brand-cyan/50 hover:bg-brand-cyan/10">
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Debrief */}
      {done && (
        <div className="mt-4 space-y-3">
          <div className={`rounded-xl border p-4 font-mono text-xs tabular-nums ${g.box}`}>
            <div className="eyebrow mb-2">Final P&L</div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-slate-400">Paper margin at plan (diff 180 − costs 170)</span><span className="text-white">+${BASE_MARGIN}/t</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Your five decisions</span><span className={impact >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{fmt(impact)}/t</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1.5">
                <span className="text-white font-bold">Net · × {TONNES} t</span>
                <span className={`font-bold text-base ${netPerT >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{fmt(netPerT)}/t · {fmt(netPerT * TONNES)}</span>
              </div>
            </div>
            <div className={`mt-2 font-bold ${g.cls}`}>{g.label}</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="eyebrow mb-2">What each decision was really about</div>
            <ul className="space-y-1.5">
              {DECISIONS.map(d => (
                <li key={d.id} className="text-xs leading-relaxed text-slate-400"><span className="font-mono font-bold text-slate-200">{d.title}:</span> {d.lesson}</li>
              ))}
            </ul>
          </div>

          <button onClick={() => setPicks([])} className="btn-ghost !px-3 !py-1.5 text-xs">Run it again</button>
        </div>
      )}
    </div>
  )
}
