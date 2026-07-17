import { render, fireEvent, screen } from '@testing-library/react'
import ContractExplorer from '@/visuals/ContractExplorer'
import GasolineSwap from '@/visuals/GasolineSwap'
import EfpDiagram from '@/visuals/EfpDiagram'
import MarginSimulator from '@/visuals/MarginSimulator'
import SwapTimeline from '@/visuals/SwapTimeline'

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

test('MarginSimulator: fixing four settles reproduces the canonical -$20,000 week', () => {
  const { container } = render(<MarginSimulator />)
  const week = [4520, 4610, 4580, 4700]
  week.forEach((settle, i) => {
    fireEvent.change(screen.getByRole('spinbutton', { name: `Day ${i + 1} settlement` }), { target: { value: String(settle) } })
    fireEvent.click(screen.getByRole('button', { name: `Fix Day ${i + 1} settle` }))
  })
  const text = container.textContent ?? ''
  // Daily VM: -2,000 / -9,000 / +3,000 / -12,000 → cumulative -20,000
  expect(text).toContain('−$2,000')
  expect(text).toContain('−$9,000')
  expect(text).toContain('+$3,000')
  expect(text).toContain('−$12,000')
  expect(text).toContain('−$20,000')
  expect(text).toContain('week complete')
})

test('SwapTimeline: defaults show the Q1 flows and the pinned effective price', () => {
  const { container } = render(<SwapTimeline />)
  const text = container.textContent ?? ''
  expect(text).toContain('+$75,000')
  expect(text).toContain('−$60,000')
  expect(text).toContain('no cash changes hands')
  expect(text).toContain('= $4,300/t')
  // Move Feb's average to the fix → Feb flow goes to zero, net = +$75,000
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Feb index average ($/t)' }), { target: { value: '4300' } })
  const after = container.textContent ?? ''
  expect(after).not.toContain('−$60,000')
  expect(after).toContain('+$75,000')
})
