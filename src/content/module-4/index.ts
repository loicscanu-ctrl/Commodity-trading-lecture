import exposureHedging from './01-exposure-hedging'
import futuresHedge from './02-futures-hedge'
import brentComplex from './03-brent-complex'
import swapsCfds from './04-swaps-cfds'
import brentQuiz from './05-brent-quiz'
import type { Topic } from '@/types/content'

export const topics: Topic[] = [
  exposureHedging,
  futuresHedge,
  brentComplex,
  swapsCfds,
  brentQuiz,
]
