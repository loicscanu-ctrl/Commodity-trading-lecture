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
    time: '11:45', from: 'Anke Vermeulen', dept: 'C. Steinweg — Warehousing', subject: 'Updated Antwerp tariff: coffee warehousing $10/t/month',
    body: `Dear all,

Please find our updated Antwerp tariff for green coffee, effective the 1st:

· Storage, handling & insurance, all-in: USD 10.00 per tonne per month
· Certified (exchange-approved) space currently AVAILABLE
· Weighbridge, sampling and re-bagging on request

We remain at your disposal for any delivery or storage programme.

Met vriendelijke groet,
Anke Vermeulen
Commercial Desk
C. Steinweg Group — Antwerp · +32 3 545 8800`,
    replies: [
      { label: 'File the rate and reply with thanks — carry numbers decide delivery questions, and one may land today.', delta: 0, feedback: 'Filed: $10/t/month, all-in, certified space available. A warehouse tariff is never junk mail on a futures desk — storage + finance against the spread IS market structure, with an invoice attached.' },
      { label: 'Ignore — we trade futures, this is warehouse spam.', delta: -500, feedback: 'Deleted at 11:46. At 17:15 a delivery question landed that needed exactly this number, and you asked Steinweg to resend the tariff after their Antwerp office had closed. −$500 of scrambling.' },
      { label: 'Reply asking for a discount before we have any business to store.', delta: -300, feedback: 'Steinweg politely points out the tariff is already the group rate. Negotiating with nothing to store weakens the call you will need to make when you DO have tonnage. −$300 of goodwill.' },
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
    time: '17:15', from: 'Linh Pham', dept: 'Risk', subject: 'DECISION NEEDED: long Jan lots entering the delivery period',
    body: `Before you leave — this cannot wait until tomorrow.

The training book is LONG 10 January lots (100 t) and January enters its delivery period soon. This contract is PHYSICALLY DELIVERABLE. Three ways out — pick one:

1. TAKE DELIVERY — pay full value, receive certified warrants in an exchange warehouse.
2. ROLL to March — the structure is a $80/t CONTANGO to the next contract (sell Jan, buy Mar above it). The bank charges 8% p.a. on the initial margin we keep posting.
3. CLOSE — sell the lots now and realize the open profit of about +$10/t.

Your screen: Jan 4,800 · Mar 4,880. I believe a warehouse tariff circulated this morning.

Thanks,
Linh Pham
Risk & Product Control — HCM Desk
Saigon Merchants Co.`,
    replies: [
      { label: 'Take delivery AND sell March against it — cash and carry: earn the $80 contango, pay 2 × $10 Steinweg storage and ~$8 of 8% financing ≈ +$52/t locked, whatever prices do.', delta: 0, feedback: 'The morning email was the clue: with storage at $10/t/month, the $80 contango pays the carry roughly twice over. You take warrants, sell Mar at 4,880, redeliver in March — ≈ +$52/t locked on 100 t versus +$10/t for closing. Risk signs with a note: "read his mail before lunch."' },
      { label: 'Roll to March — stay long, the trend is our friend.', delta: -2500, feedback: 'You PAID the $80/t contango to keep the position, and the bank keeps charging 8% on the margin — you paid the very carry the warehouse would have PAID YOU to collect. The desk head circles the two emails, 11:45 and 17:15, and staples them together. −$2,500.' },
      { label: 'Close for +$10/t — never hold a deliverable contract into the notice period.', delta: -1500, feedback: 'Safe, clean — and ≈ $42/t light. "Never take delivery" is a rule for desks with no warehouse tariff in their inbox; you had one since 11:45. Banking +$10 while the structure pays +$52 is how carry desks eat speculators. −$1,500.' },
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
