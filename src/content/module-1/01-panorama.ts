import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-panorama',
  title: 'Why We Need a Market: Commodities & Traders',
  type: 'lecture',
  estimatedMinutes: 30,
  sections: [
    {
      id: 'why-market',
      title: 'Why Do We Need a Market?',
      body: `This is a course about **commodity trading** — so start with the most fundamental question of all: *why does a market exist in the first place?*\n\nPicture the coffee chain without an exchange: **millions of growers**, thousands of exporters and roasters, scattered across continents, each negotiating bilaterally in the dark. Nobody knows the "right" price; everybody carries price risk from harvest to delivery; and if your buyer disappears, so does your sale.\n\nA **futures exchange** solves all three problems at once. It is a single, **centrally-cleared marketplace** where the whole supply chain can transfer price risk and read **one transparent price** — and, because the contract is physically deliverable, it acts as the **buyer and seller of last resort** for standard-spec coffee.\n\nThe three functions feed each other through **liquidity**: deep participation makes the price meaningful (**price discovery**), a meaningful price makes hedging work (**risk management**), and guaranteed delivery anchors it all to physical reality.\n\nFor coffee, that marketplace is the **Intercontinental Exchange (ICE)** — a Fortune 500 exchange operator (NYSE: ICE, also owner of the New York Stock Exchange) that runs the benchmark **Arabica (New York)** and **Robusta (London)** futures used to price and hedge physical coffee worldwide. The scale is striking: ICE reports the equivalent of roughly **400 million tonnes** traded across its coffee markets in a single year — more than **2,000 times** the world's physical crop.`,
      visual: 'exchange-functions',
    },
    {
      id: 'classification',
      title: 'The Commodity Universe — Hard vs Soft',
      body: `Coffee is one market among many. Zoom out: commodities divide into two broad families.\n\n**Hard Commodities** — extracted from the earth:\n- Energy: crude oil (Brent, WTI), natural gas, coal\n- Metals: copper, aluminium, gold, iron ore\n\n**Soft Commodities** — grown or raised:\n- Agricultural grains: wheat, corn, soybeans\n- Tropicals: coffee (Arabica, Robusta), cocoa, sugar, cotton\n\nThe distinction matters because hard and soft commodities follow very different supply/demand dynamics, seasonality, and storage constraints — but they all rely on the same market machinery you just saw.`,
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
      id: 'robusta-contract',
      title: 'Anatomy of a Futures Contract: ICE Robusta',
      body: `Before those players can trade with each other, they need the instrument itself. What does "standard-spec" actually mean? A futures contract standardises **everything except price** — that is what makes thousands of strangers able to trade it.\n\nThe **ICE Robusta Coffee (RC)** contract shows the machinery. Delivery runs through **ICE-registered warehouses**: physical coffee is turned into a **warrant**, sampled and **graded** against a quality ladder, and that warrant can then be delivered by a contract seller to settle their obligation — the full mechanics of futures positions come in the next topic.\n\nThe **quality ladder** is the bridge between an idealised contract and messy real-world coffee: Class 1 delivers at the contract price, better coffee earns a fixed premium, worse coffee a fixed discount. The differentials are set by the exchange — not negotiated — which is exactly what keeps delivery predictable.`,
      visual: 'robusta-contract',
    },
  ],
}

export default topic
