import { render, fireEvent } from '@testing-library/react'
import BasisPnl from '@/visuals/BasisPnl'

test('default trade nets the basis move: −$30/t = −$3,000 on 100 t', () => {
  const { container } = render(<BasisPnl />)
  const text = container.textContent ?? ''
  // Entry +10, exit −20 → net −30/t → −3,000 total; basis weakened
  expect(text).toContain('−$30/t')
  expect(text).toContain('−$3,000')
  expect(text).toContain('weakened')
})

test('net P&L is invariant to the exit flat price', () => {
  const { container } = render(<BasisPnl />)
  const sliders = container.querySelectorAll('input[type="range"]')
  // Third slider is the exit futures price: move it from 2,250 to 2,900
  fireEvent.change(sliders[2], { target: { value: '2900' } })
  const text = container.textContent ?? ''
  // Legs changed, net did not
  expect(text).toContain('−$30/t')
  expect(text).toContain('−$3,000')
})

test('strengthening basis flips the P&L positive', () => {
  const { container } = render(<BasisPnl />)
  const sliders = container.querySelectorAll('input[type="range"]')
  // Second slider is the exit differential: +40 → net = 40 − 10 = +30/t
  fireEvent.change(sliders[1], { target: { value: '40' } })
  const text = container.textContent ?? ''
  expect(text).toContain('+$30/t')
  expect(text).toContain('strengthened')
})
