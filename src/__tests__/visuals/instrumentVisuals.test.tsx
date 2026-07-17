import { render } from '@testing-library/react'
import ContractExplorer from '@/visuals/ContractExplorer'
import GasolineSwap from '@/visuals/GasolineSwap'
import EfpDiagram from '@/visuals/EfpDiagram'

test('ContractExplorer aligns all six contracts in one matrix', () => {
  const { container } = render(<ContractExplorer />)
  const text = container.textContent ?? ''
  // One column per commodity, all visible at once
  expect(text).toContain('Arabica Coffee "C"')
  expect(text).toContain('US-grown cotton ONLY')
  expect(text).toContain('~28 listed origins')
  expect(text).toContain('blé MATIF')
  expect(text).toContain('Rouen and Dunkirk')
  expect(text).toContain('CASH-SETTLED')
  // WTI beside Brent: physical delivery at one hub, and the 2020 lesson
  expect(text).toContain('Cushing, Oklahoma')
  expect(text).toContain('negative print')
  // Spec rows present
  expect(text).toContain('Origin spec')
  expect(text).toContain('Incoterm / settlement')
  // Next-5-months row: front months for coffee and wheat
  expect(text).toContain('Dec Z · 250.00')
  expect(text).toContain('Dec Z · 228.50')
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
