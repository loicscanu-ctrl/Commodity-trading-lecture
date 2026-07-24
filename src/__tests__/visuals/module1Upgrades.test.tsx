import { render, fireEvent, screen } from '@testing-library/react'
import NetworkExplosion from '@/visuals/NetworkExplosion'
import UnhedgeableMarkets from '@/visuals/UnhedgeableMarkets'
import CbotTimeline from '@/visuals/CbotTimeline'
import VolumeOiFlow from '@/visuals/VolumeOiFlow'
import TradeWorkflow from '@/visuals/TradeWorkflow'
import PhysicalFlow from '@/visuals/PhysicalFlow'
import RollingOiWave, { oiAt, priceAt, rolledLongAt } from '@/visuals/RollingOiWave'

test('RollingOiWave: real-year replay — the OI wave rolls and prices pull to the front', () => {
  // The OI model: the front carries ~50% of a ~126k board
  const start = oiAt(0)
  expect(Math.round(start[0])).toBe(63) // F, the front
  expect(Math.round(start[1])).toBe(32) // H
  const midRoll = oiAt(1.9) // deep in F's roll window
  expect(midRoll[1]).toBeGreaterThan(midRoll[0]) // H has taken the crowd
  const after = oiAt(2.5) // F expired: H is the new front
  expect(after[0]).toBe(0)
  expect(Math.round(after[1])).toBe(66)
  // The price model: winter backwardation (deferreds under the nearby)…
  expect(priceAt(0, 0)).toBe(4820)
  expect(priceAt(0, 5)).toBeLessThan(priceAt(0, 0))
  // …and the pull to spot: F converges onto the front path as it expires
  expect(priceAt(1.9, 0)).toBeGreaterThan(priceAt(0, 0))
  // …then the autumn flip: X trades ABOVE the front path — contango
  expect(priceAt(11.5, 5)).toBeGreaterThan(4425)
  // The rolled long: flat at entry; in the backwardated winter the roll
  // yield is POSITIVE — the rolled long beats the front-path move
  expect(rolledLongAt(0).pnl).toBe(0)
  const atTwo = rolledLongAt(2)
  expect(atTwo.rolls).toBe(1) // F was rolled into H mid-window
  expect(atTwo.rollYield).toBeGreaterThan(0)
  expect(atTwo.pnl).toBe(atTwo.marketMove + atTwo.rollYield)
  expect(rolledLongAt(12).rolls).toBe(5) // rolled all the way into X
  // The component: legend, codes, live structure chip, scrub-driven states
  const { container } = render(<RollingOiWave />)
  expect(container.textContent).toContain('F · Jan 25')
  expect(container.textContent).toContain('X · Nov 25')
  expect(container.textContent).toContain('front F')
  expect(container.textContent).toContain('BACKWARDATION')
  expect(container.textContent).toContain('OI 63k') // the front's OI in the structure chip
  expect(container.textContent).toContain('F 63k') // …and its band label in the OI panel
  expect(container.textContent).toContain('OPEN INTEREST')
  expect(container.textContent).toContain('The rolled long')
  expect(container.textContent).toContain('bought F @ 4,820')
  expect(container.textContent).toContain('ROLL YIELD')
  fireEvent.change(screen.getByRole('slider', { name: 'Timeline (months)' }), { target: { value: '1.9' } })
  expect(container.textContent).toContain('ROLL — volume spikes, OI migrates')
  fireEvent.change(screen.getByRole('slider', { name: 'Timeline (months)' }), { target: { value: '2.5' } })
  expect(container.textContent).toContain('✕')
  expect(container.textContent).toContain('front H')
  fireEvent.change(screen.getByRole('slider', { name: 'Timeline (months)' }), { target: { value: '11.5' } })
  expect(container.textContent).toContain('CONTANGO')
})

test('VolumeOiFlow: opening creates OI, changing hands only creates volume', () => {
  const { container } = render(<VolumeOiFlow />)
  // Trade 1: A buys, B sells → volume 1, OI 1, both sides positioned
  fireEvent.click(screen.getByRole('button', { name: /A buys, B sells/ }))
  expect(container.textContent).toContain('+1 — both sides OPENED')
  expect(container.textContent).toContain('LONG 1')
  expect(container.textContent).toContain('SHORT 1')
  // Trade 2: A passes the lot to C → volume 2, OI unchanged
  fireEvent.click(screen.getByRole('button', { name: /A passes its lot to C/ }))
  expect(container.textContent).toContain('unchanged — it changed hands')
  expect(container.textContent).toContain('still short')
  const text = container.textContent ?? ''
  // The counters read volume 2, OI 1
  expect(text).toContain('Volume (today)2')
  expect(text).toContain('Open interest1')
})
import OrderBook from '@/visuals/OrderBook'
import ParcelJourney from '@/visuals/ParcelJourney'
import MarketBenefits from '@/visuals/MarketBenefits'
import MarginSimulator from '@/visuals/MarginSimulator'
import RollYield from '@/visuals/RollYield'
import BackwardationChart from '@/visuals/BackwardationChart'
import DeskOrganisation from '@/visuals/DeskOrganisation'
import StuScatter from '@/visuals/StuScatter'
import CropCalendar from '@/visuals/CropCalendar'
import WarrantLifecycle from '@/visuals/WarrantLifecycle'

test('NetworkExplosion: quadratic bilateral links collapse to linear with the exchange', () => {
  const { container } = render(<NetworkExplosion />)
  // 14 participants → 7×7 = 49 bilateral links
  expect(container.textContent).toContain('49')
  fireEvent.click(screen.getByRole('button', { name: /One exchange/ }))
  expect(container.textContent).toContain('14')
  expect(container.textContent).toContain('one public price')
})

test('UnhedgeableMarkets: olive oil deep case plus rice, pepper and the onion experiment', () => {
  const { container } = render(<UnhedgeableMarkets />)
  // The olive-oil chart with its swing annotation
  expect(container.textContent).toContain('Extra-virgin olive oil')
  expect(container.textContent).toContain('×4.7 top-to-bottom in five years')
  // Even the best buyer could not do much: the two failed defences
  expect(container.textContent).toContain('tanks hold ~1 month of supply')
  // The three mini-cases
  expect(container.textContent).toContain('Rice · world price')
  expect(container.textContent).toContain('Vietnamese pepper')
  expect(container.textContent).toContain('after the ban')
  // The four no-exchange problems are still on the slide
  expect(container.textContent).toContain('No buyer of last resort')
  expect(container.textContent).toContain('suppliers walk away')
})

test('CbotTimeline: the chronology runs from harvest chaos to the modern clearing house', () => {
  const { container } = render(<CbotTimeline />)
  ;['1840s', '1848', '1850s', '1865', '1925', 'Today'].forEach(y =>
    expect(container.textContent).toContain(y))
  // Each invention is tagged with the problem it solves
  expect(container.textContent).toContain('reference price')
  expect(container.textContent).toContain('protection in advance')
  expect(container.textContent).toContain('no counterparty risk')
  expect(container.textContent).toContain('82 merchants')
  expect(container.textContent).toContain('CME · ICE · LME')
})

test('OrderBook: a large market order walks the book; an unmarketable limit rests', () => {
  const { container } = render(<OrderBook />)
  // Market buy 15 lots: 10 @ 4,805 + 5 @ 4,810 → avg $4,807, walked to $4,810
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Order lots' }), { target: { value: '15' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit order' }))
  expect(container.textContent).toContain('Filled 15 lots at avg $4,807')
  expect(container.textContent).toContain('WALKED the book to $4,810')
  // Limit buy below the market rests
  fireEvent.click(screen.getByRole('button', { name: 'limit' }))
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Limit price' }), { target: { value: '4790' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit order' }))
  expect(container.textContent).toContain('REST in the book at $4,790')
})

test('ParcelJourney: risk tiles flip as the parcel moves down the chain', () => {
  const { container } = render(<ParcelJourney />)
  // Farmer: both risks, no hedge access
  expect(container.textContent).toContain('FLAT AT RISK')
  expect(container.textContent).toContain('DIFF AT RISK')
  // Two hops → Exporter: flat covered, diff at risk, origination margin
  fireEvent.click(screen.getByRole('button', { name: /Pass the parcel/ }))
  fireEvent.click(screen.getByRole('button', { name: /Pass the parcel/ }))
  expect(container.textContent).toContain('Exporter · Ho Chi Minh City')
  expect(container.textContent).toContain('FLAT covered')
  expect(container.textContent).toContain('origination margin')
})

test('ParcelJourney: the exporter carries FX risk — a weaker dollar flips the margin', () => {
  const { container } = render(<ParcelJourney />)
  fireEvent.click(screen.getByRole('button', { name: /Pass the parcel/ }))
  fireEvent.click(screen.getByRole('button', { name: /Pass the parcel/ }))
  // Exporter shows the FX tile and the mini-simulator at the entry rate
  expect(container.textContent).toContain('FX AT RISK')
  expect(container.textContent).toContain('+$26/t')
  // USD weakens to 25,000: cost 120.2m/25,000 = $4,808/t → margin −$68/t, parcel −$6,800
  fireEvent.change(screen.getByRole('slider', { name: 'USD/VND exchange rate' }), { target: { value: '25000' } })
  expect(container.textContent).toContain('−$68/t')
  expect(container.textContent).toContain('−$6,800')
})

test('MarketBenefits: fixing the two lows beats the cheapest outright day by $210/t', () => {
  const { container } = render(<MarketBenefits />)
  // Nothing computed until both legs are fixed
  expect(container.textContent).toContain('Pick one month for each leg')
  // Futures low: May 4,250 · diff low: Nov −80 → 4,170, vs best outright 4,380 (May)
  fireEvent.click(screen.getByRole('button', { name: 'Fix the FUTURES leg in…: May' }))
  fireEvent.click(screen.getByRole('button', { name: 'Fix the DIFFERENTIAL leg in…: Nov' }))
  expect(container.textContent).toContain('= $4,170/t')
  expect(container.textContent).toContain('$210/t BELOW')
  // Same-day fixing = an outright purchase
  fireEvent.click(screen.getByRole('button', { name: 'Fix the DIFFERENTIAL leg in…: May' }))
  expect(container.textContent).toContain('outright purchase')
})

test('MarginSimulator: a funded call is not a liquidation — the first UNMET one is', () => {
  const { container } = render(<MarginSimulator />)
  // Day 1: 4,500 → 4,900 = −$40,000 — the call is FUNDED, position lives
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Day 1 settlement' }), { target: { value: '4900' } })
  fireEvent.click(screen.getByRole('button', { name: 'Fix Day 1 settle' }))
  expect(container.textContent).toContain('call funded')
  expect(container.textContent).not.toContain('FORCED OUT')
  // Day 2: another −$30,000 blows through the $60,000 line — call UNMET → closed
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Day 2 settlement' }), { target: { value: '5200' } })
  fireEvent.click(screen.getByRole('button', { name: 'Fix Day 2 settle' }))
  const text = container.textContent ?? ''
  expect(text).toContain('call UNMET')
  expect(text).toContain('FORCED OUT')
  expect(text).toContain('the call goes UNMET')
  expect(text).toContain('the funding did')
})

test('RollYield: contango taxes the long and pays the short', () => {
  const { container } = render(<RollYield />)
  const text = container.textContent ?? ''
  // Default: LONG in 0.6%/month contango → (1/1.006)^12 − 1 = −6.9%
  expect(text).toContain('-6.9')
  expect(text).toContain('CONTANGO × LONG')
  expect(text).toContain('Spot never moved')
  // Flip to SHORT: same curve, +7.4% — the rule of thumb made visible
  fireEvent.click(screen.getByRole('button', { name: 'SHORT futures' }))
  expect(container.textContent).toContain('+7.4')
  expect(container.textContent).toContain('CONTANGO × SHORT')
  expect(container.textContent).toContain('backwardation favours the LONG')
})

test('BackwardationChart: $60 spot, priced points and the three illustrated causes', () => {
  const { container } = render(<BackwardationChart />)
  const text = container.textContent ?? ''
  expect(text).toContain('SPOT $60.00')
  expect(text).toContain('shortage premium')
  expect(text).toContain('Supply shortage')
  expect(text).toContain('Seasonal demand peak')
  expect(text).toContain('Inventory drawdown')
})

test('DeskOrganisation: three offices, the trade lifecycle and the Barings lesson', () => {
  const { container } = render(<DeskOrganisation />)
  const text = container.textContent ?? ''
  expect(text).toContain('FRONT OFFICE')
  expect(text).toContain('MIDDLE OFFICE')
  expect(text).toContain('BACK OFFICE')
  expect(text).toContain('Owns the P&L')
  expect(text).toContain('Owns the limits & the marks')
  expect(text).toContain('through the back office')
  expect(text).toContain('Barings, 1995')
  expect(text).toContain('account 88888')
})

test('StuScatter: the real 12.4% STU lands in the convexity zone', () => {
  const { container } = render(<StuScatter />)
  const text = container.textContent ?? ''
  expect(text).toContain('12.4')
  expect(text).toContain('274')
  expect(text).toContain('multiplicative')
})

test('CropCalendar and WarrantLifecycle render their content', () => {
  const cal = render(<CropCalendar />)
  expect(cal.container.textContent).toContain('Vietnam')
  expect(cal.container.textContent).toContain('harvest')
  const wl = render(<WarrantLifecycle />)
  expect(wl.container.textContent).toContain('Warrant')
  expect(wl.container.textContent).toContain('fungible')
})

test('TradeWorkflow: one trade travels through all four departments in order', () => {
  const { container } = render(<TradeWorkflow />)
  // The swimlanes
  ;['FRONT OFFICE', 'MIDDLE OFFICE', 'BACK OFFICE', 'TREASURY', 'BROKER / EXCHANGE'].forEach(l =>
    expect(container.textContent).toContain(l))
  // Step 1: the deal is done at the word, on the front-office lane
  expect(container.textContent).toContain('Deal done')
  expect(container.textContent).toContain('step 1/7')
  // Walk to deal capture (step 3): middle office + limits
  fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
  expect(container.textContent).toContain('Deal capture & limits')
  expect(container.textContent).toContain('unbooked trade is invisible risk')
  // Jump to treasury (step 5): margin & financing
  fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
  expect(container.textContent).toContain('Margin & financing')
  // …and to the end: the P&L report, with the controls takeaway
  fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
  expect(container.textContent).toContain('P&L & position report')
  expect(screen.getByRole('button', { name: 'Next →' })).toBeDisabled()
})

test('PhysicalFlow: goods forward, documents forward, money back — with owners', () => {
  const { container } = render(<PhysicalFlow />)
  // The four parties, supplier to customer
  ;['SUPPLIER', 'TRADING HOUSE', 'WAREHOUSE', 'CUSTOMER'].forEach(n =>
    expect(container.textContent).toContain(n))
  expect(container.textContent).toContain('Dak Lak')
  expect(container.textContent).toContain('Roaster · Hamburg')
  // The three flows with their cargo
  expect(container.textContent).toContain('container · vessel HCM → Antwerp')
  expect(container.textContent).toContain('B/L · quality & phyto certificates')
  expect(container.textContent).toContain('against documents (LC or CAD)')
  // Focusing a flow names the office that owns it
  fireEvent.click(screen.getByRole('button', { name: 'Show cash flow' }))
  expect(container.textContent).toContain('moved by TREASURY')
  fireEvent.click(screen.getByRole('button', { name: 'Show docs flow' }))
  expect(container.textContent).toContain('the paper IS the trade')
})
