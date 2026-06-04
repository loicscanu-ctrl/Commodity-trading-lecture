import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01b-panorama-quiz',
  title: 'Quiz: Commodities & Trader Types',
  type: 'quiz',
  estimatedMinutes: 5,
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
        question: 'What is the "differential" in a physical commodity trade?',
        options: [
          'The fee paid to the exchange for futures clearing',
          'The spread between bid and ask prices on the exchange',
          'The premium or discount added to the futures price to arrive at the physical price',
          'The difference between Arabica and Robusta coffee prices',
        ],
        correctIndex: 2,
        explanation: 'Physical price = Futures price + Differential. The differential captures origin, quality, logistics, and timing factors not reflected in the generic futures contract.',
      },
    ],
  },
}

export default topic
