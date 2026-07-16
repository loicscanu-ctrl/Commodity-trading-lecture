import { render } from '@testing-library/react'
import CoffeeOdyssey from '@/visuals/CoffeeOdyssey'
import ArabicaRobusta from '@/visuals/ArabicaRobusta'

test('CoffeeOdyssey renders all eleven stations of the journey', () => {
  const { container } = render(<CoffeeOdyssey />)
  const text = container.textContent ?? ''
  for (const station of [
    'Kaffa', 'Mocha', 'Constantinople', 'Mysore', 'Java', 'Amsterdam',
    'Paris', 'Martinique', 'Brazil', 'Vietnam', 'Côte d’Ivoire',
  ]) {
    expect(text).toContain(station)
  }
  // Era legend present
  expect(text).toContain('Breaking the monopoly')
})

test('ArabicaRobusta renders both species with their exchanges', () => {
  const { container } = render(<ArabicaRobusta />)
  const text = container.textContent ?? ''
  expect(text).toContain('Arabica')
  expect(text).toContain('Robusta')
  expect(text).toContain('ICE New York')
  expect(text).toContain('ICE Europe (London)')
  expect(text).toContain('Ethiopian highlands')
  expect(text).toContain('West & Central African')
})
