import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-hedgingstrategies',
  title: 'Hedging Principles & Risk Strategies',
  type: 'lecture',
  estimatedMinutes: 40,
  sections: [
    {
      id: 'hedging-principle',
      title: 'Why Commercial Hedging Opposes the Speculator',
      body: `A commercial trader hedges by taking the **opposite position in futures** to their physical position.\n\n- Physical long (owns coffee) → sell futures (short hedge)\n- Physical short (sold coffee not yet bought) → buy futures (long hedge)\n\nThe commercial hedger's futures position is always the opposite of the speculator's preferred direction. This is why speculators provide liquidity that commercials need — they are natural counterparties.\n\n**The speculator profits when prices move in one direction. The commercial hedger profits from the basis, not the direction.**`,
    },
    {
      id: 'incoterms',
      title: 'Incoterms & Logistics Risk Transfer',
      body: `**Incoterms** (International Commercial Terms) define where responsibility for goods, insurance, and freight transfers from seller to buyer.\n\nKey terms for commodity trading:\n\n**FOB (Free on Board):** Seller's responsibility ends when the goods are **on board the vessel** at the export port. Buyer arranges and pays freight/insurance.\n\n**CIF (Cost, Insurance, Freight):** Seller pays freight and insurance to the destination port — but **risk still transfers at origin, once the goods are on board the vessel**. Cost and risk part ways: that split is the whole point of CIF.\n\n**CFR (Cost and Freight):** Like CIF but without insurance — buyer arranges their own.\n\n**DAP (Delivered at Place):** Seller delivers to a named destination, duty unpaid.\n\nTwo precision points for the exam room and the desk:\n\n- The old **"ship's rail"** test was retired in **Incoterms 2010**; since then the criterion is *on board the vessel*.\n- FOB/CIF/CFR are formally **maritime bulk** terms. For containerised cargo ICC recommends **FCA / CIP** (risk transfers when the container is handed to the carrier) — although coffee trade practice stubbornly keeps saying "FOB".\n\nChoosing the right Incoterm affects your logistics exposure, insurance responsibilities, and pricing competitiveness.`,
    },
    {
      id: 'robusta-vs-arabica',
      title: 'Robusta vs Arabica: Contract Specifics',
      body: `Physical coffee trades involve two very different contracts with important implications:\n\n**ICE Robusta — RC (London):**\n- 10 MT per lot, quoted in US\\$/tonne\n- Delivery: **ICE-registered warehouses in the EU, UK & USA** (Antwerp, Amsterdam, Hamburg/Bremen, Le Havre, London area, New Orleans…)\n- Quality: graded into **classes** — Class 1 delivers at the contract price; better or worse classes tender at **fixed premiums/discounts** (from +\\$30/t down to −\\$90/t)\n\n**ICE Arabica — KC, the "C" contract (New York):**\n- 37,500 lbs per lot (~17 MT), quoted in ¢/lb\n- Delivery: exchange-licensed warehouses in the US and Europe\n- Grade: **washed arabica** from ~20 deliverable growths, screen and defect tested\n- **Growth differentials apply on tender** — Colombia at a fixed *premium* (+2¢/lb), several growths (e.g. Burundi, Rwanda, India) at discounts of 1–4¢/lb; **Brazilian naturals are not tenderable at all**. Always verify against the current ICE rulebook — these schedules change.\n\n**Mastering these specifications is a competitive advantage** — knowing which origins are certifiable, when delivery economics are favorable, and how tenders constrain prices (tenderable parity).`,
    },
    {
      id: 'tenderable-parity',
      title: 'Tenderable Parity: Theoretical Price Limits',
      body: `**Tenderable parity** answers one question: *is my coffee worth more delivered to the exchange, or sold in the cash market?* It is an arbitrage bound, so write it as a comparison of two realisations:\n\n> **Exchange realisation = Futures price ± class/growth differential − delivery costs**\n> *(delivery costs = freight to an exchange warehouse + handling + grading & certification fees + financing while you wait)*\n>\n> **Cash realisation = Futures price + market differential**\n\nWhen **exchange realisation > cash realisation**, sellers tender; the resulting deliveries cap how far futures can trade above the physical market. When it is below, nobody tenders and the cash market sets the pace.\n\n**Worked example (Robusta, \\$/t):** futures at \\$4,500; your coffee grades **Class 1** (par). Delivery costs: freight to Antwerp \\$120 + handling/warehouse \\$60 + grading \\$25 + financing \\$45 = **\\$250**.\n\n- Exchange realisation: 4,500 + 0 − 250 = **\\$4,250**\n- Cash market bids Gd2 at futures − \\$300 = **\\$4,200**\n- → Tendering wins by **\\$50/t**: coffee flows to the exchange (exactly the Vietnam 2024–25 mechanism from Module 1)\n\nRe-run it with the cash differential at −\\$200 and tendering loses by \\$50 — the flow stops. That switch point **is** tenderable parity: the fundamental anchor that forces physical and futures to converge.`,
    },
  ],
}

export default topic
