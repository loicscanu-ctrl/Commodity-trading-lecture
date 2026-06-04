import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03b-hedging-quiz',
  title: 'Quiz: Hedging & Incoterms',
  type: 'quiz',
  estimatedMinutes: 5,
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
