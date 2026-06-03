import type { ComponentType } from 'react'
import HedgingCalculator from '@/components/tools/HedgingCalculator'
import BasisCalculator from '@/components/tools/BasisCalculator'

export const toolRegistry: Record<string, ComponentType> = {
  'hedging-calculator': HedgingCalculator,
  'basis-calculator': BasisCalculator,
}
