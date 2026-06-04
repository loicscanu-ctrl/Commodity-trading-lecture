import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02b-keyconcept-quiz',
  title: 'Quiz: Futures, Swaps & EFP',
  type: 'quiz',
  estimatedMinutes: 5,
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'How many metric tonnes does one ICE-EU Robusta Coffee futures lot represent?',
        options: ['5 MT', '10 MT', '20 MT', '37.5 MT'],
        correctIndex: 1,
        explanation: 'One ICE-EU Robusta lot = 10 metric tonnes, quoted in $/MT. ICE-US Arabica is quoted in ¢/lb with 37,500 lb per lot.',
      },
      {
        id: 'q2',
        question: 'What is the main advantage of a swap over a futures contract for a commodity producer?',
        options: [
          'No margin calls',
          'Exchange-guaranteed clearing eliminates credit risk',
          'Flexibility in size, tenor, and settlement terms',
          'Lower transaction costs',
        ],
        correctIndex: 2,
        explanation: 'Swaps are OTC and can be customized in size, duration, and settlement — but unlike futures, they carry counterparty credit risk since there is no clearinghouse.',
      },
    ],
  },
}

export default topic
