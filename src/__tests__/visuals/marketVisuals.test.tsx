import { render } from '@testing-library/react'
import ExchangeFunctions from '@/visuals/ExchangeFunctions'
import RobustaContract from '@/visuals/RobustaContract'
import VietnamCaseStudy from '@/visuals/VietnamCaseStudy'
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

test('module 1 quiz has 10 questions and follows the market-structure topic', () => {
  const m1 = modules[0]
  const ids = m1.topics.map(t => t.id)
  const quizIdx = ids.indexOf('01b-panorama-quiz')
  const structureIdx = ids.indexOf('03-market-structure')
  expect(quizIdx).toBeGreaterThan(structureIdx)
  const quiz = m1.topics[quizIdx]
  expect(quiz.quiz?.questions).toHaveLength(10)
})
