'use client'

import { useState } from 'react'

// A miniature central limit order book: where "one transparent price"
// actually comes from. Students submit market or limit orders against a
// resting book (London Robusta, $/t, lots) and watch price discovery.
type Level = { price: number; lots: number }
type Trade = { price: number; lots: number; taker: 'buy' | 'sell' }

const START_BIDS: Level[] = [
  { price: 4795, lots: 12 }, { price: 4790, lots: 18 }, { price: 4785, lots: 25 },
  { price: 4780, lots: 30 }, { price: 4775, lots: 40 },
]
const START_ASKS: Level[] = [
  { price: 4805, lots: 10 }, { price: 4810, lots: 15 }, { price: 4815, lots: 20 },
  { price: 4820, lots: 35 }, { price: 4825, lots: 50 },
]

const usd = (n: number) => '$' + n.toLocaleString('en-US')

export default function OrderBook() {
  const [bids, setBids] = useState<Level[]>(START_BIDS)
  const [asks, setAsks] = useState<Level[]>(START_ASKS)
  const [tape, setTape] = useState<Trade[]>([])
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [type, setType] = useState<'market' | 'limit'>('market')
  const [lots, setLots] = useState(15)
  const [limit, setLimit] = useState(4800)
  const [note, setNote] = useState<string | null>(null)

  const bestBid = bids[0]?.price
  const bestAsk = asks[0]?.price
  const last = tape[0]

  function submit() {
    let remaining = lots
    const fills: Trade[] = []
    const isBuy = side === 'buy'
    // A market order crosses at any price; a limit order only up/down to its limit.
    const book = isBuy ? [...asks] : [...bids]
    const crosses = (p: number) =>
      type === 'market' ? true : isBuy ? p <= limit : p >= limit

    while (remaining > 0 && book.length > 0 && crosses(book[0].price)) {
      const lvl = book[0]
      const take = Math.min(remaining, lvl.lots)
      fills.push({ price: lvl.price, lots: take, taker: side })
      remaining -= take
      if (take === lvl.lots) book.shift()
      else book[0] = { ...lvl, lots: lvl.lots - take }
    }

    let restNote = ''
    if (isBuy) setAsks(book)
    else setBids(book)

    // Unfilled remainder of a limit order rests in the book at its price.
    if (remaining > 0 && type === 'limit') {
      const rest = { price: limit, lots: remaining }
      if (isBuy) {
        setBids(b => [...b, rest].sort((a, c) => c.price - a.price))
      } else {
        setAsks(a => [...a, rest].sort((a2, c) => a2.price - c.price))
      }
      restNote = ` ${remaining} lots now REST in the book at ${usd(limit)} — you are making liquidity (and a better price), at the risk of never trading.`
    } else if (remaining > 0) {
      restNote = ` ${remaining} lots could not fill — the book ran out.`
    }

    if (fills.length > 0) {
      setTape(t => [...fills.reverse(), ...t].slice(0, 8))
      const avg = fills.reduce((s, f) => s + f.price * f.lots, 0) / fills.reduce((s, f) => s + f.lots, 0)
      const worst = isBuy ? Math.max(...fills.map(f => f.price)) : Math.min(...fills.map(f => f.price))
      setNote(
        `Filled ${fills.reduce((s, f) => s + f.lots, 0)} lots at avg ${usd(Math.round(avg))}` +
        (fills.length > 1 ? ` — your size WALKED the book to ${usd(worst)}: that slippage is the price of immediacy.` : ` at the ${isBuy ? 'offer' : 'bid'} — you paid the spread for instant execution.`) +
        restNote
      )
    } else {
      setNote(type === 'limit' ? `Nothing crossed.${restNote}` : 'Nothing to fill.')
    }
  }

  function reset() {
    setBids(START_BIDS); setAsks(START_ASKS); setTape([]); setNote(null)
  }

  const maxLots = 50

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">The Order Book · London Robusta ($/t · lots)</div>
        <span className="chip !py-0.5 font-mono text-slate-300">
          {bestBid && bestAsk ? <>best {usd(bestBid)} / {usd(bestAsk)} · spread ${bestAsk - bestBid}</> : 'book empty'}
          {last && <> · last {usd(last.price)}</>}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
        {/* The book */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-2">
            <div className="mb-1 text-center font-mono text-[10px] font-bold uppercase tracking-wide text-emerald-400">Bids (buyers)</div>
            {bids.slice(0, 7).map((l, i) => (
              <div key={`${l.price}-${i}`} className="relative mb-0.5 flex justify-between rounded px-2 py-1 font-mono text-[11px] tabular-nums">
                <div className="absolute inset-y-0 right-0 rounded bg-emerald-500/15" style={{ width: `${(l.lots / maxLots) * 100}%` }} />
                <span className="relative z-10 text-emerald-300">{usd(l.price)}</span>
                <span className="relative z-10 text-slate-300">{l.lots}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.04] p-2">
            <div className="mb-1 text-center font-mono text-[10px] font-bold uppercase tracking-wide text-rose-400">Asks (sellers)</div>
            {asks.slice(0, 7).map((l, i) => (
              <div key={`${l.price}-${i}`} className="relative mb-0.5 flex justify-between rounded px-2 py-1 font-mono text-[11px] tabular-nums">
                <div className="absolute inset-y-0 left-0 rounded bg-rose-500/15" style={{ width: `${(l.lots / maxLots) * 100}%` }} />
                <span className="relative z-10 text-rose-300">{usd(l.price)}</span>
                <span className="relative z-10 text-slate-300">{l.lots}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order ticket */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {(['buy', 'sell'] as const).map(s => (
              <button key={s} onClick={() => setSide(s)}
                className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                  side === s
                    ? s === 'buy' ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200' : 'border-rose-500/60 bg-rose-500/20 text-rose-200'
                    : 'border-white/10 text-slate-400 hover:border-white/25'
                }`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {(['market', 'limit'] as const).map(t0 => (
              <button key={t0} onClick={() => setType(t0)}
                className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  type === t0 ? 'border-brand-blue/60 bg-brand-blue/20 text-blue-100' : 'border-white/10 text-slate-400 hover:border-white/25'
                }`}>
                {t0}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-slate-400">Lots</span>
            <input type="number" value={lots} min={1} max={99}
              onChange={e => { const v = parseInt(e.target.value); if (Number.isFinite(v)) setLots(Math.max(1, Math.min(99, v))) }}
              aria-label="Order lots"
              className="w-24 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-right font-mono text-xs tabular-nums text-white outline-none focus:border-brand-blue" />
          </div>
          {type === 'limit' && (
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-400">Limit price</span>
              <input type="number" value={limit} step={5}
                onChange={e => { const v = parseFloat(e.target.value); if (Number.isFinite(v)) setLimit(v) }}
                aria-label="Limit price"
                className="w-24 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-right font-mono text-xs tabular-nums text-white outline-none focus:border-brand-blue" />
            </div>
          )}
          <button onClick={submit} className="btn-primary w-full !py-2 text-xs">Submit order</button>
          <button onClick={reset} className="btn-ghost w-full !py-1.5 text-xs">Reset book</button>
        </div>
      </div>

      {/* Execution note + tape */}
      {note && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-relaxed text-slate-300">
          {note}
        </div>
      )}
      {tape.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span className="text-slate-500">tape:</span>
          {tape.map((t0, i) => (
            <span key={i} className={`rounded px-1.5 py-0.5 ${t0.taker === 'buy' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
              {t0.lots}@{t0.price.toLocaleString('en-US')}
            </span>
          ))}
        </div>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Try three orders: a small <span className="text-slate-300">market buy</span> (you pay the spread — the cost of immediacy), a <span className="text-slate-300">40-lot market buy</span> (you walk the book — size moves the price), and a <span className="text-slate-300">limit buy below the market</span> (you rest in the book — making the liquidity everyone else takes). The &ldquo;one transparent price&rdquo; from the opening lecture is nothing more than the top of this book, printed trade by trade.
      </p>
    </div>
  )
}
