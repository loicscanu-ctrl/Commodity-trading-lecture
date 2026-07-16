import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-panorama',
  title: 'Why We Need a Market: Commodities & Traders',
  type: 'lecture',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'why-market',
      title: 'Why Do We Need a Market?',
      body: `This is a course about **commodity trading** — so start with the most fundamental question of all: *why does a market exist in the first place?*\n\nPicture the coffee chain without an exchange: **millions of growers**, thousands of exporters and roasters, scattered across continents, each negotiating bilaterally in the dark. Nobody knows the "right" price; everybody carries price risk from harvest to delivery; and if your buyer disappears, so does your sale.\n\nA **futures exchange** solves all three problems at once. It is a single, **centrally-cleared marketplace** where the whole supply chain can transfer price risk and read **one transparent price** — and, because the contract is physically deliverable, it acts as the **buyer and seller of last resort** for standard-spec coffee.\n\nThe three functions feed each other through **liquidity**: deep participation makes the price meaningful (**price discovery**), a meaningful price makes hedging work (**risk management**), and guaranteed delivery anchors it all to physical reality.\n\nFor coffee, that marketplace is the **Intercontinental Exchange (ICE)** — a Fortune 500 exchange operator (NYSE: ICE, also owner of the New York Stock Exchange) that runs the benchmark **Arabica (New York)** and **Robusta (London)** futures used to price and hedge physical coffee worldwide. The scale is striking: ICE reports the equivalent of roughly **400 million tonnes** traded across its coffee markets in a single year — more than **2,000 times** the world's physical crop.`,
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
      id: 'ptbf',
      title: 'PTBF: Price To Be Fixed',
      body: `Most physical coffee is **not** sold at a flat price. It is sold **PTBF — Price To Be Fixed**: the contract locks the *differential* today and leaves the *futures leg* to be fixed later.\n\n> Invoice price = **futures fixing** (set later, by whoever holds the fixing right) **+ differential** (set at signature)\n\nExample: *"100 t Robusta, ICE January **+ \\$120/t**, buyer's call."* The \\$120 is agreed now; the roaster chooses **when** to fix the January futures leg — any time before the contract's fixing deadline (in practice, ahead of the reference month's first notice day), usually executed against the exporter's hedge via an **AA/EFP**.\n\n**Read it as a pair trade.** A PTBF sale decomposes one price into two tradeable legs:\n\n- The **futures leg** — the systematic, flat-price component: liquid, screen-traded, hedgeable by anyone\n- The **differential leg** — the idiosyncratic component: origin, quality, logistics, local supply and demand\n\nThe exporter who hedges the moment they sign is **long physical / short futures** — a classic pair. The outright price cancels out of their book; what they still own, and what they actually trade for a living, is the **differential** (the *basis*). Hence the desk maxim: *a hedged physical trader is not flat — they are long the basis.*\n\n**Who carries what:**\n\n- **Exporter (hedged):** immune to the flat price. Their economics were sealed at signature: futures sold at \\$4,500 + \\$120 differential = **\\$4,620/t**, whatever happens next.\n- **Roaster (holds the fixing right):** owns the *timing decision* on the futures leg. Fix at \\$4,200 and the invoice is \\$4,320/t; fix at \\$5,000 and it is \\$5,120/t. The fixing right is effectively a timing option on the flat price.\n\nPTBF exists because it **separates the two risks and lets each party price its own leg on its own clock** — the physical logistics proceed regardless. Prove the invariance to yourself below: drag the roaster's fixing level and watch the hedged exporter's net refuse to move.`,
      visual: 'ptbf-mechanics',
    },
  ],
}

export default topic
