import differential from './01-differential'
import knowExposure from './02-knowyourexposure'
import hedging from './03-hedgingstrategies'
import shipping from './04-shipping'
import fobToCif from './05-FOBtoCIFtrades'
import type { Topic } from '@/types/content'

export const topics: Topic[] = [
  differential,
  knowExposure,
  hedging,
  shipping,
  fobToCif,
]
