import { render, fireEvent, screen } from '@testing-library/react'
import OptionPayoff from '@/visuals/OptionPayoff'

test('defaults to the zero-cost producer collar with floor 230 and cap 275', () => {
  const { container } = render(<OptionPayoff />)
  const text = container.textContent ?? ''
  expect(text).toContain('floor 230¢')
  expect(text).toContain('cap 275¢')
  expect(text).toContain('zero-cost ✓')
})

test('long call shows breakeven = strike + premium', () => {
  const { container } = render(<OptionPayoff />)
  fireEvent.click(screen.getByRole('button', { name: 'Long call' }))
  // Default call strike 275, premium 8 → breakeven 283
  expect(container.textContent).toContain('breakeven 283¢')
})

test('protective put floor moves with the premium', () => {
  const { container } = render(<OptionPayoff />)
  fireEvent.click(screen.getByRole('button', { name: 'Protective put' }))
  // Put strike 230, premium 8 → floor 222
  expect(container.textContent).toContain('floor 222¢')
  // Raise the put premium to 20 → floor 210
  const sliders = container.querySelectorAll('input[type="range"]')
  fireEvent.change(sliders[1], { target: { value: '20' } })
  expect(container.textContent).toContain('floor 210¢')
})
