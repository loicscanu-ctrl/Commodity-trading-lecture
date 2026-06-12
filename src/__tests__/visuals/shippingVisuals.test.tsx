import { render } from '@testing-library/react'
import CharterTypes from '@/visuals/CharterTypes'
import DemurrageWhoPays from '@/visuals/DemurrageWhoPays'
import WorldscaleCalculator from '@/visuals/WorldscaleCalculator'
import LaytimeDemurrage from '@/visuals/LaytimeDemurrage'

test('CharterTypes renders the four charter types', () => {
  const { container } = render(<CharterTypes />)
  expect(container.textContent).toContain('Bareboat')
  expect(container.textContent).toContain('Affreightment')
})

test('DemurrageWhoPays renders the invoicing matrix', () => {
  const { container } = render(<DemurrageWhoPays />)
  expect(container.textContent).toContain('FOB Seller')
  expect(container.textContent).toContain('Charterer')
})

test('WorldscaleCalculator default reproduces $6.084/MT and $486,720', () => {
  const { container } = render(<WorldscaleCalculator />)
  // flat $4.68 × WS130/100 = $6.084/MT ; × 80,000 MT = $486,720
  expect(container.textContent).toContain('6.084')
  expect(container.textContent).toContain('486,720')
})

test('LaytimeDemurrage default is back-to-back with $0 exposure', () => {
  const { container } = render(<LaytimeDemurrage />)
  // 110h used vs 72h laytime → Owners claim 38/24 × $50,000 = $79,167
  expect(container.textContent).toContain('79,167')
  expect(container.textContent).toContain('Back-to-back')
  expect(container.textContent).toContain('Trader demurrage exposure')
  // Back-to-back collection nets the Owners' claim → zero exposure
  expect(container.textContent).toContain('$0')
})
