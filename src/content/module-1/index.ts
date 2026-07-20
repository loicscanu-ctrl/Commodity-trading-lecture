import panorama from './01-panorama'
import panoramaQuiz from './01b-panorama-quiz'
import keyconcept from './02-keyconcept'
import keyconceptQuiz from './02b-keyconcept-quiz'
import marketStructure from './03-market-structure'
import supplyDemand from './04-supply-demand'
import dayInLife from './05-case-study-adayinlife'
import futuresFirst from './06-futures-first'
import careersDesk from './07-careers-desk'
import type { Topic } from '@/types/content'

// Pedagogical order: what a market is → what a futures contract is (incl.
// margin, swaps, EFP) → market structure → THEN trade futures against the
// news (speculation first — hedging and PTBF live in Module 2).
export const topics: Topic[] = [
  panorama,
  supplyDemand, // what moves these markets — read the news before pricing it
  keyconcept,
  keyconceptQuiz,
  marketStructure,
  futuresFirst, // futures-only live screen: buy & sell against the news
  panoramaQuiz, // 10-question checkpoint: commodities, traders & market structure
  dayInLife,
  careersDesk, // the building, not the market: desk organisation as a career map
]
