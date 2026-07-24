import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-supply-demand',
  title: 'Reading Supply & Demand',
  type: 'lecture',
  estimatedMinutes: 20,
  sections: [
    {
      id: 'supply-side',
      title: 'The Supply Side',
      body: `**What is supply?**\n\nIn commodity S&D models, "supply" is not simply production. The full picture:\n\n- **Production:** What is grown / extracted in a given crop year\n- **Beginning stocks:** Carryover inventory from the previous year\n- **Imports:** How much enters the market from external sources\n\n**Total supply = Production + Beginning stocks + Imports**\n\nKey insight: A bad harvest doesn't necessarily cause a price spike if stocks are abundant.`,
    },
    {
      id: 'seasonality',
      title: 'The Harvest Never Stops: Crop Calendar',
      body: `Coffee supply is not a smooth flow \u2014 it arrives in **pulses**, and the pulses rotate around the globe. Brazil picks in the middle of the year; Vietnam and Colombia's main crops land around the turn of the year; Indonesia bridges. Somewhere, it is always harvest \u2014 but for any single origin, supply pressure (and harvest-time selling of differentials) is intensely seasonal.\n\nThis wheel is why softs curves carry crop-year structure \u2014 remember the September new-crop break in the wheat column of the contract matrix \u2014 and why an origin's differentials have seasons of their own.`,
      visual: 'crop-calendar',
    },
    {
      id: 'demand-side',
      title: 'The Demand Side',
      body: `**What is demand?**\n\nDemand in commodity markets is driven by:\n\n- **Consumption:** End-use by processors, manufacturers, households\n- **Exports:** Physical flow out of the producing country\n- **Ending stocks:** Inventory held at year-end (the residual)\n\n**Total demand = Consumption + Exports + Ending stocks**\n\nCritical question: What really drives demand for coffee?\n- Population growth in consuming countries\n- Per-capita income growth (coffee is a "luxury" in low-income markets)\n- Changing consumption patterns (capsule culture, specialty coffee boom)\n- Substitution (tea, other beverages)`,
    },
    {
      id: 'balance',
      title: 'The Balance: Stocks-to-Use Ratio',
      body: `The single most important S&D indicator is the **stocks-to-use ratio (STU)**:\n\n**STU = Ending stocks ÷ Annual consumption × 100%**\n\nA high STU signals comfortable supply — prices tend to be low.\nA low STU signals tight supply — prices tend to be elevated.\n\nIllustrative bands (rules of thumb, not published thresholds — calibrate them per commodity against its own history):\n- STU > 25%: ample supply, weak price pressure\n- STU 15–25%: balanced market\n- STU < 15%: tightening — watch for backwardation and price spikes\n\nThe relationship is famously **non-linear**: below some critical STU, each further point of tightness produces a disproportionate price response. That convexity is why traders obsess over the stocks line of the balance sheet.`,
    },
    {
      id: 'real-balance',
      title: 'A Real Balance Sheet — Do the Numbers',
      body: `Here is a real-world coffee balance (USDA FAS *Coffee: World Markets and Trade*, **December 2024 vintage**, million 60-kg bags — always pull the latest release before using in anger):\n\n| World coffee, 2024/25 | M bags |\n|---|---|\n| Beginning stocks | 14.1 |\n| Production | 174.9 |\n| — of which Brazil | 66.4 |\n| — of which Vietnam | 30.1 |\n| **Total supply** | **189.0** |\n| Consumption | 168.1 |\n| **Ending stocks** | **20.9** |\n\n**Now compute, before reading on:**\n\n1. **STU** = 20.9 ÷ 168.1 = **12.4%** — inside the "tight" band, among the lowest in decades\n2. **Concentration**: Brazil + Vietnam = 96.5 of 174.9 = **55% of world production**\n3. **Interpretation**: a 12.4% STU means the world carries about **45 days of consumption** in stock. Any Brazilian frost or Vietnamese drought hits a market with no cushion — which is precisely the backdrop of the 2024–25 price spike and the Vietnam buyer-of-last-resort case from the PTBF topic.\n\nThis is the whole method in one table: build the balance, find the residual, divide, compare to history — *then* form the price view.`,
    },
    {
      id: 'stu-convexity',
      title: 'The Convexity: Why Tight Markets Explode',
      body: `You computed STU = 12.4%. Now see what that *means*. The stocks-to-use \u2192 price relationship is not a line \u2014 it is a **hockey stick**. Above ~25% of annual use in stock, another million bags barely moves the price. Below ~15%, every point of tightness moves it disproportionately, and the uncertainty band around any forecast blows out with it.\n\nDrag this year's STU along the curve. At 12.4% \u2014 the real 2024/25 number \u2014 the market sits deep in the convexity zone: exactly why one drought headline out of Dak Lak was worth hundreds of dollars a tonne in the live-market exercise.`,
      visual: 'stu-scatter',
    },
    {
      id: 'sources',
      title: 'Where to Find S&D Data',
      body: `Key data sources:\n\n**Coffee:**\n- ICO (International Coffee Organization) — monthly trade stats\n- USDA GAIN reports — origin-by-origin crop estimates\n\n**Energy:**\n- IEA (International Energy Agency) — monthly oil market report\n- EIA (US Energy Information Administration) — weekly inventory data\n\n**Grains/Oilseeds:**\n- USDA WASDE (World Agricultural Supply and Demand Estimates) — released monthly, market-moving event\n\nTraders build their own models by aggregating these sources and applying their own adjustments.`,
    },
    {
      id: 'price-factors',
      title: 'Factors That Drive Price',
      body: `The commodity price is not set by one variable. It emerges from the intersection of supply, demand, and a web of structural factors — each with different time horizons and magnitudes.\n\nGroup them into **four families** and every headline finds its box: **supply-side** forces (weather, crops, origin stocks, logistics), **demand-side** forces (consumption, substitution, preferences, processor margins), **exchange-related** forces (certified stocks, fund positioning, deliveries and squeezes, rule changes) and the **macro & policy** backdrop (FX, rates, tariffs, regulation). When the futures screen goes live two sessions from now, every news flash you trade will come out of one of these boxes — practice sorting them now.`,
      visual: 'price-factors-grid',
    },
  ],
}

export default topic
