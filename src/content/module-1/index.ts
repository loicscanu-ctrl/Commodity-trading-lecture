import panorama from './01-panorama'
import panoramaQuiz from './01b-panorama-quiz'
import keyconcept from './02-keyconcept'
import keyconceptQuiz from './02b-keyconcept-quiz'
import marketStructure from './03-market-structure'
import supplyDemand from './04-supply-demand'
import dayInLife from './05-case-study-adayinlife'
import type { Topic } from '@/types/content'

export const topics: Topic[] = [
  panorama,
  keyconcept,
  keyconceptQuiz,
  marketStructure,
  panoramaQuiz, // 10-question checkpoint: commodities, traders & market structure
  supplyDemand,
  dayInLife,
]
