import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-brent-complex',
  title: 'The Brent Complex',
  type: 'lecture',
  estimatedMinutes: 25,
  sections: [
    {
      id: 'north-sea',
      title: 'Small Output, Global Benchmark',
      body: `Brent's importance has almost nothing to do with how much oil the North Sea pumps:\n\n- **Less than 3% of world crude production**\n- ~**150 different fields**, but only a **handful of loading installations**\n- Clear, published **loading programmes** assign "dates" to cargoes at each terminal\n- A complex mixture of **physical and forward** trading sits on top\n\nFew terminals + transparent loading dates + deep paper market = the most-watched price benchmark on earth.`,
    },
    {
      id: 'forties',
      title: 'One Pipeline, One Export Point',
      body: `The Forties system is the clearest illustration of *why so few installations* matters. Around 150 North Sea fields drain through **one pipeline network** to **one export terminal**.\n\nThat concentration is the benchmark's pressure point: a single outage at Forties can move **Dated Brent — and therefore a huge share of the world's crude pricing — at once.**`,
      visual: 'forties-system',
    },
    {
      id: 'brent-basket',
      title: '“Brent” Is a Brand Name',
      body: `There is no single barrel called Brent any more. Today the term refers to the value of **six light crude oils** (the FOB grades trade as **BFOET**):\n\n- Brent Ninian Blend (BNB) · Forties · Oseberg · Ekofisk · Troll\n- **WTI delivered CIF Rotterdam**, netted back to the North Sea\n\nThe twist that drives the whole market: **on any given day the *lowest* value in the basket sets the published Dated Brent price.** The seller delivers the cheapest grade they can — so Dated tracks the weakest grade.`,
      visual: 'brent-basket',
    },
    {
      id: 'price-buildup',
      title: 'The Price Build-Up',
      body: `Price discovery **cascades** down from paper to physical:\n\n1. **Futures** trade — visible, screen pricing\n2. **Forward** markets trade *using* futures prices\n3. **Physical** markets trade using futures + forward activity to define value\n4. The physical deal is struck at the **benchmark price ± a differential**\n\nEach layer leans on the one above it; the differential is the last mile.`,
      visual: 'price-buildup',
    },
    {
      id: 'triangle',
      title: 'Trading as Price Relationships',
      body: `Because value cascades through those layers, the real trading is in the **spreads between them**. Three instruments stitch the Brent complex together — **EFP**, **DFL** and **CFD** — each linking two of the three markets (Futures, BFOE Forward, Dated Brent).\n\nMaster this triangle and the rest of crude hedging falls into place.`,
      visual: 'brent-triangle',
    },
    {
      id: 'dfl',
      title: 'DFL — Dated to Front Line',
      body: `**DFL = a swap on Dated Brent vs ICE Brent (futures).**\n\n- Fixed value versus a floating settlement: **Platts Dated − ICE settlement**, on a calendar average\n- Lets a trader **lock in the relative value of Dated Brent to the futures contract before the oil even trades**\n\nIt is the bridge across the left side of the triangle: Futures ↔ Dated.`,
    },
    {
      id: 'forward',
      title: 'The Brent Forward (BFOE)',
      body: `A **Brent Forward** is a standardised contract for one of the grades (WTI delivers Rotterdam):\n\n- Identical terms, a **full delivery month**, loading any time within it\n- **Nomination 30 days prior**; the seller can nominate **any of the five** grades\n- Priced **fixed or via EFP** — and these days it is **"always EFP"**\n\nWhen you buy a forward you ultimately receive a **dated cargo** — and the relationship between forward and dated is itself a price risk traders are eager to manage. That is the CFD's job.`,
    },
    {
      id: 'dated',
      title: 'Dated Brent',
      body: `**Dated Brent** is physical oil with **specific loading dates**:\n\n- FOB North Sea: BNB, Forties, Oseberg, Ekofisk, Troll · CFR Rotterdam: WTI Midland\n- **700,000 bbl cargoes ± 1%**\n- Trades within a **10–31-day forward window** beyond the publication date (the window tracks the calendar month)\n\nIts price is created from fixed trades, differential trades on the derivative markets, **and** the value of the physical cargo market — the combination is what the **CFD** captures and trades.`,
    },
  ],
}

export default topic
