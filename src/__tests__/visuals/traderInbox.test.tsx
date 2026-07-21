import { render, fireEvent, screen } from '@testing-library/react'
import TraderInbox from '@/visuals/TraderInbox'
import AnalystInbox from '@/visuals/AnalystInbox'

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
  // The whole inbox is readable from the start — like a real inbox
  expect(container.textContent).toContain('Overnight check')
  expect(screen.getByRole('button', { name: /17:30/ })).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: /17:30/ }))
  expect(container.textContent).toContain('EOD — desk report due')
  fireEvent.click(screen.getByRole('button', { name: /06:30/ }))
  // Emails read like emails: signatures included
  expect(container.textContent).toContain('Risk & Product Control — HCM Desk')
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

// ── Module 1's junior inbox — same engine, Module 1 concepts ──

const analystBest = [
  /Wire \$30,000/,
  /WALKS the book/,
  /unconfirmed flashes revert/i,
  /File the rate/,
  /trade houses and cooperatives bridge/,
  /price response is CONVEX/,
  /Take delivery AND sell March/,
]

test('AnalystInbox: a perfect first day banks the +$2,000 base', () => {
  const { container } = render(<AnalystInbox />)
  expect(container.textContent).toContain('junior analyst')
  expect(container.textContent).toContain('Overnight margin call')
  // The market strip above the inbox: 5 contracts, contango, OI drained from Jan
  expect(container.textContent).toContain('next 5 contracts')
  expect(container.textContent).toContain('CONTANGO')
  expect(container.textContent).toContain('4,880')
  expect(container.textContent).toContain('+80 vs Jan')
  expect(container.textContent).toContain('OI 1,850')
  expect(container.textContent).toContain('delivery period approaching')
  analystBest.forEach((r, i) => {
    fireEvent.click(screen.getByRole('button', { name: r }))
    if (i < analystBest.length - 1) fireEvent.click(screen.getByRole('button', { name: /Open next email/ }))
  })
  const text = container.textContent ?? ''
  expect(text).toContain('day complete')
  expect(text).toContain('+$2,000')
  expect(text).toContain('Clean first day')
})

test('AnalystInbox: the margin arithmetic mistake costs and explains the lot size', () => {
  const { container } = render(<AnalystInbox />)
  fireEvent.click(screen.getByRole('button', { name: /Wire \$3,000/ }))
  const text = container.textContent ?? ''
  expect(text).toContain('−$1,500')
  expect(text).toContain('a lot is 10 TONNES')
})
