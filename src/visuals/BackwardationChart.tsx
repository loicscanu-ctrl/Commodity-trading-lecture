const CONTRACTS = [
  'CL F27','CL G27','CL H27','CL J27','CL K27','CL M27',
  'CL N27','CL Q27','CL U27','CL V27','CL X27','CL Z27','CL F28',
]

// The three classic causes of backwardation, each with a small pictogram.
const CAUSES = [
  {
    title: 'Supply shortage',
    desc: 'Bad harvest, port strike, pipeline outage — nearby barrels suddenly cannot be found, and the prompt price pays whatever it takes.',
    example: 'Brazilian frost · HCM port congestion · 2022 gasoil',
    hex: '#f43f5e',
    icon: (
      // storm cloud + lightning over a wilted stalk
      <g fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 15 a6 6 0 0 1 6-6 a7 7 0 0 1 13 2 a5 5 0 0 1 1 10 H14 a5 5 0 0 1-4-6 z" />
        <path d="M22 23 L18 30 h5 L19 37" />
        <path d="M9 37 q1-6 0-9 m0 9 q-3-2-4-5 m4 5 q3-3 3-6" opacity="0.7" />
      </g>
    ),
  },
  {
    title: 'Seasonal demand peak',
    desc: 'Heating oil in winter, gasoline in driving season, power in a cold snap — demand spikes NOW while later months stay calm.',
    example: 'Henry Hub’s Jan premium · RBOB’s summer',
    hex: '#f59e0b',
    icon: (
      // thermometer + flame
      <g fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 8 v18 a5 5 0 1 0 6 0 V8 a3 3 0 0 0-6 0 z" />
        <line x1="17" y1="14" x2="17" y2="28" strokeWidth="3" opacity="0.6" />
        <path d="M31 20 q4 4 2 9 a5.5 5.5 0 0 1-10 -1 q-1-5 4-8 q-1 4 2 5 q2-2 2-5 z" />
      </g>
    ),
  },
  {
    title: 'Inventory drawdown',
    desc: 'Warehouse and tank stocks run low: no buffer between today and trouble, so the convenience of holding physical NOW earns a premium.',
    example: 'Robusta certified stocks at multi-year lows',
    hex: '#22d3ee',
    icon: (
      // stacked boxes emptying, arrow down
      <g fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="26" width="10" height="9" />
        <rect x="19" y="26" width="10" height="9" />
        <rect x="13" y="15" width="10" height="9" opacity="0.45" strokeDasharray="2.5 2.5" />
        <path d="M33 12 v14 m0 0 l-3.5-4 m3.5 4 l3.5-4" />
      </g>
    ),
  },
]

export default function BackwardationChart() {
  const W = 580, H = 280
  const ml = 48, mr = 24, mt = 20, mb = 76
  const pw = W - ml - mr
  const ph = H - mt - mb

  const MONTHS = 13
  // Crude in $/bbl: spot $60 commanding a ~$10 shortage premium over the strip
  const SPOT = 60
  const PMIN = 46, PMAX = 64

  const x = (m: number) => ml + (m / MONTHS) * pw
  const y = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph

  const backwardPrice = (t: number) => SPOT - 10 * (1 - Math.exp(-t / 3.5))

  const N = 80
  const path = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * MONTHS
    return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(1)},${y(backwardPrice(t)).toFixed(1)}`
  }).join(' ')

  const ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  const spotX = x(0), spotY = y(SPOT)
  const axisBottom = mt + ph

  // Spot reference line (horizontal dashed)
  const spotLineY = spotY

  // Spread annotation at t=6
  const t6 = 6
  const p6 = backwardPrice(t6)

  return (
    <div className="mt-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '260px' }}>
        {/* Grid */}
        {ticks.map(t => (
          <line key={t} x1={x(t)} y1={mt} x2={x(t)} y2={axisBottom} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}

        {/* Spot reference line */}
        <line x1={ml} y1={spotLineY} x2={ml + pw} y2={spotLineY}
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

        {/* Axes */}
        <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

        {/* Backwardation curve */}
        <path d={path} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Spread arrow at t=6: the premium spot commands over the deferred */}
        <line x1={x(t6)} y1={spotLineY} x2={x(t6)} y2={y(p6)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
        <text x={x(t6) + 5} y={(spotLineY + y(p6)) / 2 + 4} fill="#94a3b8" fontSize="8" fontFamily="monospace">
          shortage premium −${(SPOT - p6).toFixed(2)}
        </text>

        {/* Markers with example prices below each point */}
        {ticks.map((t, i) => {
          const cx = x(t)
          const p = backwardPrice(t)
          const cy = y(p)
          const lx = cx, ly = axisBottom + 10
          return (
            <g key={t}>
              <line x1={cx} y1={axisBottom} x2={cx} y2={axisBottom + 5} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="3.5" fill="#34d399" stroke="#070912" strokeWidth="1" />
              <text x={cx} y={cy + 13} textAnchor="middle" fill="#6ee7b7" fontSize="7" fontFamily="monospace">
                {p.toFixed(1)}
              </text>
              <text x={lx} y={ly} textAnchor="end" fill="#94a3b8" fontSize="8.5" fontFamily="monospace"
                transform={`rotate(-45 ${lx} ${ly})`}>{CONTRACTS[i]}</text>
            </g>
          )
        })}

        {/* Spot dot */}
        <circle cx={spotX} cy={spotY} r="5.5" fill="#3b82f6" />
        <circle cx={spotX} cy={spotY} r="9" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />

        {/* Labels */}
        <text x={11} y={mt + ph / 2} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace"
          transform={`rotate(-90 11 ${mt + ph / 2})`}>PRICE $/bbl</text>
        <text x={spotX + 12} y={spotY - 8} fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">SPOT $60.00</text>

        {/* Backwardation label */}
        <text x={x(9)} y={y(backwardPrice(9)) - 22} fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">BACKWARDATION</text>
        <text x={x(9)} y={y(backwardPrice(9)) - 10} fill="#94a3b8" fontSize="8" fontFamily="monospace">futures {'<'} spot</text>
      </svg>

      {/* What puts a market into backwardation */}
      <div className="mt-4 border-t border-white/[0.07] pt-4">
        <div className="eyebrow mb-3">What puts a market into backwardation</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CAUSES.map(c => (
            <div key={c.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">{c.icon}</svg>
              <div className="mt-2 font-mono text-xs font-bold" style={{ color: c.hex }}>{c.title}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{c.desc}</p>
              <p className="mt-1.5 font-mono text-[9px] text-slate-500">{c.example}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          All three are the same message in different clothes: <span className="text-slate-300">someone needs the physical NOW</span> and there is not enough of it nearby — so the prompt price carries a premium the deferred months refuse to pay.
        </p>
      </div>
    </div>
  )
}
