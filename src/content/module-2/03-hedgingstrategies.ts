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
      body: `**Incoterms** (International Commercial Terms) define where responsibility for goods, insurance, and freight transfers from seller to buyer.\n\nKey terms for commodity trading:\n\n**FOB (Free on Board):** Seller's responsibility ends when goods are loaded on the vessel at the export port. Buyer arranges and pays freight/insurance.\n\n**CIF (Cost, Insurance, Freight):** Seller pays freight and insurance to the destination port. Risk transfers when goods cross the ship's rail at origin.\n\n**CFR (Cost and Freight):** Like CIF but without insurance — buyer arranges their own.\n\n**DAP (Delivered at Place):** Seller delivers to a named destination, duty unpaid.\n\nChoosing the right Incoterm affects your logistics exposure, insurance responsibilities, and pricing competitiveness.`,
    },
    {
      id: 'robusta-vs-arabica',
      title: 'Robusta vs Arabica: Contract Specifics',
      body: `Physical coffee trades involve two very different contracts with important implications:\n\n**ICE-EU Robusta (London):**\n- 10 MT per lot\n- Delivery: approved warehouses in Europe (Rotterdam, Hamburg, Antwerp, Le Havre, Barcelona)\n- Grade: Grade 1, Free of Defects (FOD)\n\n**ICE-US Arabica (New York):**\n- 37,500 lbs per lot (~17 MT)\n- Delivery: approved certified warehouses in licensed countries\n- Grade: washed Arabica, specific screen sizes\n- Country differentials apply on tender (e.g., Colombia at par, Ethiopia at a premium)\n\n**Mastering these specifications is a competitive advantage** — knowing which origins are certifiable, when delivery economics are favorable, and how tenders constrain prices (tenderable parity).`,
    },
    {
      id: 'tenderable-parity',
      title: 'Tenderable Parity: Theoretical Price Limits',
      body: `**Tenderable parity** is the all-in cost of delivering physical coffee against an exchange contract.\n\nFormula: **Parity = Origin cost + Freight + Handling + Warehouse fees − Exchange price**\n\nWhen this calculation is negative: it is cheaper to tender physical coffee against the exchange than to sell it in the cash market → sellers will tender → exchange price cannot rise too far above tenderable parity.\n\nWhen positive: physical is more expensive to deliver than the exchange pays → no one tenders → price can remain elevated.\n\nUnderstanding tenderable parity gives you a **fundamental anchor** for where physical prices must converge with futures over time.`,
    },
  ],
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'A trader owns 500 MT of physical Arabica coffee. To hedge, they should:',
        options: [
          'Buy Arabica futures (go long)',
          'Sell Arabica futures (go short)',
          'Buy Robusta futures (cross-hedge)',
          'Do nothing — hedging increases risk',
        ],
        correctIndex: 1,
        explanation: 'A physical long position (own the coffee) is hedged by selling futures (short hedge). The futures gain offsets any physical price decline.',
      },
      {
        id: 'q2',
        question: 'Under FOB terms, when does the buyer become responsible for the cargo?',
        options: [
          'When the contract is signed',
          'When the goods are loaded onto the vessel at origin',
          'When the vessel arrives at destination port',
          'When the buyer takes delivery at their warehouse',
        ],
        correctIndex: 1,
        explanation: 'FOB = Free on Board. Risk and responsibility transfer from seller to buyer when goods cross the ship\'s rail at the origin port.',
      },
    ],
  },
}

export default topic
