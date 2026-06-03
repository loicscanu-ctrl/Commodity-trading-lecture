import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '00-introduction',
  title: 'Welcome & Why Commodity Trading',
  type: 'lecture',
  estimatedMinutes: 10,
  sections: [
    {
      id: 'hook',
      title: 'Why Commodity Trading?',
      body: `Every product you consume — the coffee in your cup, the fuel in your car, the metal in your phone — passed through a commodity market.\n\nCommodity trading is the invisible infrastructure of the global economy. Yet it remains one of the least understood industries in finance.\n\nThis course gives you the vocabulary, mechanics, and strategic frameworks used by traders, exporters, and risk managers in physical commodity markets.`,
    },
    {
      id: 'structure',
      title: 'Course Structure',
      body: `**Module 1 — Panorama & Vocabulary** *(Licence / M1)*\nCommodity types, trader archetypes, key instruments (futures, swaps, EFP), and market structure.\n\n**Module 2 — Operational Mechanics & Hedging** *(M1 / M2)*\nHow trades are executed: basis management, hedging strategies, incoterms, risk taxonomy, and shipping.\n\n**Module 3 — Strategies, ESG & Data** *(M2 Spécialisé)*\nOptions in physical markets, EUDR regulation, supply/demand modeling, and data-driven trading.`,
    },
    {
      id: 'who-are-traders',
      title: 'Who Are Commodity Traders?',
      body: `Commodity traders connect **producers** (farmers, miners, oil fields) with **consumers** (factories, refineries, food processors). They add value by:\n\n- **Transforming place:** buying in Vietnam, selling in Rotterdam\n- **Transforming time:** buying now, selling in 3 months\n- **Transforming form:** buying raw beans, processing to green coffee\n- **Managing risk:** using financial instruments to lock in prices\n\nThe major trading houses — Vitol, Trafigura, Glencore, Louis Dreyfus, Cargill, Bunge — handle hundreds of billions in physical commodities annually.`,
    },
  ],
}

export default topic
