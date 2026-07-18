import { render, fireEvent, screen, act } from '@testing-library/react'
import ExchangeFunctions from '@/visuals/ExchangeFunctions'
import RobustaContract from '@/visuals/RobustaContract'
import VietnamCaseStudy from '@/visuals/VietnamCaseStudy'
import PtbfMechanics, { buildTradeReport, buildPdfString, feedAt } from '@/visuals/PtbfMechanics'
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
  expect(screen.getByRole('button', { name: 'Buy G2 spot HCM' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Sell futures' })).toBeDisabled()
  // The spot-buy tile also quotes the purchase as a differential equivalent
  expect(container.textContent).toContain('diff eq. −$94')
  // Step 1: buy local — the book shows the clip; outright long = BOTH risks open
  fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
  expect(container.textContent).toContain('96 t @ $4,706') // book table: Physical buying tile
  expect(screen.getByTestId('risk-flat').textContent).toContain('AT RISK')
  expect(screen.getByTestId('risk-diff').textContent).toContain('AT RISK')
  // Step 2: hedge → buying diff = 4,705.9 − 4,800 = −$94.1; flat covered, diff still open
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  expect(container.textContent).toContain('−$94.1')
  expect(screen.getByTestId('risk-flat').textContent).toContain('covered')
  expect(screen.getByTestId('risk-diff').textContent).toContain('AT RISK')
  // Steps 3 & 4 at unchanged market
  fireEvent.click(screen.getByRole('button', { name: 'Sell FOB HCM' }))
  fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
  const text = container.textContent ?? ''
  // Physical +$34.1/t (4,740 − 4,705.9) on 5 containers = 96 t → +$3,275; futures $0
  expect(text).toContain('+$34.1')
  expect(text).toContain('+$3,275')
  expect(text).toContain('FLAT — trade complete')
  // The price graph pinned a point per action (with its side and time) and annotates the hedge→fix leg
  expect(text).toContain('action 2 (sell) · T2 · $4,800')
  expect(text).toContain('futures leg +$0/t')
  expect(text).toContain('hedge')
  expect(text).toContain('outright (fut + diff)')
})

test('PtbfMechanics importer trade: 5 steps — diff, freight, fix+hedge, EUR sale, buy-back', () => {
  const { container } = render(<PtbfMechanics />)
  fireEvent.click(screen.getByRole('button', { name: /Importer: buy FOB/ }))
  // The spot-sale tile quotes the FOB-equivalent diff: 4,920 − 4,800 − 70 − 100 = −$50
  expect(container.textContent).toContain('FOB eq. −$50')
  // 1. Buy in diff only — price still floating: diff risk open, NO flat risk
  fireEvent.click(screen.getByRole('button', { name: 'Buy FOB HCM' }))
  expect(container.textContent).toContain('96 t @ −$60') // book table: Physical buying tile (diff)
  expect(container.textContent).toContain('price TBF')
  expect(screen.getByTestId('risk-flat').textContent).toContain('covered')
  expect(screen.getByTestId('risk-diff').textContent).toContain('AT RISK')
  // 2. Buy freight
  fireEvent.click(screen.getByRole('button', { name: 'Buy freight' }))
  expect(container.textContent).toContain('locked @ $70')
  // 3. Fix before export: sell futures → purchase prices at 4,800 − 60 = 4,740
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  expect(container.textContent).toContain('$4,740')
  // 4. Sell spot outright in EUR: €4,100 × 1.20 = $4,920 — the naked-short
  //    window: FLAT risk flips ON, diff risk is done
  fireEvent.click(screen.getByRole('button', { name: 'Sell spot Antwerp (EUR)' }))
  expect(container.textContent).toContain('€4,100')
  expect(container.textContent).toContain('$4,920')
  expect(screen.getByTestId('risk-flat').textContent).toContain('AT RISK')
  expect(screen.getByTestId('risk-diff').textContent).toContain('covered')
  // 5. Buy futures → selling diff = 4,920 − 4,800 = +$120
  fireEvent.click(screen.getByRole('button', { name: 'Buy futures' }))
  const text = container.textContent ?? ''
  expect(text).toContain('+$120')
  // Physical +180/t, costs −170/t, futures 0 → +$10/t on 96 t = +$960
  expect(text).toContain('+$180')
  expect(text).toContain('−$170')
  expect(text).toContain('+$960')
  expect(text).toContain('FLAT — trade complete')
})

test('PtbfMechanics intermediate level: sell the diff first — and even buy futures outright', () => {
  const { container } = render(<PtbfMechanics />)
  fireEvent.click(screen.getByRole('button', { name: /Intermediate/ }))
  // Buying futures with NO short to cover is allowed here — the student must know why
  expect(screen.getByRole('button', { name: 'Buy futures (Load & fix)' })).toBeEnabled()
  expect(container.textContent).toContain('no short — going NAKED LONG')
  // Selling FOB BEFORE buying physical is allowed on this level
  fireEvent.click(screen.getByRole('button', { name: 'Sell FOB HCM' }))
  expect(container.textContent).toContain('Sold FOB')
  // Complete out of order: buy, hedge, fix → same economics as the guided order
  fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
  expect(container.textContent).toContain('FLAT — trade complete')
  expect(container.textContent).toContain('+$3,275')
})

test('PtbfMechanics intermediate live: booked business auto-fixes after 10 s with the penalty', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    fireEvent.click(screen.getByRole('button', { name: /Intermediate/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Trader name' }), { target: { value: 'Ada' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Trader surname' }), { target: { value: 'Lovelace' } })
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    // Build the book and sell the diff at the opening prints: the business is BOOKED
    fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sell FOB HCM' }))
    expect(container.textContent).toContain('BUSINESS BOOKED')
    // 11 s later the desk has auto-fixed the open short, recorded, and charged −$20,000
    act(() => { jest.advanceTimersByTime(11_000) })
    expect(container.textContent).toContain('auto-fix penalty')
    expect(container.textContent).toContain('Trade #1 recorded automatically')
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics live: maintenance margin caps the hedge — no unlimited over-hedging', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Trader name' }), { target: { value: 'Ada' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Trader surname' }), { target: { value: 'Lovelace' } })
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    // Buy 500 t at the opening prints: draws $2,333,333 of the $4M line
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Volume to buy (t)' }), { target: { value: '500' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
    // Four hedge clips of 60 lots: initial margin 240 × $6k = $1,440,000
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Hedge volume (lots)' }), { target: { value: '60' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
    expect(container.textContent).toContain('incl. margin $360,000')
    fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
    expect(container.textContent).toContain('incl. margin $1,440,000')
    // A fifth 60-lot clip needs $360k more — only ~$227k left: blocked
    expect(screen.getByRole('button', { name: 'Sell futures' })).toBeDisabled()
    expect(container.textContent).toContain('no margin')
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics live: an open futures position rolls every 2 months, straight into P&L', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    // Build a hedged book at the opening prints: net short 10 lots
    fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
    // Two calendar months later (t=40) the front expires: the short rolls at
    // the calendar spread — contango at the open, so the short EARNS the carry
    act(() => { jest.advanceTimersByTime(40_000) })
    const spread = feedAt(40, 'spread')
    const roll = -10 * 10 * spread
    const rollStr = `${roll < 0 ? '−' : '+'}$${Math.abs(roll).toLocaleString('en-US')}`
    expect(spread).toBeLessThan(0) // the session opens in contango
    expect(container.textContent).toContain(`rolls ${rollStr}`)
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics intermediate live: financing accrues every second on locked capital', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    fireEvent.click(screen.getByRole('button', { name: /Intermediate/ }))
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    // Buy 96 t: $448,000 of capital locks — the 8% p.a. meter starts running
    fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
    act(() => { jest.advanceTimersByTime(10_000) })
    expect(container.textContent).toContain('financing −$')
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics advanced level: futures fills pay the bid/ask spread and size impact', () => {
  const { container } = render(<PtbfMechanics />)
  fireEvent.click(screen.getByRole('button', { name: /Advanced/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
  // Selling 20 lots at a 4,800 screen: half-spread $3 + $0.50 × 10 excess lots = $8 → filled 4,792
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Hedge volume (lots)' }), { target: { value: '20' } })
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  expect(container.textContent).toContain('20 lots @ $4,792')
})

test('PtbfMechanics advanced: grade choice adjusts both legs, tendering delivers at parity', () => {
  const { container } = render(<PtbfMechanics />)
  fireEvent.click(screen.getByRole('button', { name: /Advanced/ }))
  // Originate G3: −$70 on cost, −$90 on the sale/tender ladder
  fireEvent.click(screen.getByRole('button', { name: 'Grade G3' }))
  fireEvent.click(screen.getByRole('button', { name: 'Buy G3 spot HCM' }))
  expect(container.textContent).toContain('96 t @ $4,636') // 4,705.9 − 70
  // Hedge 10 lots with the order-book spread: 4,800 − $3 half-spread = 4,797
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  expect(container.textContent).toContain('10 lots @ $4,797')
  // Tender to the exchange: parity −(70+100+95) = −265, G3 ladder −90 → −355
  fireEvent.click(screen.getByRole('button', { name: 'Tender to exchange' }))
  expect(container.textContent).toContain('5 bx @ −$355')
  // Square the futures → the book completes
  fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
  expect(container.textContent).toContain('FLAT — trade complete')
})

test('PtbfMechanics: the flat-risk meter charges naked speculation on the risk-adjusted score', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    fireEvent.click(screen.getByRole('button', { name: /Intermediate/ }))
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    // Go naked long 10 lots — pure speculation, 100 t of flat exposure
    fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
    act(() => { jest.advanceTimersByTime(10_000) })
    // 100 t × 10 s = 0.5 months exposure → the meter shows and risk-adjusts
    expect(container.textContent).toContain('flat risk')
    expect(container.textContent).toContain('t·mo · risk-adj')
    const report = buildTradeReport([], undefined, 50)
    expect(report).toContain('Risk charge ($150/t·mo): −$7,500')
    expect(report).toContain('RISK-ADJUSTED TOTAL: −$7,500')
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics live: flash events spike the tape for seconds, then fully revert', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    // Y1 Dec (t=160): Vietnam panic selling flashes for 4 seconds
    act(() => { jest.advanceTimersByTime(161_000) })
    expect(container.textContent).toContain('⚡ FLASH')
    expect(container.textContent).toContain('Vietnam farmers dump')
    // The flashed print is the deterministic feed value (base − 150 on futures)
    expect(container.textContent).toContain(feedAt(161, 'fut').toLocaleString('en-US'))
    // Ten seconds later the fall-and-recovery has fully played out
    act(() => { jest.advanceTimersByTime(10_000) })
    expect(container.textContent).not.toContain('⚡ FLASH')
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics live: at the end of the 45 months the market closes and actions lock', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    act(() => { jest.advanceTimersByTime(905_000) })
    expect(container.textContent).toContain('SESSION OVER')
    expect(screen.getByRole('button', { name: 'Buy G2 spot HCM' })).toBeDisabled()
    // The feed is frozen: nothing moves after the close
    expect(feedAt(950, 'fut')).toBe(feedAt(900, 'fut'))
    expect(feedAt(950, 'fob')).toBe(feedAt(900, 'fob'))
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics live: pause freezes the clock, resume continues it', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    act(() => { jest.advanceTimersByTime(5_000) })
    fireEvent.click(screen.getByRole('button', { name: /Pause/ }))
    const frozen = feedAt(5, 'vnd').toLocaleString('en-US')
    expect(container.textContent).toContain(frozen)
    // Ten seconds of wall clock pass — the market does not move
    act(() => { jest.advanceTimersByTime(10_000) })
    expect(container.textContent).toContain(frozen)
    expect(screen.getByRole('button', { name: /Resume/ })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: /Resume/ }))
    act(() => { jest.advanceTimersByTime(3_000) })
    // The clock resumes from where it paused (t≈8, not t≈18)
    expect(container.textContent).toContain(feedAt(8, 'vnd').toLocaleString('en-US'))
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics intermediate: an outright futures long flashes FLAT AT RISK', () => {
  const { container } = render(<PtbfMechanics />)
  fireEvent.click(screen.getByRole('button', { name: /Intermediate/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
  // 10 lots long, no physical, no hedge: naked length
  expect(container.textContent).toContain('10 lots @ $4,800') // book table: Futures buying tile
  expect(container.textContent).toContain('LONG 10 lots')
  expect(screen.getByTestId('risk-flat').textContent).toContain('AT RISK')
})

test('PtbfMechanics live market: predetermined path, no typing, round-stamped blotter', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    // Names are optional — the live market starts straight away (the report
    // is simply issued unnamed if the fields are left blank)
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    // Round 1 (Y1 Apr) on the feed, with its news; typing is disabled
    // No round counter, no next-news countdown — the future stays a mystery
    expect(container.textContent).not.toContain('next news')
    expect(container.textContent).not.toContain('Round 1/10')
    expect(container.textContent).toContain('warehouses almost full')
    expect(container.textContent).toContain('119,000')
    expect(screen.queryByRole('spinbutton', { name: /Spot HCM/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('spinbutton', { name: /London futures/ })).not.toBeInTheDocument()
    // The clock runs at one month per 20 s: Y1 Jul's news fires at t=60 —
    // and the price does NOT jump: it starts drifting from the old level
    act(() => { jest.advanceTimersByTime(60_000) })
    expect(container.textContent).toContain('iced tea and matcha') // Y1 Jul's news is out
    expect(container.textContent).toContain('119,000') // still at the old level at the news
    // Mid-drift (t=75): 119,000 → 114,000 plus the deterministic brownian
    // wiggle — assert the exact feed value
    act(() => { jest.advanceTimersByTime(15_000) })
    expect(container.textContent).toContain(feedAt(75, 'vnd').toLocaleString('en-US'))
    // Drift complete (t=95): the screen keeps BREATHING around the published
    // level — assert the exact (wiggled) feed value
    act(() => { jest.advanceTimersByTime(20_000) })
    expect(container.textContent).toContain(feedAt(95, 'vnd').toLocaleString('en-US'))
    // Buy at t=95; Y1 Nov's news fires at t=140 (Bab-el-Mandeb); hedge at t=175
    fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
    act(() => { jest.advanceTimersByTime(80_000) })
    expect(container.textContent).toContain('Bab-el-Mandeb')
    fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
    const buyUsd = (feedAt(95, 'vnd') * 1000) / 25500
    const dBuy = buyUsd - feedAt(175, 'fut')
    const dStr = `${dBuy < 0 ? '−' : '+'}$${Math.abs(dBuy).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
    expect(container.textContent).toContain(dStr)
    // The blotter stamps the execution rounds — the anti-cheat audit trail
    expect(container.textContent).toContain('Bought local · Y1 Jul')
    expect(container.textContent).toContain('buying diff · Y1 Nov')
  } finally {
    jest.useRealTimers()
  }
})

test('PtbfMechanics: typed values beyond the slider scale are accepted', () => {
  const { container } = render(<PtbfMechanics />)
  // 6,500 is beyond the slider max of 6,000 — typing must still work
  fireEvent.change(screen.getByRole('spinbutton', { name: /London futures — hedge leg/ }), { target: { value: '6500' } })
  fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  expect(container.textContent).toContain('10 lots @ $6,500') // book table: Futures selling tile
  // Buying diff = 4,705.9 − 6,500 = −$1,794.1
  expect(container.textContent).toContain('−$1,794.1')
})

test('PtbfMechanics: the two futures legs stay independent through the fix', () => {
  const { container } = render(<PtbfMechanics />)
  // Type the hedge-leg futures level directly instead of sliding
  fireEvent.change(screen.getByRole('spinbutton', { name: /London futures — hedge leg/ }), { target: { value: '5000' } })
  fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  // Hedge books at 5,000; buying diff = 4,705.9 − 5,000 = −$294.1
  expect(container.textContent).toContain('10 lots @ $5,000')
  expect(container.textContent).toContain('−$294.1')
  // A second futures price ("since the hedge") drives the fixing — move it
  fireEvent.change(screen.getByRole('spinbutton', { name: /London futures — since the hedge/ }), { target: { value: '4900' } })
  // The booked hedge did not move
  expect(container.textContent).toContain('10 lots @ $5,000')
  expect(container.textContent).toContain('−$294.1')
  fireEvent.click(screen.getByRole('button', { name: 'Sell FOB HCM' }))
  fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
  expect(container.textContent).toContain('10 lots @ $4,900') // book table: Futures buying tile
  // Futures P&L = 5,000 − 4,900 = +$100
  expect(container.textContent).toContain('+$100')
})

test('PtbfMechanics: clip trading — buy little by little, sell little by little', () => {
  const { container } = render(<PtbfMechanics />)
  // Two buy clips of 48 t each → 96 t at the same price
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Volume to buy (t)' }), { target: { value: '48' } })
  fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
  expect(container.textContent).toContain('48 t @ $4,706')
  fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
  // two clips → two tiles on the Physical buying row
  expect((container.textContent?.match(/48 t @ \$4,706/g) ?? []).length).toBe(2)
  // Hedge in two clips of 5 lots
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Hedge volume (lots)' }), { target: { value: '5' } })
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
  expect(container.textContent).toContain('5 lots @ $4,800')
  // Sell 2 boxes, then the remaining 3
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Containers to ship' }), { target: { value: '2' } })
  fireEvent.click(screen.getByRole('button', { name: 'Sell FOB HCM' }))
  expect(container.textContent).toContain('2 bx @ −$60')
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Containers to ship' }), { target: { value: '3' } })
  fireEvent.click(screen.getByRole('button', { name: 'Sell FOB HCM' }))
  // Fix in two clips: 4 lots then the last 6 → book squares, same P&L as one shot
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Lots to buy back' }), { target: { value: '4' } })
  fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Lots to buy back' }), { target: { value: '6' } })
  fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
  expect(container.textContent).toContain('FLAT — trade complete')
  expect(container.textContent).toContain('+$3,275')
})

test('PtbfMechanics: completed trades are recorded and a new trade can start', () => {
  const { container } = render(<PtbfMechanics />)
  const runExporterTrade = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Buy G2 spot HCM' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sell futures' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sell FOB HCM' }))
    fireEvent.click(screen.getByRole('button', { name: 'Buy futures (Load & fix)' }))
  }
  runExporterTrade()
  fireEvent.click(screen.getByRole('button', { name: /Record trade/ }))
  // Trade #1 in the log with its P&L; the desk is clear for a new trade
  expect(container.textContent).toContain('Trade log')
  expect(container.textContent).toContain('#1')
  expect(container.textContent).toContain('+$3,275')
  expect(container.textContent).toContain('96 t · 10 lots · 5 bx')
  expect(container.textContent).toContain('No position')
  expect(screen.getByRole('button', { name: 'Buy G2 spot HCM' })).toBeEnabled()
  // A second identical trade doubles the session total
  runExporterTrade()
  fireEvent.click(screen.getByRole('button', { name: /Record trade/ }))
  expect(container.textContent).toContain('#2')
  expect(container.textContent).toContain('+$6,551')
})

test('buildTradeReport includes volumes, every execution, stamps and totals', () => {
  const buy = 120000000 / 25500 // $4,705.9/t
  const netT = -60 - (buy - 4800) // sell diff − buying diff = +34.1/t
  const netD = netT * 96 // on 5 containers = 96 t
  const report = buildTradeReport([{
    mode: 'exporter' as const,
    tonnes: 96, soldT: 96, lots: 10, boxes: 5,
    deal: { vnd: 120000, buy, fHedge: 4800, sell: -60, fFix: 4800, vol: 96, lots: 10, boxes: 5, stamps: [1, 2, 2, 3] },
    physicalD: netD, futuresD: 0, costsD: 0, financingD: 0, penaltyD: 0, rollD: 0, netD,
  }], 'Ada Lovelace')
  expect(report).toContain('Trader: Ada Lovelace')
  expect(report).toContain('Trade 1 — Exporter (buy VND → sell FOB) · 96 t bought · 10 lots hedged (100 t) · 5 containers shipped (96.0 t)')
  expect(report).toContain('120,000 VND/kg')
  expect(report).toContain('buying diff −$94.1 · Y1 Nov')
  expect(report).toContain('Rounds unhedged (flat risk): 1')
  expect(report).toContain('NET: +$3,275 (+$34.1/t on 96 t)')
  expect(report).toContain('SESSION TOTAL (1 trade): +$3,275')
})

test('buildTradeReport shows the scaling readout for multi-clip legs', () => {
  const report = buildTradeReport([{
    mode: 'exporter' as const,
    tonnes: 96, soldT: 96, lots: 10, boxes: 5,
    deal: {
      vnd: 120000, buy: 4700, fHedge: 4850, sell: -60, fFix: 4800,
      vol: 96, lots: 10, boxes: 5, fixedLots: 10,
      order: [1, 2, 2, 3, 4], clipPx: [4700, 4900, 4800, -60, 4800],
    },
    physicalD: 0, futuresD: 0, costsD: 0, financingD: 0, penaltyD: 0, rollD: 0, netD: 0,
  }])
  // The hedge was worked in two clips: first at 4,900, average 4,850
  expect(report).toContain('Scaling — hedge: 2 clips · first $4,900 → avg $4,850')
  // Single-clip legs stay silent
  expect(report).not.toContain('Scaling — physical buy')
})

test('buildPdfString produces a valid single-font PDF from the report text', () => {
  const raw = buildPdfString('PTBF TRADE REPORT\nNET: +$3,275')
  expect(raw.startsWith('%PDF-1.4')).toBe(true)
  expect(raw).toContain('/BaseFont /Courier')
  expect(raw).toContain('(PTBF TRADE REPORT) Tj')
  expect(raw).toContain('%%EOF')
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
