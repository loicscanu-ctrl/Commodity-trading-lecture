import { render } from '@testing-library/react'
import BrentTriangle from '@/visuals/BrentTriangle'
import BrentBasket from '@/visuals/BrentBasket'
import PriceBuildup from '@/visuals/PriceBuildup'
import ExposureLadder from '@/visuals/ExposureLadder'
import FortiesSystem from '@/visuals/FortiesSystem'
import SwapSimulator from '@/visuals/SwapSimulator'
import CfdCurve from '@/visuals/CfdCurve'

// These visuals live on later slides of Module 4, so they aren't in the
// initial server-rendered HTML. Mount each directly to prove it renders
// without throwing and shows its key content.
const cases: [string, () => JSX.Element, string][] = [
  ['BrentTriangle', () => <BrentTriangle />, 'Trading as price relationships'],
  ['BrentBasket', () => <BrentBasket />, 'SETS DATED'],
  ['BrentBasket·min', () => <BrentBasket />, 'Dated Brent ='],
  ['PriceBuildup', () => <PriceBuildup />, 'differential'],
  ['ExposureLadder', () => <ExposureLadder />, 'NEUTRAL'],
  ['FortiesSystem', () => <FortiesSystem />, 'Forties Unity Riser'],
  ['SwapSimulator', () => <SwapSimulator />, '116,250'],
  ['CfdCurve', () => <CfdCurve />, 'CFD Curve'],
]

test.each(cases)('%s renders and shows key content', (_name, Comp, marker) => {
  const { container } = render(<Comp />)
  expect(container.textContent).toContain(marker)
})

test('SwapSimulator default reproduces the canonical settlement', () => {
  const { container } = render(<SwapSimulator />)
  // 5,000 MT × $23.25 = $116,250, with Company A paying B
  expect(container.textContent).toContain('Company A pays Company B')
  expect(container.textContent).toContain('116,250')
})
