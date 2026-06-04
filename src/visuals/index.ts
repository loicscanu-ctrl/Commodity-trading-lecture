import type { ComponentType } from 'react'
import ThreeLaws from './ThreeLaws'
import DeadEnds from './DeadEnds'
import FlowTraps from './FlowTraps'
import GeometricMultiplier from './GeometricMultiplier'
import TermStructureChart from './TermStructureChart'

export const visualRegistry: Record<string, ComponentType> = {
  'three-laws': ThreeLaws,
  'dead-ends': DeadEnds,
  'flow-traps': FlowTraps,
  'geometric-multiplier': GeometricMultiplier,
  'term-structure-chart': TermStructureChart,
}
