import panorama from './01-panorama'
import panoramaQuiz from './01b-panorama-quiz'
import keyconcept from './02-keyconcept'
import keyconceptQuiz from './02b-keyconcept-quiz'
import marketStructure from './03-market-structure'
import supplyDemand from './04-supply-demand'
import dayInLife from './05-case-study-adayinlife'
import ptbfTrading from './06-ptbf-trading'
import type { Topic } from '@/types/content'

// Pedagogical order: what a market is → what a futures contract is (incl.
// margin, swaps, EFP) → market structure → THEN PTBF & differential trading.
export const topics: Topic[] = [
  panorama,
  keyconcept,
  keyconceptQuiz,
  marketStructure,
  ptbfTrading,
  panoramaQuiz, // 10-question checkpoint: commodities, traders, structure & PTBF
  supplyDemand,
  dayInLife,
]
