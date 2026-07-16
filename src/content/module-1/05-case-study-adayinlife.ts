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
      body: `Ho Chi Minh City. Coffee is already three hours old in your inbox.\n\nFirst screen: **New York closed**, **London reopens at 15:00 local**. Overnight, London Jan settled **\\$4,800/t**, up \\$95 on fund buying after a dry-weather story out of the Central Highlands. FX opens **25,500 VND/USD**.\n\nSecond screen: the **position sheet** — per bucket, with the flat exposure of every line, exactly as the exposure module taught. This desk runs **fully hedged**: the flat column must sum to zero before you leave the office, every day.\n\n| Book | Bucket | Tonnage | Flat exposure |\n|---|---|---|---|\n| Physical stock, unsold (Gd2, HCM warehouse) | spot | 600 t | +600 |\n| Stock sold to EU roasters — **PTBF, unfixed** (buyer's call) | Jan | 1,200 t | **+1,200** |\n| Forward purchases, Dak Lak (fixed VND price) | Mar | 400 t | +400 |\n| Futures hedge | Jan/Mar | short 220 lots | −2,200 |\n| **Net flat** | | | **0 — fully hedged** |\n\nRead the second line twice — it is the one juniors get wrong. Those 1,200 t are already **sold**, but the sale is **PTBF and unfixed**: the invoice will be *fixing + differential*, so the revenue still **floats with London**. Sold-but-unfixed coffee needs a hedge exactly like unsold stock. Only the *differential* on those 1,200 t is locked.\n\nSo the book is flat-neutral — and still full of risk: you are **long the basis on 1,000 t** (the unsold 600 + the Mar purchases 400, whose differentials are not yet locked). Yesterday's \\$95 rally moved nothing in your P&L; it will, however, move your *cash* — treasury will call before you finish the first coffee.\n\nThird screen: the differentials. FOB HCM quoted **Jan −\\$60** last night. Antwerp instore indicated **+\\$120**. Write those two numbers on your hand; the whole day trades between them.`,
    },
    {
      id: 'origin-morning',
      title: '08:30 — Origin Calls',
      body: `The phone starts. A Dak Lak supplier offers 200 t at **121,000 VND/kg**, prompt delivery.\n\nDo the conversion before you answer — always:\n\n> 121,000 VND/kg × 1,000 ÷ 25,500 = **\\$4,745/t** → implied differential = 4,745 − 4,800 = **Jan −\\$55**\n\nFOB HCM bids −\\$60. The supplier is offering you local coffee at −55 against an FOB market at −60: **negative origination margin — pass**, or counter. You counter at 119,500 (implied −\\$114... check: 119,500 ÷ 25.5 = \\$4,686 → −\\$114). He laughs. You settle at **120,200 VND/kg (implied −\\$86)**: buy 200 t, an origination margin of **\\$26/t** against the FOB bid if you re-sell today.\n\nNote what you did *not* discuss: the flat price. Neither of you controls it, so neither of you negotiated it. The entire conversation was conducted in **differential space** — VND on his side, dollars-versus-London on yours.`,
    },
    {
      id: 'hedge-margin',
      title: '11:00 — Hedging & the Treasury Call',
      body: `The 200 t you just bought is, for a few minutes, **the only unhedged tonnage on the book** — long flat + long diff. That is the rule of this desk: flat risk exists *only* in the gap between a new purchase and its hedge, and the gap is measured in minutes. You sell **20 lots of Jan** the moment London's pre-open allows — no view, no waiting. The book is fully hedged again: short 240 lots against 2,400 t of priced-but-unfixed length.\n\nThen treasury calls, as predicted. Yesterday's \\$95 rally against the 220-lot short: **95 × 2,200 t = \\$209,000 variation margin**, wired this morning. The physical side gained the same amount on paper — but paper doesn't wire. You walk the CFO through the margin table from the instruments module and confirm the revolving credit line has headroom for another \\$400/t of rally (\\$880,000 on this book). *(If that sentence sounds paranoid: the group exercise's Round 2 is exactly this, at +\\$400.)*\n\nThis is the price of the fully-hedged discipline: **zero flat P&L risk, real cash-flow risk.** The desk that can't fund its margin is forced to lift its hedges at the top — which is how "hedged" books blow up.`,
    },
    {
      id: 'london-open',
      title: '15:00 — London Opens',
      body: `The real market day begins.\n\n**15:10** — A German roaster fixes 300 t of its PTBF purchase (buyer's call). Jan trades \\$4,760. You agree an **EFP at 4,760**: 30 lots of your short futures transfer to the buyer, the invoice fixes at 4,760 + the agreed differential, both legs in one registered transaction. Zero legging risk — the reason EFPs exist. Notice the book-keeping: those 300 t are no longer floating, so the hedge **shrinks with the fixing** — short 210 lots against 2,100 t unfixed. Still zero net flat. The hedge is not a static number; it tracks the unfixed length tonne for tonne.\n\n**15:40** — Your Antwerp office reports instore bid **+\\$125**, and a forwarder quotes next month's HCM→Antwerp box at **\\$72/t**. Quick arithmetic on today's origination: bought at implied −86, Antwerp at +125, costs 72 + 100 = 172 → **+\\$39/t landed margin** if you place it. You offer 200 t instore at +130 and book the freight while the offer works — an unbooked freight quote is an open position.\n\n**16:30** — The dry-weather story gets a Reuters follow-up. Jan pops to \\$4,850. Your book barely blinks: the stock gains, the hedge pays margin, and the *differentials* — where your real P&L lives — haven't moved. You are long the basis, and today the basis is quiet.`,
    },
    {
      id: 'close',
      title: '17:30 — Marking the Book',
      body: `Close of business. The desk report decomposes the day the only honest way:\n\n| Leg | Today |\n|---|---|\n| Flat price (fully hedged book) | **\\$0** |\n| Basis: FOB diff −60 → −58 on 1,000 t of open diff exposure | +\\$2,000 |\n| New origination locked (200 t × \\$26 margin, hedged at purchase) | +\\$5,200 |\n| Costs accrued (storage, finance, today's fees) | −\\$2,900 |\n| **Day P&L** | **+\\$4,300** |\n\nThe flat line reads **zero by design** — that is the whole point of the book you inherited at 06:30 and the 20 lots you sold at 11:00. Every dollar of today's P&L came from the **differential**: the basis strengthening on your open diff exposure, and the origination margin you negotiated at 08:30. The report goes to risk with positions against limits — net flat (must be ~0), diff exposure per bucket, counterparty lines — because the limit framework, not the trader's mood, is what lets the desk take tomorrow's risk.\n\nLast call of the day: Antwerp confirms the +130 offer traded. You leave at 18:15. London is still open; the book is square enough that it can be.`,
    },
    {
      id: 'reflection',
      title: 'Reflection Questions',
      body: `1. The 06:30 sheet hedges **2,200 t** although only 600 t sit unsold in the warehouse. Explain why the 1,200 t *already sold* to roasters still belong in the hedge — and what single event removes them from it.\n2. At 08:30 the local market implied **−\\$55** while FOB bid **−\\$60**. Why is buying at that implied level a *losing* trade for an exporter, and what two market moves could make it profitable again?\n3. The 11:00 wire was **\\$209,000 out** on a day the book made money and carried **zero flat risk**. Explain to a CFO — in three sentences — why a fully hedged book consumes cash in a rally, and what funding facility it therefore needs.\n4. The 15:10 fixing was done by **EFP** rather than two screen trades, and the hedge dropped from 220 to 210 lots. Quantify the risk the EFP removed (use the PTBF simulator's slippage line), and state the rule linking hedge size to unfixed tonnage.\n5. In the 17:30 report the flat line reads **\\$0 by design**. Which line would a *speculator's* report be dominated by? What does that tell you about what this desk is actually paid for?\n6. The trader booked freight at 15:40 **before** the instore offer traded. Position or prudence? Argue both sides in differential terms.`,
    },
  ],
}

export default topic
