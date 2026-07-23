import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-market-structure',
  title: 'Market Structure: Contango & Backwardation',
  type: 'lecture',
  estimatedMinutes: 25,
  sections: [
    {
      id: 'term-structure',
      title: 'The Futures Term Structure',
      body: `The **term structure** (or forward curve) shows the price of a commodity at different future delivery dates.\n\nTwo fundamental shapes:\n\n**Contango:** Future price > Spot price\n- "Normal" for storable commodities\n- Reflects cost of carry: storage + insurance + financing\n- Signals adequate nearby supply\n\n**Backwardation:** Future price < Spot price\n- Spot commands a premium\n- Signals tight nearby supply or strong immediate demand\n- Common during supply disruptions or harvest seasons`,
      visual: 'term-structure-chart',
    },
    {
      id: 'market-influences',
      title: 'Influences That Drive Market Structure',
      body: `What shapes the forward curve? Five key forces determine whether a market is in contango or backwardation — and by how much.`,
      visual: 'market-influences',
    },
    {
      id: 'contango',
      title: 'Contango in Detail',
      body: `In contango, a nearby buyer can:\n1. Buy spot\n2. Store the commodity\n3. Sell forward at a higher price\n4. Earn the spread (minus costs)\n\nIf the forward premium exceeds cost of carry, this **cash-and-carry arbitrage** is profitable and traders exploit it until the premium collapses to fair value.\n\n**Cost of carry** = Storage cost + Insurance + Financing cost (interest)\n\nContango is why oil in tanks, grain in silos, and coffee in warehouses are all "financed" by the forward curve.\n\n---\n\n**⚠ The contango fallacy — the curve is NOT a forecast**\n\nOn the chart: spot \\$60, 6-month contract ≈ \\$67. Beginners read: *"the market expects \\$67."* **Wrong.** The \\$7 is not an opinion — it is just the bill for storing, insuring and financing a barrel for six months.\n\nProof by arbitrage: if the 6-month jumped to \\$75 on pure bullish sentiment, anyone could buy spot at 60, pay ~7 of carry, and sell forward at 75 — risk-free profit. That selling would crush the forward straight back to ~67. The curve is leashed to spot by the cost of carry.\n\n**Takeaway:** contango describes *today's* fundamentals (ample supply, demand for storage) and the cost of money — not where spot will be at maturity.`,
      visual: 'contango-chart',
    },
    {
      id: 'arbitrage-exercise',
      title: 'Exercise: Is There an Arbitrage?',
      body: `For each case below, decide: **YES** (Cash-and-Carry arbitrage exists) or **NO** (market is fairly priced). Click "Reveal answer" to check your work and see the full calculation.`,
      visual: 'arbitrage-exercise',
    },
    {
      id: 'unit-conversions',
      title: 'Prices, Units & Conversions',
      body: `Commodity prices are quoted in different units across markets. A trader working across crude, products, and softs must convert fluently.`,
      visual: 'unit-conversions',
    },
    {
      id: 'cash-carry-simulator',
      title: 'Simulator: Cash-and-Carry Arbitrage',
      body: `Use this simulator to visualize the leash. Drag the **Market Forward Price** slider above the fair value to trigger an arbitrage opportunity — then watch what must happen to restore equilibrium.`,
      visual: 'cash-carry-simulator',
    },
    {
      id: 'roll-yield',
      title: 'The Roll: Contango Taxes Longs, Backwardation Pays Them',
      body: `Cash-and-carry explains why the curve has its shape. Here is what that shape **does to anyone holding futures over time**.\n\nA futures position held beyond one expiry must be **rolled** every month \u2014 close the expiring contract, open the next. Which way the roll cuts depends on the curve *and* on your side of it:\n\n- **Contango \u00d7 LONG:** you keep buying the dearer next contract and watching it decay to spot \u2014 the roll quietly **taxes** you. *Good market to be SHORT:* the short collects exactly that carry.\n- **Backwardation \u00d7 LONG:** you keep buying the next contract at a *discount* and it converges **up** to spot \u2014 the roll **pays** you. *Bad market to be short:* a rolling short hedge pays the shortage premium away every month.\n\n**Rule of thumb: backwardation favours the long, contango favours the short.** Toggle the position and set the carry below \u2014 a full year of rolls, with spot never moving an inch.\n\nThis is why long-only commodity index investors can lose money in a flat contango market ("just buy futures and hold" has a built-in rent bill), and why hedging programs care so much about which structure they roll their shorts in.`,
      visual: 'roll-yield',
    },
    {
      id: 'oi-wave',
      title: 'Five Contracts, One Crowd: the Open Interest Wave',
      body: `Put the last two ideas together \u2014 open interest, and the roll \u2014 and watch them move through **one real year of the Robusta market** (November 2024 \u2192 November 2025, reconstructed from settlement history; indicative).\n\nThe chart below is a real price chart: the **y-axis is the futures price**, and each coloured line is one of the **six contracts** that carried the year \u2014 **F** (Jan 25), **H** (Mar 25), **K** (May 25), **N** (Jul 25), **U** (Sep 25), **X** (Nov 25): the exchange month codes you will read on every professional screen, identified in the legend and riding the end of their own line. Each line DIES in its own calendar month \u2014 that is the defining fact of a futures curve: **every contract expires on schedule**, front first. The vertical line is **time passing**; the bubble riding each line is that contract's **open interest**.\n\nPress play and watch four things at once:\n\n- The **front month carries the crowd** (\u224850% of the board's open interest) \u2014 and as its expiry nears, its bubble **deflates while the next contract's inflates**: the ROLL. The open interest does not die, it **changes address** (volume spikes while it happens \u2014 every migrating lot trades twice). A small remainder rides into expiry on purpose: the players with a **delivery plan**.\n- Through the winter the curve is **deeply backwardated** \u2014 every deferred line sits UNDER the front \u2014 and each contract **climbs toward the front price as its own expiry approaches**: the *pull to spot*, the roll yield of the previous section drawn in real time.\n- Mid-2025 the **record crop lands**: the front collapses hardest, from $5,700 toward $3,500 \u2014 and the whole board converges.\n- By autumn the structure has quietly **flipped into mild contango** (watch the chip above the chart change): structure is a live thing, not a diagram.\n\nScrub the timeline by hand and stop just before an expiry: a nearby with almost no OI left while the next month bulges \u2014 exactly the screen you read on the desk day, and exactly why an unplanned long in the delivery month is a decision, not a detail.`,
      visual: 'rolling-oi',
    },
    {
      id: 'backwardation',
      title: 'Backwardation in Detail',
      body: `In backwardation, spot prices are higher than forward prices.\n\nCauses:\n- Supply shortage: bad harvest, port strikes, logistics disruption\n- Seasonal demand peaks\n- Inventory drawdown (low warehouse stocks)\n\n**Squeeze risk:** An extreme form of backwardation where a dominant player controls nearby physical supply, forcing short hedgers to pay very high prices to close positions. The **Robusta coffee market** has seen recurring squeezes.\n\n---\n\n**Exchange Interventions: Constraining the Squeeze**\n\n**1. Position Limits & Accountability Levels** *(Preventative Shield)*\nExchanges and regulators cap the number of contracts — net or gross — that any single entity or group of linked entities can hold in a delivery month. By legally capping market share (e.g. no single trader can hold more than 20% of open interest in the delivery month), the exchange prevents any single player from cornering the market and holding deliverable supply hostage from the shorts.\n\n**2. Lending Rules** *(Liquidity Forcer)*\nProminently used by the LME via their Tom-Next Lending Rules. If a trader builds a dominant long position (controlling 50%, 80%, or 90% of deliverable warehouse warrants), the exchange triggers mandatory lending obligations. The dominant long is legally forced to lend their metal at a capped backwardation premium — allowing trapped shorts to roll positions forward at a controlled cost rather than bidding spot prices to infinity.\n\n**3. Backwardation Caps** *(Hard Ceiling)*\nFollowing the nickel short squeeze of 2022, the LME introduced absolute backwardation limits — a strict mathematical cap on the premium that nearby contracts can trade over deferred contracts. If the spot-to-3M spread exceeds the predefined limit, trades beyond this limit are automatically price-adjusted or cancelled. It acts as an absolute speed limit on the convenience yield.\n\n**4. Delivery Deferral Powers** *(Release Valve)*\nIn extreme logistical or geopolitical crises where physical commodity cannot be sourced, exchanges can grant short sellers the right to defer physical delivery. Instead of defaulting or paying exorbitant spot prices, the short pays a penalty fee to defer their obligation — instantly removing panic-buying pressure from the prompt price.\n\n**5. Financially Settled Contracts** *(Structural Bypass)*\nAs a structural alternative, exchanges offer cash-settled futures (e.g. CME financially settled agricultural and energy contracts). Because the contract settles against an index rather than requiring physical delivery, short sellers are never forced to scramble for physical barrels or tons — they pay the cash difference, eliminating the localized physical squeeze altogether.`,
      visual: 'backwardation-chart',
    },
    {
      id: 'squeeze-simulator',
      title: 'Simulator: Squeeze & Exchange Intervention',
      body: `*Stretch material — this simulator runs ahead of the course: squeezes and lending rules come back in force in the oil modules. If it feels like a step too far today, play it once, note what the exchange did, and return after Module 2.*\n\nUse the sliders to build a squeeze scenario: reduce deliverable supply, raise short covering demand, and increase long concentration. Watch the front of the curve spike.\n\nThen toggle exchange interventions one by one to see how each mechanism flattens the curve and restores order.`,
      visual: 'squeeze-simulator',
    },
  ],
}

export default topic
