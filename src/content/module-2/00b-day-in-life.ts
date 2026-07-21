import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '05-case-study-adayinlife',
  title: 'A Day in the Life of a Trader in Asia',
  type: 'case-study',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'morning-recap',
      title: '06:30 — The Book You Inherit',
      body: `**Tuesday, 12 November.** Ho Chi Minh City. Coffee is already three hours old in your inbox.\n\nThe screen: London **Nov** is in its delivery period, so **January is the nearby liquid month** — it settled **\\$4,800/t** overnight, up \\$95 on a dry-weather story. **Mar** trades \\$4,760. FX **25,500 VND/USD**. FOB HCM quoted **Jan −\\$60**; instore Antwerp indicated **Jan +\\$120**.\n\nThe **position sheet** — every line dated, valued, and typed (outright or differential). This desk runs **fully hedged**: the flat column sums to zero before anyone goes home.\n\n| Book | Tonnage | Priced at | Type | Flat | Hedged with |\n|---|---|---|---|---|---|\n| Unsold stock, **carried from yesterday** (Gd2, HCM) | 600 t | \\$4,698/t (avg 119,800 VND/kg) | **outright** | +600 | short 60 lots **Jan** (nearby) @ avg 4,750 → buying diff locked **−\\$52** |\n| Sold to EU roasters — **PTBF, unfixed** (buyer's call) | 1,200 t | **Jan +\\$115/t** | **differential** (diff locked, flat floats until fixing) | +1,200 | short 120 lots **Jan** @ avg 4,745 |\n| Forward purchases, Dak Lak — **Mar delivery** | 400 t | \\$4,725/t (120,500 VND/kg) | **outright** | +400 | short 40 lots **Mar** @ 4,760 → buying diff locked **−\\$35** |\n| **Net flat** | | | | **0** | **220 lots total (180 Jan + 40 Mar)** |\n\nThree disciplines are written into that table:\n\n1. **Yesterday's stock hedges in the nearby month (Jan)** — it will price or ship within weeks, so its hedge lives in the nearest liquid contract. The **Mar purchases hedge in Mar**, matching their own pricing period: hedges sit in the bucket of the exposure they cover.\n2. **The sold-but-unfixed line still carries flat exposure** — the one juniors get wrong. Those 1,200 t are sold at Jan +115, but PTBF-unfixed revenue *floats with London* until the roaster fixes. Only the differential is locked; the flat leg needs its 120 lots.\n3. Every **outright** line converts to a **locked buying differential** the moment its hedge is on (−\\$52 on the stock, −\\$35 on the Mar purchases): the book's real position is *long the basis* — locked buying diffs against a locked selling diff of +\\$115 on the sold portion, with **1,000 t of diff exposure still open** (600 unsold + 400 Mar).\n\nThe only time flat risk is allowed to exist on this desk is in the minutes between a **fresh purchase** and its hedge. Today you will make one. Open the inbox.`,
    },
    {
      id: 'inbox',
      title: 'The Inbox — Run the Day',
      body: `Seven emails between 06:30 and 17:30 — risk, treasury, a supplier, the desk head, a roaster, your Antwerp office, and risk again at the close. Each expects a reply; pick one of the pre-written answers, read the consequence, and watch the day's P&L build.\n\nA perfectly-handled day closes at **+\\$4,300** — every dollar of it from differentials. Anything below that is the cost of your replies.`,
      visual: 'trader-inbox',
    },
    {
      id: 'reflection',
      title: 'Reflection Questions',
      body: `1. The 06:30 sheet hedges **2,200 t** although only 600 t sit unsold in the warehouse. Explain why the 1,200 t *already sold* to roasters still belong in the hedge — and what single event removes them from it.\n2. Why does yesterday's stock hedge in **Jan** while the Dak Lak purchases hedge in **Mar**? What risk would appear if all 220 lots sat in Jan?\n3. The 07:15 wire was **\\$209,000 out** on a day the book made money and carried **zero flat risk**. Explain to a CFO — in three sentences — why a fully hedged book consumes cash in a rally, and what funding facility it therefore needs.\n4. The 15:10 fixing was done by **EFP** rather than two screen trades, and the hedge dropped from 240 to 210 lots. Quantify the risk the EFP removed (use the PTBF simulator's slippage line), and state the rule linking hedge size to unfixed tonnage.\n5. In the EOD report the flat line reads **\\$0 by design**. Which line would a *speculator's* report be dominated by? What does that tell you about what this desk is actually paid for?\n6. At 15:40 the right reply booked the freight **before** the instore offer traded. Position or prudence? Argue both sides in differential terms.`,
    },
  ],
}

export default topic
