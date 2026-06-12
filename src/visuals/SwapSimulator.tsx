'use client'

import { useState } from 'react'

function Slider({ label, value, min, max, step, onChange, display, amber }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string; amber?: boolean
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className={`text-xs font-mono ${amber ? 'text-brand-cyan' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-xs font-mono font-bold tabular-nums ${amber ? 'text-brand-cyan' : 'text-white'}`}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 cursor-pointer ${amber ? 'accent-brand-cyan' : 'accent-brand-blue'}`} />
    </div>
  )
}

export default function SwapSimulator() {
  const [fixed, setFixed] = useState(630)
  const [floating, setFloating] = useState(653.25)
  const [volume, setVolume] = useState(5000)

  const difference = floating - fixed
  const absDiff = Math.abs(difference)
  const payment = volume * absDiff

  // Company A sold at the FIXED price and receives FLOATING.
  // floating > fixed → A pays B ; floating < fixed → B pays A ; equal → none.
  const aPays = difference > 0.0001
  const bPays = difference < -0.0001
  const noPayment = !aPays && !bPays

  // SVG bar chart dimensions
  const SVG_W = 260, SVG_H = 220
  const BASE_Y = 185
  const maxVal = Math.max(fixed, floating) * 1.12
  const sc = (v: number) => Math.max(0, (v / maxVal) * BASE_Y)

  const fixedTop = BASE_Y - sc(fixed)
  const floatTop = BASE_Y - sc(floating)

  // Payer / payee colouring
  const payerColor = '#f43f5e'   // rose
  const payeeColor = '#34d399'   // emerald
  const fixedColor = noPayment ? '#475569' : (aPays ? payeeColor : payerColor)   // A holds fixed leg
  const floatColor = noPayment ? '#475569' : (aPays ? payerColor : payeeColor)

  const fmt0 = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">Commodity Swap Settlement</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Controls */}
        <div className="space-y-3">
          <div className="eyebrow mb-1">Swap Terms</div>
          <Slider label="Fixed price ($/MT)" value={fixed} min={400} max={800} step={1} onChange={setFixed} display={`$${fmt2(fixed)}`} />
          <Slider label="Volume (MT)" value={volume} min={1000} max={20000} step={500} onChange={setVolume} display={`${fmt0(volume)} MT`} />

          <div className="border-t border-white/10 pt-3">
            <div className="eyebrow text-brand-cyan mb-1">Drag this ↓</div>
            <Slider label="Floating settlement avg ($/MT)" value={floating} min={400} max={800} step={0.25} onChange={setFloating} display={`$${fmt2(floating)}`} amber />
          </div>

          {/* Settlement breakdown */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs mt-1">
            <div className="eyebrow mb-2">Settlement</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-sm bg-brand-blue"></span><span className="text-slate-300">Fixed (Company A sold)</span></span>
                <span className="text-white tabular-nums">${fmt2(fixed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-sm bg-amber-500"></span><span className="text-slate-300">Floating average</span></span>
                <span className="text-white tabular-nums">${fmt2(floating)}</span>
              </div>
              <div className="flex justify-between border-t border-white/15 pt-1.5">
                <span className="text-white font-bold">Difference</span>
                <span className="text-white font-bold tabular-nums">{difference >= 0 ? '+' : '−'}${fmt2(absDiff)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Visualization */}
        <div>
          {/* SVG Bar Chart */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-3">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ maxHeight: '210px' }}>

              {/* Baseline */}
              <line x1="10" y1={BASE_Y} x2={SVG_W - 10} y2={BASE_Y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

              {/* Fixed bar (left) */}
              <rect x="25" y={fixedTop} width="85" height={sc(fixed)} fill={fixedColor} />
              <text x="67" y={Math.max(10, fixedTop - 6)} textAnchor="middle"
                fill="white" fontSize="11" fontFamily="monospace" fontWeight="bold">
                ${fmt2(fixed)}
              </text>
              <text x="67" y={BASE_Y + 14} textAnchor="middle"
                fill="#94a3b8" fontSize="9" fontFamily="monospace">FIXED</text>

              {/* Floating bar (right) */}
              <rect x="150" y={floatTop} width="85" height={sc(floating)} fill={floatColor} />
              <text x="192" y={Math.max(10, floatTop - 6)} textAnchor="middle"
                fill="white" fontSize="11" fontFamily="monospace" fontWeight="bold">
                ${fmt2(floating)}
              </text>
              <text x="192" y={BASE_Y + 14} textAnchor="middle"
                fill="#94a3b8" fontSize="9" fontFamily="monospace">FLOATING</text>

              {/* Gap annotation */}
              {!noPayment && Math.abs(sc(difference)) > 6 && (
                <g>
                  <line x1="112" y1={floatTop} x2="148" y2={floatTop}
                    stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="130" y1={fixedTop} x2="130" y2={floatTop}
                    stroke="#94a3b8" strokeWidth="1" />
                  <text x="130" y={Math.max(10, (fixedTop + floatTop) / 2 + 4)} textAnchor="middle"
                    fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    ${fmt2(absDiff)}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: payerColor }} />
              <span className="text-slate-400 text-xs font-mono">Payer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: payeeColor }} />
              <span className="text-slate-400 text-xs font-mono">Payee</span>
            </div>
          </div>

          {/* Result */}
          <div className={`rounded-xl p-3 border font-mono text-xs tabular-nums transition-colors duration-200 ${
            noPayment
              ? 'border-white/10 bg-white/[0.03] text-slate-400'
              : 'border-rose-500/30 bg-rose-500/[0.08] text-rose-200'
          }`}>
            {noPayment ? (
              <>
                <div className="text-slate-100 font-bold mb-1">NO PAYMENT</div>
                <div>Floating ${fmt2(floating)} = Fixed ${fmt2(fixed)}</div>
                <div className="text-slate-500 mt-1">The swap settles flat — no cash changes hands.</div>
              </>
            ) : aPays ? (
              <>
                <div className="text-rose-300 font-bold mb-1">FLOATING ABOVE FIXED</div>
                <div>Floating ${fmt2(floating)} &gt; Fixed ${fmt2(fixed)} → <span className="text-rose-300 font-bold">Company A pays Company B</span></div>
                <div className="text-white font-bold text-2xl mt-1.5">${fmt0(payment)}</div>
                <div className="text-slate-400 mt-1">{fmt0(volume)} MT × ${fmt2(absDiff)} = ${fmt0(payment)}</div>
              </>
            ) : (
              <>
                <div className="text-emerald-300 font-bold mb-1">FLOATING BELOW FIXED</div>
                <div>Floating ${fmt2(floating)} &lt; Fixed ${fmt2(fixed)} → <span className="text-emerald-300 font-bold">Company B pays Company A</span></div>
                <div className="text-white font-bold text-2xl mt-1.5">${fmt0(payment)}</div>
                <div className="text-slate-400 mt-1">{fmt0(volume)} MT × ${fmt2(absDiff)} = ${fmt0(payment)}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
