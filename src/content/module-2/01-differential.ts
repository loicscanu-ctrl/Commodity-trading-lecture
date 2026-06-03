import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-differential',
  title: 'The Differential & Basis Management',
  type: 'lecture',
  estimatedMinutes: 30,
  sections: [
    {
      id: 'what-is-differential',
      title: 'What is the Differential?',
      body: `The **differential** (also called the basis in grain markets) is the premium or discount at which physical coffee trades relative to the futures price.\n\n**Physical price = Futures price ± Differential**\n\nA coffee from Colombia might trade at ICE March + 35¢/lb.\nA lower-grade Vietnam Robusta might trade at LIFFE March − $30/MT.\n\nThe differential is the market's way of pricing everything the futures contract ignores: origin, quality, harvest timing, local logistics, certifiability.`,
    },
    {
      id: 'arbitrage-types',
      title: 'Three Types of Arbitrage',
      body: `**Origin arbitrage:** Buying in a cheaper origin and selling in a market where demand is higher. Example: buying Vietnam Robusta for European instant coffee manufacturers when the differential is attractive vs Brazilian Conillon.\n\n**Quality arbitrage:** Blending lower-grade lots with higher-grade to create a certifiable grade that trades near the exchange price, while the input cost was lower than the full premium.\n\n**Logistic arbitrage:** Routing physical cargo through an alternative port or routing to exploit a freight differential. Example: redirecting a shipment from Rotterdam to Hamburg when Hamburg warehouse receipts trade at a better basis.`,
    },
    {
      id: 'basis-risk',
      title: 'Basis Risk',
      body: `A trader who hedges price risk with futures eliminates **flat price risk** but retains **basis risk** — the risk that the differential moves adversely.\n\nExample:\n- Trader buys physical Robusta at LIFFE + $10/MT\n- Sells LIFFE futures at the same time (hedge)\n- Flat price risk: eliminated\n- Basis risk: if the differential widens to − $20/MT when the trader needs to sell, they lose $30/MT on the basis\n\nBasis risk is the core commercial risk that separates skilled physical traders from pure financial speculators.`,
    },
  ],
}

export default topic
