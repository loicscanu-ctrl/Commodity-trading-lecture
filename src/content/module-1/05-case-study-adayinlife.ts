import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '05-case-study-adayinlife',
  title: 'A Day in the Life of a Trader in Asia',
  type: 'case-study',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'morning-recap',
      title: '06:30 — The Overnight',
      body: `Ho Chi Minh City. Coffee is already three hours old in your inbox.\n\nFirst screen: **New York closed**, **London reopens at 15:00 local**. Overnight, London Jan settled **\\$4,800/t**, up \\$95 on fund buying after a dry-weather story out of the Central Highlands. FX opens **25,500 VND/USD**.\n\nSecond screen: the **position sheet** — per bucket, then net, exactly as the exposure module taught:\n\n| Book | Bucket | Tonnage |\n|---|---|---|\n| Physical stock (Gd2, HCM warehouse) | spot | +1,800 t |\n| Sales to EU roasters (PTBF, unfixed) | Jan | −1,200 t |\n| Purchases from Dak Lak suppliers | Mar | +400 t |\n| Futures hedge | Jan | −900 t (90 lots) |\n| **Net** | | **+100 t** |\n\nNet looks tame. The structure doesn't: long spot against short Jan means yesterday's \\$95 rally *helped* the stock but *cost* the hedge — treasury will call about the variation margin before you finish the first coffee.\n\nThird screen: the differentials. FOB HCM quoted **Jan −\\$60** last night. Antwerp instore indicated **+\\$120**. Write those two numbers on your hand; the whole day trades between them.`,
    },
    {
      id: 'origin-morning',
      title: '08:30 — Origin Calls',
      body: `The phone starts. A Dak Lak supplier offers 200 t at **121,000 VND/kg**, prompt delivery.\n\nDo the conversion before you answer — always:\n\n> 121,000 VND/kg × 1,000 ÷ 25,500 = **\\$4,745/t** → implied differential = 4,745 − 4,800 = **Jan −\\$55**\n\nFOB HCM bids −\\$60. The supplier is offering you local coffee at −55 against an FOB market at −60: **negative origination margin — pass**, or counter. You counter at 119,500 (implied −\\$114... check: 119,500 ÷ 25.5 = \\$4,686 → −\\$114). He laughs. You settle at **120,200 VND/kg (implied −\\$86)**: buy 200 t, an origination margin of **\\$26/t** against the FOB bid if you re-sell today.\n\nNote what you did *not* discuss: the flat price. Neither of you controls it, so neither of you negotiated it. The entire conversation was conducted in **differential space** — VND on his side, dollars-versus-London on yours.`,
    },
    {
      id: 'hedge-margin',
      title: '11:00 — Hedging & the Treasury Call',
      body: `The 200 t you just bought is unhedged: long flat + long diff. You sell **20 lots of Jan** the moment London's pre-open allows — no view, no waiting, the simulation lesson.\n\nThen treasury calls, as predicted. Yesterday's \\$95 rally against the 90-lot short: **95 × 900 t = \\$85,500 variation margin**, wired this morning. The physical stock gained the same amount on paper — but paper doesn't wire. You walk the CFO through the margin table from the instruments module and confirm the revolving credit line has headroom for another \\$400/t of rally. *(If that sentence sounds paranoid: the group exercise's Round 2 is exactly this, at +\\$400.)*`,
    },
    {
      id: 'london-open',
      title: '15:00 — London Opens',
      body: `The real market day begins.\n\n**15:10** — A German roaster fixes 300 t of its PTBF purchase (buyer's call). Jan trades \\$4,760. You agree an **EFP at 4,760**: your short futures transfer to the buyer, the invoice fixes at 4,760 + the agreed differential, both legs in one registered transaction. Zero legging risk — the reason EFPs exist.\n\n**15:40** — Your Antwerp office reports instore bid **+\\$125**, and a forwarder quotes next month's HCM→Antwerp box at **\\$72/t**. Quick arithmetic on today's origination: bought at implied −86, Antwerp at +125, costs 72 + 100 = 172 → **+\\$39/t landed margin** if you place it. You offer 200 t instore at +130 and book the freight while the offer works — an unbooked freight quote is an open position.\n\n**16:30** — The dry-weather story gets a Reuters follow-up. Jan pops to \\$4,850. Your book barely blinks: the stock gains, the hedge pays margin, and the *differentials* — where your real P&L lives — haven't moved. You are long the basis, and today the basis is quiet.`,
    },
    {
      id: 'close',
      title: '17:30 — Marking the Book',
      body: `Close of business. The desk report decomposes the day the only honest way:\n\n| Leg | Today |\n|---|---|\n| Flat price (stock vs hedge, net +100 t × +\\$50) | +\\$5,000 |\n| Basis: FOB diff −60 → −58 on 1,800 t stock | +\\$3,600 |\n| New origination locked (200 t × \\$26 margin) | +\\$5,200 |\n| Costs accrued (storage, finance, today's fees) | −\\$2,900 |\n| **Day P&L** | **+\\$10,900** |\n\nThe flat-price line is noise you mostly neutralised; the basis and origination lines are the job. The report goes to risk with positions against limits — net, per bucket, per counterparty — because the limit framework, not the trader's mood, is what lets the desk take tomorrow's risk.\n\nLast call of the day: Antwerp confirms the +130 offer traded. You leave at 18:15. London is still open; the book is square enough that it can be.`,
    },
    {
      id: 'reflection',
      title: 'Reflection Questions',
      body: `1. At 08:30 the local market implied **−\\$55** while FOB bid **−\\$60**. Why is buying at that implied level a *losing* trade for an exporter, and what two market moves could make it profitable again?\n2. The 11:00 wire was **\\$85,500 out** on a day the book *made* money. Explain to a CFO — in three sentences — why a profitable hedged book consumes cash in a rally, and what funding facility it therefore needs.\n3. The 15:10 fixing was done by **EFP** rather than two screen trades. Quantify the risk it removed, using the slippage line from the PTBF simulator.\n4. In the 17:30 report, which line would a *speculator's* report be dominated by, and which line dominates here? What does that tell you about what this desk is actually paid for?\n5. The trader booked freight at 15:40 **before** the instore offer traded. Position or prudence? Argue both sides in differential terms.`,
    },
  ],
}

export default topic
