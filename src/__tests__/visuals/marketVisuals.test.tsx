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
  expect(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ })).toBeEnabled()
  expect(screen.getByRole('button', { name: /2\. Sell futures/ })).toBeDisabled()
  // Step 1: buy local — the VND component locks; outright long = BOTH risks open
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ }))
  expect(container.textContent).toContain('locked @ 120,000')
  expect(screen.queryByRole('spinbutton', { name: /Spot HCM/ })).not.toBeInTheDocument()
  expect(screen.getByTestId('risk-flat').textContent).toContain('AT RISK')
  expect(screen.getByTestId('risk-diff').textContent).toContain('AT RISK')
  // Step 2: hedge → buying diff = 4,705.9 − 4,800 = −$94.1; flat covered, diff still open
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  expect(container.textContent).toContain('−$94.1')
  expect(screen.getByTestId('risk-flat').textContent).toContain('covered')
  expect(screen.getByTestId('risk-diff').textContent).toContain('AT RISK')
  // Steps 3 & 4 at unchanged market
  fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical FOB/ }))
  fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
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
  // 1. Buy in diff only — price still floating: diff risk open, NO flat risk
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical FOB/ }))
  expect(container.textContent).toContain('locked @ −$60')
  expect(container.textContent).toContain('price TBF')
  expect(screen.getByTestId('risk-flat').textContent).toContain('covered')
  expect(screen.getByTestId('risk-diff').textContent).toContain('AT RISK')
  // 2. Buy freight
  fireEvent.click(screen.getByRole('button', { name: /2\. Buy freight/ }))
  expect(container.textContent).toContain('locked @ $70')
  // 3. Fix before export: sell futures → purchase prices at 4,800 − 60 = 4,740
  fireEvent.click(screen.getByRole('button', { name: /3\. Fix before export/ }))
  expect(container.textContent).toContain('$4,740')
  // 4. Sell spot outright in EUR: €4,100 × 1.20 = $4,920 — the naked-short
  //    window: FLAT risk flips ON, diff risk is done
  fireEvent.click(screen.getByRole('button', { name: /4\. Sell spot/ }))
  expect(container.textContent).toContain('€4,100')
  expect(container.textContent).toContain('$4,920')
  expect(screen.getByTestId('risk-flat').textContent).toContain('AT RISK')
  expect(screen.getByTestId('risk-diff').textContent).toContain('covered')
  // 5. Buy futures → selling diff = 4,920 − 4,800 = +$120
  fireEvent.click(screen.getByRole('button', { name: /5\. Buy futures/ }))
  const text = container.textContent ?? ''
  expect(text).toContain('+$120')
  // Physical +180/t, costs −170/t, futures 0 → +$10/t on 96 t = +$960
  expect(text).toContain('+$180')
  expect(text).toContain('−$170')
  expect(text).toContain('+$960')
  expect(text).toContain('FLAT — trade complete')
})

test('PtbfMechanics intermediate level: sell the diff first, the fix still needs the hedge', () => {
  const { container } = render(<PtbfMechanics />)
  fireEvent.click(screen.getByRole('button', { name: /Intermediate/ }))
  // Selling FOB BEFORE buying physical is allowed on this level
  fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical FOB/ }))
  expect(container.textContent).toContain('Sold FOB')
  // …but buying the futures back stays gated on the hedge existing
  expect(screen.getByRole('button', { name: /4\. Fix it/ })).toBeDisabled()
  // Complete out of order: buy, hedge, fix → same economics as the guided order
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ }))
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
  expect(container.textContent).toContain('FLAT — trade complete')
  expect(container.textContent).toContain('+$3,275')
})

test('PtbfMechanics live market: predetermined path, no typing, round-stamped blotter', () => {
  jest.useFakeTimers()
  try {
    const { container } = render(<PtbfMechanics />)
    // The live market only starts once the trader is named — the report is issued in their name
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    expect(container.textContent).toContain('enter trader name & surname')
    fireEvent.change(screen.getByRole('textbox', { name: 'Trader name' }), { target: { value: 'Ada' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Trader surname' }), { target: { value: 'Lovelace' } })
    fireEvent.click(screen.getByRole('button', { name: /Live market/ }))
    // Round 1 (Y1 Apr) on the feed, with its news; typing is disabled
    expect(container.textContent).toContain('Round 1/10 · Y1 Apr')
    expect(container.textContent).toContain('warehouses almost full')
    expect(container.textContent).toContain('119,000')
    expect(screen.queryByRole('spinbutton', { name: /Spot HCM/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('spinbutton', { name: /London futures/ })).not.toBeInTheDocument()
    // 45 seconds later the round rolls to Y1 Jul — but the price does NOT
    // jump: it starts drifting from the previous level in 5-second steps
    act(() => { jest.advanceTimersByTime(45_000) })
    expect(container.textContent).toContain('Round 2/10 · Y1 Jul')
    expect(container.textContent).toContain('119,000') // still at the old level at the boundary
    // Halfway through the drift (20 s = 4 of 8 ticks): 119,000 → 114,000 plus
    // the deterministic brownian wiggle — assert the exact feed value
    act(() => { jest.advanceTimersByTime(20_000) })
    expect(container.textContent).toContain(feedAt(65, 'vnd').toLocaleString('en-US'))
    // At 40 s the round's published level is reached and holds
    act(() => { jest.advanceTimersByTime(20_000) })
    expect(container.textContent).toContain('114,000')
    // Buy at Y1 Jul's level, roll into Y1 Nov (Bab-el-Mandeb) and let the
    // drift complete: buying diff = 114,000/25.5k − 4,950 = −$479.4
    fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ }))
    act(() => { jest.advanceTimersByTime(45_000) })
    expect(container.textContent).toContain('Bab-el-Mandeb')
    fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
    expect(container.textContent).toContain('−$479.4')
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
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ }))
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  expect(container.textContent).toContain('locked @ $6,500')
  // Buying diff = 4,705.9 − 6,500 = −$1,794.1
  expect(container.textContent).toContain('−$1,794.1')
})

test('PtbfMechanics: typeable inputs, and the two futures legs lock independently', () => {
  const { container } = render(<PtbfMechanics />)
  // Type the hedge-leg futures level directly instead of sliding
  fireEvent.change(screen.getByRole('spinbutton', { name: /London futures — hedge leg/ }), { target: { value: '5000' } })
  fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ }))
  fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
  // Hedge leg is now locked at 5,000; buying diff = 4,705.9 − 5,000 = −$294.1
  expect(container.textContent).toContain('locked @ $5,000')
  expect(container.textContent).toContain('−$294.1')
  expect(screen.queryByRole('spinbutton', { name: /London futures — hedge leg/ })).not.toBeInTheDocument()
  // A second futures price ("since the hedge") drives the fixing — move it
  fireEvent.change(screen.getByRole('spinbutton', { name: /London futures — since the hedge/ }), { target: { value: '4900' } })
  // The locked hedge did not move
  expect(container.textContent).toContain('locked @ $5,000')
  expect(container.textContent).toContain('−$294.1')
  fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical FOB/ }))
  fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
  expect(container.textContent).toContain('locked @ $4,900')
  // Futures P&L = 5,000 − 4,900 = +$100
  expect(container.textContent).toContain('+$100')
})

test('PtbfMechanics: completed trades are recorded and a new trade can start', () => {
  const { container } = render(<PtbfMechanics />)
  const runExporterTrade = () => {
    fireEvent.click(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ }))
    fireEvent.click(screen.getByRole('button', { name: /2\. Sell futures/ }))
    fireEvent.click(screen.getByRole('button', { name: /3\. Sell physical FOB/ }))
    fireEvent.click(screen.getByRole('button', { name: /4\. Fix it/ }))
  }
  runExporterTrade()
  fireEvent.click(screen.getByRole('button', { name: /Record trade/ }))
  // Trade #1 in the log with its P&L; the desk is clear for a new trade
  expect(container.textContent).toContain('Trade log')
  expect(container.textContent).toContain('#1')
  expect(container.textContent).toContain('+$3,275')
  expect(container.textContent).toContain('96 t · 10 lots · 5 bx')
  expect(container.textContent).toContain('No position')
  expect(screen.getByRole('button', { name: /1\. Buy physical \(VND\)/ })).toBeEnabled()
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
    physicalD: netD, futuresD: 0, costsD: 0, financingD: 0, netD,
  }], 'Ada Lovelace')
  expect(report).toContain('Trader: Ada Lovelace')
  expect(report).toContain('Trade 1 — Exporter (buy VND → sell FOB) · 96 t bought · 10 lots hedged (100 t) · 5 containers shipped (96.0 t)')
  expect(report).toContain('120,000 VND/kg')
  expect(report).toContain('buying diff −$94.1 · Y1 Nov')
  expect(report).toContain('Rounds unhedged (flat risk): 1')
  expect(report).toContain('NET: +$3,275 (+$34.1/t on 96 t)')
  expect(report).toContain('SESSION TOTAL (1 trade): +$3,275')
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
