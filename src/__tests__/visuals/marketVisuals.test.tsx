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

test('PtbfMechanics: steps enforce order and a clean round trip nets the diff minus costs', () => {
  const { container } = render(<PtbfMechanics />)
  // Only step 1 is executable at the start
  expect(screen.getByRole('button', { name: /1\. Buy physical/ })).toBeEnabled()
  expect(screen.getByRole('button', { name: /2\. Sell futures/ })).toBeDisabled()
  // Execute all four steps without moving the market
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical/ }))
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical/ }))
  fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
  const text = container.textContent ?? ''
  // Diff leg 120 − (−60) = +180; costs freight 70 + 100 instore = −170; no slippage → +$10/t, +$1,000
  expect(text).toContain('+$180')
  expect(text).toContain('−$170')
  expect(text).toContain('clean pair trade')
  expect(text).toContain('+$10/t')
  expect(text).toContain('+$1,000')
  expect(text).toContain('FLAT — trade complete')
})

test('PtbfMechanics: moving futures between buy and hedge shows up as slippage', () => {
  const { container } = render(<PtbfMechanics />)
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical/ }))
  // Futures rally $100 before the hedge goes on (sliders: vnd, futures, fobDiff, freight, antwerpDiff)
  const sliders = container.querySelectorAll('input[type="range"]')
  fireEvent.change(sliders[1], { target: { value: '4900' } })
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical/ }))
  fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
  const text = container.textContent ?? ''
  // Slippage = (4900 − 4800) = +100 → net = 180 − 170 + 100 = +$110/t
  expect(text).toContain('+$100')
  expect(text).toContain('+$110/t')
  expect(text).not.toContain('clean pair trade')
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
