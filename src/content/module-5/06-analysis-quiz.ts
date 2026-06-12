import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '06-analysis-quiz',
  title: 'Quiz: Analysing the Oil Market',
  type: 'quiz',
  estimatedMinutes: 5,
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'The "call on OPEC crude" is best described as:',
        options: [
          'Total world demand',
          'OPEC’s total production capacity',
          'Total demand minus non-OPEC supply minus OPEC NGLs — the residual OPEC must supply',
          'OPEC spare capacity',
        ],
        correctIndex: 2,
        explanation: 'The call on OPEC = total demand − non-OPEC supply − OPEC NGLs. It is the volume OPEC crude must fill to balance the market.',
      },
      {
        id: 'q2',
        question: 'In a distillation column, where do the lightest fractions (LPG, naphtha) leave?',
        options: [
          'At the hot bottom (~370°C)',
          'Near the cooler top (~150°C)',
          'They do not leave the column',
          'From a side stream halfway up only',
        ],
        correctIndex: 1,
        explanation: 'Lighter fractions boil off higher up the column where it is cooler (~150°C); the heavy atmospheric residue stays at the hot bottom (~370°C).',
      },
      {
        id: 'q3',
        question: 'A light, sweet crude relative to a heavy, sour crude generally:',
        options: [
          'Yields more fuel oil and trades at a discount',
          'Yields more high-value light products and trades at a premium',
          'Requires a coker to process',
          'Has higher sulphur content',
        ],
        correctIndex: 1,
        explanation: 'High API (light) + low sulphur (sweet) crude yields more light, high-value products on simple distillation, so it commands a premium. Heavy, sour grades make more fuel oil, need conversion kit, and trade at a discount.',
      },
      {
        id: 'q4',
        question: 'North Sea GPW is $465.78/MT. At 7.55 bbl/MT and a crude price of $59.16/bbl, the refining margin is about:',
        options: ['$2.53/bbl', '$6.50/bbl', '$465.78/bbl', '−$59.16/bbl'],
        correctIndex: 0,
        explanation: '$465.78 ÷ 7.55 = $61.69/bbl GPW; margin = $61.69 − $59.16 = $2.53/bbl.',
      },
      {
        id: 'q5',
        question: 'Price rising, volume increasing and open interest up signals a market that is:',
        options: ['Weak / bearish', 'Strong / bullish', 'Short covering', 'Long liquidation'],
        correctIndex: 1,
        explanation: 'Rising price confirmed by rising volume AND rising open interest (new money entering) is the classic strong/bullish reading.',
      },
    ],
  },
}

export default topic
