import { render, fireEvent, screen } from '@testing-library/react'
import CommodityDonutChart from '@/visuals/CommodityDonutChart'
import GasolineSwap from '@/visuals/GasolineSwap'
import EfpDiagram from '@/visuals/EfpDiagram'
import MarginSimulator from '@/visuals/MarginSimulator'
import SwapTimeline from '@/visuals/SwapTimeline'

test('CommodityDonutChart: ticker chips open the real contract spec cards', () => {
  const { container } = render(<CommodityDonutChart />)
  // Chips live under Petroleum Products and Crop Products
  expect(container.textContent).toContain('WTI Crude')
  expect(container.textContent).toContain('Low Sulphur Gasoil')
  expect(container.textContent).toContain('RBOB Gasoline')
  expect(container.textContent).toContain('Robusta Coffee')
  // No spec card until a chip is clicked
  expect(container.textContent).not.toContain('Cushing, Oklahoma')

  // WTI: physical delivery at one hub, and the 2020 lesson
  fireEvent.click(screen.getByRole('button', { name: /WTI Crude/ }))
  expect(container.textContent).toContain('Cushing, Oklahoma')
  expect(container.textContent).toContain('negative print')
  expect(container.textContent).toContain('Origin spec')
  expect(container.textContent).toContain('Incoterm / settlement')

  // Wheat replaces it: the blé MATIF card
  fireEvent.click(screen.getByRole('button', { name: /Milling Wheat/ }))
  expect(container.textContent).toContain('Rouen and Dunkirk')
  expect(container.textContent).toContain('Dec Z · 228.50')
  expect(container.textContent).not.toContain('Cushing, Oklahoma')

  // RBOB: the summer-spec seasonality
  fireEvent.click(screen.getByRole('button', { name: /RBOB Gasoline/ }))
  expect(container.textContent).toContain('Reformulated Blendstock')

  // Robusta: the course's own contract, in backwardation
  fireEvent.click(screen.getByRole('button', { name: /Robusta Coffee/ }))
  expect(container.textContent).toContain('Jan F · 4,800')
  expect(container.textContent).toContain('backwardation')
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
