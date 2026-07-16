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
      body: `A **futures contract** is a standardized, exchange-traded agreement to buy or sell a specific commodity at a predetermined price on a future date.\n\nKey characteristics:\n- **Standardized:** lot size, quality, delivery location defined by the exchange\n- **Marked to market daily:** gains/losses settled each day (variation margin)\n- **Clearinghouse guarantee:** counterparty risk is *mutualised and collateralised* (initial + variation margin, default fund) — mitigated, not abolished; the 2018 Nasdaq Clearing power-market default is the standard counterexample\n\n**Arabica Coffee (ICE-US):** 37,500 lbs per lot, quoted in cents/lb\n**Robusta Coffee (ICE-EU):** 10 metric tonnes per lot, quoted in $/MT\n**Brent Crude (ICE):** 1,000 barrels per lot, quoted in $/barrel\n\nMost futures contracts are **never delivered** — they are offset before expiry by an opposing trade.`,
    },
    {
      id: 'margin-mechanics',
      title: 'Margin: the Cash Reality of a Hedge',
      body: `"Marked to market daily" is not an abstraction — it is **cash leaving or entering your account every day**. Walk through a real sequence.\n\nAn exporter **sells 10 lots of Robusta (100 t) at \\$4,500/t** to hedge unsold physical. Initial margin: ~\\$6,000/lot → **\\$60,000 posted** via their clearing member. Each \\$1/t move = \\$100 on the position. The market rallies:\n\n| Day | Settle ($/t) | Daily move | Variation margin (cash) | Cumulative |\n|---|---|---|---|---|\n| 1 | 4,520 | +20 | −$2,000 | −$2,000 |\n| 2 | 4,610 | +90 | −$9,000 | −$11,000 |\n| 3 | 4,580 | −30 | +$3,000 | −$8,000 |\n| 4 | 4,700 | +120 | −$12,000 | −$20,000 |\n\nFour days, **\\$20,000 of cash out the door** — while the physical coffee that "backs" the hedge is still in a warehouse, unsold and unfinanceable. The hedge is *economically* perfect and *cash-flow* brutal: this **margin-funding risk** is what broke Ashanti's gold hedges in 1999 and squeezed European utilities in 2022. A hedging program without a liquidity line is a speculation on your own funding.`,
    },
    {
      id: 'swaps',
      title: 'Swaps',
      body: `A **swap** is an OTC (over-the-counter) agreement between two parties to exchange cash flows based on a commodity price.\n\nCommon use: a producer wants to lock in a selling price without using exchange futures.\n- Producer receives fixed price from bank\n- Producer pays floating (market price) to bank\n- Net: producer's price is fixed, regardless of where market moves\n\nSwaps are more flexible than futures (custom size, tenor, settlement) but carry **counterparty credit risk** since they are bilateral agreements.\n\n**A swap in numbers.** A producer fixes 500 t/month for Q1 at **\\$4,300/t** against the monthly average of the London front month:\n\n| Month | Index average | Producer receives (fixed − floating) | Cash flow |\n|---|---|---|---|\n| Jan | $4,150 | 4,300 − 4,150 = +$150/t | **+$75,000** |\n| Feb | $4,420 | 4,300 − 4,420 = −$120/t | **−$60,000** |\n| Mar | $4,300 | 0 | $0 |\n\nEach month, swap cash flow + physical sales at market ≈ **\\$4,300/t effective** — the fix holds whichever way the index goes. (Compare the fuel-oil swap settlement in the oil track: same machine, different index.)`,
    },
    {
      id: 'efp-efs',
      title: 'EFP and EFS',
      body: `**EFP (Exchange of Futures for Physical):** A privately negotiated transaction where a futures position is exchanged for a physical (cash) commodity position.\n\nExample: A coffee exporter has sold 100 lots of Robusta futures to hedge. When they execute the physical sale to a roaster, they do an EFP — the futures position moves to the buyer, and the physical transaction is confirmed.\n\n**EFS (Exchange of Futures for Swaps):** Same concept, but the futures position is exchanged for a swap position.\n\n**An EFP step by step, with prices:**\n\n1. *September:* exporter sells 100 t "Jan + \\$120, buyer's call" — a **PTBF sale** (*Price To Be Fixed*: the differential is agreed now, the futures leg is fixed later; the full mechanics come two topics from here) — and hedges by **selling Jan futures at \\$4,500**\n2. *November:* the roaster wants to fix. Jan futures trade **\\$4,200**\n3. The two parties register an **EFP at \\$4,200** with the exchange: the exporter's short 10 lots transfer to the roaster **off-screen, at the agreed price** — no slippage, no legging risk, both legs crystallise simultaneously\n4. Books after: exporter is flat futures, invoice fixed at 4,200 + 120 = **\\$4,320/t** (plus the \\$300/t hedge gain = \\$4,620 net, as per PTBF); the roaster now owns the short futures and manages their own flat price\n\nWhy not just cross on screen? Because on-screen you'd each **leg** the trade separately and risk the market moving between the two executions. The EFP prices *both* legs at one agreed number.\n\nKey point: EFPs/EFS are the plumbing that links the exchange to the physical market — they are how basis trading and PTBF fixings are executed in practice.`,
    },
    {
      id: 'differential',
      title: 'The Differential',
      body: `**Physical price = Futures price + Differential**\n\nThe differential is expressed as a premium (+) or discount (−) to the nearby futures contract.\n\nFactors that affect the differential:\n- **Origin quality:** high-quality Yirgacheffe Arabica trades at a premium vs generic Brazil\n- **Logistics:** proximity to port, bagging quality\n- **Timing:** nearby supply tightness vs forward surplus\n- **Certifiability:** whether the physical coffee can be tendered against the exchange contract\n\nTrading the differential (basis trading) is where much of the commercial edge in physical trading lies.`,
    },
  ],
}

export default topic
