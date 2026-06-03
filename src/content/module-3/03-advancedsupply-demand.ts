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
      body: `A commodity S&D model is a structured forecast of supply and demand variables to estimate the ending stocks balance and derive a price view.\n\n**Standard structure (annual, crop year basis):**\n\n| Supply | Demand |\n|--------|--------|\n| Opening stocks | Consumption |\n| Production | Exports |\n| Imports | Ending stocks |\n| **Total supply** | **Total demand** |\n\nBalance = Total supply − Total demand = Ending stocks (must equal)\n\nThe model's value lies not in the number — it's in the **scenario analysis**: what if Brazil production is down 5%? What if Chinese demand grows faster than expected?`,
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
