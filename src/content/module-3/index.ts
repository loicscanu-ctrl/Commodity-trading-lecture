import options from './01-options'
import esgEudr from './02-esg-eudr'
import advancedSD from './03-advancedsupply-demand'
import cherryToTerminal from './04-cherry-to-terminal'
import type { Topic } from '@/types/content'

export const topics: Topic[] = [
  options,
  esgEudr,
  advancedSD,
  cherryToTerminal,
]
