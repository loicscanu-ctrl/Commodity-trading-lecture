import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-knowyourexposure',
  title: 'Understanding & Measuring Exposure',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'what-is-exposure',
      title: 'What is Exposure?',
      body: `**Exposure** is the quantity of a commodity whose price you have not yet locked in.\n\nIf you own 1,000 MT of Robusta coffee with no futures hedge:\n- You have 1,000 MT of **long exposure**\n- Every $1/MT move in Robusta = $1,000 in P&L impact\n\nIf you have sold forward to a roaster but haven't bought the physical yet:\n- You have 1,000 MT of **short exposure**\n\nMeasuring exposure accurately across origins, maturities, and instruments is the prerequisite for hedging.`,
    },
    {
      id: 'types-of-risk',
      title: 'Six Types of Risk in Commodity Trading',
      body: `**6a. Counterparty risk:** The risk that your buyer or seller fails to perform. Mitigated by: credit lines, letters of credit (LC), trade credit insurance.\n\n**6b. Logistic risk:** Delays, vessel problems, port congestion, strikes. Mitigated by: logistics clauses in contracts, robust charter party terms.\n\n**6c. Quality risk:** The commodity delivered does not meet contract specifications. Mitigated by: pre-shipment inspection, quality clauses, arbitration mechanisms.\n\n**6d. Geographic risk:** Country-specific risks — export bans, FX controls, political instability. Mitigated by: diversified sourcing, political risk insurance.\n\n**6e. Political risk:** Sanctions, regulatory changes, nationalization. Mitigated by: OECD country coverage, geopolitical monitoring.\n\n**6f. Price / Differential risk:** Market price moves adversely. Mitigated by: futures hedging, options.`,
    },
    {
      id: 'hedge-ratio',
      title: 'The Hedge Ratio',
      body: `The **hedge ratio** is the proportion of your physical exposure you choose to hedge with futures.\n\n**Hedge ratio = Lots hedged × Lot size ÷ Physical volume**\n\n- 100% hedge: perfect flat-price protection, but you retain full basis risk and opportunity cost if prices move favorably\n- 50% hedge: partial protection, some speculative exposure retained\n- 0%: fully speculative — not acceptable for commercial traders with real physical commitments\n\nCommercial traders typically target 70–100% hedge ratios on committed volumes. The exact ratio depends on contract terms, price views, and risk appetite approved by management.`,
    },
  ],
  tool: {
    componentKey: 'hedging-calculator',
  },
}

export default topic
