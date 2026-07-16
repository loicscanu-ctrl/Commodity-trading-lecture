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
import BrentTriangle, { textDef as brentTriangleText } from './BrentTriangle'
import BrentBasket, { textDef as brentBasketText } from './BrentBasket'
import PriceBuildup, { textDef as priceBuildupText } from './PriceBuildup'
import ExposureLadder, { textDef as exposureLadderText } from './ExposureLadder'
import FortiesSystem, { textDef as fortiesSystemText } from './FortiesSystem'
import SwapSimulator from './SwapSimulator'
import CfdCurve, { textDef as cfdCurveText } from './CfdCurve'
import CharterTypes, { textDef as charterTypesText } from './CharterTypes'
import DemurrageWhoPays, { textDef as demurrageWhoPaysText } from './DemurrageWhoPays'
import WorldscaleCalculator from './WorldscaleCalculator'
import LaytimeDemurrage from './LaytimeDemurrage'
import DistillationColumn, { textDef as distillationColumnText } from './DistillationColumn'
import CrudeQualityScatter from './CrudeQualityScatter'
import GpwCalculator from './GpwCalculator'
import RefineryTypes, { textDef as refineryTypesText } from './RefineryTypes'
import SupplyDemandRegion, { textDef as supplyDemandRegionText } from './SupplyDemandRegion'
import TechnicalSchematics, { textDef as technicalSchematicsText } from './TechnicalSchematics'
import PriceVolumeOI, { textDef as priceVolumeOIText } from './PriceVolumeOI'
import CoffeeOdyssey, { textDef as coffeeOdysseyText } from './CoffeeOdyssey'
import ArabicaRobusta, { textDef as arabicaRobustaText } from './ArabicaRobusta'
import ExchangeFunctions, { textDef as exchangeFunctionsText } from './ExchangeFunctions'
import RobustaContract, { textDef as robustaContractText } from './RobustaContract'
import VietnamCaseStudy, { textDef as vietnamCaseStudyText } from './VietnamCaseStudy'
import PtbfMechanics from './PtbfMechanics'
import OptionPayoff from './OptionPayoff'

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
  'brent-triangle': BrentTriangle,
  'brent-basket': BrentBasket,
  'price-buildup': PriceBuildup,
  'exposure-ladder': ExposureLadder,
  'forties-system': FortiesSystem,
  'swap-simulator': SwapSimulator,
  'cfd-curve': CfdCurve,
  'charter-types': CharterTypes,
  'demurrage-whopays': DemurrageWhoPays,
  'worldscale-calculator': WorldscaleCalculator,
  'laytime-demurrage': LaytimeDemurrage,
  'distillation-column': DistillationColumn,
  'crude-quality-scatter': CrudeQualityScatter,
  'gpw-calculator': GpwCalculator,
  'refinery-types': RefineryTypes,
  'supply-demand-region': SupplyDemandRegion,
  'technical-schematics': TechnicalSchematics,
  'price-volume-oi': PriceVolumeOI,
  'coffee-odyssey': CoffeeOdyssey,
  'arabica-robusta': ArabicaRobusta,
  'exchange-functions': ExchangeFunctions,
  'robusta-contract': RobustaContract,
  'vietnam-case-study': VietnamCaseStudy,
  'ptbf-mechanics': PtbfMechanics,
  'option-payoff': OptionPayoff,
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
  'brent-triangle': brentTriangleText,
  'brent-basket': brentBasketText,
  'price-buildup': priceBuildupText,
  'exposure-ladder': exposureLadderText,
  'forties-system': fortiesSystemText,
  'cfd-curve': cfdCurveText,
  'charter-types': charterTypesText,
  'demurrage-whopays': demurrageWhoPaysText,
  'distillation-column': distillationColumnText,
  'refinery-types': refineryTypesText,
  'supply-demand-region': supplyDemandRegionText,
  'technical-schematics': technicalSchematicsText,
  'price-volume-oi': priceVolumeOIText,
  'coffee-odyssey': coffeeOdysseyText,
  'arabica-robusta': arabicaRobustaText,
  'exchange-functions': exchangeFunctionsText,
  'robusta-contract': robustaContractText,
  'vietnam-case-study': vietnamCaseStudyText,
}
