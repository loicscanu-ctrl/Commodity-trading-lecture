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
      id: 'swaps',
      title: 'Swaps',
      body: `A **swap** is an OTC (over-the-counter) agreement between two parties to exchange cash flows based on a commodity price.\n\nCommon use: a producer wants to lock in a selling price without using exchange futures.\n- Producer receives fixed price from bank\n- Producer pays floating (market price) to bank\n- Net: producer's price is fixed, regardless of where market moves\n\nSwaps are more flexible than futures (custom size, tenor, settlement) but carry **counterparty credit risk** since they are bilateral agreements.`,
    },
    {
      id: 'efp-efs',
      title: 'EFP and EFS',
      body: `**EFP (Exchange of Futures for Physical):** A privately negotiated transaction where a futures position is exchanged for a physical (cash) commodity position.\n\nExample: A coffee exporter has sold 100 lots of Robusta futures to hedge. When they execute the physical sale to a roaster, they do an EFP — the futures position moves to the buyer, and the physical transaction is confirmed.\n\n**EFS (Exchange of Futures for Swaps):** Same concept, but the futures position is exchanged for a swap position.\n\nKey point: EFPs/EFS allow the link between the exchange and physical markets — they are how "basis trading" is executed in practice.`,
    },
    {
      id: 'differential',
      title: 'The Differential',
      body: `**Physical price = Futures price + Differential**\n\nThe differential is expressed as a premium (+) or discount (−) to the nearby futures contract.\n\nFactors that affect the differential:\n- **Origin quality:** high-quality Yirgacheffe Arabica trades at a premium vs generic Brazil\n- **Logistics:** proximity to port, bagging quality\n- **Timing:** nearby supply tightness vs forward surplus\n- **Certifiability:** whether the physical coffee can be tendered against the exchange contract\n\nTrading the differential (basis trading) is where much of the commercial edge in physical trading lies.`,
    },
  ],
}

export default topic
