import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-supply-demand',
  title: 'Reading Supply & Demand',
  type: 'lecture',
  estimatedMinutes: 30,
  sections: [
    {
      id: 'supply-side',
      title: 'The Supply Side',
      body: `**What is supply?**\n\nIn commodity S&D models, "supply" is not simply production. The full picture:\n\n- **Production:** What is grown / extracted in a given crop year\n- **Beginning stocks:** Carryover inventory from the previous year\n- **Imports:** How much enters the market from external sources\n\n**Total supply = Production + Beginning stocks + Imports**\n\nKey insight: A bad harvest doesn't necessarily cause a price spike if stocks are abundant.`,
    },
    {
      id: 'demand-side',
      title: 'The Demand Side',
      body: `**What is demand?**\n\nDemand in commodity markets is driven by:\n\n- **Consumption:** End-use by processors, manufacturers, households\n- **Exports:** Physical flow out of the producing country\n- **Ending stocks:** Inventory held at year-end (the residual)\n\n**Total demand = Consumption + Exports + Ending stocks**\n\nCritical question: What really drives demand for coffee?\n- Population growth in consuming countries\n- Per-capita income growth (coffee is a "luxury" in low-income markets)\n- Changing consumption patterns (capsule culture, specialty coffee boom)\n- Substitution (tea, other beverages)`,
    },
    {
      id: 'balance',
      title: 'The Balance: Stocks-to-Use Ratio',
      body: `The single most important S&D indicator is the **stocks-to-use ratio (STU)**:\n\n**STU = Ending stocks ÷ Annual consumption × 100%**\n\nA high STU signals comfortable supply — prices tend to be low.\nA low STU signals tight supply — prices tend to be elevated.\n\nExample thresholds (coffee, approximate):\n- STU > 25%: ample supply, weak price pressure\n- STU 15–25%: balanced market\n- STU < 15%: tightening — watch for backwardation and price spikes`,
    },
    {
      id: 'sources',
      title: 'Where to Find S&D Data',
      body: `Key data sources:\n\n**Coffee:**\n- ICO (International Coffee Organization) — monthly trade stats\n- USDA GAIN reports — origin-by-origin crop estimates\n\n**Energy:**\n- IEA (International Energy Agency) — monthly oil market report\n- EIA (US Energy Information Administration) — weekly inventory data\n\n**Grains/Oilseeds:**\n- USDA WASDE (World Agricultural Supply and Demand Estimates) — released monthly, market-moving event\n\nTraders build their own models by aggregating these sources and applying their own adjustments.`,
    },
    {
      id: 'price-factors',
      title: 'Factors That Drive Price',
      body: `The commodity price is not set by one variable. It emerges from the intersection of supply, demand, and a web of structural factors — each with different time horizons and magnitudes.`,
      visual: 'price-factors-grid',
    },
  ],
}

export default topic
