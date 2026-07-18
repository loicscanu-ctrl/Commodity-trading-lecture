'use client'

import { useState, useRef, useEffect } from 'react'

// Two PTBF trades on Robusta, now with real desk constraints:
//  Exporter (4 steps): buy local VND (outright, choose the VOLUME in tonnes)
//    → sell futures (choose the hedge in LOTS of 10 t) → sell FOB in
//    CONTAINERS of 19.2 t (diff) → fix (buy futures).
//  Importer (5 steps): buy FOB (diff only — unpriced, choose tonnes) →
//    buy freight → fix before export (sell futures in lots) → sell spot
//    outright in EUR by the container → buy futures (locks the selling diff).
// Every input is typeable and LOCKS when the action that consumes it
// executes. In live mode a WORKING-CAPITAL LINE caps how much physical can
// be owned at once: capital only frees when the parcel delivers (next round).
const FX = 25500        // VND per USD
const EURUSD = 1.20     // USD per EUR (fixed)
const CIF_INSTORE = 100 // $/t CIF → instore
const TENDER_FRICTION = 95 // $/t grading, docs & warehousing to turn FOB coffee into a warrant
// Tenderable parity FLOATS with freight: delivering to the exchange means
// shipping to a licensed European warehouse first — dearer freight pushes
// the FOB floor lower.
const tenderableParity = (fr: number) => -(fr + CIF_INSTORE + TENDER_FRICTION)
const LOT_T = 10        // tonnes per futures lot
const CONTAINER_T = 19.2 // tonnes per container
const DEFAULT_VOL = 96  // 96 t = exactly 5 containers (and 9.6 lots — never round!)
const CAPITAL_START = 4_000_000 // $ starting capital (live mode) — realized P&L adds to / subtracts from it as trades settle
const SETTLE_SECONDS = 30    // a trade takes 30 s to execute & settle: capital stays locked that long after the sale
const FIN_RATE = 0.08        // 8% p.a. financing on drawn capital (intermediate level)
const AUTO_FIX_SECONDS = 10  // intermediate: once the diff is sold (business BOOKED), the futures must be squared within 10 s…
const AUTO_FIX_PENALTY = 20_000 // …or the desk auto-fixes at market and charges this penalty
const MARGIN_PER_LOT = 6_000 // $ INITIAL margin per net futures lot (≈ ICE Robusta at these levels), posted from capital; adverse moves draw VARIATION margin on top
const ROLL_MONTHS = 2 // an expiry every two calendar months: open futures ROLL at the calendar spread — the roll P&L is part of the trade P&L

type Mode = 'exporter' | 'importer'
type Side = 'buy' | 'sell'
type Deal = {
  vnd?: number; buy?: number          // exporter step 1
  dBuy?: number                        // importer step 1
  freight?: number                     // importer step 2
  fHedge?: number                      // futures sold (exporter step 2 / importer step 3)
  sell?: number                        // exporter step 3: FOB diff · importer step 4: sale in USD
  eur?: number                         // importer step 4: sale in EUR
  fFix?: number                        // futures bought back (final step)
  vol?: number                         // total tonnes bought (clips accumulate; prices are weighted averages)
  lots?: number                        // total futures lots hedged
  boxes?: number                       // total containers sold
  fixedLots?: number                   // total lots bought back (fix clips)
  draw?: number                        // $ of working capital this trade draws (live)
  order?: number[]                     // action numbers in execution order (free order on intermediate)
  clipPx?: number[]                    // each execution's own clip price (for the scaling readout)
  clipQty?: number[]                   // each execution's own clip quantity (t / lots / boxes — for the book table)
  penalty?: number                     // $ auto-fix penalty (intermediate: futures not squared in time)
  cut?: number                         // lots force-closed by the exchange on a margin call
  roll?: number                        // $ roll P&L accumulated at each 2-month expiry (spread × net position)
  fin?: number                         // $ financing accrued EVERY SECOND on locked capital (intermediate, 8% p.a.)
  stamps?: number[]                    // live mode: the round (T0..) each action executed in
  stampTimes?: number[]                // live mode: the exact second each action executed at
  futMarks?: number[]                  // London futures level at each executed action (for the price graph)
  diffMarks?: number[]                 // FOB differential at each executed action (second graph panel)
}

// Live-market mode: a predetermined multi-season path, identical for every
// student. The CLOCK runs at a constant speed — 3 days per second, one month
// every 10 seconds — and each news event fires when the calendar reaches its
// date, so rounds have very different real-time lengths (Y2 Sep→Oct is 10 s;
// Y2 Oct→Y3 Dec is 140 s). After each news the market DRIFTS toward the
// published level tick by tick, reaching it within at most 35 s (or by
// the next news for short rounds) and holding, so the printed level is
// always tradeable before the next event.
const TICK_SECONDS = 1 // the market ticks EVERY SECOND — a real sense of motion
const DRIFT_TICKS_MAX = 35 // the drift completes in at most 35 ticks (35 s)
const LIVE_SCRIPT = [
  { label: 'Y1 Apr', headline: 'Full warehouses', vnd: 119000, fut: 4800, fob: -120, freight: 70, eur: 4090, spread: -25,
    news: 'A broker reports an unseasonal increase of Vietnam coffee stocks at origin — warehouses almost full. Bearish Vietnam FOB differentials.' },
  { label: 'Y1 Jul', headline: 'Demand fading', vnd: 114000, fut: 4650, fob: -180, freight: 70, eur: 3980, spread: -35,
    news: 'Warehouses at origin confirmed well filled. A contact at Starbucks reports consumption shifting from coffee towards iced tea and matcha.' },
  { label: 'Y1 Nov', headline: 'Logistics crisis', vnd: 113000, fut: 4950, fob: -465, freight: 270, eur: 4290, spread: 40,
    news: 'Harvest just starting — and Bab-el-Mandeb is CLOSED. Freight quotes +$200/t with a lack of vessels. Bullish London, bearish differential.' },
  { label: 'Y2 Jan', headline: 'Tet holiday', vnd: 121000, fut: 5000, fob: -250, freight: 180, eur: 4230, spread: 20,
    news: 'Tet: farmers withhold coffee for the holiday and internal logistics pause — local prices firm while vessels slowly return after Bab-el-Mandeb.' },
  { label: 'Y2 Mar', headline: 'Drought risk', vnd: 138500, fut: 5400, fob: 250, freight: 150, eur: 4620, spread: 60,
    news: 'Good crop in the barn — but a drought is hitting the NEXT crop: a broker estimates −10%. Bullish London and bullish Vietnam diffs, Vietnam outpacing the screen.' },
  { label: 'Y2 Sep', headline: 'HCM stocks down', vnd: 144500, fut: 5600, fob: 500, freight: 140, eur: 4800, spread: 90,
    news: 'HCM warehouses emptier than normal. High prices push farmers to cut avocado trees and plant coffee — an agronomist estimates +5% area (yields in two years). Diffs still bullish for now.' },
  { label: 'Y2 Oct', headline: 'Freight collapse', vnd: 142000, fut: 5450, fob: 700, freight: 45, eur: 4690, spread: 70,
    news: 'Logistics normalising — historically low freight. Bearish London/spot, bullish FOB differentials.' },
  { label: 'Y3 Mar', headline: 'EUDR scramble', vnd: 136000, fut: 5350, fob: 550, freight: 50, eur: 5170, spread: 50,
    news: 'EUDR enforcement wave: EU importers scramble for deforestation-compliant coffee. Antwerp premiums jump — compliant Vietnamese parcels bid up.' },
  { label: 'Y3 Jul', headline: 'London squeeze!', vnd: 143000, fut: 5650, fob: 350, freight: 55, eur: 5170, spread: 150,
    news: 'A trade house stands for delivery on London: certified stocks cornered, the front month spikes. Bullish screen — differentials compress as paper outruns physical.' },
  { label: 'Y3 Dec', headline: 'Farmers selling', vnd: 133500, fut: 5300, fob: 150, freight: 50, eur: 4470, spread: 30,
    news: 'Harvested crop estimated −10% vs Y2 — but an agronomist shows fertilizer inflows (afforded thanks to high prices) boosting yields +3%. Origin stocks still low; farmers sell hard ahead of a record next crop. Bearish differential.' },
  { label: 'Y4 Mar', headline: 'Typhoon hits!', vnd: 128000, fut: 5380, fob: -80, freight: 190, eur: 4700, spread: 45,
    news: 'A typhoon closes Central Highlands roads and suspends HCM loading for two weeks. Freight jumps; FOB sellers who cannot load dump their differentials.' },
  { label: 'Y4 Aug', headline: 'Record crop!', vnd: 111500, fut: 4700, fob: -250, freight: 55, eur: 4000, spread: -20,
    news: 'A broker publishes a RECORD crop estimate: +20%! Bearish London and further bearish differentials.' },
  { label: 'Y4 Oct', headline: 'Roasters waiting', vnd: 115000, fut: 4750, fob: -230, freight: 50, eur: 3930, spread: -30,
    news: 'European roasters run stocks down, waiting for the record crop to land. Differentials drift toward tenderable parity — the exchange floor beckons.' },
  { label: 'Y4 Dec', headline: 'Harvest delayed', vnd: 127000, fut: 4850, fob: 300, freight: 60, eur: 4180, spread: 15,
    news: 'La Niña brings heavy rain and postpones the harvest to January. Flash hike of local FOB differentials — exporters scramble for spot coffee.' },
  { label: 'Y5 Jan', headline: 'Harvest in', vnd: 114000, fut: 4600, fob: -100, freight: 60, eur: 3950, spread: -25,
    news: 'The harvest is happening. Final round — complete your remaining actions.' },
]

// The rounds are NOT evenly spaced in calendar time. Month index of each
// round from Y1 Apr = 0 — the news fires when the calendar reaches its date.
const ROUND_MONTHS = [0, 3, 7, 9, 11, 17, 18, 23, 27, 32, 35, 40, 42, 44, 45]
const TOTAL_MONTHS = ROUND_MONTHS[ROUND_MONTHS.length - 1]
const SECONDS_PER_MONTH = 20 // the clock: 1.5 days per second — time to read, think, execute
const ROUND_STARTS = ROUND_MONTHS.map(m => m * SECONDS_PER_MONTH)
const SESSION_SECONDS = TOTAL_MONTHS * SECONDS_PER_MONTH // 450 s of live market

// Which round (news regime) the market is in at second t
function roundAt(t: number): number {
  let r = 0
  for (let i = 0; i < ROUND_STARTS.length; i++) if (t >= ROUND_STARTS[i]) r = i
  return r
}
// Drift window of round r: at most 8 ticks, less if the next news is sooner
function ticksToTarget(r: number): number {
  const len = r < ROUND_STARTS.length - 1 ? ROUND_STARTS[r + 1] - ROUND_STARTS[r] : Infinity
  return Math.max(1, Math.min(DRIFT_TICKS_MAX, len / TICK_SECONDS - 1))
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// Calendar label of month index m (m = 0 is Y1 Apr)
const monthLabel = (m: number) => { const abs = 3 + m; return `Y${1 + Math.floor(abs / 12)} ${MONTH_NAMES[abs % 12]}` }

// Session second → calendar month position: LINEAR, one month per 10 s
const calAt = (t: number) => Math.min(t, SESSION_SECONDS) / SECONDS_PER_MONTH

// Deterministic per-tick noise in [-1, 1] — identical for every student.
function noise01(k: number): number {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453
  return 2 * (x - Math.floor(x)) - 1
}

// Deterministic live value at second t: the round-to-round drift plus a
// little brownian wiggle. The wiggle fades to zero at the drift's ends
// (scale 4f(1−f)), so each round STARTS at the previous level and the
// published level is exactly tradeable once the drift completes.
function liveValueAt(t: number, get: (r: (typeof LIVE_SCRIPT)[number]) => number, snap: number, seed = 0, amp = 0, holdAmp = 0): number {
  const r = roundAt(t)
  const prev = get(LIVE_SCRIPT[Math.max(0, r - 1)])
  const target = get(LIVE_SCRIPT[r])
  const f = Math.min(1, Math.floor(Math.max(0, t - ROUND_STARTS[r]) / TICK_SECONDS) / ticksToTarget(r))
  const tick = Math.floor(Math.max(0, t) / TICK_SECONDS)
  // Drift wiggle fades at the ends; holdAmp keeps a residual brownian breath
  // AFTER the target is reached (used for the differential — a quoted, not
  // printed, market never sits perfectly still).
  const scale = amp * 4 * f * (1 - f) + (f >= 1 ? holdAmp : 0)
  const wiggle = scale * noise01(tick * 7.13 + seed)
  return Math.round((prev + (target - prev) * f + wiggle) / snap) * snap
}

// The whole market derives from time through this table — the graph redraws
// history with the exact function the live feed uses.
const FEED = {
  vnd:     { get: (r: (typeof LIVE_SCRIPT)[number]) => r.vnd,     snap: 100, seed: 11, amp: 1800, holdAmp: 0 },
  fut:     { get: (r: (typeof LIVE_SCRIPT)[number]) => r.fut,     snap: 5,   seed: 23, amp: 65,   holdAmp: 0 },
  fob:     { get: (r: (typeof LIVE_SCRIPT)[number]) => r.fob,     snap: 1,   seed: 37, amp: 45,   holdAmp: 30 },
  freight: { get: (r: (typeof LIVE_SCRIPT)[number]) => r.freight, snap: 1,   seed: 41, amp: 8,    holdAmp: 0 },
  eur:     { get: (r: (typeof LIVE_SCRIPT)[number]) => r.eur,     snap: 5,   seed: 53, amp: 60,   holdAmp: 0 },
  spread:  { get: (r: (typeof LIVE_SCRIPT)[number]) => r.spread,  snap: 1,   seed: 61, amp: 8,    holdAmp: 5 },
} as const
export const feedAt = (t: number, key: keyof typeof FEED) =>
  liveValueAt(t, FEED[key].get, FEED[key].snap, FEED[key].seed, FEED[key].amp, FEED[key].holdAmp)

const fmtUsd = (n: number, dp = 0) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
const fmtEur = (n: number) => '€' + Math.abs(n).toLocaleString('en-US')
const sgn = (n: number, dp = 0) => (n < 0 ? '−' : '+') + fmtUsd(n, dp)
const dfmt = (n: number, dp = 0) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`

export type TradeRecord = {
  mode: Mode
  tonnes: number      // physical volume bought
  soldT: number       // tonnes actually shipped (containers × 19.2)
  lots: number        // futures lots hedged
  boxes: number       // containers shipped
  deal: Deal
  physicalD: number   // $ absolute
  futuresD: number    // $ absolute
  costsD: number      // $ absolute
  financingD: number  // $ absolute (intermediate level: 8% p.a. on drawn capital)
  penaltyD: number    // $ absolute auto-fix penalty
  rollD: number       // $ roll P&L (calendar spread applied to open futures every 2 months)
  netD: number        // $ absolute
}

const stampLabel = (deal: Deal, i: number) => (i >= 0 && deal.stamps?.[i] !== undefined ? ` · ${LIVE_SCRIPT[deal.stamps[i]].label}` : '')
// Stamp of an ACTION number, mapped through the execution order (free-order levels)
const stampOfAction = (deal: Deal, n: number) => stampLabel(deal, deal.order ? deal.order.indexOf(n) : n - 1)

/** Plain-text session report: every trade with its volumes, executions, stamps and P&L. */
export function buildTradeReport(history: TradeRecord[], trader?: string): string {
  const L: string[] = []
  L.push('PTBF TRADE REPORT')
  if (trader) L.push(`Trader: ${trader}`)
  L.push(`Generated: ${new Date().toISOString()}`)
  L.push('')
  history.forEach((t, n) => {
    const d = t.deal
    L.push(`Trade ${n + 1} — ${t.mode === 'exporter' ? 'Exporter (buy VND → sell FOB)' : 'Importer (buy FOB → sell spot EUR)'} · ${t.tonnes} t bought · ${t.lots} lots hedged (${t.lots * LOT_T} t) · ${t.boxes} containers shipped (${t.soldT.toFixed(1)} t)`)
    if (t.mode === 'exporter') {
      const dBuy = d.buy! - d.fHedge!
      L.push(`  1. Buy physical: ${d.vnd?.toLocaleString('en-US')} VND/kg = ${fmtUsd(d.buy!, 1)}/t × ${t.tonnes} t${stampOfAction(d, 1)}`)
      L.push(`  2. Sell futures (hedge): ${fmtUsd(d.fHedge!)} × ${t.lots} lots → buying diff ${dfmt(dBuy, 1)}${stampOfAction(d, 2)}`)
      L.push(`  3. Sell physical FOB: London ${dfmt(d.sell!)} × ${t.boxes} containers${stampOfAction(d, 3)}`)
      L.push(`  4. Fix (buy futures): ${fmtUsd(d.fFix!)} → invoice ${fmtUsd(d.fFix! + d.sell!)}/t${stampOfAction(d, 4)}`)
      if (d.stamps) {
        const i1 = d.order ? d.order.indexOf(1) : 0, i2 = d.order ? d.order.indexOf(2) : 1
        L.push(`  Rounds unhedged (flat risk): ${Math.abs(d.stamps[i2] - d.stamps[i1])}`)
      }
    } else {
      L.push(`  1. Buy physical FOB: London ${dfmt(d.dBuy!)} (PTBF) × ${t.tonnes} t${stampOfAction(d, 1)}`)
      L.push(`  2. Buy freight: $${d.freight}/t + $${CIF_INSTORE} instore${stampOfAction(d, 2)}`)
      L.push(`  3. Fix before export (sell futures): ${fmtUsd(d.fHedge!)} × ${t.lots} lots → purchase ${fmtUsd(d.fHedge! + d.dBuy!)}/t${stampOfAction(d, 3)}`)
      L.push(`  4. Sell spot outright: ${fmtEur(d.eur!)}/t × ${EURUSD.toFixed(2)} = ${fmtUsd(d.sell!)}/t × ${t.boxes} containers${stampOfAction(d, 4)}`)
      L.push(`  5. Buy futures: ${fmtUsd(d.fFix!)} → selling diff ${dfmt(d.sell! - d.fFix!)}${stampOfAction(d, 5)}`)
      if (d.stamps) {
        const i4 = d.order ? d.order.indexOf(4) : 3, i5 = d.order ? d.order.indexOf(5) : 4
        L.push(`  Rounds with naked short (flat risk): ${Math.abs(d.stamps[i5] - d.stamps[i4])}`)
      }
    }
    // Scaling discipline: for any leg worked in several clips, show the first
    // clip vs the achieved average — did the trader improve their price?
    if (d.order && d.clipPx) {
      const clipsOf = (n: number) => d.order!.filter(o => o === n).length
      const firstPx = (n: number) => d.clipPx![d.order!.indexOf(n)]
      const legs: [number, string, (v: number) => string, number | undefined][] = t.mode === 'exporter'
        ? [[1, 'physical buy', v => fmtUsd(v, 1) + '/t', d.buy], [2, 'hedge', v => fmtUsd(v), d.fHedge], [3, 'FOB sale (diff)', v => dfmt(v), d.sell], [4, 'fix', v => fmtUsd(v), d.fFix]]
        : [[1, 'FOB buy (diff)', v => dfmt(v), d.dBuy], [3, 'hedge', v => fmtUsd(v), d.fHedge], [4, 'spot sale', v => fmtUsd(v), d.sell], [5, 'buy-back', v => fmtUsd(v), d.fFix]]
      legs.forEach(([n, name, f, avg]) => {
        const c = clipsOf(n)
        if (c > 1 && avg !== undefined) L.push(`  Scaling — ${name}: ${c} clips · first ${f(firstPx(n))} → avg ${f(avg)}`)
      })
    }
    if ((d.cut ?? 0) > 0) L.push(`  MARGIN CALL: the exchange cut ${d.cut} lot${d.cut === 1 ? '' : 's'} at market (capital below maintenance margin)`)
    L.push(`  Physical P&L: ${sgn(t.physicalD)} · Futures P&L: ${sgn(t.futuresD)}${t.costsD !== 0 ? ` · Costs: ${sgn(t.costsD)}` : ''}${t.financingD !== 0 ? ` · Financing (8% p.a.): ${sgn(t.financingD)}` : ''}${t.penaltyD > 0 ? ` · AUTO-FIX PENALTY: −${fmtUsd(t.penaltyD)}` : ''}${t.rollD !== 0 ? ` · Roll P&L (2-monthly expiries): ${sgn(t.rollD)}` : ''}`)
    L.push(`  NET: ${sgn(t.netD)} (${sgn(t.netD / t.tonnes, 1)}/t on ${t.tonnes} t)`)
    L.push('')
  })
  const total = history.reduce((s, t) => s + t.netD, 0)
  L.push(`SESSION TOTAL (${history.length} trade${history.length === 1 ? '' : 's'}): ${sgn(total)}`)
  return L.join('\n')
}

// ── Minimal dependency-free PDF (Courier, US Letter) ──
const pdfSanitize = (s: string) =>
  s.replace(/[−–—]/g, '-').replace(/·/g, '-').replace(/→/g, '->').replace(/€/g, 'EUR ')
    .replace(/≈/g, '~').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/×/g, 'x')
    .replace(/[^\x20-\x7e]/g, '')
const pdfEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

export function buildPdfString(text: string): string {
  const lines = text.split('\n').map(l => pdfEscape(pdfSanitize(l)))
  const pages: string[][] = []
  for (let i = 0; i < Math.max(1, lines.length); i += 60) pages.push(lines.slice(i, i + 60))
  const objs: string[] = []
  const kids = pages.map((_, k) => `${4 + k * 2} 0 R`).join(' ')
  objs.push('<< /Type /Catalog /Pages 2 0 R >>')
  objs.push(`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`)
  objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>')
  pages.forEach((pl, k) => {
    objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + k * 2} 0 R >>`)
    const content = `BT /F1 9 Tf 11 TL 40 752 Td ${pl.map((l, i) => `${i === 0 ? '' : 'T* '}(${l}) Tj`).join(' ')} ET`
    objs.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
  })
  let out = '%PDF-1.4\n'
  const offsets: number[] = []
  objs.forEach((o, i) => { offsets.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const xrefPos = out.length
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
  offsets.forEach(off => { out += `${String(off).padStart(10, '0')} 00000 n \n` })
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`
  return out
}

export function buildPdfBlob(text: string): Blob {
  return new Blob([buildPdfString(text)], { type: 'application/pdf' })
}

function Field({ label, value, min, max, step, onChange, locked, lockedAt, live }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; locked: boolean; lockedAt?: string; live?: boolean
}) {
  const [draft, setDraft] = useState<string | null>(null)
  if (live && !locked) {
    // Live-market feed: read-only, identical for everyone.
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-brand-cyan/20 bg-brand-cyan/[0.04] px-2.5 py-1.5">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        <span className="font-mono text-xs font-bold tabular-nums text-white">
          {value.toLocaleString('en-US')} <span className="ml-1 rounded bg-brand-cyan/20 px-1 text-[9px] font-bold text-brand-cyan">LIVE</span>
        </span>
      </div>
    )
  }
  return (
    <div className={locked ? 'opacity-70' : ''}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        {locked ? (
          <span className="chip !py-0.5 border-amber-500/40 bg-amber-500/10 font-mono text-[10px] text-amber-300">locked {lockedAt}</span>
        ) : (
          <input
            type="number" value={draft ?? String(value)} step={step}
            onChange={e => {
              setDraft(e.target.value)
              const v = parseFloat(e.target.value)
              if (Number.isFinite(v)) onChange(v) // no clamping — type any value
            }}
            onBlur={() => setDraft(null)}
            aria-label={label}
            className="w-28 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-right font-mono text-xs tabular-nums text-white outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} disabled={locked}
        onChange={e => { setDraft(null); onChange(parseFloat(e.target.value)) }}
        className={`w-full h-1.5 ${locked ? 'cursor-not-allowed accent-slate-600' : 'cursor-pointer accent-brand-blue'}`} />
    </div>
  )
}

function RiskSquare({ label, on, active }: { label: string; on: boolean; active: boolean }) {
  return (
    <div
      data-testid={`risk-${label.toLowerCase()}`}
      title={`${label} price risk is ${on ? 'OPEN' : active ? 'covered' : 'not present'}`}
      className={`flex w-16 flex-col items-center rounded-lg border px-2 py-1 font-mono text-[10px] leading-tight ${
        on
          ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
          : active
            ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400'
            : 'border-white/10 bg-white/[0.02] text-slate-500'
      }`}
    >
      <span className="font-bold tracking-wide">{label}</span>
      <span>{on ? 'AT RISK' : active ? 'covered' : '—'}</span>
    </div>
  )
}

// Which curve each action pins its dot on, and on which side:
//  Exporter: A1 buys PHYSICAL outright (dot on the white outright line) ·
//  A2 sells futures AND thereby buys the differential · A3 sells the diff ·
//  A4 buys futures back.
//  Importer: A1 buys the diff · A2 freight (no curve) · A3 sells futures,
//  pricing the purchase outright · A4 sells physical outright · A5 buys
//  futures back, locking (selling) the diff.
type DotSpec = { fut?: Side; diff?: Side; out?: Side }
const EXP_DOTS: DotSpec[] = [{ out: 'buy' }, { fut: 'sell', diff: 'buy' }, { diff: 'sell' }, { fut: 'buy' }]
const IMP_DOTS: DotSpec[] = [{ diff: 'buy' }, {}, { fut: 'sell', out: 'buy' }, { out: 'sell' }, { fut: 'buy', diff: 'sell' }]
const EXP_SIDES: readonly Side[] = ['buy', 'sell', 'sell', 'buy']
const IMP_SIDES: readonly Side[] = ['buy', 'buy', 'sell', 'sell', 'buy']

// A dot kept on the graph after its trade is recorded — the session's visual history.
export type Pin = { t: number; panel: 'fut' | 'diff' | 'out'; side: Side; value: number }

// London-futures price graph, margin-simulator style. Live mode: the x-axis
// is CALENDAR TIME (months between rounds are realistic, not equal), the
// ticker crawls right every second, executed actions pin green (buy) /
// red (sell) dots on the curve they touched, and pins from past trades stay.
function PriceGraph({ marks, liveFut, diffMarks, liveDiff, liveParity, calSpread, lastStep, hedgeIdx, fixIdx, complete, dots, sides, order, stamps, stampTimes, liveLabel, elapsed, pins }: {
  marks: number[]; liveFut: number; diffMarks: number[]; liveDiff: number; liveParity: number; calSpread: number; lastStep: number; hedgeIdx: number; fixIdx: number; complete: boolean
  dots: DotSpec[]; sides: readonly Side[]; order?: number[]; stamps?: number[]; stampTimes?: number[]; liveLabel: string
  elapsed?: number; pins: Pin[]
}) {
  // Which ACTION the i-th execution was (free order on the intermediate level)
  const actionOf = (i: number) => order?.[i] ?? i + 1
  const W = 560, H = 320, ml = 56, mr = 16, mt = 12
  const pw = W - ml - mr, ph = 158 - mt // futures panel height
  const PMINg = 3500, PMAXg = 6000
  const y = (p: number) => mt + (1 - (p - PMINg) / (PMAXg - PMINg)) * ph
  // Second panel: the FOB differential — the risk the desk actually trades
  const D = { top: 196, h: 92, min: -580, max: 760 }
  const clampD = (v: number) => Math.min(D.max, Math.max(D.min, v))
  const yd = (v: number) => D.top + (1 - (clampD(v) - D.min) / (D.max - D.min)) * D.h

  // ── Two x-axes ──
  // Live: CALENDAR months (uneven round spacing), ticker advancing every 5 s.
  // Manual: one slot per action (T1…).
  const isTime = elapsed !== undefined
  const tickNow = isTime ? Math.min(SESSION_SECONDS, Math.floor(elapsed! / TICK_SECONDS) * TICK_SECONDS) : 0
  const xT = (t: number) => ml + (calAt(t) / TOTAL_MONTHS) * pw
  const xM = (m: number) => ml + (m / TOTAL_MONTHS) * pw
  // Manual mode: one slot per EXECUTION — clips can outgrow the nominal step count
  const slots = Math.max(lastStep, marks.length + (complete ? 0 : 1))
  const xStep = (step: number) => ml + ((step - 1) / Math.max(1, slots - 1)) * pw
  const xa = (i: number) => (isTime ? xT(stampTimes?.[i] ?? 0) : xStep(i + 1))
  const nextStep = marks.length + 1
  const xLive = isTime ? xT(tickNow) : xStep(nextStep)

  // Live mode: reconstruct the whole tick-by-tick history (deterministic)
  const times: number[] = isTime ? Array.from({ length: tickNow / TICK_SECONDS + 1 }, (_, k) => k * TICK_SECONDS) : []
  const futSeries = times.map(t => feedAt(t, 'fut'))
  const diffSeries = times.map(t => feedAt(t, 'fob'))
  const seriesPath = (vals: number[], yf: (v: number) => number) =>
    vals.map((v, k) => `${k === 0 ? 'M' : 'L'}${xT(times[k]).toFixed(1)},${yf(v).toFixed(1)}`).join(' ')

  const path = isTime ? seriesPath(futSeries, y) : marks.map((v, i) => `${i === 0 ? 'M' : 'L'}${xStep(i + 1).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const diffPath = isTime ? seriesPath(diffSeries, yd) : diffMarks.map((v, i) => `${i === 0 ? 'M' : 'L'}${xStep(i + 1).toFixed(1)},${yd(v).toFixed(1)}`).join(' ')

  const hedge = hedgeIdx > 0 ? marks[hedgeIdx - 1] : undefined
  const fix = complete && fixIdx > 0 ? marks[fixIdx - 1] : undefined
  const futPnlT = hedge !== undefined && fix !== undefined ? hedge - fix : null

  const hex = (s: Side) => (s === 'buy' ? '#34d399' : '#f43f5e')
  // Time label of each executed action: live-round stamp, or T1/T2… by hand
  const timeLabel = (i: number) => (stamps?.[i] !== undefined ? LIVE_SCRIPT[stamps[i]].label : `T${i + 1}`)
  // The flat outright = futures + differential, along the series (live) or the actions (manual)
  const outright = marks.map((v, i) => v + (diffMarks[i] ?? 0))
  const outrightSeries = futSeries.map((v, k) => v + diffSeries[k])
  const outrightPath = isTime
    ? seriesPath(outrightSeries, y)
    : outright.map((v, i) => `${i === 0 ? 'M' : 'L'}${xStep(i + 1).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const liveOutright = liveFut + liveDiff
  const showOutright = isTime ? times.length > 1 : marks.length > 0
  const pinY = (p: Pin) => (p.panel === 'diff' ? yd(p.value) : y(p.value))

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="eyebrow">London futures — the price path of your trade</div>
          {isTime && (
            <span className="rounded-full border border-brand-cyan/50 bg-brand-cyan/15 px-3 py-0.5 font-mono text-sm font-bold tabular-nums text-cyan-100">
              {monthLabel(Math.floor(calAt(elapsed!)))}
            </span>
          )}
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold tabular-nums ${
              calSpread > 0 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/[0.06] text-rose-300'
            }`}
            title="Front-to-second-month calendar spread. + = INVERTED: rolling a LONG earns the spread, a short pays it · − = CONTANGO: rolling a short earns the carry, a long pays it. Open positions roll automatically every 2 months — straight into your P&L."
          >
            cal spread {dfmt(calSpread)} · {calSpread > 0 ? 'INVERTED' : 'CONTANGO'}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> buy</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> sell</span>
          <span className="flex items-center gap-1"><span className="inline-block w-4 border-t border-dotted border-slate-200" /> outright (fut + diff)</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '360px' }}>
        {[4000, 4500, 5000, 5500].map(p => (
          <g key={p}>
            <line x1={ml} y1={y(p)} x2={ml + pw} y2={y(p)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={ml - 6} y={y(p) + 3} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">{p.toLocaleString()}</text>
          </g>
        ))}

        {/* X axis: a REGULAR calendar (live) or T1/T2… (manual). News events
            only appear on the axis once the market has reached them. */}
        {isTime ? (
          <g>
            {/* month ticks, quarterly labels, faint year lines */}
            {Array.from({ length: TOTAL_MONTHS + 1 }, (_, m) => m).map(m => {
              const bx = xM(m)
              const isYear = (3 + m) % 12 === 0
              const labelled = m % 3 === 0
              return (
                <g key={`mo-${m}`}>
                  {isYear && <line x1={bx} y1={mt} x2={bx} y2={D.top + D.h} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />}
                  <line x1={bx} y1={D.top + D.h} x2={bx} y2={D.top + D.h + (labelled ? 5 : 3)} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                  {labelled && (
                    <text x={bx + 2} y={H - 8} textAnchor="start" fill="#64748b" fontSize="7.5" fontFamily="monospace"
                      transform={`rotate(-33 ${bx + 2} ${H - 8})`}>
                      {monthLabel(m)}
                    </text>
                  )}
                </g>
              )
            })}
            {/* news flags — revealed only once the market reaches them */}
            {LIVE_SCRIPT.map((r, ri) => {
              if (ROUND_STARTS[ri] > elapsed!) return null
              const bx = xM(ROUND_MONTHS[ri])
              const fy2 = mt + 2 + (ri % 2) * 10
              return (
                <g key={`news-${r.label}`}>
                  <line x1={bx} y1={fy2} x2={bx} y2={fy2 + 7} stroke="#22d3ee" strokeWidth="1.2" opacity="0.8" />
                  <circle cx={bx} cy={fy2} r="2" fill="#22d3ee" opacity="0.9">
                    <title>{`NEWS · ${r.label} — ${r.news}`}</title>
                  </circle>
                  <text x={bx + 3} y={fy2 + 6} fill="#22d3ee" fontSize="6.5" fontFamily="monospace" opacity="0.9">{r.headline}</text>
                </g>
              )
            })}
          </g>
        ) : (
          Array.from({ length: slots }, (_, i) => i + 1).map(stp => (
            <text key={stp} x={xStep(stp)} y={H - 6} textAnchor="middle"
              fill={stp <= marks.length ? '#94a3b8' : stp === nextStep ? '#e2e8f0' : '#475569'} fontSize="9.5" fontFamily="monospace">
              {stp <= marks.length ? timeLabel(stp - 1) : stp === nextStep && !complete ? liveLabel : '·'}
            </text>
          ))
        )}

        {/* Flat outright — dotted white, above the futures path */}
        {showOutright && (
          <path d={outrightPath} fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.75" strokeLinecap="round" />
        )}
        {!isTime && !complete && marks.length > 0 && (
          <line x1={xStep(marks.length)} y1={y(outright[outright.length - 1])} x2={xStep(nextStep)} y2={y(liveOutright)}
            stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 4" opacity="0.45" />
        )}
        {showOutright && (
          <text x={ml + 6} y={y(isTime ? outrightSeries[0] : outright[0]) - 6} fill="#e2e8f0" fontSize="8.5" fontFamily="monospace" opacity="0.8">outright</text>
        )}

        {/* hedge → fix window: the futures leg */}
        {hedge !== undefined && (
          <g>
            <line x1={xa(hedgeIdx - 1)} y1={y(hedge)} x2={complete && fixIdx > 0 ? xa(fixIdx - 1) : Math.max(xLive, xa(hedgeIdx - 1))} y2={y(hedge)}
              stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x={xa(hedgeIdx - 1)} y={y(hedge) - 8} textAnchor="middle" fill="#22d3ee" fontSize="9.5" fontFamily="monospace" fontWeight="bold">hedge</text>
          </g>
        )}
        {futPnlT !== null && (
          <g>
            <line x1={xa(fixIdx - 1)} y1={y(hedge!)} x2={xa(fixIdx - 1)} y2={y(fix!)} stroke={futPnlT >= 0 ? '#34d399' : '#f43f5e'} strokeWidth="1.5" />
            <text x={xa(fixIdx - 1) - 6} y={(y(hedge!) + y(fix!)) / 2 + 3} textAnchor="end"
              fill={futPnlT >= 0 ? '#34d399' : '#f87171'} fontSize="10" fontFamily="monospace" fontWeight="bold">
              futures leg {futPnlT >= 0 ? '+' : '−'}${Math.abs(futPnlT).toLocaleString('en-US')}/t
            </text>
          </g>
        )}

        {/* Price path: live → the tick-by-tick market; manual → the executed marks */}
        {(isTime ? times.length > 1 : marks.length > 0) && (
          <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        )}

        {/* Pins from PAST trades — the session's visual decision history */}
        {isTime && pins.filter(p => p.panel !== 'diff').map((p, k) => (
          <circle key={`pin-${k}`} cx={xT(p.t)} cy={pinY(p)} r="3.5" fill={hex(p.side)} stroke="#070912" strokeWidth="1" opacity="0.5">
            <title>{`past trade · ${p.side} · ${p.panel === 'out' ? 'outright' : 'futures'} ${p.value.toLocaleString('en-US')}`}</title>
          </circle>
        ))}

        {/* Executed actions of the CURRENT trade — dots on the curve each action touched */}
        {marks.map((v, i) => {
          const n = actionOf(i)
          const s = dots[n - 1]
          if (!s) return null
          return (
            <g key={i}>
              {s.fut && (
                <circle cx={xa(i)} cy={y(v)} r="4.5" fill={hex(s.fut)} stroke="#070912" strokeWidth="1.2">
                  <title>{`action ${n} (${sides[n - 1]}) · ${timeLabel(i)} · $${v.toLocaleString('en-US')}`}</title>
                </circle>
              )}
              {s.out && (
                <circle cx={xa(i)} cy={y(v + (diffMarks[i] ?? 0))} r="4.5" fill={hex(s.out)} stroke="#070912" strokeWidth="1.2">
                  <title>{`action ${n} (${sides[n - 1]}) · ${timeLabel(i)} · outright $${(v + (diffMarks[i] ?? 0)).toLocaleString('en-US')}`}</title>
                </circle>
              )}
            </g>
          )
        })}

        {/* Live ticker — crawls right every tick (1 s) */}
        {!complete && (
          <g>
            {!isTime && marks.length > 0 && (
              <line x1={xStep(marks.length)} y1={y(marks[marks.length - 1])} x2={xLive} y2={y(liveFut)}
                stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
            )}
            <circle cx={xLive} cy={y(liveFut)} r="6" fill="#f59e0b" stroke="#070912" strokeWidth="1.5" />
            <circle cx={xLive} cy={y(liveFut)} r="10" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.35" />
            <text x={xLive} y={y(liveFut) - 12} textAnchor={isTime && xLive > ml + pw - 40 ? 'end' : 'middle'} fill="#fbbf24" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
              {liveFut.toLocaleString('en-US')}
            </text>
          </g>
        )}

        {/* ── FOB differential panel — the DIFF tile as a chart ── */}
        <text x={ml} y={D.top - 8} fill="#94a3b8" fontSize="10" fontFamily="monospace">FOB HCM DIFFERENTIAL ($/t vs London)</text>
        {[0, 350, 700].map(v => (
          <g key={`d-${v}`}>
            <line x1={ml} y1={yd(v)} x2={ml + pw} y2={yd(v)}
              stroke={v === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.05)'} strokeWidth="1" strokeDasharray={v === 0 ? '4 3' : undefined} />
            <text x={ml - 6} y={yd(v) + 3} textAnchor="end" fill={v === 0 ? '#94a3b8' : '#64748b'} fontSize="10" fontFamily="monospace">{v === 0 ? '0' : '+' + v}</text>
          </g>
        ))}
        {/* tenderable parity — a MOVING floor: −(freight + instore + tender costs).
            Freight up → parity dives; the diff only "hits the floor" when the
            gap between them closes. */}
        {isTime ? (
          <path d={seriesPath(times.map(t => tenderableParity(feedAt(t, 'freight'))), yd)}
            fill="none" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
        ) : (
          <line x1={ml} y1={yd(liveParity)} x2={ml + pw} y2={yd(liveParity)} stroke="#f43f5e" strokeWidth="1" strokeDasharray="5 4" opacity="0.55" />
        )}
        <text x={isTime ? xLive : ml + pw} y={yd(liveParity) + 11} textAnchor="end" fill="#f43f5e" fontSize="8" fontFamily="monospace" opacity="0.9">
          tenderable parity {liveParity.toLocaleString('en-US')}
        </text>
        {(isTime ? times.length > 1 : diffMarks.length > 0) && (
          <path d={diffPath} fill="none" stroke="#0891b2" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {isTime && pins.filter(p => p.panel === 'diff').map((p, k) => (
          <circle key={`pind-${k}`} cx={xT(p.t)} cy={yd(p.value)} r="3" fill={hex(p.side)} stroke="#070912" strokeWidth="1" opacity="0.5">
            <title>{`past trade · ${p.side} · diff ${dfmt(p.value)}`}</title>
          </circle>
        ))}
        {diffMarks.map((v, i) => {
          const n = actionOf(i)
          const s = dots[n - 1]
          if (!s?.diff) return null
          return (
            <circle key={`dm-${i}`} cx={xa(i)} cy={yd(v)} r="4" fill={hex(s.diff)} stroke="#070912" strokeWidth="1.2">
              <title>{`action ${n} (${sides[n - 1]}) · ${timeLabel(i)} · diff ${v >= 0 ? '+' : '−'}$${Math.abs(v).toLocaleString('en-US')}`}</title>
            </circle>
          )
        })}
        {!complete && (
          <g>
            {!isTime && diffMarks.length > 0 && (
              <line x1={xStep(diffMarks.length)} y1={yd(diffMarks[diffMarks.length - 1])} x2={xLive} y2={yd(liveDiff)}
                stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
            )}
            <circle cx={xLive} cy={yd(liveDiff)} r="5" fill="#f59e0b" stroke="#070912" strokeWidth="1.2" />
            <text x={xLive} y={yd(liveDiff) - 9} textAnchor={isTime && xLive > ml + pw - 40 ? 'end' : 'middle'} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {liveDiff >= 0 ? '+' : '−'}{Math.abs(liveDiff).toLocaleString('en-US')}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

const CHIP_CLS = (s: string) =>
  s === 'No position' ? 'border-white/10 bg-white/[0.03] text-slate-400'
  : s.includes('UNHEDGED') || s.includes('open!') ? 'border-rose-500/40 bg-rose-500/[0.10] text-rose-300'
  : s.includes('FLAT') ? 'border-emerald-500/40 bg-emerald-500/[0.10] text-emerald-300'
  : s.includes('pending') || s.includes('Freight') ? 'border-amber-500/40 bg-amber-500/[0.10] text-amber-300'
  : 'border-brand-cyan/40 bg-brand-cyan/10 text-cyan-200'

export default function PtbfMechanics() {
  const [mode, setMode] = useState<Mode>('exporter')
  // Difficulty: easy = guided fixed order · inter = free order + 8% financing
  const [level, setLevel] = useState<'easy' | 'inter'>('easy')

  // Live market
  const [vnd, setVnd] = useState(120000)     // VND/kg, local HCM
  const [fut, setFut] = useState(4800)       // London — hedge leg, $/t
  const [futFix, setFutFix] = useState(4800) // London — since the hedge, $/t
  const [fobDiff, setFobDiff] = useState(-60)
  const [freight, setFreight] = useState(70)
  const [eurSpot, setEurSpot] = useState(4100) // spot Antwerp, outright €/t
  const [spreadQ, setSpreadQ] = useState(-25)  // calendar spread F1→F2, $/t (+ inverted, − contango)

  // Volumes for the pending trade (lock into the deal at execution)
  const [vol, setVol] = useState(DEFAULT_VOL)         // tonnes of physical
  const [lotsIn, setLotsIn] = useState(Math.round(DEFAULT_VOL / LOT_T))   // hedge, in lots
  const [boxesIn, setBoxesIn] = useState(Math.floor(DEFAULT_VOL / CONTAINER_T)) // sale, in containers
  const [fixLotsIn, setFixLotsIn] = useState(Math.round(DEFAULT_VOL / LOT_T))   // buy-back, in lots

  const [deal, setDeal] = useState<Deal>({})
  const [history, setHistory] = useState<TradeRecord[]>([])
  const [pins, setPins] = useState<Pin[]>([])

  // Trader identity — the report is issued in their name
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // Intermediate: the second at which the business got BOOKED (diff fully sold)
  const [bookedAt, setBookedAt] = useState<number | null>(null)

  // Working capital (live): every trade takes 30 seconds to execute & settle,
  // so a recorded trade keeps its capital locked until freesAt (in seconds) —
  // and its P&L joins the capital base only once it settles.
  const [commitments, setCommitments] = useState<{ amount: number; freesAt: number; pnl: number }[]>([])

  // Live-market mode: the predetermined path plays at one round per minute.
  const [live, setLive] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(0)
  const liveRound = roundAt(elapsed)

  useEffect(() => {
    if (!live) return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [live])

  // While the live session runs, the slide is locked: SectionReader listens
  // and disables all navigation until the session ends (or a page refresh).
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('ptbf-live-lock', { detail: live }))
    return () => { window.dispatchEvent(new CustomEvent('ptbf-live-lock', { detail: false })) }
  }, [live])

  // Feed the market — identical for every student: drift toward each round's
  // published level tick by tick, plus the deterministic wiggle.
  useEffect(() => {
    if (!live) return
    setVnd(feedAt(elapsed, 'vnd'))
    const futNow = feedAt(elapsed, 'fut')
    setFut(futNow); setFutFix(futNow)
    setFobDiff(feedAt(elapsed, 'fob'))
    setFreight(feedAt(elapsed, 'freight'))
    setEurSpot(feedAt(elapsed, 'eur'))
    setSpreadQ(feedAt(elapsed, 'spread'))
  }, [live, elapsed])

  function toggleLive() {
    if (live) { setLive(false); return }
    startRef.current = Date.now()
    setElapsed(0)
    setDeal({})
    setBookedAt(null)
    setPins([])
    setCommitments([])
    setLive(true)
  }

  // ── The BOOK: clip trading — buy and sell little by little. Prices in the
  // deal are running weighted averages; volumes accumulate. ──
  const volT = deal.vol ?? 0
  const lotsH = deal.lots ?? 0
  const lotsX = deal.fixedLots ?? 0
  const boxesS = deal.boxes ?? 0
  const soldT = boxesS * CONTAINER_T
  const outstanding = lotsH - lotsX
  const remainingT = volT - soldT
  const started = (deal.order?.length ?? 0) > 0
  const step = deal.order?.length ?? 0 // executions so far
  const lastStep = mode === 'exporter' ? 4 : 5
  const freightDone = mode === 'exporter' || deal.freight !== undefined
  // The trade squares itself when: physical bought, everything shipped
  // (less than one container left), futures flat, freight booked.
  const complete = volT > 0 && lotsH > 0 && lotsX === lotsH && boxesS > 0 && remainingT < CONTAINER_T && freightDone
  const hedged = lotsH > 0

  // Containers can never ship more than the (planned) physical
  const plannedVol = Math.max(volT, vol)
  const maxBoxesTotal = Math.max(1, Math.floor((plannedVol + 1e-9) / CONTAINER_T))
  const remainingBoxes = Math.max(0, maxBoxesTotal - boxesS)

  const canExec = (n: number) => {
    if (complete) return false
    if (marginBlockedAct(n)) return false
    const hedgeN = mode === 'exporter' ? 2 : 3
    const sellN = mode === 'exporter' ? 3 : 4
    if (n === lastStep) return level === 'easy' ? outstanding > 0 : true // easy: buy-back needs an open short; inter: outright longs allowed — know why
    if (mode === 'importer' && n === 2) return level === 'easy' ? volT > 0 && deal.freight === undefined : deal.freight === undefined
    if (n === sellN && remainingBoxes === 0) return false
    if (level === 'easy') {
      // Guided: each leg unlocks once the previous leg EXISTS — then clips freely
      if (n === hedgeN) return volT > 0
      if (n === sellN) return lotsH > 0
    }
    return true
  }

  const localUsd = (vnd * 1000) / FX
  const eurUsd = eurSpot * EURUSD
  const curFut = hedged ? futFix : fut

  // ── Working capital (live only) ──
  const openCommitments = commitments.filter(c => c.freesAt > elapsed)
  const committedDrawn = openCommitments.reduce((s, c) => s + c.amount, 0)
  // Realized P&L joins the capital base once its trade has settled
  const settledPnl = commitments.filter(c => c.freesAt <= elapsed).reduce((s, c) => s + c.pnl, 0)
  const capitalBase = CAPITAL_START + settledPnl
  // INITIAL margin on the NET futures position is posted from capital —
  // over-hedging is not free — and when the market moves AGAINST the open
  // position, VARIATION margin is drawn on top: the margin call, automated.
  const initialMargin = live ? Math.abs(outstanding) * MARGIN_PER_LOT : 0
  const openAvg = outstanding > 0 ? (deal.fHedge ?? curFut) : (deal.fFix ?? curFut)
  const futMtm = outstanding > 0
    ? (openAvg - curFut) * outstanding * LOT_T
    : outstanding < 0 ? (curFut - openAvg) * -outstanding * LOT_T : 0
  const vmCall = live && outstanding !== 0 ? Math.max(0, -futMtm) : 0
  const marginReq = initialMargin + vmCall
  const drawn = committedDrawn + (deal.draw !== undefined ? deal.draw : 0) + marginReq
  const available = capitalBase - drawn
  // Would action n GROW the net futures position beyond the margin headroom?
  const marginBlockedAct = (n: number): boolean => {
    if (!live) return false
    const hedgeN = mode === 'exporter' ? 2 : 3
    if (n === hedgeN) return (Math.abs(outstanding + lotsIn) - Math.abs(outstanding)) * MARGIN_PER_LOT > available
    if (n === lastStep && level !== 'easy') return (Math.abs(outstanding - fixLotsIn) - Math.abs(outstanding)) * MARGIN_PER_LOT > available
    return false
  }
  const estDraw = (mode === 'exporter' ? localUsd : Math.max(0, curFut + fobDiff)) * vol
  const capitalBlocked = live && estDraw > available
  const nextFreeIn = openCommitments.length > 0 ? Math.max(0, Math.min(...openCommitments.map(c => c.freesAt)) - elapsed) : 0

  function switchMode(m: Mode) { setMode(m); setDeal({}); setBookedAt(null) }

  // Weighted-average accumulator: fold a new clip into a running average
  const wavg = (avg0: number | undefined, qty0: number, px: number, qty: number) =>
    ((avg0 ?? 0) * qty0 + px * qty) / (qty0 + qty)

  function act(n: number) {
    if (!canExec(n)) return
    // Every execution stamps the current futures level (for the price graph),
    // the action number (for free order/clips), and — live — round + second.
    const stamp = (d: Deal, px: number, qty: number): Pick<Deal, 'order' | 'clipPx' | 'clipQty' | 'stamps' | 'stampTimes' | 'futMarks' | 'diffMarks'> => ({
      futMarks: [...(d.futMarks ?? []), curFut],
      diffMarks: [...(d.diffMarks ?? []), fobDiff],
      order: [...(d.order ?? []), n],
      clipPx: [...(d.clipPx ?? []), px],
      clipQty: [...(d.clipQty ?? []), qty],
      ...(live ? { stamps: [...(d.stamps ?? []), liveRound], stampTimes: [...(d.stampTimes ?? []), elapsed] } : {}),
    })
    if (mode === 'exporter') {
      if (n === 1) {
        if (capitalBlocked) return
        setDeal(d => {
          const v0 = d.vol ?? 0
          return { ...d, vnd: Math.round(wavg(d.vnd, v0, vnd, vol)), buy: wavg(d.buy, v0, localUsd, vol),
            vol: v0 + vol, draw: (d.draw ?? 0) + localUsd * vol, ...stamp(d, localUsd, vol) }
        })
      }
      else if (n === 2) { setFutFix(fut); setDeal(d => { const l0 = d.lots ?? 0
        return { ...d, fHedge: wavg(d.fHedge, l0, fut, lotsIn), lots: l0 + lotsIn, ...stamp(d, fut, lotsIn) } }) }
      else if (n === 3) { const clip = Math.min(boxesIn, remainingBoxes); setDeal(d => { const b0 = d.boxes ?? 0
        return { ...d, sell: wavg(d.sell, b0, fobDiff, clip), boxes: b0 + clip, ...stamp(d, fobDiff, clip) } }) }
      else if (n === 4) { const clip = level === 'easy' ? Math.min(fixLotsIn, outstanding) : fixLotsIn; if (clip <= 0) return; setDeal(d => { const x0 = d.fixedLots ?? 0
        return { ...d, fFix: wavg(d.fFix, x0, futFix, clip), fixedLots: x0 + clip, ...stamp(d, futFix, clip) } }) }
    } else {
      if (n === 1) {
        if (capitalBlocked) return
        setDeal(d => {
          const v0 = d.vol ?? 0
          return { ...d, dBuy: wavg(d.dBuy, v0, fobDiff, vol),
            vol: v0 + vol, draw: (d.draw ?? 0) + Math.max(0, curFut + fobDiff) * vol, ...stamp(d, fobDiff, vol) }
        })
      }
      else if (n === 2) setDeal(d => ({ ...d, freight, ...stamp(d, freight, 1) }))
      else if (n === 3) { setFutFix(fut); setDeal(d => { const l0 = d.lots ?? 0
        return { ...d, fHedge: wavg(d.fHedge, l0, fut, lotsIn), lots: l0 + lotsIn, ...stamp(d, fut, lotsIn) } }) }
      else if (n === 4) { const clip = Math.min(boxesIn, remainingBoxes); setDeal(d => { const b0 = d.boxes ?? 0
        return { ...d, eur: Math.round(wavg(d.eur, b0, eurSpot, clip)), sell: wavg(d.sell, b0, eurUsd, clip), boxes: b0 + clip, ...stamp(d, eurUsd, clip) } }) }
      else if (n === 5) { const clip = level === 'easy' ? Math.min(fixLotsIn, outstanding) : fixLotsIn; if (clip <= 0) return; setDeal(d => { const x0 = d.fixedLots ?? 0
        return { ...d, fFix: wavg(d.fFix, x0, futFix, clip), fixedLots: x0 + clip, ...stamp(d, futFix, clip) } }) }
    }
  }

  // ── Expert combos: two actions in ONE click ──
  // Buy G2 spot HCM *diff*: buy the physical AND sell the futures hedge
  // simultaneously — the buying differential locks in a single execution.
  function comboBuyDiff() {
    if (mode !== 'exporter' || complete || capitalBlocked || marginBlockedAct(2)) return
    setFutFix(fut)
    setDeal(d => {
      const v0 = d.vol ?? 0, l0 = d.lots ?? 0
      return {
        ...d,
        vnd: Math.round(wavg(d.vnd, v0, vnd, vol)), buy: wavg(d.buy, v0, localUsd, vol), vol: v0 + vol,
        draw: (d.draw ?? 0) + localUsd * vol,
        fHedge: wavg(d.fHedge, l0, fut, lotsIn), lots: l0 + lotsIn,
        futMarks: [...(d.futMarks ?? []), curFut, fut],
        diffMarks: [...(d.diffMarks ?? []), fobDiff, fobDiff],
        order: [...(d.order ?? []), 1, 2],
        clipPx: [...(d.clipPx ?? []), localUsd, fut],
        clipQty: [...(d.clipQty ?? []), vol, lotsIn],
        ...(live ? { stamps: [...(d.stamps ?? []), liveRound, liveRound], stampTimes: [...(d.stampTimes ?? []), elapsed, elapsed] } : {}),
      }
    })
  }
  // Sell G2 FOB & load immediately: the PTBF sale and its fixing execute together.
  function comboSellFix() {
    if (mode !== 'exporter' || complete) return
    const sClip = Math.min(boxesIn, remainingBoxes)
    const fClip = level === 'easy' ? Math.min(fixLotsIn, outstanding) : fixLotsIn
    if (sClip <= 0 || fClip <= 0 || outstanding <= 0) return
    setDeal(d => {
      const b0 = d.boxes ?? 0, x0 = d.fixedLots ?? 0
      return {
        ...d,
        sell: wavg(d.sell, b0, fobDiff, sClip), boxes: b0 + sClip,
        fFix: wavg(d.fFix, x0, futFix, fClip), fixedLots: x0 + fClip,
        futMarks: [...(d.futMarks ?? []), curFut, curFut],
        diffMarks: [...(d.diffMarks ?? []), fobDiff, fobDiff],
        order: [...(d.order ?? []), 3, 4],
        clipPx: [...(d.clipPx ?? []), fobDiff, futFix],
        clipQty: [...(d.clipQty ?? []), sClip, fClip],
        ...(live ? { stamps: [...(d.stamps ?? []), liveRound, liveRound], stampTimes: [...(d.stampTimes ?? []), elapsed, elapsed] } : {}),
      }
    })
  }
  const combo1Ok = mode === 'exporter' && !complete && !capitalBlocked && !marginBlockedAct(2)
  const combo2Ok = mode === 'exporter' && !complete && remainingBoxes > 0 && outstanding > 0

  // Stamp tag by ACTION number (free order maps action → execution index)
  const execIdx = (n: number) => (deal.order ? deal.order.indexOf(n) : n - 1)
  const roundTagA = (n: number) => stampLabel(deal, execIdx(n))

  // Derived economics (guards handle free order: legs may exist alone)
  const dBuyExp = mode === 'exporter' && hedged && deal.buy !== undefined ? deal.buy - deal.fHedge! : null
  const impInvoice = mode === 'importer' && hedged && deal.dBuy !== undefined ? deal.fHedge! + deal.dBuy : null
  const dSellImp = mode === 'importer' && deal.fFix !== undefined && deal.sell !== undefined ? deal.sell - deal.fFix : null

  let physicalD: number | null = null, futuresD: number | null = null, costsD = 0
  if (complete) {
    futuresD = (deal.fHedge! - deal.fFix!) * lotsX * LOT_T
    if (mode === 'exporter') {
      physicalD = ((deal.fFix! + deal.sell!) - deal.buy!) * soldT
    } else {
      costsD = -(deal.freight! + CIF_INSTORE) * soldT
      physicalD = (deal.sell! - impInvoice!) * soldT
    }
  }
  // Intermediate level: the financing accrued second by second on locked
  // capital (see the accrual effect) — a financial cost inside the P&L.
  const financingD = -(deal.fin ?? 0)
  const penaltyD = deal.penalty ?? 0
  const rollD = deal.roll ?? 0
  const netD = physicalD !== null ? physicalD + futuresD! + costsD + financingD - penaltyD + rollD : null

  // Record the completed trade into the log; in live mode this is AUTOMATIC —
  // in real life you cannot cancel a bad trade.
  function recordTrade() {
    if (!complete || physicalD === null || netD === null) return
    const rec: TradeRecord = {
      mode, tonnes: deal.vol!, soldT: soldT, lots: deal.lots!, boxes: deal.boxes!,
      deal, physicalD, futuresD: futuresD!, costsD, financingD, penaltyD, rollD, netD,
    }
    setHistory(h => [...h, rec])
    if (live) {
      // The trade takes 30 s to execute & settle: capital stays locked
      // for 30 seconds after the final action.
      // Capital frees 30 s after the LOAD — the final action that completes
      // the book (the 10 s auto-fix window still runs from the booking).
      const doneAt = deal.stampTimes?.[deal.stampTimes.length - 1] ?? elapsed
      setCommitments(c => [...c, { amount: deal.draw ?? 0, freesAt: doneAt + SETTLE_SECONDS, pnl: netD }])
      // Keep the trade's dots on the graph — the session's decision history.
      const spec = mode === 'exporter' ? EXP_DOTS : IMP_DOTS
      const newPins: Pin[] = []
      deal.futMarks?.forEach((v, i) => {
        const t = deal.stampTimes?.[i]
        const s = spec[(deal.order?.[i] ?? i + 1) - 1]
        if (t === undefined || !s) return
        if (s.fut) newPins.push({ t, panel: 'fut', side: s.fut, value: v })
        if (s.diff) newPins.push({ t, panel: 'diff', side: s.diff, value: deal.diffMarks![i] })
        if (s.out) newPins.push({ t, panel: 'out', side: s.out, value: v + deal.diffMarks![i] })
      })
      setPins(p => [...p, ...newPins])
    }
    setBookedAt(null)
    setDeal({})
  }

  // Live mode: auto-record the moment the final action executes.
  useEffect(() => {
    if (live && complete) recordTrade()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, complete])

  // Intermediate: the business is BOOKED once the diff is fully sold.
  const bookedNow = volT > 0 && boxesS > 0 && remainingT < CONTAINER_T
  useEffect(() => {
    if (live && level === 'inter' && bookedNow && bookedAt === null) setBookedAt(elapsed)
    if (!bookedNow && bookedAt !== null) setBookedAt(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, level, bookedNow, elapsed])

  // ROLL: every 2 calendar months the front expires — an open futures
  // position rolls AT THE CALENDAR SPREAD, and that cash is part of the P&L:
  // net longs earn an inversion and pay contango; net shorts the mirror.
  const rollIdx = Math.floor(calAt(elapsed) / ROLL_MONTHS)
  const lastRollRef = useRef(0)
  useEffect(() => {
    if (!live) { lastRollRef.current = 0; return }
    if (rollIdx <= lastRollRef.current) return
    const n = rollIdx - lastRollRef.current
    lastRollRef.current = rollIdx
    if (outstanding === 0) return
    const spreadNow = feedAt(elapsed, 'spread')
    const pnl = -outstanding * LOT_T * spreadNow * n
    setDeal(d => ((d.lots ?? 0) - (d.fixedLots ?? 0)) !== 0 ? { ...d, roll: (d.roll ?? 0) + pnl } : d)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, rollIdx])

  // Intermediate: FINANCING on locked capital (physical draw + margin)
  // accrues EVERY SECOND at 8% p.a. of calendar time — a running financial
  // cost that lands in the P&L like the rolls do.
  useEffect(() => {
    if (!live || level !== 'inter' || !started || complete) return
    const locked = (deal.draw ?? 0) + marginReq
    if (locked <= 0) return
    const costPerSecond = locked * FIN_RATE / (12 * SECONDS_PER_MONTH)
    setDeal(d => (d.order?.length ? { ...d, fin: (d.fin ?? 0) + costPerSecond } : d))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, elapsed])

  // MARGIN CALL: if capital falls below the total maintenance margin, the
  // exchange force-closes futures at market until the margin fits again.
  useEffect(() => {
    if (!live || outstanding === 0 || available >= 0) return
    const deficitLots = Math.min(Math.abs(outstanding), Math.ceil(-available / MARGIN_PER_LOT))
    if (deficitLots <= 0) return
    setDeal(d => {
      const l0 = d.lots ?? 0, x0 = d.fixedLots ?? 0
      const out = l0 - x0
      const cut = Math.min(Math.abs(out), deficitLots)
      if (cut === 0) return d
      const snap = (extra: Partial<Deal>): Deal => ({ ...d, ...extra,
        cut: (d.cut ?? 0) + cut,
        futMarks: [...(d.futMarks ?? []), curFut], diffMarks: [...(d.diffMarks ?? []), fobDiff],
        clipPx: [...(d.clipPx ?? []), out > 0 ? futFix : fut],
        clipQty: [...(d.clipQty ?? []), cut],
        order: [...(d.order ?? []), out > 0 ? lastStep : (mode === 'exporter' ? 2 : 3)],
        stamps: [...(d.stamps ?? []), liveRound], stampTimes: [...(d.stampTimes ?? []), elapsed] })
      return out > 0
        ? snap({ fFix: wavg(d.fFix, x0, futFix, cut), fixedLots: x0 + cut })
        : snap({ fHedge: wavg(d.fHedge, l0, fut, cut), lots: l0 + cut })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, available, outstanding])

  // …and if the futures are not squared within 10 s of booking, the desk
  // auto-fixes at market and charges the penalty.
  const autoFixIn = bookedAt !== null && !complete ? Math.max(0, AUTO_FIX_SECONDS - (elapsed - bookedAt)) : null
  useEffect(() => {
    if (!live || level !== 'inter' || bookedAt === null || complete) return
    if (elapsed - bookedAt < AUTO_FIX_SECONDS) return
    setDeal(d => {
      const l0 = d.lots ?? 0, x0 = d.fixedLots ?? 0
      const out = l0 - x0
      if (out === 0) return d
      const snap = (extra: Partial<Deal>): Deal => ({
        ...d, ...extra,
        penalty: AUTO_FIX_PENALTY,
        futMarks: [...(d.futMarks ?? []), curFut],
        diffMarks: [...(d.diffMarks ?? []), fobDiff],
        clipPx: [...(d.clipPx ?? []), out > 0 ? futFix : fut],
        clipQty: [...(d.clipQty ?? []), Math.abs(out)],
        order: [...(d.order ?? []), out > 0 ? lastStep : (mode === 'exporter' ? 2 : 3)],
        stamps: [...(d.stamps ?? []), liveRound],
        stampTimes: [...(d.stampTimes ?? []), elapsed],
      })
      return out > 0
        ? snap({ fFix: wavg(d.fFix, x0, futFix, out), fixedLots: x0 + out })
        : snap({ fHedge: wavg(d.fHedge, l0, fut, -out), lots: l0 - out })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, level, bookedAt, elapsed, complete])

  function exportReport() {
    const trader = `${firstName.trim()} ${lastName.trim()}`.trim()
    const blob = buildPdfBlob(buildTradeReport(history, trader || undefined))
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = trader ? `ptbf-report-${trader.toLowerCase().replace(/\s+/g, '-')}.pdf` : 'ptbf-trade-report.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  const sessionTotal = history.reduce((s, t) => s + t.netD, 0)
  const lastRec = history.length > 0 ? history[history.length - 1] : null

  // Each tile leads with ITS executable price — $/t outright or differential
  const ACTIONS = mode === 'exporter'
    ? [
        { n: 1, label: 'Buy G2 spot HCM', px: `${fmtUsd(localUsd, 1)}/t`, px2: `diff eq. ${dfmt(localUsd - curFut, 0)}`, detail: `${vnd.toLocaleString()} VND/kg at ${FX.toLocaleString()} FX`, qty: 'vol' as const },
        { n: 2, label: 'Sell futures', px: fmtUsd(fut), px2: undefined, detail: 'hedge → sets your buying differential', qty: 'lots' as const },
        { n: 3, label: 'Sell FOB HCM', px: dfmt(fobDiff), px2: undefined, detail: 'diff vs London · PTBF', qty: 'boxes' as const },
        { n: 4, label: 'Buy futures (Load & fix)', px: fmtUsd(curFut), px2: undefined, detail: 'EFP → invoice = fix + diff', qty: 'fixlots' as const },
      ]
    : [
        { n: 1, label: 'Buy FOB HCM', px: dfmt(fobDiff), px2: undefined, detail: 'diff vs London · PTBF — price still floating', qty: 'vol' as const },
        { n: 3, label: 'Sell futures', px: fmtUsd(fut), px2: undefined, detail: 'fix before export → purchase = fix + diff, hedged', qty: 'lots' as const },
        { n: 4, label: 'Sell spot Antwerp (EUR)', px: `${fmtUsd(eurUsd)}/t`, px2: `FOB eq. ${dfmt(eurUsd - curFut - (deal.freight ?? freight) - CIF_INSTORE, 0)}`, detail: `${fmtEur(eurSpot)}/t × ${EURUSD.toFixed(2)}`, qty: 'boxes' as const },
        { n: 5, label: 'Buy futures', px: fmtUsd(curFut), px2: undefined, detail: 'locks your selling differential', qty: 'fixlots' as const },
        { n: 2, label: 'Buy freight', px: `$${freight}/t`, px2: undefined, detail: `HCM → Antwerp (+$${CIF_INSTORE} CIF→instore) — needed before the book can square`, qty: null },
      ]


  const statusText = complete
    ? 'FLAT — trade complete'
    : !started ? 'No position'
    : `Book: ${volT} t phys · ${outstanding >= 0 ? `short ${outstanding}` : `LONG ${-outstanding}`} lot${Math.abs(outstanding) === 1 ? '' : 's'} · ${soldT.toFixed(0)} t sold`

  // Which risks are OPEN, computed from the live book so clips work:
  //  Exporter FLAT: physical and hedge must pair (naked long, or naked short
  //  futures if hedged first). DIFF: open until buy+hedge+sale all exist.
  //  Importer FLAT: sold outright with the buy-back still open. DIFF: open
  //  until the outright sale prices the selling side.
  const flatRisk = mode === 'exporter'
    ? started && !complete && Math.abs(volT + (lotsX - lotsH) * LOT_T) >= LOT_T
    : started && !complete && ((soldT > 0 && outstanding > 0) || lotsX > lotsH)
  const diffRisk = mode === 'exporter'
    ? started && !complete && !(volT > 0 && lotsH > 0 && boxesS > 0)
    : started && !complete && boxesS === 0

  const numCls = 'w-14 rounded border border-white/15 bg-white/[0.05] px-1.5 py-0.5 text-right tabular-nums text-white outline-none focus:border-brand-blue'
  const qtyInput = (kind: 'vol' | 'lots' | 'boxes' | 'fixlots') => {
    if (kind === 'vol') return (
      <span className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-slate-400" onClick={e => e.stopPropagation()}>
        Clip
        <input type="number" min={1} max={500} step={1} value={vol} aria-label="Volume to buy (t)"
          onChange={e => {
            const v = parseFloat(e.target.value)
            if (!Number.isFinite(v)) return
            setVol(v)
            setLotsIn(Math.max(1, Math.round(v / LOT_T)))
            setBoxesIn(Math.max(1, Math.floor(v / CONTAINER_T)))
          }}
          className={`${numCls} w-16`} />
        t {volT > 0 && <span className="text-slate-500">(book: {volT} t)</span>}
      </span>
    )
    if (kind === 'lots') return (
      <span className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-slate-400" onClick={e => e.stopPropagation()}>
        Clip
        <input type="number" min={0} max={60} step={1} value={lotsIn} aria-label="Hedge volume (lots)"
          onChange={e => { const v = parseInt(e.target.value, 10); if (Number.isFinite(v)) setLotsIn(Math.max(0, v)) }}
          className={numCls} />
        lots <span className="text-slate-500">(= {lotsIn * LOT_T} t vs {Math.max(volT, vol)} t phys)</span>
      </span>
    )
    if (kind === 'boxes') return (
      <span className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-slate-400" onClick={e => e.stopPropagation()}>
        Clip
        <input type="number" min={1} max={Math.max(1, remainingBoxes)} step={1} value={Math.max(1, Math.min(boxesIn, remainingBoxes))} aria-label="Containers to ship"
          onChange={e => { const v = parseInt(e.target.value, 10); if (Number.isFinite(v)) setBoxesIn(Math.max(1, Math.min(Math.max(1, remainingBoxes), v))) }}
          className={numCls} />
        boxes <span className="text-slate-500">(× {CONTAINER_T} t · {remainingBoxes} left)</span>
      </span>
    )
    return (
      <span className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-slate-400" onClick={e => e.stopPropagation()}>
        Clip
        <input type="number" min={1} max={60} step={1} value={outstanding > 0 ? Math.max(1, Math.min(fixLotsIn, outstanding)) : Math.max(1, fixLotsIn)} aria-label="Lots to buy back"
          onChange={e => { const v = parseInt(e.target.value, 10); if (Number.isFinite(v)) setFixLotsIn(Math.max(1, v)) }}
          className={numCls} />
        lots <span className={outstanding > 0 ? 'text-slate-500' : 'text-rose-300'}>{outstanding > 0 ? `(of ${outstanding} outstanding)` : '(no short — going NAKED LONG)'}</span>
      </span>
    )
  }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">Two PTBF Trades · Robusta by the container</div>
        <div className="flex items-center gap-1.5">
          <RiskSquare label="FLAT" on={flatRisk} active={step > 0 && !complete} />
          <RiskSquare label="DIFF" on={diffRisk} active={step > 0 && !complete} />
          <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${CHIP_CLS(statusText)}`}>{statusText}</span>
        </div>
      </div>

      {/* Difficulty level */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {([['easy', 'Easy · guided order'], ['inter', 'Intermediate · free order + 8% financing']] as const).map(([k, label]) => (
          <button key={k} disabled={live} onClick={() => { if (level !== k) { setLevel(k); setDeal({}); setBookedAt(null) } }}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              level === k ? 'border-amber-500/60 bg-amber-500/15 text-amber-100' : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
            } ${live ? 'cursor-not-allowed opacity-60' : ''}`}>
            {label}
          </button>
        ))}
        <button disabled className="cursor-not-allowed rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-600">
          Advanced · order book & quality inventory (soon)
        </button>
        <span className="font-mono text-[10px] text-slate-500">
          {level === 'easy'
            ? 'actions execute in a fixed, guided order'
            : 'any order — sell first, even buy futures naked (know why!) · 8% p.a. financing on drawn capital · booked = diff sold: square the futures within 10 s or auto-fix, −$20k'}
        </span>
      </div>

      {/* Trade selector + trader identity + live-market control */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {([['exporter', 'Exporter: buy VND → sell FOB'], ['importer', 'Importer: buy FOB → sell spot']] as [Mode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => switchMode(m)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              mode === m ? 'border-brand-blue/60 bg-brand-blue/20 text-blue-100' : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
            }`}>
            {label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-white/10" />
        {live ? (
          <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-slate-200">
            {firstName.trim()} {lastName.trim()}
          </span>
        ) : (
          <>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} aria-label="Trader name" placeholder="Trader name"
              className="w-28 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-xs text-white outline-none placeholder:text-slate-600 focus:border-brand-blue" />
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} aria-label="Trader surname" placeholder="Surname"
              className="w-28 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-xs text-white outline-none placeholder:text-slate-600 focus:border-brand-blue" />
          </>
        )}
        <button onClick={toggleLive}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            live ? 'border-brand-cyan/60 bg-brand-cyan/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
          }`}>
          {live ? '■ Stop live market' : '▶ Live market (45 months · 20 s/month ≈ 15 min)'}
        </button>
        {/* No round counter, no next-news countdown: when the next news lands
            — and how many remain — stays a mystery for the students. */}
      </div>

      {/* Working-capital monitor — the physical must deliver to free the line */}
      {live && (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <span className="eyebrow">Working capital</span>
            <span className="tabular-nums text-slate-300">
              line <span className={`font-bold ${capitalBase >= CAPITAL_START ? 'text-emerald-300' : 'text-rose-300'}`}>{fmtUsd(capitalBase)}</span>
              {settledPnl !== 0 && <span className="text-slate-500"> ({sgn(settledPnl)} realized)</span>}
              {' · drawn '}<span className={drawn > 0 ? 'text-amber-300 font-bold' : 'text-slate-300'}>{fmtUsd(drawn)}</span>
              {marginReq > 0 && <span className="text-slate-500"> (incl. margin {fmtUsd(marginReq)} · IM {Math.abs(outstanding)} lots × ${MARGIN_PER_LOT / 1000}k{vmCall > 0 ? <> + <span className="font-bold text-rose-300">VM call {fmtUsd(vmCall)}</span></> : null})</span>}
              {' · available '}<span className={available < estDraw ? 'text-rose-300 font-bold' : 'text-emerald-300 font-bold'}>{fmtUsd(Math.max(0, available))}</span>
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div className={`h-full transition-all ${drawn / capitalBase > 0.85 ? 'bg-rose-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, (drawn / Math.max(1, capitalBase)) * 100)}%` }} />
          </div>
          {openCommitments.length > 0 && (
            <p className="mt-1.5 font-mono text-[10px] text-slate-500">
              {openCommitments.map((c, i) => (
                <span key={i} className="mr-3">{fmtUsd(c.amount)} settling ({sgn(c.pnl)} P&L lands with it) — frees in {Math.max(0, c.freesAt - elapsed)}s</span>
              ))}
            </p>
          )}
          {vmCall > 0 && (
            <div className="mt-2 rounded-lg border border-amber-500/40 bg-amber-500/[0.08] p-2 font-mono text-[11px] text-amber-200">
              MARGIN CALL — your open futures are {fmtUsd(vmCall)} underwater: variation margin is drawn from the line on top of the {fmtUsd(initialMargin)} initial margin.
            </div>
          )}
          {(deal.cut ?? 0) > 0 && (
            <div className="mt-2 rounded-lg border border-rose-500/50 bg-rose-500/[0.10] p-2 font-mono text-[11px] font-bold text-rose-200">
              MARGIN CALL — capital fell below the maintenance margin: the exchange CUT {deal.cut} lot{deal.cut === 1 ? '' : 's'} at market.
            </div>
          )}
          {capitalBlocked && (
            <div className="mt-2 rounded-lg border border-rose-500/40 bg-rose-500/[0.08] p-2 font-mono text-[11px] text-rose-200">
              CAPITAL LIMIT HIT — every trade takes {SETTLE_SECONDS} s to execute and settle: the capital from your last sale is still locked{nextFreeIn > 0 ? ` (frees in ${nextFreeIn}s)` : ''} and cannot finance another {vol} t purchase ({fmtUsd(estDraw)}).
            </div>
          )}
        </div>
      )}

      {/* Intermediate: booked business countdown — square the futures or eat the penalty */}
      {live && level === 'inter' && autoFixIn !== null && outstanding !== 0 && (
        <div className="mb-4 rounded-xl border border-rose-500/50 bg-rose-500/[0.10] p-3 font-mono text-xs text-rose-200">
          ⏱ BUSINESS BOOKED — the differential is sold. Square your futures within <span className="text-base font-bold">{autoFixIn}s</span> or the desk auto-fixes at market with a −{fmtUsd(AUTO_FIX_PENALTY)} penalty.
        </div>
      )}

      {/* Book + graph + actions SIDE BY SIDE — everything on one screen */}
      <div className="mb-4 grid grid-cols-1 xl:grid-cols-[176px_minmax(0,1fr)_330px] gap-4">
        {/* Current book — every clip lands as a tile on its row */}
        <div className="space-y-1.5 self-start">
          <div className="eyebrow">Current book</div>
          {(() => {
            const rowOf = (n: number): 'pb' | 'ps' | 'fs' | 'fb' | null => {
              const map: Record<number, 'pb' | 'ps' | 'fs' | 'fb'> = mode === 'exporter'
                ? { 1: 'pb', 2: 'fs', 3: 'ps', 4: 'fb' }
                : { 1: 'pb', 3: 'fs', 4: 'ps', 5: 'fb' }
              return map[n] ?? null
            }
            const tiles: Record<'pb' | 'ps' | 'fs' | 'fb', string[]> = { pb: [], ps: [], fs: [], fb: [] }
            deal.order?.forEach((n, i) => {
              const r = rowOf(n)
              if (!r) return
              const px = deal.clipPx?.[i] ?? 0
              const q = deal.clipQty?.[i] ?? 0
              if (r === 'pb') tiles.pb.push(mode === 'exporter' ? `${q} t @ ${fmtUsd(px, 0)}` : `${q} t @ ${dfmt(px)}`)
              else if (r === 'ps') tiles.ps.push(mode === 'exporter' ? `${q} bx @ ${dfmt(px)}` : `${q} bx @ ${fmtUsd(px, 0)}`)
              else tiles[r].push(`${q} lots @ ${fmtUsd(px)}`)
            })
            const rows: { k: 'pb' | 'ps' | 'fb' | 'fs'; label: string; buy: boolean }[] = [
              { k: 'pb', label: 'Physical buying', buy: true },
              { k: 'ps', label: 'Physical selling', buy: false },
              { k: 'fb', label: 'Futures buying', buy: true },
              { k: 'fs', label: 'Futures selling', buy: false },
            ]
            return (
              <>
                {rows.map(r => {
                  // Once the physical is paired with an opposite futures leg,
                  // the book thinks in DIFFERENTIAL terms — show it.
                  const diffTile =
                    r.k === 'pb' && mode === 'exporter' && volT > 0 && lotsH > 0
                      ? `= diff ${dfmt(deal.buy! - deal.fHedge!, 0)}`
                      : r.k === 'ps' && mode === 'importer' && boxesS > 0 && lotsX > 0
                        ? `= diff ${dfmt(deal.sell! - deal.fFix!, 0)}`
                        : null
                  return (
                    <div key={r.k} className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
                      <div className="font-mono text-[9px] uppercase tracking-wide text-slate-500">{r.label}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {tiles[r.k].length === 0
                          ? <span className="font-mono text-[9px] text-slate-600">—</span>
                          : tiles[r.k].map((t2, i2) => (
                            <span key={i2} className={`rounded px-1 py-px font-mono text-[9px] font-bold ${r.buy ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>{t2}</span>
                          ))}
                        {diffTile && (
                          <span className="rounded bg-brand-cyan/10 px-1 py-px font-mono text-[9px] font-bold text-brand-cyan">{diffTile}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
                {(() => {
                  const cumPnl = sessionTotal + (netD ?? 0)
                  const hasPnl = history.length > 0 || netD !== null
                  return (
                    <div className={`rounded-xl border p-2 ${hasPnl ? (cumPnl >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-rose-500/40 bg-rose-500/[0.06]') : 'border-white/10 bg-white/[0.03]'}`}>
                      <div className="font-mono text-[9px] uppercase tracking-wide text-slate-500">PnL (accumulated)</div>
                      <div className={`mt-0.5 font-mono text-[11px] font-bold tabular-nums ${!hasPnl ? 'text-slate-600' : cumPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {hasPnl ? sgn(cumPnl) : started ? 'open' : '—'}
                      </div>
                      {(deal.roll ?? 0) !== 0 && (
                        <div className="mt-0.5 font-mono text-[9px] text-slate-400">rolls {sgn(deal.roll!)}</div>
                      )}
                      {(deal.fin ?? 0) > 0 && (
                        <div className="mt-0.5 font-mono text-[9px] text-rose-300/80">financing −{fmtUsd(deal.fin!)}</div>
                      )}
                    </div>
                  )
                })()}
              </>
            )
          })()}
        </div>

        <PriceGraph
          marks={deal.futMarks ?? []}
          liveFut={curFut}
          diffMarks={deal.diffMarks ?? []}
          liveDiff={fobDiff}
          liveParity={tenderableParity(freight)}
          calSpread={spreadQ}
          lastStep={lastStep}
          hedgeIdx={execIdx(mode === 'exporter' ? 2 : 3) + 1}
          fixIdx={(deal.order?.lastIndexOf(lastStep) ?? -1) + 1}
          complete={complete}
          dots={mode === 'exporter' ? EXP_DOTS : IMP_DOTS}
          sides={mode === 'exporter' ? EXP_SIDES : IMP_SIDES}
          order={deal.order}
          stamps={deal.stamps}
          stampTimes={deal.stampTimes}
          liveLabel={live ? LIVE_SCRIPT[liveRound].label : 'now'}
          elapsed={live ? elapsed : undefined}
          pins={pins}
        />

        {/* Actions — clip by clip: buy and sell little by little */}
        <div className="space-y-1.5 self-start">
          {/* The NEWS tile — shines for a few seconds when a story breaks */}
          <div className={`rounded-xl border p-2.5 transition-all duration-500 ${
            live && elapsed - ROUND_STARTS[liveRound] < 5
              ? 'animate-pulse border-brand-cyan bg-brand-cyan/[0.12] shadow-[0_0_24px_rgba(34,211,238,0.45)]'
              : 'border-brand-cyan/25 bg-brand-cyan/[0.04]'
          }`}>
            <div className="flex items-center gap-2">
              <span className="chip !py-0.5 shrink-0 border-brand-cyan/50 bg-brand-cyan/15 font-mono text-[10px] font-bold text-brand-cyan">NEWS{live ? ` · ${LIVE_SCRIPT[liveRound].label}` : ''}</span>
              {live && <span className="truncate font-mono text-[10px] font-bold text-cyan-200">{LIVE_SCRIPT[liveRound].headline}</span>}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
              {live ? LIVE_SCRIPT[liveRound].news : 'The news feed wakes with the live market.'}
            </p>
          </div>

          <div className="eyebrow">Actions · clip by clip</div>
          {(() => {
            const row = (a: (typeof ACTIONS)[number]) => {
            const usable = canExec(a.n)
            const blocked = usable && a.n === 1 && capitalBlocked
            return (
              <div key={a.n} className="flex items-stretch gap-1.5">
                <div
                  className={`min-w-0 flex-1 rounded-xl border p-2 text-left transition-all ${
                    blocked ? 'border-rose-500/30 bg-rose-500/[0.04]'
                    : usable ? 'border-brand-blue/50 bg-brand-blue/10'
                    : 'border-white/5 bg-white/[0.01] opacity-40'
                  }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-xs font-bold text-white">{a.label}</span>
                    <button onClick={() => act(a.n)} disabled={!usable || blocked} aria-label={a.label}
                      className={`chip !py-0.5 shrink-0 ${usable && !blocked ? 'cursor-pointer border-brand-blue/60 bg-brand-blue/20 text-blue-100 hover:bg-brand-blue/30' : 'cursor-not-allowed opacity-50 text-slate-500'}`}>
                      {blocked ? 'no capital' : marginBlockedAct(a.n) ? 'no margin' : 'execute'}
                    </button>
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-slate-500">
                    <span className="rounded bg-amber-500/10 px-1 py-px text-[11px] font-bold text-amber-300">{a.px}</span>
                    {a.px2 && <span className="ml-1 rounded bg-brand-cyan/10 px-1 py-px text-[10px] font-bold text-brand-cyan">{a.px2}</span>}
                    {' '}{a.detail}
                  </div>
                  {usable && !blocked && a.qty && <div className="mt-1">{qtyInput(a.qty)}</div>}
                </div>
              </div>
            )
            }
            const vertBtn = (label: string, ok: boolean, onClick: () => void) => (
              <button type="button" onClick={onClick} disabled={!ok} aria-label={label}
                className={`w-8 shrink-0 rounded-xl border px-1 py-2 font-mono text-[10px] font-bold tracking-wide transition-all ${
                  ok ? 'cursor-pointer border-amber-500/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20' : 'cursor-not-allowed border-white/5 bg-white/[0.01] text-slate-600'
                }`}
                style={{ writingMode: 'vertical-rl' }}>
                {label}
              </button>
            )
            if (mode === 'importer') return ACTIONS.map(a => row(a))
            return (
              <>
                {/* buy spot + hedge = buy the DIFF, one click */}
                <div className="flex items-stretch gap-1.5">
                  <div className="min-w-0 flex-1 space-y-1.5">{row(ACTIONS[0])}{row(ACTIONS[1])}</div>
                  {vertBtn('Buy G2 spot HCM diff ⚡', combo1Ok, comboBuyDiff)}
                </div>
                {/* sell FOB + fix = sell & load immediately, one click */}
                <div className="flex items-stretch gap-1.5">
                  <div className="min-w-0 flex-1 space-y-1.5">{row(ACTIONS[2])}{row(ACTIONS[3])}</div>
                  {vertBtn('Sell G2 FOB & load immediately ⚡', combo2Ok, comboSellFix)}
                </div>
              </>
            )
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: the market */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">{live ? 'The market — LIVE feed (identical for everyone)' : 'The market — type any value or slide'}</div>

          {mode === 'exporter' ? (
            <Field live={live} label="Spot HCM (VND/kg)" value={vnd} min={80000} max={160000} step={500} onChange={setVnd} locked={false} />
          ) : (
            <>
              <Field live={live} label="FOB HCM differential ($/t)" value={fobDiff} min={-350} max={1000} step={5} onChange={setFobDiff} locked={false} />
              <p className="-mt-1 text-[10px] text-slate-500">The rose line on the graph is tenderable parity — it MOVES: −(freight + $100 instore + $95 tender costs). Dearer freight pushes the floor lower.</p>
            </>
          )}

          {mode === 'importer' && (
            <Field live={live} label="Freight HCM → Antwerp ($/t)" value={freight} min={40} max={150} step={5} onChange={setFreight}
              locked={deal.freight !== undefined} lockedAt={deal.freight !== undefined ? `@ $${deal.freight}` : undefined} />
          )}

          <Field live={live} label="London futures — hedge leg ($/t)" value={fut} min={3500} max={6000} step={5} onChange={setFut} locked={false} />

          <Field live={live} label="Calendar spread F1→F2 ($/t · + inverted)" value={spreadQ} min={-100} max={200} step={5} onChange={setSpreadQ} locked={false} />

          {hedged && (
            <Field live={live} label="London futures — since the hedge ($/t)" value={futFix} min={3500} max={6000} step={5} onChange={setFutFix} locked={false} />
          )}

          {mode === 'exporter' ? (
            <>
              <Field live={live} label="FOB HCM differential ($/t)" value={fobDiff} min={-350} max={1000} step={5} onChange={setFobDiff} locked={false} />
              <p className="-mt-1 text-[10px] text-slate-500">The rose line on the graph is tenderable parity — it MOVES: −(freight + $100 instore + $95 tender costs). Dearer freight pushes the floor lower.</p>
            </>
          ) : (
            <Field live={live} label="Spot Antwerp, outright (€/t)" value={eurSpot} min={3200} max={5000} step={10} onChange={setEurSpot} locked={false} />
          )}

        </div>

        {/* RIGHT: blotter, P&L */}
        <div className="space-y-3">
          {/* Blotter */}
          {step > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] tabular-nums space-y-1">
              <div className="eyebrow mb-1">Deal blotter (running averages)</div>
              {mode === 'exporter' ? (
                <>
                  {volT > 0 && <div className="flex justify-between"><span className="text-slate-400">1 · Bought local{roundTagA(1)}</span><span className="text-white">{deal.vnd?.toLocaleString()} VND/kg = {fmtUsd(deal.buy!, 1)}/t × {volT} t</span></div>}
                  {lotsH > 0 && <div className="flex justify-between"><span className="text-slate-400">2 · Sold futures → buying diff{roundTagA(2)}</span><span className="text-white">{fmtUsd(deal.fHedge!)} × {lotsH} lots{dBuyExp !== null ? <> → {dfmt(dBuyExp, 1)}</> : <span className="text-slate-500"> · diff TBD (no physical yet)</span>}</span></div>}
                  {boxesS > 0 && <div className="flex justify-between"><span className="text-slate-400">3 · Sold FOB (PTBF){roundTagA(3)}</span><span className="text-white">London {dfmt(deal.sell!)} × {boxesS} boxes</span></div>}
                  {lotsX > 0 && deal.sell !== undefined && <div className="flex justify-between"><span className="text-slate-400">4 · Fixed — invoice{roundTagA(4)}</span><span className="text-white">{fmtUsd(deal.fFix!)} {deal.sell < 0 ? '−' : '+'} {fmtUsd(Math.abs(deal.sell))} = {fmtUsd(deal.fFix! + deal.sell)}/t</span></div>}
                </>
              ) : (
                <>
                  {volT > 0 && <div className="flex justify-between"><span className="text-slate-400">1 · Bought FOB (diff){roundTagA(1)}</span><span className="text-white">London {dfmt(deal.dBuy!)} · price TBF · {volT} t</span></div>}
                  {deal.freight !== undefined && <div className="flex justify-between"><span className="text-slate-400">2 · Freight booked{roundTagA(2)}</span><span className="text-white">${deal.freight}/t + ${CIF_INSTORE} instore</span></div>}
                  {lotsH > 0 && <div className="flex justify-between"><span className="text-slate-400">3 · Fixed & hedged{roundTagA(3)}</span><span className="text-white">{fmtUsd(deal.fHedge!)} × {lotsH} lots{impInvoice !== null ? <> → purchase {fmtUsd(impInvoice)}/t</> : <span className="text-slate-500"> · purchase TBD (no diff yet)</span>}</span></div>}
                  {boxesS > 0 && <div className="flex justify-between"><span className="text-slate-400">4 · Sold outright{roundTagA(4)}</span><span className="text-white">{fmtEur(deal.eur!)}/t = {fmtUsd(deal.sell!)}/t × {boxesS} boxes</span></div>}
                  {lotsX > 0 && <div className="flex justify-between"><span className="text-slate-400">5 · Bought futures → selling diff{roundTagA(5)}</span><span className="text-white">{fmtUsd(deal.fFix!)}{dSellImp !== null ? <> → {dfmt(dSellImp, 0)}</> : null}</span></div>}
                </>
              )}
            </div>
          )}

          {/* P&L */}
          {complete && netD !== null && (
            <div className={`rounded-xl p-4 border font-mono text-xs tabular-nums ${netD >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'}`}>
              <div className="eyebrow mb-2">Trade P&L</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">Physical P&L {mode === 'exporter' ? '(invoice − VND buy)' : '(outright sale − purchase)'}</span><span className={physicalD! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(physicalD! / soldT!, 1)}/t × {soldT!.toFixed(1)} t = {sgn(physicalD!)}</span></div>
                {mode === 'importer' && <div className="flex justify-between"><span className="text-slate-400">Freight + instore costs</span><span className="text-rose-300">{sgn(costsD / soldT!, 1)}/t × {soldT!.toFixed(1)} t = {sgn(costsD)}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Futures P&L (sold − bought back)</span><span className={futuresD! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(deal.fHedge! - deal.fFix!, 0)}/t × {deal.lots! * LOT_T} t = {sgn(futuresD!)}</span></div>
                {financingD !== 0 && <div className="flex justify-between"><span className="text-slate-400">Financing · {(FIN_RATE * 100).toFixed(0)}% p.a. on locked capital, accrued per second</span><span className="text-rose-300">{sgn(financingD)}</span></div>}
                {rollD !== 0 && <div className="flex justify-between"><span className="text-slate-400">Roll P&L (cal spread × open lots, every {ROLL_MONTHS} mo)</span><span className={rollD >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(rollD)}</span></div>}
                {penaltyD > 0 && <div className="flex justify-between"><span className="text-slate-400">Auto-fix penalty (futures not squared in time)</span><span className="text-rose-300 font-bold">−{fmtUsd(penaltyD)}</span></div>}
                <div className="flex justify-between border-t border-white/15 pt-1.5">
                  <span className="text-white font-bold">Net · on {deal.vol} t</span>
                  <span className={`font-bold text-base ${netD >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(netD / deal.vol!, 1)}/t · {sgn(netD)}</span>
                </div>
                <p className="pt-1 text-slate-400">
                  {mode === 'exporter'
                    ? `= sell diff ${dfmt(deal.sell!)} − buying diff ${dfmt(dBuyExp!, 1)}: the whole trade was a differential.`
                    : `= selling diff ${dfmt(dSellImp!, 0)} − buying diff ${dfmt(deal.dBuy!)} − costs $${deal.freight! + CIF_INSTORE}: a pair trade with a freight bill.`}
                </p>
              </div>
            </div>
          )}

          {/* Live: the record is automatic — a desk cannot cancel a bad trade */}
          {live && step === 0 && lastRec && lastRec.penaltyD > 0 && (
            <div className={`rounded-xl border p-3 font-mono text-[11px] ${lastRec.netD >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-200' : 'border-rose-500/40 bg-rose-500/[0.08] text-rose-200'}`}>
              Trade #{history.length} recorded automatically — net {sgn(lastRec.netD)}{lastRec.penaltyD > 0 ? <> · includes a <span className="font-bold">−{fmtUsd(lastRec.penaltyD)} auto-fix penalty</span> (futures not squared within {AUTO_FIX_SECONDS} s of booking)</> : null}. In real life you cannot cancel a bad trade; execution & settlement take {SETTLE_SECONDS} s, then the capital (and this P&L) returns to your line.
            </div>
          )}

          {!live && step > 0 && (
            <div className="flex flex-wrap gap-2">
              {complete && (
                <button onClick={recordTrade} className="btn-primary !px-3 !py-1.5 text-xs">
                  ✓ Record trade · start next
                </button>
              )}
              <button onClick={() => setDeal({})} className="btn-ghost !px-3 !py-1.5 text-xs">
                {complete ? 'Discard (don’t record)' : 'Reset trade'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trade log — every recorded trade of the session */}
      {history.length > 0 && (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="eyebrow">
              Trade log · session total{' '}
              <span className={sessionTotal >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sgn(sessionTotal)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={exportReport} className="btn-ghost !px-3 !py-1 text-xs">↓ Export report (PDF)</button>
              {!live && (
                <button onClick={() => { setHistory([]); setPins([]) }} className="btn-ghost !px-3 !py-1 text-xs text-rose-300 hover:!border-rose-400/40">Clear log</button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px] tabular-nums">
              <thead>
                <tr className="border-b border-white/10 text-slate-500">
                  <th className="py-1.5 pr-2 text-left font-normal">#</th>
                  <th className="px-2 text-left font-normal">Trade</th>
                  <th className="px-2 text-left font-normal">Route</th>
                  <th className="px-2 text-left font-normal">Vol</th>
                  <th className="px-2 text-left font-normal">Rounds</th>
                  <th className="px-2 text-right font-normal">Net $/t</th>
                  <th className="pl-2 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {history.map((t, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-1.5 pr-2 text-slate-400">#{i + 1}</td>
                    <td className="px-2 text-slate-300">{t.mode === 'exporter' ? 'Exporter' : 'Importer'}</td>
                    <td className="px-2 text-slate-400">
                      {t.mode === 'exporter'
                        ? `${t.deal.vnd?.toLocaleString('en-US')} VND → FOB ${dfmt(t.deal.sell!)}`
                        : `FOB ${dfmt(t.deal.dBuy!)} → ${fmtEur(t.deal.eur!)}`}
                    </td>
                    <td className="px-2 text-slate-400">{t.tonnes} t · {t.lots} lots · {t.boxes} bx</td>
                    <td className="px-2 text-slate-500">
                      {t.deal.stamps ? `${LIVE_SCRIPT[t.deal.stamps[0]].label} → ${LIVE_SCRIPT[t.deal.stamps[t.deal.stamps.length - 1]].label}` : 'manual'}
                    </td>
                    <td className={`px-2 text-right ${t.netD >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(t.netD / t.tonnes, 1)}</td>
                    <td className={`pl-2 text-right font-bold ${t.netD >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{sgn(t.netD)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
