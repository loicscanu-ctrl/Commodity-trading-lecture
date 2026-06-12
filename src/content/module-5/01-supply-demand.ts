import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-supply-demand',
  title: 'Supply, Demand & Price',
  type: 'lecture',
  estimatedMinutes: 22,
  sections: [
    {
      id: 'price-feedback',
      title: 'Price Is Both an Output and a Signal',
      body: `The oil price is the **output** of a system — supply, demand, stocks and transport — but it is also an **input**, because the price level feeds back to the market: a higher price curbs demand and pulls out supply; a lower price does the reverse.\n\n*Exercise:* list every factor you can think of that moves the price of oil. Most fall into a grid of fundamental drivers:\n\n- **Supply** ↔ **Demand** (the two poles)\n- **Stocks**, **geopolitics**, **transport**\n- **Seasonality**, **refining**, **quality / location**\n- **Alternatives**, **taxation**, **environment**\n- **Renewables**, **regulation**, the **US dollar**\n\nAnalysing these fundamentals tells you whether the market is **balanced**, over-supplied (bearish) or tight (bullish).`,
    },
    {
      id: 'flow-east',
      title: 'Where Oil Is Produced vs Consumed',
      body: `World supply (~98 mb/d) and demand (~102 mb/d) are both concentrated — but in **different places**. The Middle East and Russia produce far more than they burn; Asia-Pacific and Europe burn far more than they produce.\n\nThe consequence is the single most important fact in oil logistics: **crude must flow East.** It is the reason the tanker, pipeline and benchmark systems are shaped the way they are.`,
      visual: 'supply-demand-region',
    },
    {
      id: 'opec-balance',
      title: 'OPEC, OPEC+ and the “Call on OPEC”',
      body: `Two blocs set the supply tone:\n\n- **OPEC** — 12 members (Saudi Arabia, Iraq, UAE, Kuwait, Iran, Nigeria, Libya, Algeria, Venezuela, Congo, Equatorial Guinea, Gabon)\n- **OPEC+** — OPEC plus 10 partners, led by **Russia** (also Kazakhstan, Mexico, Oman, Azerbaijan…)\n\nThe key analytical residual is the **call on OPEC crude**:\n\n> **Call on OPEC = Total demand − non-OPEC supply − OPEC NGLs**\n\nIt's the volume OPEC must pump to balance the market. Set against OPEC's **spare capacity** (the cushion against shocks, and a cap on prices), it tells you how tight the market really is.`,
    },
    {
      id: 'reading-balance',
      title: 'Reading the Balance: Stocks & Spare Capacity',
      body: `Two gauges turn the balance into a tradable view:\n\n**Inventories** are read **against the 5-year seasonal range**, never in absolutes. Stocks at the bottom of the range = tight market (bullish); a build above the range = surplus (bearish). Watch OECD industry stocks, oil-on-water, and **days of forward demand cover**.\n\n**Spare capacity** — mostly Saudi and UAE — is the market's shock absorber. High spare capacity caps prices; thin spare capacity (as in 2022) means any disruption spikes the price.\n\nWhen forecast **supply > demand**, the model implies **stock builds → bearish bias**; the reverse implies draws and a bullish bias.`,
    },
  ],
}

export default topic
