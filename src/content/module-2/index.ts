import ptbfTrading from './00-ptbf-trading'
import differential from './01-differential'
import knowExposure from './02-knowyourexposure'
import hedgingTool from './02b-hedging-tool'
import hedging from './03-hedgingstrategies'
import hedgingQuiz from './03b-hedging-quiz'
import shipping from './04-shipping'
import fobToCif from './05-FOBtoCIFtrades'
import liveTrading from './06-live-trading-exercise'
import type { Topic } from '@/types/content'

export const topics: Topic[] = [
  ptbfTrading,   // PTBF & the two trades — the module's opening case study (Easy level in class)
  differential,
  knowExposure,
  hedgingTool,
  hedging,
  hedgingQuiz,
  shipping,
  fobToCif,       // guided solo simulation (theory → practice)
  liveTrading,    // timed live-market exercise (the capstone of the module)
]
