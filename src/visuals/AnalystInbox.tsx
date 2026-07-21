'use client'

import { InboxSim, type Email, type InboxGrade } from './TraderInbox'

// Module 1's "Day in the Life": the JUNIOR's first day. No hedging yet —
// every email tests a concept taught in this module: margin & the clearing
// house, the order book, news lags & flash traps, cash-and-carry structure,
// who the players are, stocks-to-use convexity, and what a deliverable
// contract really means. A clean day banks the small speculative book's
// +$2,000; every wrong reply costs what it would really cost.
const BASE_PNL = 2000

const EMAILS: Email[] = [
  {
    time: '06:45', from: 'Linh Pham', dept: 'Risk', subject: 'Overnight margin call — confirm the wire',
    body: `Morning,

Welcome aboard. First job of the day.

The training book you inherited is SHORT 20 lots of London (200 t) from Friday. Overnight the market rallied $150/t on dry-weather headlines.

The clearing bank has called variation margin this morning. Please confirm the amount so treasury can wire before 09:00.

Best regards,
Linh Pham
Risk & Product Control — HCM Desk
Saigon Merchants Co. · +84 28 3915 4410`,
    replies: [
      { label: 'Wire $30,000 — 20 lots × 10 t × $150 against our short.', delta: 0, feedback: 'Correct: 20 lots × 10 t/lot × $150/t = $30,000 of variation margin. Cash leaves today; it comes back if the market does. Margin is the price of a guaranteed promise.' },
      { label: 'Wire $3,000 — 20 lots × $150.', delta: -1500, feedback: 'You forgot the lot size: a lot is 10 TONNES. Treasury wired short, the clearer issued a default warning, and Risk spent the morning fixing your arithmetic. −$1,500 in credibility (and fees).' },
      { label: 'Nothing to pay — the clearing house guarantees the trade, that’s their problem.', delta: -2500, feedback: 'The guarantee works BECAUSE both sides post margin — that is the 1865 invention. Refusing a margin call is a default. The broker liquidated 5 of your lots before Risk intervened. −$2,500.' },
    ],
  },
  {
    time: '08:10', from: 'David Okafor', dept: 'Broker — London', subject: 'Fill report: your 40 lots came back at three prices',
    body: `Hi,

Your market order this morning: BUY 40 lots.

Fill: 10 lots @ 4,800 · 20 lots @ 4,805 · 10 lots @ 4,810. Average 4,805.

Your desk head asked me to have you explain the three prices before lunch. His words, not mine.

Regards,
David Okafor
Execution Desk
Marlowe & Cie — London · +44 20 7488 3200`,
    replies: [
      { label: 'A 40-lot market order WALKS the book: 4,800 had 10 lots of depth, the rest filled deeper. Next time I work it in clips or use a limit.', delta: 0, feedback: 'Exactly. The screen price is the price of the FIRST lot only — size pays for immediacy. The desk head nods and moves on.' },
      { label: 'Dispute the fill — the screen showed 4,800 when I clicked.', delta: -1200, feedback: 'The broker sends the order-book snapshot: 10 lots bid at 4,800, that is all you were owed at that price. You disputed your own market order. −$1,200 in review time and a colder line to London.' },
      { label: 'It must be the exchange fee added per clip.', delta: -800, feedback: 'Fees are billed separately and are cents, not dollars. Confusing depth with fees in front of the desk head costs you the afternoon and −$800 of his patience.' },
    ],
  },
  {
    time: '10:20', from: 'Sarah Nguyen', dept: 'Desk head', subject: 'FROST tweet — screen +300 in 40 seconds. Doing anything?',
    body: `Screen just spiked $300 on a frost alert going around — one unverified account, no agency confirmation, no met-office data.

You are flat. Doing anything?

S.
—
Sarah Nguyen · Head of Desk, Asia
sent from mobile`,
    replies: [
      { label: 'Nothing yet — unconfirmed flashes revert. If the met office confirms, the price will DRIFT and HOLD, and there will be time to act.', delta: 0, feedback: 'The spike retraced fully in a minute — position-driven, not news-driven. Real news is absorbed with a lag and holds its new level; traps spike and revert. You kept your capital and your credibility.' },
      { label: 'Buying 20 lots NOW — frost is bullish and I refuse to miss it.', delta: -4000, feedback: 'You bought the top of a fake. The tweet was deleted, the spike fully retraced, and you stopped out −$20/t on 200 t. −$4,000. The tape punishes positions taken before thinking.' },
      { label: 'Selling short — spikes always come back down.', delta: -1000, feedback: 'It worked this time — and Sarah made you close it immediately: "always" is not a risk framework, and if the frost had been REAL you would have been short a limit-up market. Fined a symbolic −$1,000 for the right result with the wrong reasoning.' },
    ],
  },
  {
    time: '11:45', from: 'Sophie Laurent', dept: 'Research', subject: 'Dec/Feb spread vs the cost of carry — worth a look?',
    body: `Hi,

Quick structure check on London:

· Dec trades 4,800, Feb trades 4,880 — a $80 contango.
· Full cost of carry for the two months (warehouse + finance + insurance): ~$55/t.

Someone should look at this before the market does.

Sophie Laurent
Research & Analytics
Saigon Merchants Co. — Geneva`,
    replies: [
      { label: 'Cash-and-carry: buy Dec (take delivery), store at $55, deliver into Feb at 4,880 — $25/t nearly risk-free. Size it and check warehouse space.', delta: 0, feedback: 'The contango exceeds full carry — the classic arbitrage. Do it in size and you (and everyone like you) will pull the spread back inside the carry: that is WHY contango is normally capped at carry.' },
      { label: 'No trade — the $80 just means the market expects prices to rise $80 by February.', delta: -2000, feedback: 'Structure is not a forecast. Contango reflects the cost of CARRY, not expectations — and when it exceeds carry, storage plus delivery locks the difference regardless of where prices go. You left $25/t on the table. −$2,000.' },
      { label: 'Sell Dec, buy Feb — the spread will widen further.', delta: -2500, feedback: 'You are now SHORT the arbitrage: every cash-and-carry trader in the market is working against your position. The spread converged back to carry and you paid it. −$2,500.' },
    ],
  },
  {
    time: '13:30', from: 'Duc Tran', dept: 'Supplier — Dak Lak', subject: 'Question from my cooperative',
    body: `Chao anh,

My cooperative asks: the roasters in Europe hedge on London, your company hedges on London. Why do we farmers not hedge? Should we?

I want to give them a serious answer.

Cam on,
Duc Tran
Farmer collector — Dak Lak
+84 90 345 2211`,
    replies: [
      { label: 'Honestly: a 10 t lot size, USD margin calls and a futures account are out of reach for a 2-hectare farm — that is exactly the gap trade houses and cooperatives bridge, by hedging in size on your behalf.', delta: 0, feedback: 'The honest structural answer. Smallholders cannot post daily USD variation margin on their crop; intermediaries aggregate, hedge and pass a firmer price back. Duc reads it to the cooperative — the relationship deepens.' },
      { label: 'Farmers should not hedge — prices always recover eventually.', delta: -1500, feedback: 'Tell that to anyone who sold the 2019 lows. "It recovers eventually" is not a treasury plan when the school fees are due at harvest. Duc expected better; the answer travels round the province. −$1,500 in origination goodwill.' },
      { label: 'They can just download a trading app and short one lot each.', delta: -1000, feedback: 'One lot is 10 t — most of a smallholder’s crop — and the margin account needs USD liquidity they do not have. The cooperative tried, got margin-called in week two, and Duc’s phone rang. −$1,000.' },
    ],
  },
  {
    time: '15:05', from: 'Sophie Laurent', dept: 'Research', subject: 'Stocks-to-use revision: 28% → 16%',
    body: `Second note today, more important.

Our balance sheet revision puts world robusta stocks-to-use at 16% for next season, down from 28%.

Management asks: same size of weather shock next year — same size of price move?

Sophie Laurent
Research & Analytics
Saigon Merchants Co. — Geneva`,
    replies: [
      { label: 'No — price response is CONVEX in tightness: at 16% there is no buffer, so the same shock moves price far more. Flag the regime change to the desk.', delta: 0, feedback: 'The scatter you studied says exactly this: below ~20% stocks-to-use, price sensitivity explodes. Same news, thinner cushion, bigger move. The desk raises its risk numbers before the market teaches it the hard way.' },
      { label: 'Same shock, same move — supply and demand are linear.', delta: -2000, feedback: 'They are not. With no inventory buffer, demand must be rationed by PRICE, and rationing is violent. The desk kept old volatility assumptions and got caught by the first weather scare. −$2,000.' },
      { label: 'Lower stocks mean lower prices — less to sell, less business.', delta: -1500, feedback: 'Backwards: scarce stocks make what remains MORE valuable, not less. Research quietly forwards you the S&D slides again. −$1,500.' },
    ],
  },
  {
    time: '17:15', from: 'Linh Pham', dept: 'Risk', subject: 'EOD check: your 20 Jan lots and first notice day',
    body: `Before you leave:

The training book is LONG 20 lots of January, and January's first notice day is approaching. Confirm your intention.

Reminder that this contract is PHYSICALLY DELIVERABLE.

Thanks,
Linh Pham
Risk & Product Control — HCM Desk
Saigon Merchants Co.`,
    replies: [
      { label: 'Roll or close before first notice day — unless we actually want 200 t of certified robusta in an exchange warehouse.', delta: 0, feedback: 'Signed. A deliverable contract held into the notice period can become a warrant and a warehouse invoice — the delivery mechanism anchors the price, and it is opt-in only for those equipped to handle beans.' },
      { label: 'Do nothing — futures always cash-settle at expiry.', delta: -2000, feedback: 'Robusta is PHYSICALLY deliverable — that is precisely what anchors the futures to real coffee (remember WTI April 2020 for what delivery mechanics can do to the unprepared). Risk force-closed the position late with $10/t of slippage. −$2,000.' },
      { label: 'Take delivery — free coffee, and warehouses sound fun.', delta: -1500, feedback: 'Not free: you pay the full contract value, plus warrant fees, warehouse rent and insurance — for 200 t of beans the desk has no roasting plan for. Risk vetoes it and books the carrying-cost estimate against your day. −$1,500.' },
    ],
  },
]

function gradeAnalyst(total: number, base: number): InboxGrade {
  if (total >= base) return { label: 'Clean first day — the desk head asks Risk where they found you', cls: 'text-emerald-300', box: 'border-emerald-500/30 bg-emerald-500/[0.08]' }
  if (total >= 0) return { label: 'Survived day one — reread the feedback tonight, tomorrow is faster', cls: 'text-amber-300', box: 'border-amber-500/40 bg-amber-500/[0.10]' }
  return { label: 'Day one ended in Risk’s office — the concepts are in Module 1, all of them', cls: 'text-rose-300', box: 'border-rose-500/40 bg-rose-500/[0.10]' }
}

export default function AnalystInbox() {
  return (
    <InboxSim
      emails={EMAILS}
      base={BASE_PNL}
      header="Inbox — your first day · junior analyst, HCM desk"
      baseLine="The training book’s clean day (small speculative gains, no mistakes)"
      grades={gradeAnalyst}
    />
  )
}
