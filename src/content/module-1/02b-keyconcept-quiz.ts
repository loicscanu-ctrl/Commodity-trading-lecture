import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02b-keyconcept-quiz',
  title: 'Quiz: Futures, Swaps & EFP',
  type: 'quiz',
  estimatedMinutes: 8,
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
      {
        id: 'q3',
        question: 'You are SHORT 10 lots of Robusta (100 t) at $4,500/t. The market settles at $4,590/t. Your variation margin cash flow today is:',
        options: ['+$9,000', '−$9,000', '−$900', '+$4,590'],
        correctIndex: 1,
        explanation: 'Short position, price up $90/t × 100 t = $9,000 against you — paid out in cash that day. Daily variation margin is the cash reality of a hedge.',
      },
      {
        id: 'q4',
        question: 'A producer swaps 500 t at a fixed $4,300/t against the monthly index average. The index averages $4,150. Who pays whom?',
        options: [
          'The producer pays $75,000 to the counterparty',
          'The counterparty pays the producer $75,000',
          'No payment — the swap only settles at maturity',
          'The producer delivers 500 t of coffee',
        ],
        correctIndex: 1,
        explanation: 'The producer receives fixed − floating = 4,300 − 4,150 = +$150/t × 500 t = $75,000. Combined with selling their physical at the (low) market price, their effective price stays ~$4,300. Swaps are financially settled — no coffee moves.',
      },
      {
        id: 'q5',
        question: 'Why do the two parties to a PTBF fixing use an EFP instead of each trading futures on screen?',
        options: [
          'EFPs avoid exchange fees entirely',
          'On-screen trading is prohibited for commercial hedgers',
          'The EFP transfers the futures at one agreed price — no legging risk between two separate executions',
          'EFPs settle in physical coffee instead of cash',
        ],
        correctIndex: 2,
        explanation: 'An EFP is a privately negotiated, exchange-registered transfer of a futures position at an agreed price. Both legs (physical fixing and futures transfer) crystallise simultaneously — neither party risks the market moving between two separate screen executions.',
      },
      {
        id: 'q6',
        question: 'How is the vast majority of commodity futures volume actually closed out?',
        options: [
          'By physical delivery at expiry — futures are delivery contracts, so most positions end in coffee changing hands',
          'By an offsetting trade before expiry — delivery is the rare exception, not the routine',
          'By automatic cash settlement — physical delivery is impossible on commodity futures',
          'By converting the position into an OTC swap at expiry',
        ],
        correctIndex: 1,
        explanation: 'Option A is the tempting one: futures ARE deliverable contracts, and deliveries genuinely happen — Vietnamese exporters tendered hundreds of lots in 2024–25 when the FOB differential fell through tenderable parity. But even in that extreme episode, tenders were a tiny fraction of open interest: speculators never want the coffee, and hedgers normally prefer selling their physical through commercial channels at a better differential than the exchange ladder pays. So almost every position is offset before expiry — while delivery’s mere POSSIBILITY (the buyer/seller of last resort) is what anchors the futures price to the physical market. Option C fails the other way: some contracts are cash-settled (Brent, coal, power), but coffee, cotton, sugar and WTI deliver physically if held to expiry.',
      },
      {
        id: 'q7',
        question: 'The clearinghouse "guarantee" means:',
        options: [
          'Counterparty credit risk is completely eliminated',
          'The exchange insures your trading losses',
          'Counterparty risk is mutualised and collateralised through margin and a default fund',
          'Only banks can trade futures',
        ],
        correctIndex: 2,
        explanation: 'The clearinghouse stands between buyer and seller and manages risk with initial + variation margin and a mutualised default fund. Risk is mitigated, not abolished — the 2018 Nasdaq Clearing power-market default consumed a chunk of the default fund.',
      },
      {
        id: 'q8',
        question: 'A trader needs to hedge a 700,000-barrel crude cargo with ICE Brent futures (1,000 bbl/lot). How many lots?',
        options: ['70', '700', '7,000', '1,400'],
        correctIndex: 1,
        explanation: '700,000 ÷ 1,000 = 700 lots. Sizing the hedge to the physical exposure is always the first calculation on the desk.',
      },
    ],
  },
}

export default topic
