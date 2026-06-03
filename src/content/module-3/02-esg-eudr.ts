import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-esg-eudr',
  title: 'ESG & EUDR: The Regulatory Revolution',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'what-is-eudr',
      title: 'What is the EUDR?',
      body: `The **EU Deforestation Regulation (EUDR)** — Regulation (EU) 2023/1115 — came into force in June 2023. It requires that seven key commodities (coffee, cocoa, cattle, soy, palm oil, wood, rubber) and derived products placed on the EU market must:\n\n1. Not have been produced on land deforested after December 31, 2020\n2. Be traceable to the plot of land where they were produced (geolocation data)\n3. Be covered by a **due diligence statement** filed by the operator before import\n\nNon-compliance: fines up to 4% of EU turnover, market access ban, seizure of goods.`,
    },
    {
      id: 'impact-on-coffee',
      title: 'Impact on Coffee Supply Chains',
      body: `Coffee is one of the most exposed commodities. Key challenges:\n\n**Traceability to farm level:** Traditional coffee supply chains aggregate beans from thousands of smallholders. Mapping each to GPS coordinates with deforestation risk assessment is operationally complex and costly.\n\n**Producing country readiness:** Vietnam (largest Robusta producer) and Brazil (largest Arabica) have varying levels of national monitoring system infrastructure recognized by the EU.\n\n**Price impact:** EUDR-compliant coffee commands a premium in the EU market. Non-compliant origins face discount or exclusion. This is reshaping differentials for Vietnamese, Indonesian, and Brazilian origins.\n\n**Opportunity:** Traders who built traceability infrastructure early gain competitive advantage — their supply is certifiable when others cannot ship.`,
    },
    {
      id: 'beyond-eudr',
      title: 'Beyond EUDR: The Broader ESG Agenda',
      body: `EUDR is one piece of a broader regulatory shift:\n\n**Corporate Sustainability Due Diligence Directive (CSDDD):** Requires large EU companies to identify, prevent, and address adverse human rights and environmental impacts in their supply chains.\n\n**Carbon border adjustment mechanism (CBAM):** Applies carbon pricing to imports of carbon-intensive goods (initially steel, cement, fertilizers — coffee not yet in scope).\n\n**Science-Based Targets (SBTs):** Many major roasters (Nestlé, JDE, Lavazza) have committed to net-zero supply chains, pushing ESG requirements upstream to traders and producers.\n\n**Trader response:** ESG is no longer reputational — it affects market access, financing costs (green bonds, sustainability-linked loans), and counterparty selection.`,
    },
  ],
}

export default topic
