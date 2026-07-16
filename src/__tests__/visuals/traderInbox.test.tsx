import { render, fireEvent, screen } from '@testing-library/react'
import TraderInbox from '@/visuals/TraderInbox'

const best = [
  /Confirmed: net flat zero/,
  /margin is the cash cost of zero price risk/,
  /Counter at 119,500/,
  /Selling 20 lots Jan now/,
  /EFP at 4,760/,
  /book the freight NOW/,
  /Flat \$0 \(fully hedged\)/,
]

test('a perfectly handled day closes at +$4,300', () => {
  const { container } = render(<TraderInbox />)
  // Only the first email is open; later ones are locked
  expect(container.textContent).toContain('Overnight check')
  expect(screen.getByRole('button', { name: /17:30/ })).toBeDisabled()
  best.forEach((r, i) => {
    fireEvent.click(screen.getByRole('button', { name: r }))
    if (i < best.length - 1) fireEvent.click(screen.getByRole('button', { name: /Open next email/ }))
  })
  const text = container.textContent ?? ''
  expect(text).toContain('day complete')
  expect(text).toContain('+$4,300')
  expect(text).toContain('Clean day')
})

test('wrong replies cost money and show their feedback', () => {
  const { container } = render(<TraderInbox />)
  // Cut the hedge on email 1 — the classic PTBF-unfixed mistake
  fireEvent.click(screen.getByRole('button', { name: /Cut 120 lots/ }))
  const text = container.textContent ?? ''
  expect(text).toContain('−$12,000')
  expect(text).toContain('sold is not fixed')
  expect(text).toContain('decisions −$12,000')
})

test('answered emails can be revisited from the inbox list', () => {
  const { container } = render(<TraderInbox />)
  fireEvent.click(screen.getByRole('button', { name: /Confirmed: net flat zero/ }))
  // Move on to email 2, then revisit email 1 from the list
  fireEvent.click(screen.getByRole('button', { name: /Open next email/ }))
  expect(container.textContent).toContain('URGENT')
  fireEvent.click(screen.getByRole('button', { name: /06:30/ }))
  expect(container.textContent).toContain('You replied:')
  expect(container.textContent).toContain('Risk signs off')
})
