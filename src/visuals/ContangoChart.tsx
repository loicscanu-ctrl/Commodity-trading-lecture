const CONTRACTS = [
  'CL F27','CL G27','CL H27','CL J27','CL K27','CL M27',
  'CL N27','CL Q27','CL U27','CL V27','CL X27','CL Z27','CL F28',
]

export default function ContangoChart() {
  const W = 580, H = 280
  const ml = 48, mr = 24, mt = 20, mb = 76
  const pw = W - ml - mr
  const ph = H - mt - mb

  const MONTHS = 13
  const SPOT = 100
  const PMIN = 70, PMAX = 158

  const x = (m: number) => ml + (m / MONTHS) * pw
  const y = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph

  const contangoPrice = (t: number) => SPOT + 48 * (1 - Math.exp(-t / 3.5))

  const N = 80
  const path = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * MONTHS
    return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(1)},${y(contangoPrice(t)).toFixed(1)}`
  }).join(' ')

  const ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  const spotX = x(0), spotY = y(SPOT)
  const axisBottom = mt + ph

  // Spot reference line (horizontal dashed)
  const spotLineY = spotY

  // Spread annotation at t=6
  const t6 = 6
  const p6 = contangoPrice(t6)
  const spreadPx = spotY - y(p6)

  return (
    <div className="mt-6 bg-black border border-zinc-800 p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '260px' }}>
        {/* Grid */}
        {ticks.map(t => (
          <line key={t} x1={x(t)} y1={mt} x2={x(t)} y2={axisBottom} stroke="#27272a" strokeWidth="1" />
        ))}

        {/* Spot reference line */}
        <line x1={ml} y1={spotLineY} x2={ml + pw} y2={spotLineY}
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

        {/* Axes */}
        <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="#3f3f46" strokeWidth="1" />
        <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="#3f3f46" strokeWidth="1" />

        {/* Contango curve */}
        <path d={path} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Spread arrow at t=6 */}
        <line x1={x(t6)} y1={spotLineY} x2={x(t6)} y2={y(p6)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
        <text x={x(t6) + 5} y={(spotLineY + y(p6)) / 2 + 4} fill="#94a3b8" fontSize="8" fontFamily="monospace">cost of carry</text>

        {/* Markers */}
        {ticks.map((t, i) => {
          const cx = x(t)
          const cy = y(contangoPrice(t))
          const lx = cx, ly = axisBottom + 10
          return (
            <g key={t}>
              <line x1={cx} y1={axisBottom} x2={cx} y2={axisBottom + 5} stroke="#3f3f46" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
              <text x={lx} y={ly} textAnchor="end" fill="#71717a" fontSize="8.5" fontFamily="monospace"
                transform={`rotate(-45 ${lx} ${ly})`}>{CONTRACTS[i]}</text>
            </g>
          )
        })}

        {/* Spot dot */}
        <circle cx={spotX} cy={spotY} r="5.5" fill="#3b82f6" />
        <circle cx={spotX} cy={spotY} r="9" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />

        {/* Labels */}
        <text x={11} y={mt + ph / 2} textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace"
          transform={`rotate(-90 11 ${mt + ph / 2})`}>PRICE</text>
        <text x={spotX + 12} y={spotY - 6} fill="#60a5fa" fontSize="9" fontFamily="monospace" fontWeight="bold">SPOT</text>

        {/* Contango label */}
        <text x={x(9)} y={y(contangoPrice(9)) - 10} fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">CONTANGO</text>
        <text x={x(9)} y={y(contangoPrice(9)) + 3} fill="#78716c" fontSize="8" fontFamily="monospace">futures {'>'} spot</text>
      </svg>
    </div>
  )
}
