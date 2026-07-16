import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-advancedsupply-demand',
  title: 'Advanced S&D Modeling',
  type: 'lecture',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'building-a-model',
      title: 'Building an S&D Model',
      body: `A commodity S&D model is a structured forecast of supply and demand variables to estimate the ending stocks balance and derive a price view.\n\n**Standard structure (annual, crop year basis):**\n\n| Supply | Use |\n|--------|--------|\n| Opening stocks | Consumption |\n| Production | Exports |\n| Imports | — |\n| **Total supply** | **Total use** |\n\nThe forecast output is the residual:\n\n> **Ending stocks = Total supply − (Consumption + Exports)**\n\n(Beware the classic accounting trap: if you put ending stocks *inside* "total demand", then supply − demand ≡ 0 by construction and the identity tells you nothing. Ending stocks are the balancing item, not a demand.)\n\nThe model's value lies not in the number — it's in the **scenario analysis**: what if Brazil production is down 5%? What if Chinese demand grows faster than expected? Each scenario propagates straight through the identity into ending stocks, then into the stocks-to-use ratio, and from there into your price view.`,
    },
    {
      id: 'scenario-lab',
      title: 'Scenario Lab: Shock the Balance',
      body: `Run the classic scenario on the real 2024/25 balance from Module 1 (beginning stocks 14.1, production 174.9, consumption 168.1, ending stocks 20.9 M bags — STU 12.4%):\n\n**"Brazil −5%"** (a modest frost, by historical standards):\n\n| | Baseline | Scenario |\n|---|---|---|\n| Brazil production | 66.4 | 63.1 (−3.3) |\n| World production | 174.9 | 171.6 |\n| Ending stocks | 20.9 | **17.6** |\n| STU | 12.4% | **10.5%** |\n\nA 5% problem in one origin removes **two points of STU** from a market already at the bottom of the curve — deep in the convexity zone where historical price responses run to double digits. (The 1975 Brazilian frost, a far bigger shock, tripled prices in a year; 2021's frost added ~70% in six months.)\n\nUse the lab below to build your own scenarios — stack a Vietnam drought on top, or relieve the market with a demand slowdown — and watch the residual do the work. The discipline to internalise: **the model doesn't output a price; it outputs a stocks number whose *historical analogue* is your price argument.**`,
      visual: 'sd-scenario',
    },
    {
      id: 'trader-2',
      title: 'Trader 2.0: Data & Technology',
      body: `The next generation of commodity traders uses data to anticipate S&D shifts before they appear in official reports:\n\n**Satellite imagery:** Crop condition monitoring (NDVI index), deforestation detection, inventory levels at ports/silos from space.\n\n**AIS (Automatic Identification System):** Real-time vessel tracking — count ships loading at origin ports to infer export flow before official customs data.\n\n**Weather modeling:** ENSO (El Niño/La Niña) cycle prediction 6–12 months forward to anticipate drought or flood conditions in key origins.\n\n**Alternative data:** Social media crop reports from local farmers, drone imagery, IoT sensors in warehouses.\n\nData gives an edge in three areas: anticipating supply disruptions, measuring demand inflections, and identifying operational risks.`,
    },
    {
      id: 'operational-risk',
      title: 'Operational Risk in the Data Age',
      body: `Beyond price risk, Trader 2.0 uses data to manage:\n\n**Counterparty risk:** Credit default models using public financials + payment behavior + trade exposure.\n\n**Non-execution risk:** Probability that a supplier fails to deliver. Indicators: past performance, local liquidity stress, currency moves at origin.\n\n**Logistics risk:** Congestion signals at ports (AIS dwell times), labor disputes, customs processing times.\n\nThe challenge: **data quality and interpretation**. Bad data acted on confidently is worse than no data. The trader's role evolves from pure relationship-based deal making to data-informed commercial judgment.`,
    },
  ],
}

export default topic
