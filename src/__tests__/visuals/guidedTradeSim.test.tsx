import { render, fireEvent, screen } from '@testing-library/react'
import GuidedTradeSim from '@/visuals/GuidedTradeSim'
import { modules } from '@/content'

function choose(label: RegExp) {
  fireEvent.click(screen.getByRole('button', { name: label }))
}

test('optimal path nets +$8/t (+$1,600) and grades desk-ready', () => {
  const { container } = render(<GuidedTradeSim />)
  choose(/Sell 20 lots Jan at 4,800/)
  choose(/Book now at \$70\/t/)
  choose(/Hit the bid/)
  choose(/Agree an EFP/)
  choose(/Independent re-sampling/)
  const text = container.textContent ?? ''
  expect(text).toContain('+$8/t')
  expect(text).toContain('+$1,600')
  expect(text).toContain('Desk-ready')
})

test('worst path loses −$123/t (−$24,600)', () => {
  const { container } = render(<GuidedTradeSim />)
  choose(/Wait — the chart looks bullish/)
  choose(/Float it/)
  choose(/Hold out for \+135/)
  choose(/Leg it on screen/)
  choose(/Accept −\$25\/t/)
  const text = container.textContent ?? ''
  expect(text).toContain('−$123/t')
  expect(text).toContain('−$24,600')
  expect(text).toContain('liquidity')
})

test('decisions are presented one at a time and outcomes replayed', () => {
  const { container } = render(<GuidedTradeSim />)
  expect(container.textContent).toContain('1 · The hedge')
  expect(container.textContent).not.toContain('2 · The freight')
  choose(/Hedge half/)
  // Outcome of decision 1 replayed with its cost, decision 2 now live
  expect(container.textContent).toContain('2 · The freight')
  expect(container.textContent).toContain('−$35')
})

test('no coming-soon shells remain anywhere in the course', () => {
  for (const m of modules) {
    for (const t of m.topics) {
      expect({ id: t.id, v2: t.v2 ?? false }).toEqual({ id: t.id, v2: false })
      expect({ id: t.id, hasContent: !!(t.sections?.length || t.quiz || t.tool) }).toEqual({ id: t.id, hasContent: true })
    }
  }
})
