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
      id: 'why-market',
      title: 'Why Do We Need a Market?',
      body: `Picture the coffee chain without an exchange: **millions of growers**, thousands of exporters and roasters, scattered across continents, each negotiating bilaterally in the dark. Nobody knows the "right" price; everybody carries price risk from harvest to delivery; and if your buyer disappears, so does your sale.\n\nA **futures exchange** solves all three problems at once. It is a single, **centrally-cleared marketplace** where the whole supply chain can transfer price risk and read **one transparent price** — and, because the contract is physically deliverable, it acts as the **buyer and seller of last resort** for standard-spec coffee.\n\nThe three functions feed each other through **liquidity**: deep participation makes the price meaningful (**price discovery**), a meaningful price makes hedging work (**risk management**), and guaranteed delivery anchors it all to physical reality.\n\nFor coffee, that marketplace is the **Intercontinental Exchange (ICE)** — a Fortune 500 exchange operator (NYSE: ICE, also owner of the New York Stock Exchange) that runs the benchmark **Arabica (New York)** and **Robusta (London)** futures used to price and hedge physical coffee worldwide. The scale is striking: ICE reports the equivalent of roughly **400 million tonnes** traded across its coffee markets in a single year — more than **2,000 times** the world's physical crop.`,
      visual: 'exchange-functions',
    },
    {
      id: 'robusta-contract',
      title: 'Anatomy of a Futures Contract: ICE Robusta',
      body: `What does "standard-spec" actually mean? A futures contract standardises **everything except price** — that is what makes thousands of strangers able to trade it.\n\nThe **ICE Robusta Coffee (RC)** contract shows the machinery. Delivery runs through **ICE-registered warehouses**: physical coffee is turned into a **warrant**, sampled and **graded** against a quality ladder, and that warrant can then be delivered against a short futures position.\n\nThe **quality ladder** is the bridge between an idealised contract and messy real-world coffee: Class 1 delivers at the contract price, better coffee earns a fixed premium, worse coffee a fixed discount. The differentials are set by the exchange — not negotiated — which is exactly what keeps delivery predictable.`,
      visual: 'robusta-contract',
    },
    {
      id: 'buyer-last-resort',
      title: 'Case Study: The Buyer of Last Resort at Work',
      body: `"Buyer of last resort" sounds abstract — until you watch it happen.\n\n**Vietnam, 2024–25.** Robusta futures spiked above **\\$5,000/t**. Physical demand couldn't keep up with the screen, so the **cash differential** for Vietnamese Grade 2 collapsed — at the trough, Gd2 traded around **\\$298/t *under* the futures price** (FOB Ho Chi Minh).\n\nWhen the physical market pays you less than the exchange, the arbitrage is mechanical: sell futures, grade your coffee, **deliver it to the exchange**. And that is what the data shows — Vietnamese gradings at ICE surged (630 lots in a single month) with a **roughly three-month lag** behind the differential's collapse: the time it takes to ship, warehouse and grade.\n\nRead the three panels in order and you are watching the exchange do its job: absorbing physical supply the market doesn't want at the prevailing price, and publishing the price signal that eventually pulls the differential back.`,
      visual: 'vietnam-case-study',
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
