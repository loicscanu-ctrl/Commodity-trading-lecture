import type { ComponentType } from 'react'
import ThreeLaws from './ThreeLaws'
import DeadEnds from './DeadEnds'
import FlowTraps from './FlowTraps'
import GeometricMultiplier from './GeometricMultiplier'
import TermStructureChart from './TermStructureChart'
import ContangoChart from './ContangoChart'
import CashCarrySimulator from './CashCarrySimulator'
import MarketInfluences from './MarketInfluences'
import ArbitrageExercise from './ArbitrageExercise'
import UnitConversions from './UnitConversions'
import PriceFactorsGrid from './PriceFactorsGrid'
import TankerTypes from './TankerTypes'
import WorldscaleExample from './WorldscaleExample'
import SqueezeSimulator from './SqueezeSimulator'

export const visualRegistry: Record<string, ComponentType> = {
  'three-laws': ThreeLaws,
  'dead-ends': DeadEnds,
  'flow-traps': FlowTraps,
  'geometric-multiplier': GeometricMultiplier,
  'term-structure-chart': TermStructureChart,
  'contango-chart': ContangoChart,
  'cash-carry-simulator': CashCarrySimulator,
  'market-influences': MarketInfluences,
  'arbitrage-exercise': ArbitrageExercise,
  'unit-conversions': UnitConversions,
  'price-factors-grid': PriceFactorsGrid,
  'tanker-types': TankerTypes,
  'worldscale-example': WorldscaleExample,
  'squeeze-simulator': SqueezeSimulator,
}
