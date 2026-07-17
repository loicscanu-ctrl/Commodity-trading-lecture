import { render, fireEvent, screen } from '@testing-library/react'
import NetworkExplosion from '@/visuals/NetworkExplosion'
import OrderBook from '@/visuals/OrderBook'
import ParcelJourney from '@/visuals/ParcelJourney'
import MarginSimulator from '@/visuals/MarginSimulator'
import RollYield from '@/visuals/RollYield'
import StuScatter from '@/visuals/StuScatter'
import CropCalendar from '@/visuals/CropCalendar'
import WarrantLifecycle from '@/visuals/WarrantLifecycle'

test('NetworkExplosion: quadratic bilateral links collapse to linear with the exchange', () => {
  const { container } = render(<NetworkExplosion />)
  // 14 participants → 7×7 = 49 bilateral links
  expect(container.textContent).toContain('49')
  fireEvent.click(screen.getByRole('button', { name: /One exchange/ }))
  expect(container.textContent).toContain('14')
  // The olive-oil case is on the same slide
  expect(container.textContent).toContain('olive oil')
})

test('OrderBook: a large market order walks the book; an unmarketable limit rests', () => {
  const { container } = render(<OrderBook />)
  // Market buy 15 lots: 10 @ 4,805 + 5 @ 4,810 → avg $4,807, walked to $4,810
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Order lots' }), { target: { value: '15' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit order' }))
  expect(container.textContent).toContain('Filled 15 lots at avg $4,807')
  expect(container.textContent).toContain('WALKED the book to $4,810')
  // Limit buy below the market rests
  fireEvent.click(screen.getByRole('button', { name: 'limit' }))
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Limit price' }), { target: { value: '4790' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit order' }))
  expect(container.textContent).toContain('REST in the book at $4,790')
})

test('ParcelJourney: risk tiles flip as the parcel moves down the chain', () => {
  const { container } = render(<ParcelJourney />)
  // Farmer: both risks, no hedge access
  expect(container.textContent).toContain('FLAT AT RISK')
  expect(container.textContent).toContain('DIFF AT RISK')
  // Two hops → Exporter: flat covered, diff at risk, origination margin
  fireEvent.click(screen.getByRole('button', { name: /Pass the parcel/ }))
  fireEvent.click(screen.getByRole('button', { name: /Pass the parcel/ }))
  expect(container.textContent).toContain('Exporter · Ho Chi Minh City')
  expect(container.textContent).toContain('FLAT covered')
  expect(container.textContent).toContain('origination margin')
})

test('MarginSimulator: exhausting the funding line forces the position closed', () => {
  const { container } = render(<MarginSimulator />)
  // One brutal settle: 4,500 → 5,200 = −$70,000 VM against a $60,000 line
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Day 1 settlement' }), { target: { value: '5200' } })
  fireEvent.click(screen.getByRole('button', { name: 'Fix Day 1 settle' }))
  const text = container.textContent ?? ''
  expect(text).toContain('−$70,000')
  expect(text).toContain('FORCED OUT')
  expect(text).toContain('the funding did')
})

test('RollYield: default contango shows a negative annual roll yield', () => {
  const { container } = render(<RollYield />)
  const text = container.textContent ?? ''
  expect(text).toContain('-6.9')
  expect(text).toContain('Spot never moved')
})

test('StuScatter: the real 12.4% STU lands in the convexity zone', () => {
  const { container } = render(<StuScatter />)
  const text = container.textContent ?? ''
  expect(text).toContain('12.4')
  expect(text).toContain('274')
  expect(text).toContain('multiplicative')
})

test('CropCalendar and WarrantLifecycle render their content', () => {
  const cal = render(<CropCalendar />)
  expect(cal.container.textContent).toContain('Vietnam')
  expect(cal.container.textContent).toContain('harvest')
  const wl = render(<WarrantLifecycle />)
  expect(wl.container.textContent).toContain('Warrant')
  expect(wl.container.textContent).toContain('fungible')
})
