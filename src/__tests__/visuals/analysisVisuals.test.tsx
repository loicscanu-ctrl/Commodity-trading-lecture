import { render } from '@testing-library/react'
import DistillationColumn from '@/visuals/DistillationColumn'
import CrudeQualityScatter from '@/visuals/CrudeQualityScatter'
import GpwCalculator from '@/visuals/GpwCalculator'
import RefineryTypes from '@/visuals/RefineryTypes'
import SupplyDemandRegion from '@/visuals/SupplyDemandRegion'
import TechnicalSchematics from '@/visuals/TechnicalSchematics'
import PriceVolumeOI from '@/visuals/PriceVolumeOI'

const cases: [string, () => JSX.Element, string][] = [
  ['DistillationColumn', () => <DistillationColumn />, 'Naphtha'],
  ['CrudeQualityScatter', () => <CrudeQualityScatter />, 'Brent'],
  ['CrudeQualityScatter·class', () => <CrudeQualityScatter />, 'Sweet'],
  ['RefineryTypes', () => <RefineryTypes />, 'Coker'],
  ['SupplyDemandRegion', () => <SupplyDemandRegion />, 'Asia Pacific'],
  ['TechnicalSchematics', () => <TechnicalSchematics />, 'Support'],
  ['PriceVolumeOI', () => <PriceVolumeOI />, 'Open Interest'],
]

test.each(cases)('%s renders and shows key content', (_name, Comp, marker) => {
  const { container } = render(<Comp />)
  expect(container.textContent).toContain(marker)
})

test('GpwCalculator default reproduces the North Sea margin example', () => {
  const { container } = render(<GpwCalculator />)
  // Σ(yield×price) = $465.78/MT ; ÷7.55 = $61.69/bbl ; − $59.16 = $2.53/bbl
  expect(container.textContent).toContain('465.78')
  expect(container.textContent).toContain('61.69')
  expect(container.textContent).toContain('2.53')
})

test('CrudeQualityScatter defaults to Brent and classifies it light/sweet', () => {
  const { container } = render(<CrudeQualityScatter />)
  expect(container.textContent).toContain('Light · Sweet')
})
