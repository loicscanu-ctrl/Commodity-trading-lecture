import { render, screen, fireEvent } from '@testing-library/react'
import HedgingCalculator from '@/components/tools/HedgingCalculator'

test('renders all four input fields', () => {
  render(<HedgingCalculator />)
  expect(screen.getByLabelText(/Position/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Lot size/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Price/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Hedge ratio/i)).toBeInTheDocument()
})

test('default values produce correct covered amount', () => {
  render(<HedgingCalculator />)
  // 100 lots × 10 MT × $2,450/MT × 80% = $1,960,000
  expect(screen.getByText(/1,960,000/)).toBeInTheDocument()
})

test('changing lots updates output reactively', () => {
  render(<HedgingCalculator />)
  fireEvent.change(screen.getByLabelText(/Position/i), { target: { value: '50' } })
  // 50 × 10 × 2450 × 80% = $980,000
  expect(screen.getByText(/980,000/)).toBeInTheDocument()
})

test('changing hedge ratio to 100% shows full exposure as covered', () => {
  render(<HedgingCalculator />)
  fireEvent.change(screen.getByLabelText(/Hedge ratio/i), { target: { value: '100' } })
  // Both "Total exposure (USD)" and "Covered" show $2,450,000 when hedged 100%
  const matches = screen.getAllByText(/2,450,000/)
  expect(matches.length).toBeGreaterThanOrEqual(2)
})
