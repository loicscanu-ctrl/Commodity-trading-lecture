import type { ComponentType } from 'react'
import ThreeLaws from './ThreeLaws'
import DeadEnds from './DeadEnds'
import FlowTraps from './FlowTraps'
import GeometricMultiplier from './GeometricMultiplier'
import TermStructureChart from './TermStructureChart'
import ContangoChart from './ContangoChart'
import CashCarrySimulator from './CashCarrySimulator'

export const visualRegistry: Record<string, ComponentType> = {
  'three-laws': ThreeLaws,
  'dead-ends': DeadEnds,
  'flow-traps': FlowTraps,
  'geometric-multiplier': GeometricMultiplier,
  'term-structure-chart': TermStructureChart,
  'contango-chart': ContangoChart,
  'cash-carry-simulator': CashCarrySimulator,
}
