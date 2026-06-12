import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '05-brent-quiz',
  title: 'Quiz: The Brent Complex & Hedging',
  type: 'quiz',
  estimatedMinutes: 5,
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'You buy a July Forties cargo at a fixed price of $82.45/bbl. After selling ~700 lots of Brent futures against it, what risk mainly remains?',
        options: [
          'Flat-price risk on crude',
          'Basis / differential risk between Dated Forties and the Brent futures contract',
          'Counterparty credit risk on the exchange',
          'No risk remains — the hedge is perfect',
        ],
        correctIndex: 1,
        explanation: 'The futures hedge neutralises flat price, but not the gap between Dated Forties and Brent futures. The residual is basis/differential risk (plus some timing risk) — exactly what DFLs, CFDs and swaps exist to manage.',
      },
      {
        id: 'q2',
        question: 'On any given day, which grade sets the published Dated Brent price?',
        options: [
          'Brent Ninian Blend, always',
          'The average of the six BFOET + WTI grades',
          'The highest-valued grade in the basket',
          'The lowest-valued grade in the basket',
        ],
        correctIndex: 3,
        explanation: '"Brent" is a basket (BNB, Forties, Oseberg, Ekofisk, Troll + WTI CIF Rotterdam). The seller delivers the cheapest grade they can, so the LOWEST value sets Dated Brent.',
      },
      {
        id: 'q3',
        question: 'Which instrument is a swap linking the BFOE forward to Dated Brent?',
        options: ['EFP', 'DFL', 'CFD', 'RBOB'],
        correctIndex: 2,
        explanation: 'CFD (Contract for Difference) links Forward ↔ Dated. DFL links Futures ↔ Dated. EFP links Futures ↔ the BFOE forward.',
      },
      {
        id: 'q4',
        question: 'In the fuel-oil swap example, the floating average settled at $653.25 vs a fixed $630.00 over 5,000 MT. Who pays whom, and how much?',
        options: [
          'Buyer pays seller $116,250',
          'Seller (sold fixed) pays buyer $116,250',
          'Seller pays buyer $23,250',
          'No payment — they net to zero',
        ],
        correctIndex: 1,
        explanation: 'The fixed seller (Company A) receives floating. Floating ($653.25) > fixed ($630.00), so A pays B the difference: 5,000 MT × $23.25 = $116,250.',
      },
      {
        id: 'q5',
        question: 'You buy a CFD at AUG − 0.80. During the pricing week the Dated-to-forward difference narrows. What happens?',
        options: [
          'You pay the seller',
          'The seller pays you',
          'The trade is cancelled',
          'Margin is returned with no P&L',
        ],
        correctIndex: 1,
        explanation: 'Buying the CFD makes you long Dated / short the forward. If the difference narrows (Dated strengthens relative to forward), the seller pays you; if it widens, you pay the seller.',
      },
    ],
  },
}

export default topic
