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
      title: 'Types of Traders (ABCD & Beyond)',
      body: `**The ABCD Trading Houses** — pure commodity merchants:\n- **A**rcher Daniels Midland (ADM)\n- **B**unge\n- **C**argill\n- **D**reyfus (Louis Dreyfus)\n\nThey buy from producers, transport, store, process and sell globally. They take price risk as part of their business model.\n\n**Industrial Traders** — companies that trade to supply their own operations:\n- Nestlé, Jacobs Douwe Egberts (coffee)\n- BP, Shell (energy)\n- Rio Tinto, Glencore (metals)\n\n**Financial Traders** — hedge funds, prop desks trading commodity derivatives for profit without taking physical delivery.\n\n**Importateurs / Exportateurs** — regional specialists who bridge local producers with international markets.`,
    },
    {
      id: 'with-without-contract',
      title: 'With or Without a Contract',
      body: `Physical commodity trading can be executed:\n\n**With a contract** (EFP/EFS basis trades):\nA physical price is set as: **Futures price + Differential**\nExample: Arabica sold at ICE March + 35¢/lb\n\n**Without a contract** (outright/flat price):\nBuyer and seller agree on an all-in price upfront. No reference to exchange. Less common for large volumes.\n\nThe **differential** captures origin premiums/discounts, quality, logistics, timing, and supply/demand specifics that the generic futures price does not reflect.`,
    },
  ],
}

export default topic
