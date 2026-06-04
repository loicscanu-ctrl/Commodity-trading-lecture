import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-shipping',
  title: 'Shipping: Vessels, Chartering & Acceptability',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'vessel-types',
      title: 'Classification of Vessels',
      body: `Commodity traders use different vessel types depending on the cargo:\n\n**Bulk carriers:** Open holds, designed for dry bulk cargo (grain, coal, iron ore). Not suitable for bagged coffee without liners.\n\n**Container ships:** Standardized TEU containers. Most coffee (bagged, green) moves in 20ft containers. Allows precise lot tracking and blending at origin.\n\n**Tankers:** For liquid bulk (crude oil, vegetable oils, chemicals). Clean vs dirty tankers (clean = no prior crude oil cargo).\n\n**Ro-Ro (Roll-on/Roll-off):** For vehicles and machinery. Rare in coffee/energy.`,
    },
    {
      id: 'chartering',
      title: 'Vessel Chartering',
      body: `**Types of charter party:**\n\n**Voyage charter (spot):** Shipowner provides vessel + crew for a single voyage between named ports. Shipowner bears fuel costs. Charterer pays freight per MT or per day.\n\n**Time charter:** Charterer hires the vessel for a period (months/years). Charterer directs the vessel's employment, pays fuel. Shipowner provides crew.\n\n**Bareboat charter:** Charterer takes full operational control including crew. Long-term, rare for commodity traders.\n\n**Key charter party terms:**\n- Laytime: allowed loading/discharge time\n- Demurrage: penalty for exceeding laytime (per day rate)\n- Despatch: reward for finishing faster than laytime (half demurrage rate)\n- Force majeure: events beyond control that suspend laytime`,
    },
    {
      id: 'vessel-acceptability',
      title: 'Vessel Acceptability',
      body: `Not every vessel can load coffee. Contracts specify acceptability criteria:\n\n**For coffee (bagged, green):**\n- Must be "clean, dry, free from odors, fit for the carriage of coffee"\n- Previous cargo restrictions: no fish meal, chemicals, fertilizers, or other odorous/contaminating cargoes\n- Age limits: many buyers reject vessels over 20–25 years old\n- P&I Club insurance required (Protection & Indemnity)\n\n**Inspection:**\n- Pre-loading inspection by an independent surveyor (SGS, Bureau Veritas, Intertek)\n- Surveyor checks hold cleanliness and condition before loading begins\n\nFailing vessel acceptability = force majeure or contract dispute.`,
    },
    {
      id: 'tanker-types',
      title: 'Types of Oil Tankers',
      body: `Tanker selection depends on route, cargo volume, port constraints (draft limits), and canal access (Suezmax = maximum size for Suez Canal, Aframax = average freight rate maximum).`,
      visual: 'tanker-types',
    },
    {
      id: 'worldscale',
      title: 'Freight Pricing: Worldscale',
      body: `Tanker freight is not quoted in dollars per route — it uses **Worldscale**, a standardised index that allows comparison across routes and vessel sizes. W100 is the flat rate; the market quotes a percentage of it.`,
      visual: 'worldscale-example',
    },
  ],
}

export default topic
