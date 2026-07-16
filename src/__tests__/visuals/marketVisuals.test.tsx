import { render, fireEvent, screen } from '@testing-library/react'
import ExchangeFunctions from '@/visuals/ExchangeFunctions'
import RobustaContract from '@/visuals/RobustaContract'
import VietnamCaseStudy from '@/visuals/VietnamCaseStudy'
import PtbfMechanics from '@/visuals/PtbfMechanics'
import { modules } from '@/content'

test('ExchangeFunctions shows the three functions around liquidity', () => {
  const { container } = render(<ExchangeFunctions />)
  // Satellite labels word-wrap across <tspan>s, so compare space-insensitively.
  const text = (container.textContent ?? '').replace(/\s+/g, '')
  expect(text).toContain('Liquidity')
  expect(text).toContain('Pricediscovery')
  expect(text).toContain('Riskmanagement')
  expect(text).toContain('lastresort')
  expect(text).toContain('Roasters')
})

test('RobustaContract shows the spec and the quality ladder', () => {
  const { container } = render(<RobustaContract />)
  const text = container.textContent ?? ''
  expect(text).toContain('10 tonnes per lot')
  expect(text).toContain('Jan · Mar · May · Jul · Sep · Nov')
  expect(text).toContain('+$30/t')
  expect(text).toContain('−$90/t')
  expect(text).toContain('par')
})

test('VietnamCaseStudy renders three panels with the key annotations', () => {
  const { container } = render(<VietnamCaseStudy />)
  const text = container.textContent ?? ''
  expect(text).toContain('RC futures')
  expect(text).toContain('differential')
  expect(text).toContain('trough −$298 (Feb 25)')
  expect(text).toContain('630')
  expect(text).toContain('3-month lag')
})

test('VietnamCaseStudy toggle overlays Gd2 as a cash price on the futures panel', () => {
  const { container } = render(<VietnamCaseStudy />)
  // Off by default
  expect(container.textContent).not.toContain('Gd2 5% implied cash')
  fireEvent.click(screen.getByRole('button', { name: /Show Gd2 as cash price/ }))
  const text = container.textContent ?? ''
  expect(text).toContain('Gd2 5% implied cash, FOB HCMC ($/t)')
  expect(text).toContain('gap = the differential')
  // Hover title shows the converted price: Feb 25 → 5,050 − 298 = $4,752/t
  expect(text).toContain('Feb 25 · Gd2 cash $4,752/t (futures −$298)')
  // Toggling off removes the overlay
  fireEvent.click(screen.getByRole('button', { name: /Show Gd2 as cash price/ }))
  expect(container.textContent).not.toContain('Gd2 5% implied cash')
})

test('PtbfMechanics exporter trade: VND buy → hedge sets buying diff → FOB sale → fix', () => {
  const { container } = render(<PtbfMechanics />)
  // Order enforced
  expect(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ })).toBeEnabled()
  expect(screen.getByRole('button', { name: /2\. Sell futures/ })).toBeDisabled()
  // Step 1: buy local — the VND component locks
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ }))
  expect(container.textContent).toContain('locked @ 120,000')
  expect(screen.queryByRole('spinbutton', { name: /Spot HCM/ })).not.toBeInTheDocument()
  // Step 2: hedge → buying diff = 4,705.9 − 4,800 = −$94.1
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  expect(container.textContent).toContain('−$94.1')
  // Steps 3 & 4 at unchanged market
  fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical FOB/ }))
  fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
  const text = container.textContent ?? ''
  // Physical +$34.1 (4,740 − 4,705.9), futures $0, net = origination margin +$3,412
  expect(text).toContain('+$34.1')
  expect(text).toContain('+$3,412')
  expect(text).toContain('FLAT — trade complete')
})

test('PtbfMechanics importer trade: FOB diff buy, outright sale, costs and legs', () => {
  const { container } = render(<PtbfMechanics />)
  fireEvent.click(screen.getByRole('button', { name: /Importer: buy FOB/ }))
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical FOB/ }))
  // FOB diff and freight lock at purchase
  expect(container.textContent).toContain('locked @ −$60')
  expect(container.textContent).toContain('locked @ $70')
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical spot/ }))
  fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
  const text = container.textContent ?? ''
  // Physical 4,920 − 4,740 = +180; costs −170; futures 0 → +$10.0/t, +$1,000
  expect(text).toContain('+$180')
  expect(text).toContain('−$170')
  expect(text).toContain('+$1,000')
})

test('PtbfMechanics: market values are typeable via keyboard inputs', () => {
  const { container } = render(<PtbfMechanics />)
  // Type a futures level directly instead of sliding
  fireEvent.change(screen.getByRole('spinbutton', { name: /London futures/ }), { target: { value: '5000' } })
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ }))
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  // Buying diff = 4,705.9 − 5,000 = −$294.1
  expect(container.textContent).toContain('−$294.1')
  // Futures stays typeable until the fix; then it locks
  fireEvent.change(screen.getByRole('spinbutton', { name: /London futures/ }), { target: { value: '4900' } })
  fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical FOB/ }))
  fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
  expect(container.textContent).toContain('locked @ $4,900')
  // Futures P&L = 5,000 − 4,900 = +$100
  expect(container.textContent).toContain('+$100')
})

test('module 1 quiz has 10 questions and follows the market-structure topic', () => {
  const m1 = modules[0]
  const ids = m1.topics.map(t => t.id)
  const quizIdx = ids.indexOf('01b-panorama-quiz')
  const structureIdx = ids.indexOf('03-market-structure')
  expect(quizIdx).toBeGreaterThan(structureIdx)
  const quiz = m1.topics[quizIdx]
  expect(quiz.quiz?.questions).toHaveLength(10)
})
