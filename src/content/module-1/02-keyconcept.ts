import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-keyconcept',
  title: 'Key Instruments: Futures, Swaps, EFP/EFS',
  type: 'lecture',
  estimatedMinutes: 30,
  sections: [
    {
      id: 'futures',
      title: 'Futures Contracts',
      body: `A **futures contract** is a standardized, exchange-traded agreement to buy or sell a specific commodity at a predetermined price on a future date.\n\nKey characteristics:\n- **Standardized:** lot size, quality, delivery location defined by the exchange\n- **Marked to market daily:** gains/losses settled each day (variation margin)\n- **Clearinghouse guarantee:** counterparty risk is *mutualised and collateralised* (initial + variation margin, default fund) — mitigated, not abolished; the 2018 Nasdaq Clearing power-market default is the standard counterexample\n\n**Arabica Coffee (ICE-US):** 37,500 lbs per lot, quoted in cents/lb\n**Robusta Coffee (ICE-EU):** 10 metric tonnes per lot, quoted in $/MT\n**Brent Crude (ICE):** 1,000 barrels per lot, quoted in $/barrel\n\nMost futures contracts are **never delivered** — they are offset before expiry by an opposing trade.\n\nThe document below is the whole idea: **one public, pre-printed page**. Volume, delivery months, delivery terms — all standardized by the exchange; the *only* blank line is the price. And the stamp explains why strangers can sign it: the **clearing house guarantees** both sides of every matched trade.\n\n*"Futures contract" is one legal form wrapped around very different physical realities: origin specs run from US-grown-only (Cotton) to none at all (Brent); delivery from a warehouse warrant to a cash difference. The full spec cards — nine real contracts from Arabica to RBOB — live behind the ticker chips in the **Commodity Universe chart** of the first lecture: go back and click through them with these mechanics in mind.*`,
      visual: 'futures-contract-doc',
    },
    {
      id: 'order-book',
      title: 'Where the Price Comes From: The Order Book',
      body: `Every simulator in this course quotes you "the market" as a single number. Here is where that number lives: the **central limit order book** \u2014 resting bids on one side, resting offers on the other, and a trade printed every time somebody crosses the spread.\n\nThree orders to try:\n\n1. A small **market buy** \u2014 instant fill at the offer: you paid the spread, the price of immediacy\n2. A **40-lot market buy** \u2014 your size eats through several levels: the fill *walks the book* and your average slips. Size moves markets\n3. A **limit buy below the market** \u2014 nothing happens\u2026 yet. You now REST in the book, *making* the liquidity that market orders take \u2014 a better price, if the market ever comes to you\n\nThe "one transparent price" from the opening lecture is nothing more mystical than the top of this book.`,
      visual: 'order-book',
    },
    {
      id: 'margin-mechanics',
      title: 'Margin: the Cash Reality of a Hedge',
      body: `"Marked to market daily" is not an abstraction — it is **cash leaving or entering your account every day**. Run the week yourself in the simulator: you are an exporter **short 10 lots of Robusta (100 t), sold at \\$4,500/t** to hedge unsold physical, with **\\$60,000 of initial margin** posted via your clearing member. Each \\$1/t move = \\$100 on the position.\n\nSet each day's settlement on the chart — move the price point, **fix it**, and move to the next day, four times. The **daily variation margin** and the **cumulative cash line** compute as you go.\n\nTwo experiments:\n\n1. **Rally week** — settle the market up day after day (try 4,520 → 4,610 → 4,580 → 4,700): watch \\$20,000 wire out of the account in four days, while the physical coffee that "backs" the hedge sits in the warehouse, unsold and unfinanceable. The hedge is *economically* perfect and *cash-flow* brutal.\n2. **Break week** — settle it down instead: the hedge now *pays you* daily while the stock loses the same on paper. Symmetric — and just as misleading if the cash gets spent.\n3. **Bust the line** — the desk has a **\\$60,000 VM funding line** (the gauge on the right). Settle the market up hard enough, and your clearing member closes the position for you — at the top. Try it once, on purpose.\n\nThis **margin-funding risk** is what broke Ashanti's gold hedges in 1999 and squeezed European utilities in 2022. A hedging program without a liquidity line is a speculation on your own funding.`,
      visual: 'margin-simulator',
    },
    {
      id: 'swaps',
      title: 'Swaps',
      body: `A **swap** is an OTC (over-the-counter) agreement between two parties to exchange cash flows based on a commodity price.\n\nCommon use: a producer wants to lock in a selling price without using exchange futures.\n- Producer receives fixed price from bank\n- Producer pays floating (market price) to bank\n- Net: producer's price is fixed, regardless of where market moves\n\nSwaps are more flexible than futures (custom size, tenor, settlement) but carry **counterparty credit risk** since they are bilateral agreements.\n\n**A swap in numbers.** A producer fixes 500 t/month for Q1 at **\\$4,300/t** against the monthly average of the London front month:\n\n| Month | Index average | Producer receives (fixed − floating) | Cash flow |\n|---|---|---|---|\n| Jan | $4,150 | 4,300 − 4,150 = +$150/t | **+$75,000** |\n| Feb | $4,420 | 4,300 − 4,420 = −$120/t | **−$60,000** |\n| Mar | $4,300 | 0 | $0 |\n\nEach month, swap cash flow + physical sales at market ≈ **\\$4,300/t effective** — the fix holds whichever way the index goes. (Compare the fuel-oil swap settlement in the oil track: same machine, different index.)\n\n**Watch it on a timeline.** The chart plots the fixed leg against the monthly index averages, and the cash that moves at each settlement. Two things to see: at the **trade date, no cash changes hands** (a swap is not an option — there is no premium), and whatever you do to the index, the effective price line refuses to leave \\$4,300.`,
      visual: 'swap-timeline',
    },
    {
      id: 'swap-real-life',
      title: 'A Swap in Real Life: Gasoline, a Major & a London Broker',
      body: `How does a swap actually get done? Not on a screen with a central order book — **by voice and instant message, through a broker**.\n\nBelow is the anatomy of a typical North-West-Europe gasoline swap: a refiner's trading desk (here **TotalEnergies' TOTSA** in Geneva) wants to lock the selling value of next month's production; a **London OTC broker** (here **PVM**, the classic name in oil brokerage) shouts the offer to the market; a fuel distributor who needs the opposite hedge lifts it. The broker matches, earns a commission from each side, and steps away — the swap itself is **bilateral between the two principals**, papered under their ISDA master agreement and settled in cash against the published monthly average.`,
      visual: 'gasoline-swap',
    },
    {
      id: 'efp-efs',
      title: 'EFP and EFS',
      body: `**EFP (Exchange of Futures for Physical):** A privately negotiated transaction where a futures position is exchanged for a physical (cash) commodity position.\n\nExample: A coffee exporter has sold 100 lots of Robusta futures to hedge. When they execute the physical sale to a roaster, they do an EFP — the futures position moves to the buyer, and the physical transaction is confirmed.\n\n**EFS (Exchange of Futures for Swaps):** Same concept, but the futures position is exchanged for a swap position.\n\n**An EFP step by step, with prices:**\n\n1. *September:* exporter sells 100 t "Jan + \\$120, buyer's call" — a **PTBF sale** (*Price To Be Fixed*: the differential is agreed now, the futures leg is fixed later; the full mechanics come two topics from here) — and hedges by **selling Jan futures at \\$4,500**\n2. *November:* the roaster wants to fix. Jan futures trade **\\$4,200**\n3. The two parties register an **EFP at \\$4,200** with the exchange: the exporter's short 10 lots transfer to the roaster **off-screen, at the agreed price** — no slippage, no legging risk, both legs crystallise simultaneously\n4. Books after: exporter is flat futures, invoice fixed at 4,200 + 120 = **\\$4,320/t** (plus the \\$300/t hedge gain = \\$4,620 net, as per PTBF); the roaster now owns the short futures and manages their own flat price\n\nWhy not just cross on screen? Because on-screen you'd each **leg** the trade separately and risk the market moving between the two executions. The EFP prices *both* legs at one agreed number.\n\nKey point: EFPs/EFS are the plumbing that links the exchange to the physical market — they are how basis trading and PTBF fixings are executed in practice.`,
    },
    {
      id: 'efp-diagram',
      title: 'The Exchange, Drawn',
      body: `Picture the EFP as a **simultaneous swap of two legs between the same two entities**: the physical moves one way, the paper hedge moves the other — both at one agreed price, in one exchange-registered transaction.\n\nFollow the before/after books below: the exporter walks in *long physical + short futures* and walks out **flat and fully priced**; the roaster walks in with an unpriced PTBF commitment and walks out with **priced inventory plus the short futures that now hedge it**. Nobody crossed a screen, nobody legged anything — the positions simply changed owners at the agreed level. **EFS is the same picture with the paper leg being a swap** instead of futures.`,
      visual: 'efp-diagram',
    },
    {
      id: 'differential',
      title: 'The Differential',
      body: `**Physical price = Futures price + Differential**\n\nThe differential is expressed as a premium (+) or discount (−) to the nearby futures contract.\n\nFactors that affect the differential:\n- **Origin quality:** high-quality Yirgacheffe Arabica trades at a premium vs generic Brazil\n- **Logistics:** proximity to port, bagging quality\n- **Timing:** nearby supply tightness vs forward surplus\n- **Certifiability:** whether the physical coffee can be tendered against the exchange contract\n\nTrading the differential (basis trading) is where much of the commercial edge in physical trading lies.`,
    },
  ],
}

export default topic
