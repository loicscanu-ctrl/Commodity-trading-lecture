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
      body: `**Exposure** is the quantity of a commodity whose price you have not yet locked in.\n\nIf you own 1,000 MT of Robusta coffee with no futures hedge:\n- You have 1,000 MT of **long exposure**\n- Every $1/MT move in Robusta = $1,000 in P&L impact\n\nIf you have sold forward to a roaster but haven't bought the physical yet:\n- You have 1,000 MT of **short exposure**\n\nMeasuring exposure accurately across origins, maturities, and instruments is the prerequisite for hedging.\n\n**A net-exposure book (do this before any hedge decision):**\n\n| Position | Bucket | Tonnage |\n|---|---|---|\n| Physical stock, Vietnam Gd2 | spot | **+2,000 t** |\n| Forward sales to roasters | Jan | **−1,500 t** |\n| Forward purchases (Dak Lak suppliers) | Mar | **+500 t** |\n| Short futures hedge | Jan | **−800 t** |\n| **Net** | | **+200 t long** |\n\nThe book is *net* +200 t — but netting hides structure: it is **long spot / short Jan / long Mar**. A calendar-spread move (spot vs Jan) hits this book even at zero net exposure. Measure **per bucket first, net second**.`,
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
    {
      id: 'mvhr',
      title: 'The Minimum-Variance Hedge Ratio',
      body: `The coverage ratio above assumes the hedge instrument moves one-for-one with your physical. It usually doesn't — a **cross-hedge** (Conilon hedged with London Robusta, jet fuel with gasoil) needs the **minimum-variance hedge ratio** (Ederington, 1979):\n\n> **h\\* = ρ × (σ_S / σ_F)**\n\nwhere σ_S = volatility of your physical price, σ_F = volatility of the futures, ρ = their correlation.\n\n**Worked example:** hedging 1,000 t of Brazilian Conilon with London Robusta futures. Monthly vols: σ_S = \\$310/t, σ_F = \\$340/t, correlation ρ = 0.82:\n\n- h\\* = 0.82 × 310/340 = **0.75** → hedge **750 t = 75 lots**, not 100\n- A naive 1:1 hedge would be an **over-hedge**: the extra 25 lots are a speculative short position wearing a hedge costume\n- Hedge effectiveness = **ρ² = 67%** of price variance removed — the remaining 33% *is* your basis risk, now quantified\n\nOne more risk the ratio can't fix: **funding**. Variation margin on the futures leg settles in cash daily while the physical stays illiquid (see the margin walk-through in Module 1) — size the liquidity line together with the hedge.`,
    },
  ],
}

export default topic
