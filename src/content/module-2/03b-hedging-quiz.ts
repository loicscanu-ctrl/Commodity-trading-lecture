import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03b-hedging-quiz',
  title: 'Quiz: Hedging, Basis & Incoterms',
  type: 'quiz',
  estimatedMinutes: 8,
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
        explanation: 'FOB = Free on Board. Risk and responsibility transfer from seller to buyer once the goods are on board the vessel at the origin port (the old "ship\'s rail" test was retired in Incoterms 2010).',
      },
      {
        id: 'q3',
        question: 'Under CIF, who pays freight to destination — and where does RISK transfer?',
        options: [
          'Seller pays freight; risk transfers at the destination port',
          'Buyer pays freight; risk transfers at origin',
          'Seller pays freight; risk still transfers at origin, on board the vessel',
          'Seller pays freight and carries risk to the buyer\'s warehouse',
        ],
        correctIndex: 2,
        explanation: 'CIF splits cost from risk: the seller pays freight and insurance to destination, but risk passes to the buyer at origin, once the goods are on board. That split is the defining trap of CIF.',
      },
      {
        id: 'q4',
        question: 'A hedged trader buys physical at London +$10/t and later sells it at London −$20/t. Ignoring the flat price, their basis P&L is:',
        options: ['+$30/t', '−$30/t', '−$10/t', 'Zero — they were hedged'],
        correctIndex: 1,
        explanation: 'Long the basis: P&L = exit differential − entry differential = (−20) − (+10) = −$30/t. The hedge removed the flat price, not the differential. The basis weakened against them.',
      },
      {
        id: 'q5',
        question: 'The basis "strengthens". Who profits?',
        options: [
          'The short-basis trader (sold physical forward, long futures)',
          'The long-basis trader (long physical, short futures)',
          'Both — a stronger basis helps everyone',
          'Neither — basis moves are P&L-neutral',
        ],
        correctIndex: 1,
        explanation: 'Long physical / short futures = long the basis: a strengthening differential is their profit. The short-basis position wants weakening. Basis direction always has a winner and a loser.',
      },
      {
        id: 'q6',
        question: 'Cross-hedging Conilon with London Robusta: σ_physical = $310/t, σ_futures = $340/t, correlation 0.82. The minimum-variance hedge ratio is about:',
        options: ['1.00', '0.90', '0.75', '0.55'],
        correctIndex: 2,
        explanation: 'h* = ρ × σ_S/σ_F = 0.82 × 310/340 ≈ 0.75 → hedge 75% of the tonnage. A naive 1:1 hedge would over-hedge; hedge effectiveness is ρ² ≈ 67% of variance removed.',
      },
      {
        id: 'q7',
        question: 'Futures at $4,500; your Class-1 Robusta could tender at par with $250/t of delivery costs, while the cash market bids futures −$300. What do you do?',
        options: [
          'Sell in the cash market — always avoid the exchange',
          'Tender: exchange nets $4,250 vs $4,200 cash — $50/t better',
          'Do nothing until the differential recovers',
          'Buy more futures',
        ],
        correctIndex: 1,
        explanation: 'Exchange realisation = 4,500 − 250 = $4,250 vs cash realisation 4,500 − 300 = $4,200. Tendering wins by $50/t — this is tenderable parity working, and exactly the mechanism behind the Vietnam 2024–25 gradings surge.',
      },
      {
        id: 'q8',
        question: 'Your coffee ships in containers. Which Incoterms do ICC formally recommend instead of FOB/CIF?',
        options: ['EXW / DDP', 'FCA / CIP', 'CFR / DAP', 'FAS / DAT'],
        correctIndex: 1,
        explanation: 'FOB/CIF are maritime bulk terms (risk passes on board the vessel). For containers, risk realistically passes when the box is handed to the carrier — hence FCA (instead of FOB) and CIP (instead of CIF). Trade practice still says "FOB", but the exam answer is FCA/CIP.',
      },
    ],
  },
}

export default topic
