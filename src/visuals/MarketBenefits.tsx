'use client'

import { useState } from 'react'

// Two theoretical benefits of having a futures market, shown with one
// illustrative year of Robusta prices. The futures leg and the differential
// leg tend to move INVERSELY (a rally squeezes the diff, a break fattens it),
// so their lows land on different dates — and a buyer who may fix each leg
// separately can beat any single-day outright quote.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const FUT = [4600, 4500, 4400, 4300, 4250, 4350, 4450, 4600, 4750, 4900, 4950, 4850]
const DIFF = [40, 60, 90, 110, 130, 100, 70, 20, -30, -60, -80, -50]
const OUTRIGHT = FUT.map((f, i) => f + DIFF[i])

const BEST_OUTRIGHT = Math.min(...OUTRIGHT) // 4,380 (May)
const BEST_OUTRIGHT_I = OUTRIGHT.indexOf(BEST_OUTRIGHT)

const fmt = (v: number) => v.toLocaleString('en-US')
const fmtDiff = (v: number) => `${v < 0 ? '−' : '+'}$${Math.abs(v)}`

function ChipRow({ label, color, values, selected, onSelect, display }: {
  label: string; color: string; values: number[]
  selected: number | null; onSelect: (i: number) => void
  display: (v: number) => string
}) {
  return (
    <div className="mt-2">
      <div className="font-mono text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 flex flex-wrap gap-1">
        {values.map((v, i) => {
          const active = selected === i
          return (
            <button key={MONTHS[i]} type="button" onClick={() => onSelect(i)}
              aria-label={`${label}: ${MONTHS[i]}`}
              className={`rounded-lg border px-1.5 py-1 font-mono text-[9px] leading-tight transition-colors ${
                active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                borderColor: active ? color : 'rgba(255,255,255,0.1)',
                backgroundColor: active ? color + '26' : 'rgba(255,255,255,0.02)',
              }}>
              <div className="font-bold">{MONTHS[i]}</div>
              <div className="tabular-nums">{display(v)}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function MarketBenefits() {
  const [futI, setFutI] = useState<number | null>(null)
  const [diffI, setDiffI] = useState<number | null>(null)

  const combined = futI !== null && diffI !== null ? FUT[futI] + DIFF[diffI] : null
  const edge = combined !== null ? BEST_OUTRIGHT - combined : null

  // ── SVG geometry: futures band on top, differential band below ──
  const W = 560, H = 300
  const ml = 46, mr = 16
  const F = { top: 16, h: 150, min: 4150, max: 5050 }
  const D = { top: 196, h: 84, min: -110, max: 160 }
  const pw = W - ml - mr
  const x = (i: number) => ml + (i / (MONTHS.length - 1)) * pw
  const fy = (v: number) => F.top + (1 - (v - F.min) / (F.max - F.min)) * F.h
  const dy = (v: number) => D.top + (1 - (v - D.min) / (D.max - D.min)) * D.h

  const linePath = (vals: number[], y: (v: number) => number) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1">Benefit 1 · Two legs, two lows — buy below the market</div>
      <p className="text-[11px] leading-relaxed text-slate-400">
        An outright buyer gets one price on one day. A PTBF buyer splits the purchase into <span className="text-slate-300">two separate decisions</span> — fix the futures leg when the flat market is cheap, fix the differential when the physical market is cheap. Because the two legs tend to move <span className="text-slate-300">inversely</span>, their lows land on different dates. Find them both:
      </p>

      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '300px' }}>
          {/* Futures band */}
          <text x={ml} y={F.top - 4} fill="#94a3b8" fontSize="8.5" fontFamily="monospace">London futures $/t · solid — outright (futures + diff) · dashed</text>
          {[4300, 4600, 4900].map(v => (
            <g key={`f-${v}`}>
              <line x1={ml} y1={fy(v)} x2={ml + pw} y2={fy(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={ml - 5} y={fy(v) + 3} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace">{fmt(v)}</text>
            </g>
          ))}
          <path d={linePath(OUTRIGHT, fy)} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
          <path d={linePath(FUT, fy)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {FUT.map((v, i) => (
            <circle key={`fp-${i}`} cx={x(i)} cy={fy(v)} r={futI === i ? 5 : 3} fill="#3b82f6" stroke="#070912" strokeWidth="1">
              <title>{`${MONTHS[i]} · futures ${fmt(v)} · outright ${fmt(OUTRIGHT[i])}`}</title>
            </circle>
          ))}
          {futI !== null && (
            <circle cx={x(futI)} cy={fy(FUT[futI])} r="9" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
          )}
          {/* Cheapest outright day marker */}
          <text x={x(BEST_OUTRIGHT_I)} y={fy(OUTRIGHT[BEST_OUTRIGHT_I]) - 8} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
            cheapest outright day · {fmt(BEST_OUTRIGHT)}
          </text>

          {/* Differential band */}
          <text x={ml} y={D.top - 4} fill="#94a3b8" fontSize="8.5" fontFamily="monospace">FOB differential $/t vs London</text>
          {[-80, 0, 80].map(v => (
            <g key={`d-${v}`}>
              <line x1={ml} y1={dy(v)} x2={ml + pw} y2={dy(v)} stroke={v === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'} strokeWidth="1" />
              <text x={ml - 5} y={dy(v) + 3} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace">{v === 0 ? '0' : fmtDiff(v)}</text>
            </g>
          ))}
          <path d={linePath(DIFF, dy)} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {DIFF.map((v, i) => (
            <circle key={`dp-${i}`} cx={x(i)} cy={dy(v)} r={diffI === i ? 5 : 3} fill="#d97706" stroke="#070912" strokeWidth="1">
              <title>{`${MONTHS[i]} · diff ${fmtDiff(v)}`}</title>
            </circle>
          ))}
          {diffI !== null && (
            <circle cx={x(diffI)} cy={dy(DIFF[diffI])} r="9" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.5" />
          )}

          {/* Month labels */}
          {MONTHS.map((m, i) => (
            <text key={m} x={x(i)} y={H - 4} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">{m}</text>
          ))}
        </svg>
      </div>

      <ChipRow label="Fix the FUTURES leg in…" color="#3b82f6" values={FUT}
        selected={futI} onSelect={setFutI} display={v => `$${fmt(v)}`} />
      <ChipRow label="Fix the DIFFERENTIAL leg in…" color="#d97706" values={DIFF}
        selected={diffI} onSelect={setDiffI} display={fmtDiff} />

      {/* Readout */}
      <div className={`mt-3 rounded-xl border p-3 font-mono text-xs leading-relaxed ${
        combined === null
          ? 'border-white/10 bg-white/[0.03] text-slate-400'
          : edge !== null && edge > 0
            ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-200'
            : 'border-white/10 bg-white/[0.03] text-slate-300'
      }`}>
        {combined === null ? (
          <>Pick one month for each leg. Hint: the futures low and the differential low are not in the same month…</>
        ) : (
          <>
            <span className="font-bold">
              {fmt(FUT[futI!])} (futures, {MONTHS[futI!]}) {DIFF[diffI!] < 0 ? '−' : '+'} {Math.abs(DIFF[diffI!])} (diff, {MONTHS[diffI!]}) = ${fmt(combined)}/t
            </span>
            {' — '}
            {edge! > 0
              ? `$${fmt(edge!)}/t BELOW the cheapest outright price the market quoted all year ($${fmt(BEST_OUTRIGHT)}, ${MONTHS[BEST_OUTRIGHT_I]}). No outright buyer could ever have paid this.`
              : edge === 0
                ? 'exactly the cheapest outright day — fixing both legs on the same day IS an outright purchase.'
                : `$${fmt(-edge!)}/t above the best outright day ($${fmt(BEST_OUTRIGHT)}, ${MONTHS[BEST_OUTRIGHT_I]}) — keep hunting: the two lows are in different months.`}
          </>
        )}
      </div>

      {/* ── Benefit 2 ── */}
      <div className="mt-6 border-t border-white/[0.07] pt-4">
        <div className="eyebrow mb-1 text-brand-cyan">Benefit 2 · Volatility without panic</div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Look again at the two bands above: when the futures rallied into November, the differential <span className="text-slate-300">fell</span>. That inverse tendency is the market&rsquo;s built-in shock absorber for the physical chain:
        </p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wide text-emerald-400">Market rallies ↑</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
              The hedged exporter&rsquo;s short futures bleed variation margin — but the physical coffee gains the same. <span className="text-slate-400">Net book: flat.</span> And with the differential softening, the buyer&rsquo;s PTBF price rises by <em>less</em> than the flat market. Nobody has an incentive to walk away from a contract.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wide text-rose-400">Market breaks ↓</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
              The mirror image: the hedge pays the exporter what the stock loses, and the fattening differential cushions the seller&rsquo;s realised price. <span className="text-slate-400">Compare the olive-oil world:</span> price triples → suppliers default; price crashes → buyers do. With a hedge, performing the contract stays the rational move in both directions.
            </p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
          Illustrative series. The inverse futures/differential relation is a strong tendency, not a law — the 2024–25 Vietnam episode (futures at records, FOB diff collapsing to −$298) is exactly this mechanism, at full violence. PTBF mechanics are built step by step later in the course.
        </p>
      </div>
    </div>
  )
}
