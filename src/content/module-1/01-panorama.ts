import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-panorama',
  title: 'Hard vs Soft Commodities & Trader Types',
  type: 'lecture',
  estimatedMinutes: 25,
  sections: [
    {
      id: 'classification',
      title: 'The Commodity Universe — $5.3 Trillion in Annual Exports',
      body: `Commodities are divided into two broad families:\n\n**Hard Commodities** — extracted from the earth:\n- Energy: crude oil (Brent, WTI), natural gas, coal\n- Metals: copper, aluminium, gold, iron ore\n\n**Soft Commodities** — grown or raised:\n- Agricultural grains: wheat, corn, soybeans\n- Tropicals: coffee (Arabica, Robusta), cocoa, sugar, cotton\n\nThe distinction matters because hard and soft commodities follow very different supply/demand dynamics, seasonality, and storage constraints.`,
      visual: 'commodity-donut-chart',
    },
    {
      id: 'trader-types',
      title: 'Who Are the Players? — The Trade Flow',
      body: `The commodity world is structured in four tiers — from the physical producers at the top to the pure financial speculators at the bottom. Each tier has a distinct role, a distinct risk profile, and a distinct relationship with the physical commodity.

**Key insight:** Only Tiers 1–3 interact with the physical commodity. Tier 4 trades paper — they provide liquidity and price signals but never take delivery.

Understanding which tier a counterparty belongs to tells you immediately what their incentives and constraints are.`,
      visual: 'trader-types',
    },
    {
      id: 'with-without-contract',
      title: 'With or Without a Contract',
      body: `Physical commodity trading can be executed:\n\n**With a contract** (EFP/EFS basis trades):\nA physical price is set as: **Futures price + Differential**\nExample: Arabica sold at ICE March + 35¢/lb\n\n**Without a contract** (outright/flat price):\nBuyer and seller agree on an all-in price upfront. No reference to exchange. Less common for large volumes.\n\nThe **differential** captures origin premiums/discounts, quality, logistics, timing, and supply/demand specifics that the generic futures price does not reflect.`,
    },
  ],
}

export default topic
