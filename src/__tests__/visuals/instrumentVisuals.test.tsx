import { render, fireEvent, screen } from '@testing-library/react'
import ContractExplorer from '@/visuals/ContractExplorer'
import GasolineSwap from '@/visuals/GasolineSwap'
import EfpDiagram from '@/visuals/EfpDiagram'

test('ContractExplorer contrasts the four contracts across tabs', () => {
  const { container } = render(<ContractExplorer />)
  // Arabica default: months + growth differentials + warehouses
  expect(container.textContent).toContain('Coffee "C" — KC')
  expect(container.textContent).toContain('Colombia tenders at a +2¢/lb premium')
  // Cotton: single origin
  fireEvent.click(screen.getByRole('button', { name: 'Cotton' }))
  expect(container.textContent).toContain('US-grown cotton ONLY')
  // Brent: cash settled, no delivery points
  fireEvent.click(screen.getByRole('button', { name: 'Brent' }))
  expect(container.textContent).toContain('CASH-SETTLED')
  expect(container.textContent).toContain('backwardation')
  // Sugar: ~28 origins, FOB the receiver's vessel
  fireEvent.click(screen.getByRole('button', { name: 'Sugar' }))
  expect(container.textContent).toContain('~28 listed origins')
  expect(container.textContent).toContain('FOB the RECEIVER’S vessel')
})

test('GasolineSwap shows principals, broker and the settlement walk', () => {
  const { container } = render(<GasolineSwap />)
  const text = container.textContent ?? ''
  expect(text).toContain('TotalEnergies')
  expect(text).toContain('PVM Oil Associates, London')
  expect(text).toContain('Eurobob')
  expect(text).toContain('$780/MT')
  // Settlement: (802 − 780) × 5,000 = $110,000 paid by the fixed seller
  expect(text).toContain('$110,000')
  expect(text).toContain('ISDA')
})

test('EfpDiagram shows the two legs and the before/after books', () => {
  const { container } = render(<EfpDiagram />)
  const text = container.textContent ?? ''
  expect(text).toContain('PHYSICAL · 100 t robusta')
  expect(text).toContain('PAPER · 10 lots futures')
  expect(text).toContain('Short 10 lots @ 4,500 (the hedge)')
  expect(text).toContain('registered with the exchange')
  expect(text).toContain('EFS — Exchange of Futures for Swaps')
})
