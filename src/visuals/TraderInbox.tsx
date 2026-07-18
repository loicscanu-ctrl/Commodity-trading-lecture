'use client'

import { useState } from 'react'

// "A Day in the Life" as an inbox simulation. All emails are readable from
// the start — like a real inbox — and each expects one of the pre-written
// replies. A perfect day nets the base +$4,300 (the 17:30 desk report);
// every wrong reply subtracts its cost.
const BASE_PNL = 4300

type Reply = { label: string; delta: number; feedback: string }
type Email = { time: string; from: string; dept: string; subject: string; body: string; replies: Reply[] }

const EMAILS: Email[] = [
  {
    time: '06:30', from: 'Linh Pham', dept: 'Risk', subject: 'Overnight check — position sheet attached',
    body: `Morning,

London Jan settled 4,800 last night — up $95 on the dry-weather story out of Brazil.

Position sheet attached:
· 600 t unsold stock — outright $4,698/t, hedged 60 lots Jan
· 1,200 t sold PTBF, unfixed at Jan +115 — hedged 120 lots Jan
· 400 t March purchases — outright $4,725/t, hedged 40 lots Mar
Net: short 220 lots.

Please confirm the book before the local market opens.

Best regards,
Linh Pham
Risk & Product Control — HCM Desk
Saigon Merchants Co. · +84 28 3915 4410`,
    replies: [
      { label: 'Confirmed: net flat zero — the 1,200 t sold PTBF stay hedged until the roaster fixes.', delta: 0, feedback: 'Risk signs off. The sold-but-unfixed line is exactly why the hedge is 220 lots, not 100.' },
      { label: 'We look over-hedged — the 1,200 t are already SOLD. Cut 120 lots.', delta: -12000, feedback: 'You lifted 120 lots at the open; London added $10 before the desk head made you reinstate. −$12,000. A PTBF-unfixed sale floats with London — sold is not fixed.' },
      { label: 'Looks fine, no time to check — local market is opening.', delta: -1000, feedback: 'Risk escalates the unconfirmed book to the desk head. You spend the afternoon in a meeting that one reply would have avoided. −$1,000 in lost trading time.' },
    ],
  },
  {
    time: '07:15', from: 'Marc Keller', dept: 'Treasury / CFO', subject: 'URGENT: $209,000 margin wire this morning??',
    body: `Hi,

The clearing bank is calling $209,000 of variation margin on your 220-lot short after yesterday's rally. That is real cash leaving the revolver this morning.

Help me understand: why is a "hedged" book costing us money? And do we need to reduce these positions before this gets worse?

I need an answer before the 09:00 treasury call.

Regards,
Marc Keller
Group CFO
Saigon Merchants Co. — Geneva · +41 22 715 8800`,
    replies: [
      { label: 'The physical gained the same $95/t on paper — margin is the cash cost of zero price risk. Confirm headroom for another $400/t.', delta: 0, feedback: 'The CFO confirms $880k of headroom. This conversation, had early, is what keeps the hedge alive in a squeeze.' },
      { label: 'Agreed, it’s bleeding — lift 100 lots until the market calms down.', delta: -15000, feedback: 'You lifted into the rally; London added $15 before you re-hedged. −$15,000, and the book ran naked flat risk all morning. The margin call was never a loss — this is.' },
      { label: 'Ignore it — the cash comes back at expiry.', delta: -2000, feedback: 'Treasury freezes the credit line pending review. You spend the day trading with one hand tied. −$2,000.' },
    ],
  },
  {
    time: '08:30', from: 'Duc Tran', dept: 'Supplier — Dak Lak', subject: 'Offer: 200 t Gd2, prompt',
    body: `Chao anh,

I have 200 t Gd2, prompt delivery, clean cup, good preparation. Price 121,000 VND/kg.

Good coffee moves fast this week. This price is for today only.

(Your screen right now: London 4,800 · FX 25,500 · FOB HCM bid Jan −60. Do the conversion before you answer.)

Cam on,
Duc Tran
Farmer collector — Dak Lak
+84 90 345 2211`,
    replies: [
      { label: 'Counter at 119,500 — settle at 120,200 VND/kg.', delta: 0, feedback: 'Settled 120,200 = $4,714/t = implied Jan −86. Against the FOB bid at −60 that is a +$26/t origination margin on 200 t: +$5,200 booked into today’s P&L.' },
      { label: 'Accept 121,000 — good coffee is scarce this morning.', delta: -6200, feedback: '121,000 = $4,745/t = implied −55, against an FOB market at −60. You bought ABOVE the market: −$5/t, versus +$26/t available with one counter. −$6,200 against the day.' },
      { label: 'Decline — the book is full enough.', delta: -5200, feedback: 'Duc sells to your competitor at 120,300. The +$5,200 origination that anchored today’s P&L goes to their book instead.' },
    ],
  },
  {
    time: '08:35', from: 'Sarah Nguyen', dept: 'Desk head', subject: 'RE: bought 200 t — hedge?',
    body: `Saw the fill.

You are long 200 t outright — the only unhedged tonnage on this book. London pre-open is live.

What are you doing with it?

S.
—
Sarah Nguyen · Head of Desk, Asia
sent from mobile`,
    replies: [
      { label: 'Selling 20 lots Jan now at the pre-open.', delta: 0, feedback: 'Done at 4,800. Book fully hedged again: short 240 lots against 2,400 t of priced-but-unfixed length. Flat risk lived for four minutes.' },
      { label: 'Holding — the dry-weather story should add another $50 by the close.', delta: -6000, feedback: 'London faded $30 into the London open before you capitulated. −$6,000. The desk rule exists because views belong in the spec book, not the hedge book.' },
      { label: 'Hedging half, keeping 100 t for the rally.', delta: -3000, feedback: 'The unhedged half cost $30/t: −$3,000. Half a discipline is still a position.' },
    ],
  },
  {
    time: '15:10', from: 'Jonas Brandt', dept: 'Roaster — Hamburg', subject: 'Fixing 300 t against our PTBF contract',
    body: `Dear Sir or Madam,

Referring to our January PTBF contract, we would like to fix 300 t now. Our screen shows 4,760.

Kindly advise how you wish to execute.

Mit freundlichen Grüßen / Best regards,

Jonas Brandt
Head of Green Coffee Buying
Brandt & Söhne Kaffeerösterei GmbH · Hamburg
T +49 40 3609 7100`,
    replies: [
      { label: 'EFP at 4,760 — one registered transaction, 30 of my short lots transfer to you.', delta: 0, feedback: 'Invoice fixes at 4,760 + diff; your hedge drops to 210 lots against 2,100 t unfixed — the hedge tracks unfixed length tonne for tonne. Zero slippage.' },
      { label: 'I’ll buy my futures back on screen, you fix separately.', delta: -2400, feedback: 'The market ticked $8 between your buy-back and their fixing. −$2,400 — exactly the legging gap the EFP exists to remove.' },
      { label: 'Let’s do the paperwork later this week.', delta: -1500, feedback: 'The fixing deadline squeezed the execution and annoyed a good counterparty: −$1,500 and a colder phone line next season.' },
    ],
  },
  {
    time: '15:40', from: 'Pieter Janssens', dept: 'Sales — EU', subject: 'Instore bid +125 · freight quote $72 valid today',
    body: `Hi,

Two things before the EU close:

1. Instore Antwerp bids Jan +125 for prompt Gd2 — the buyer is real.
2. Forwarder quotes next month HCM → Antwerp at $72/t, valid TODAY only (Tet space is tightening fast).

Your fresh 200 t works: buy −86, sale +125, costs 72 + 100 → +$39/t landed.

Instructions?

Cheers,
Pieter Janssens
Sales & Operations — Antwerp office
Saigon Merchants Europe BV`,
    replies: [
      { label: 'Offer 200 t at +130 — and book the freight NOW while the offer works.', delta: 0, feedback: 'The +130 offer trades before the close (+$43/t landed) and the freight is locked at $72. An unbooked freight quote is an open position — you closed it.' },
      { label: 'Offer at +130, hold the freight — rates might ease after Tet.', delta: -2400, feedback: 'The offer traded, but next week the box costs $84. −$12/t on 200 t = −$2,400: you earned the diff and gave a third of it back to the forwarder.' },
      { label: 'Hit the +125 bid now, sort freight tomorrow.', delta: -3400, feedback: 'You left $5/t on the table (−$1,000) and tomorrow’s freight costs $12 more (−$2,400). Speed is not the same thing as execution.' },
    ],
  },
  {
    time: '17:30', from: 'Linh Pham', dept: 'Risk', subject: 'EOD — desk report due',
    body: `Closing time.

I need the day's P&L decomposed — flat / basis / origination / costs — and the positions checked against limits before you leave the floor.

The report is due with the desk head by 18:00 sharp.

Thanks,
Linh Pham
Risk & Product Control — HCM Desk
Saigon Merchants Co.`,
    replies: [
      { label: 'Flat $0 (fully hedged) · basis +$2,000 (diff −60→−58 on 1,000 t open) · origination +$5,200 · costs −$2,900 → +$4,300.', delta: 0, feedback: 'Signed. The flat line reads zero BY DESIGN — every dollar today came from differentials. That decomposition is what this desk is paid for.' },
      { label: 'Book +$209,000 — the stock gained on the rally.', delta: -2000, feedback: 'Risk unwinds it in five minutes: the stock’s gain is offset by the hedge, that’s the point. Misreporting flat P&L on a hedged book earns you a warning letter. −$2,000 (compliance review).' },
      { label: 'P&L is up, details tomorrow — catching my ride.', delta: -1000, feedback: 'The report is the product. Risk files a late-report note; your limit request next month just got harder. −$1,000.' },
    ],
  },
]

function grade(total: number) {
  if (total >= BASE_PNL) return { label: 'Clean day — the desk head signs without reading twice', cls: 'text-emerald-300', box: 'border-emerald-500/30 bg-emerald-500/[0.08]' }
  if (total >= 0) return { label: 'Survived — reread the feedback before tomorrow’s open', cls: 'text-amber-300', box: 'border-amber-500/40 bg-amber-500/[0.10]' }
  return { label: 'The desk lost money on a fully hedged book — impressive, in the wrong way', cls: 'text-rose-300', box: 'border-rose-500/40 bg-rose-500/[0.10]' }
}

const fmt = (n: number) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toLocaleString('en-US')}`

export default function TraderInbox() {
  // The whole inbox is readable from the start — reply in any order.
  const [answers, setAnswers] = useState<(number | null)[]>(Array(EMAILS.length).fill(null))
  const [selected, setSelected] = useState(0)

  const answeredCount = answers.filter(a => a !== null).length
  const done = answeredCount === EMAILS.length
  const impact = answers.reduce((s: number, a, i) => s + (a !== null ? EMAILS[i].replies[a].delta : 0), 0)
  const total = BASE_PNL + impact
  const g = grade(total)

  const email = EMAILS[selected]
  const answer = answers[selected]
  const nextUnanswered = answers.findIndex((a, i) => a === null && i !== selected)

  function reply(ri: number) {
    // Stay on this email so the consequence is read before moving on.
    setAnswers(a => a.map((v, i) => (i === selected ? ri : v)))
  }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Inbox — Tuesday 12 November · HCM desk</div>
        <span className="chip !py-0.5 font-mono text-slate-300">
          {done ? 'day complete' : `${answeredCount}/${EMAILS.length} handled`} · decisions {fmt(impact)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-4">
        {/* Inbox list — everything readable, unanswered marked unread */}
        <div className="space-y-1">
          {EMAILS.map((e, i) => {
            const isAnswered = answers[i] !== null
            return (
              <button key={i}
                onClick={() => setSelected(i)}
                className={`w-full rounded-lg border p-2 text-left transition-all ${
                  selected === i ? 'border-brand-blue/50 bg-brand-blue/10'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                }`}>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-slate-500">{e.time}</span>
                  <span>{isAnswered ? <span className="text-emerald-400">✓</span> : <span className="h-1.5 w-1.5 inline-block rounded-full bg-brand-cyan" title="awaiting your reply" />}</span>
                </div>
                <div className={`truncate font-mono text-[11px] ${isAnswered ? 'text-slate-400' : 'font-bold text-slate-200'}`}>{e.dept}</div>
                <div className={`truncate text-[11px] ${isAnswered ? 'text-slate-500' : 'text-slate-400'}`}>{e.subject}</div>
              </button>
            )
          })}
        </div>

        {/* Reading pane */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="border-b border-white/10 pb-2 font-mono text-[11px]">
            <div className="flex justify-between"><span className="text-slate-500">From:</span><span className="text-slate-200">{email.from} · {email.dept}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Time:</span><span className="text-slate-200">{email.time}</span></div>
            <div className="mt-1 text-sm font-bold text-white">{email.subject}</div>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">{email.body}</p>

          {answer === null ? (
            <div className="mt-4 space-y-2">
              <div className="eyebrow">Your reply</div>
              {email.replies.map((r, ri) => (
                <button key={ri} onClick={() => reply(ri)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-xs font-medium text-slate-200 transition-all hover:border-brand-cyan/50 hover:bg-brand-cyan/10">
                  ↳ {r.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <div className={`rounded-lg border p-2.5 text-xs ${email.replies[answer].delta === 0 ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-rose-500/30 bg-rose-500/[0.05]'}`}>
                <span className="font-mono text-[10px] text-slate-500">You replied: </span>
                <span className="text-slate-200">{email.replies[answer].label}</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-xs leading-relaxed text-slate-400">
                <span className={`font-mono font-bold ${email.replies[answer].delta === 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {email.replies[answer].delta === 0 ? '±$0' : fmt(email.replies[answer].delta)}
                </span>{' '}
                — {email.replies[answer].feedback}
              </div>
              {nextUnanswered !== -1 && (
                <button onClick={() => setSelected(nextUnanswered)}
                  className="btn-primary !px-3 !py-1.5 text-xs">
                  Open next email ({EMAILS[nextUnanswered].time}) →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* End of day */}
      {done && (
        <div className={`mt-4 rounded-xl border p-4 font-mono text-xs tabular-nums ${g.box}`}>
          <div className="eyebrow mb-2">End of day</div>
          <div className="space-y-1">
            <div className="flex justify-between"><span className="text-slate-400">The clean day (flat $0 · basis +$2,000 · origination +$5,200 · costs −$2,900)</span><span className="text-white">+${BASE_PNL.toLocaleString('en-US')}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Your seven replies</span><span className={impact >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{fmt(impact)}</span></div>
            <div className="flex justify-between border-t border-white/15 pt-1.5"><span className="font-bold text-white">Day P&L</span><span className={`text-base font-bold ${total >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{fmt(total)}</span></div>
          </div>
          <div className={`mt-2 font-bold ${g.cls}`}>{g.label}</div>
          <button onClick={() => { setAnswers(Array(EMAILS.length).fill(null)); setSelected(0) }} className="btn-ghost mt-3 !px-3 !py-1.5 text-xs">Run the day again</button>
        </div>
      )}
    </div>
  )
}
