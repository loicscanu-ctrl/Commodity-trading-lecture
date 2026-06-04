export default function TermStructureChart() {
  const W = 560, H = 290
  const ml = 48, mr = 24, mt = 20, mb = 44
  const pw = W - ml - mr
  const ph = H - mt - mb

  const MONTHS = 13
  const SPOT = 100
  const PMIN = 40, PMAX = 155

  const x = (m: number) => ml + (m / MONTHS) * pw
  const y = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph

  const N = 80
  const contangoPath = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * MONTHS
    const p = SPOT + 48 * (1 - Math.exp(-t / 3.5))
    return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(1)},${y(p).toFixed(1)}`
  }).join(' ')

  const backwardPath = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * MONTHS
    const p = SPOT - 55 * (1 - Math.exp(-t / 3.5))
    return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(1)},${y(p).toFixed(1)}`
  }).join(' ')

  const spotX = x(0), spotY = y(SPOT)
  const ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

  const tLabel = 8
  const contangoLabelY = y(SPOT + 48 * (1 - Math.exp(-tLabel / 3.5)))
  const backwardLabelY = y(SPOT - 55 * (1 - Math.exp(-tLabel / 3.5)))

  return (
    <div className="mt-6 bg-black border border-zinc-800 p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '260px' }}>
        {/* Grid lines */}
        {ticks.map(t => (
          <line key={t} x1={x(t)} y1={mt} x2={x(t)} y2={mt + ph} stroke="#27272a" strokeWidth="1" />
        ))}

        {/* Axes */}
        <line x1={ml} y1={mt} x2={ml} y2={mt + ph} stroke="#3f3f46" strokeWidth="1" />
        <line x1={ml} y1={mt + ph} x2={ml + pw} y2={mt + ph} stroke="#3f3f46" strokeWidth="1" />

        {/* Contango curve — amber */}
        <path d={contangoPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Backwardation curve — green */}
        <path d={backwardPath} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Spot price dot */}
        <circle cx={spotX} cy={spotY} r="5.5" fill="#3b82f6" />
        <circle cx={spotX} cy={spotY} r="9" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />

        {/* X axis ticks + labels */}
        {ticks.map(t => (
          <g key={t}>
            <line x1={x(t)} y1={mt + ph} x2={x(t)} y2={mt + ph + 4} stroke="#3f3f46" strokeWidth="1" />
            <text x={x(t)} y={mt + ph + 16} textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace">{t}</text>
          </g>
        ))}

        {/* Axis labels */}
        <text x={ml + pw / 2} y={H - 3} textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace" letterSpacing="1">MONTHS FROM EXPIRATION</text>
        <text x={11} y={mt + ph / 2} textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace" letterSpacing="1" transform={`rotate(-90 11 ${mt + ph / 2})`}>PRICE</text>

        {/* Spot label */}
        <text x={spotX + 12} y={spotY - 6} fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="bold">SPOT PRICE</text>

        {/* Contango label */}
        <text x={x(tLabel) + 8} y={contangoLabelY - 6} fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">CONTANGO</text>
        <text x={x(tLabel) + 8} y={contangoLabelY + 7} fill="#78716c" fontSize="8" fontFamily="monospace">futures {'>'} spot</text>

        {/* Backwardation label */}
        <text x={x(tLabel) + 8} y={backwardLabelY + 14} fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">BACKWARDATION</text>
        <text x={x(tLabel) + 8} y={backwardLabelY + 27} fill="#78716c" fontSize="8" fontFamily="monospace">futures {'<'} spot</text>
      </svg>
    </div>
  )
}
