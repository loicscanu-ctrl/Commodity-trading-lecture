import type { ComponentType } from 'react'
import type { VisualTextDef } from '@/lib/visualText'
import ThreeLaws, { textDef as threeLawsText } from './ThreeLaws'
import DeadEnds, { textDef as deadEndsText } from './DeadEnds'
import RiddleScene, { textDef as riddleSceneText } from './RiddleScene'
import VehicleScene from './VehicleScene'
import FlowTraps from './FlowTraps'
import GeometricMultiplier from './GeometricMultiplier'
import TermStructureChart from './TermStructureChart'
import ContangoChart from './ContangoChart'
import CashCarrySimulator from './CashCarrySimulator'
import MarketInfluences, { textDef as marketInfluencesText } from './MarketInfluences'
import ArbitrageExercise from './ArbitrageExercise'
import UnitConversions from './UnitConversions'
import PriceFactorsGrid, { textDef as priceFactorsGridText } from './PriceFactorsGrid'
import TankerTypes, { textDef as tankerTypesText } from './TankerTypes'
import WorldscaleExample, { textDef as worldscaleExampleText } from './WorldscaleExample'
import SqueezeSimulator from './SqueezeSimulator'
import MandateReveal, { textDef as mandateRevealText } from './MandateReveal'
import CommodityDonutChart from './CommodityDonutChart'
import TraderTypes from './TraderTypes'

export const visualRegistry: Record<string, ComponentType> = {
  'three-laws': ThreeLaws,
  'dead-ends': DeadEnds,
  'riddle-scene': RiddleScene,
  'vehicle-scene': VehicleScene,
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
  'mandate-reveal': MandateReveal,
  'commodity-donut-chart': CommodityDonutChart,
  'trader-types': TraderTypes,
}

// Visuals whose text is editable expose a VisualTextDef schema here.
export const visualTextRegistry: Record<string, VisualTextDef> = {
  'three-laws': threeLawsText,
  'dead-ends': deadEndsText,
  'riddle-scene': riddleSceneText,
  'mandate-reveal': mandateRevealText,
  'market-influences': marketInfluencesText,
  'price-factors-grid': priceFactorsGridText,
  'tanker-types': tankerTypesText,
  'worldscale-example': worldscaleExampleText,
}
