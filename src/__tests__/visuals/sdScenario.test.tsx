import { render, fireEvent } from '@testing-library/react'
import SdScenario from '@/visuals/SdScenario'

test('baseline reproduces the 2024/25 balance: ending 20.9, STU 12.4%', () => {
  const { container } = render(<SdScenario />)
  const text = container.textContent ?? ''
  expect(text).toContain('20.9')
  expect(text).toContain('12.4%')
})

test('default Brazil −5% scenario gives ending 17.6 and STU 10.5% (tight)', () => {
  const { container } = render(<SdScenario />)
  const text = container.textContent ?? ''
  expect(text).toContain('17.6')
  expect(text).toContain('10.5%')
  expect(text).toContain('tight')
})

test('a large supply build moves the band out of tight', () => {
  const { container } = render(<SdScenario />)
  const sliders = container.querySelectorAll('input[type="range"]')
  // Brazil +15%, Vietnam +15%: production +14.5 M bags → ending ≈ 35.4 → STU ≈ 21% (balanced)
  fireEvent.change(sliders[0], { target: { value: '15' } })
  fireEvent.change(sliders[1], { target: { value: '15' } })
  const text = container.textContent ?? ''
  expect(text).toContain('balanced')
})
