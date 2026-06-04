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
      id: 'contango',
      title: 'Contango in Detail',
      body: `In contango, a nearby buyer can:\n1. Buy spot\n2. Store the commodity\n3. Sell forward at a higher price\n4. Earn the spread (minus costs)\n\nIf the forward premium exceeds cost of carry, this **cash-and-carry arbitrage** is profitable and traders exploit it until the premium collapses to fair value.\n\n**Cost of carry** = Storage cost + Insurance + Financing cost (interest)\n\nContango is why oil in tanks, grain in silos, and coffee in warehouses are all "financed" by the forward curve.`,
      visual: 'contango-chart',
    },
    {
      id: 'contango-fallacy',
      title: '⚠ Warning: The Contango Fallacy',
      body: `**The common misconception:**\nWhen a market is in contango (e.g. Spot = $80, 6-month Forward = $85), beginners almost always conclude: *"The market expects the spot price to rise to $85 in six months."*\n\n**The reality:**\nForward prices in storable commodity markets are **not price forecasts**. They are pricing formulas dictated by the **Cost of Carry**.\n\nThe $5 premium does not mean traders are bullish. It simply reflects the exact mathematical cost of storing, insuring, and financing that commodity for six months:\n\n**Fair Forward = Spot + Storage cost + Financing cost**\n\n**Why it matters — the arbitrage bound:**\nIf the forward price spiked to $95 based purely on "bullish sentiment," it would immediately break the cost of carry. Arbitrageurs would buy at $80, store for $5, and sell forward at $95 — a risk-free $10 profit. That wave of selling crushes the forward price straight back to $85.\n\n**The key takeaway:** Contango tells you about current **fundamentals** (oversupply today → storage demand) and the **cost of capital**. It does not tell you where the spot price will be at maturity. The forward curve is tied to the spot price by an invisible mathematical leash — the cost of carry.`,
    },
    {
      id: 'cash-carry-simulator',
      title: 'Simulator: Cash-and-Carry Arbitrage',
      body: `Use this simulator to visualize the leash. Drag the **Market Forward Price** slider above the fair value to trigger an arbitrage opportunity — then watch what must happen to restore equilibrium.`,
      visual: 'cash-carry-simulator',
    },
    {
      id: 'backwardation',
      title: 'Backwardation in Detail',
      body: `In backwardation, spot prices are higher than forward prices.\n\nCauses:\n- Supply shortage: bad harvest, port strikes, logistics disruption\n- Seasonal demand peaks\n- Inventory drawdown (low warehouse stocks)\n\n**Squeeze risk:** An extreme form of backwardation where a dominant player controls nearby physical supply, forcing short hedgers to pay very high prices to close positions. The **Robusta coffee market** has seen recurring squeezes.`,
    },
    {
      id: 'back-middle-front',
      title: 'Back, Middle & Front Office',
      body: `In a commodity trading house:\n\n**Front Office** — traders, originators, sales\n- Execute trades, manage positions, engage with counterparties\n- P&L responsible\n\n**Middle Office** — risk management, compliance\n- Monitor trader positions vs limits\n- Mark-to-market, exposure reporting\n\n**Back Office** — operations, settlements, accounting\n- Confirm trades, arrange logistics, process invoices\n- Coordinate shipping documents, warehouse receipts\n- Settle financial transactions\n\nAll three must communicate seamlessly — a breakdown between front and back is how operational losses happen.`,
    },
  ],
}

export default topic
