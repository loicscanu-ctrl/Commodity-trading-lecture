import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01b-panorama-quiz',
  title: 'Quiz: Commodities, Traders & Market Structure',
  type: 'quiz',
  estimatedMinutes: 10,
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'Which of the following is classified as a "Soft" commodity?',
        options: ['Crude oil (Brent)', 'Arabica coffee', 'Copper', 'Natural gas'],
        correctIndex: 1,
        explanation: 'Arabica coffee is a tropical agricultural commodity — a Soft. The others are Hard commodities (energy and metals).',
      },
      {
        id: 'q2',
        question: 'What does "ABCD" refer to in commodity trading?',
        options: [
          'A regulatory framework for commodity markets',
          'The four main commodity exchanges (CBOT, LME, ICE, CME)',
          'The four dominant agricultural trading houses (ADM, Bunge, Cargill, Dreyfus)',
          'A risk classification system (A = low risk, D = high risk)',
        ],
        correctIndex: 2,
        explanation: 'ABCD refers to Archer Daniels Midland, Bunge, Cargill, and Louis Dreyfus — the four largest agricultural commodity trading houses.',
      },
      {
        id: 'q3',
        question: 'On the live futures screen, a clearly bullish story breaks. What does the price typically do in the first seconds?',
        options: [
          'It jumps instantly to its new level — markets are efficient',
          'It keeps breathing at the old level for a few seconds, then DRIFTS to the new one',
          'Nothing happens until the next day\u2019s open',
          'It falls first, because news is always priced in already',
        ],
        correctIndex: 1,
        explanation: 'Markets absorb news with a LAG: traders must read, decide and execute. On the course\u2019s live screen the tape breathes for ~3 seconds, then drifts to the published level over up to 35 seconds \u2014 the fast readers position during the lag.',
      },
      {
        id: 'q4',
        question: 'A futures exchange provides three core functions the physical trade depends on. Which of the following is NOT one of them?',
        options: [
          'Price discovery',
          'Risk management',
          'Setting production quotas for origin countries',
          'Acting as buyer and seller of last resort',
        ],
        correctIndex: 2,
        explanation: 'The exchange discovers a transparent price, lets the supply chain transfer price risk, and — because contracts are physically deliverable — stands as buyer/seller of last resort. It does not set production quotas; that is producer-side policy (e.g. OPEC in oil).',
      },
      {
        id: 'q5',
        question: 'The screen spikes $300 in seconds on an UNCONFIRMED frost rumour, then fully retraces within a minute. The lesson?',
        options: [
          'Always chase momentum \u2014 the first move is the true one',
          'Unconfirmed flashes tend to REVERT \u2014 real news drifts to a new level and HOLDS it',
          'The exchange made a pricing error and cancelled the trades',
          'Frost is never bullish for coffee',
        ],
        correctIndex: 1,
        explanation: 'A flash move with no confirmed story behind it is position-driven \u2014 stops, panic, thin books \u2014 and it mean-reverts when the dust settles. Confirmed fundamental news behaves differently: the price drifts to a new level and stays. Distinguishing the two is the first skill of the futures screen.',
      },
      {
        id: 'q6',
        question: 'A market where futures prices are HIGHER than the spot price is said to be in:',
        options: ['Backwardation', 'Contango', 'Equilibrium', 'Liquidation'],
        correctIndex: 1,
        explanation: 'Contango = futures above spot, the "normal" state for storable commodities, reflecting the cost of carry. Backwardation is the opposite: spot above futures.',
      },
      {
        id: 'q7',
        question: 'Spot = $80 and the 6-month forward = $85. What does the $5 premium primarily reflect?',
        options: [
          'The market’s forecast that spot will rise to $85',
          'Bullish speculative sentiment',
          'The cost of carry: storage, insurance and financing for six months',
          'An exchange-imposed minimum price move',
        ],
        correctIndex: 2,
        explanation: 'The contango fallacy: forward prices on storable commodities are not forecasts. Arbitrage pins the forward to spot + cost of carry — if it drifted higher, cash-and-carry traders would sell it straight back down.',
      },
      {
        id: 'q8',
        question: 'Which situation most typically produces BACKWARDATION?',
        options: [
          'Oversupply and full warehouses',
          'A supply disruption creating tight nearby availability',
          'Falling interest rates',
          'Cheap, abundant storage capacity',
        ],
        correctIndex: 1,
        explanation: 'Backwardation (spot above futures) signals tight nearby supply or urgent immediate demand — disruptions, drawdowns, seasonal peaks. Oversupply and cheap storage produce contango instead.',
      },
      {
        id: 'q9',
        question: 'Spot = $100, total storage + financing to delivery = $4, and the 6-month future trades at $107. What is the arbitrage?',
        options: [
          'Buy the future and sell spot short — earn $7',
          'Buy spot, store it, sell the future — lock in ~$3 risk-free',
          'No arbitrage: $107 is within fair value',
          'Buy both spot and the future and wait',
        ],
        correctIndex: 1,
        explanation: 'Fair forward = 100 + 4 = $104. At $107 the future is $3 rich: cash-and-carry — buy spot, pay $4 of carry, deliver at $107 — locks in ~$3/unit regardless of where prices go.',
      },
      {
        id: 'q10',
        question: '(Stretch) Under LME-style "lending rules", what happens when one trader controls a dominant share of deliverable warrants?',
        options: [
          'The trader is banned from the exchange',
          'All their positions are cancelled at the previous settlement price',
          'They are obliged to lend their metal at a capped backwardation premium',
          'The exchange buys their position at market price',
        ],
        correctIndex: 2,
        explanation: 'Lending rules force a dominant long to lend to trapped shorts at a capped premium, letting shorts roll forward at a controlled cost — one of the key exchange interventions that defuse a squeeze.',
      },
    ],
  },
}

export default topic
