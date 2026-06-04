// WTI contract codes starting from F27 (January 2027)
// F=Jan G=Feb H=Mar J=Apr K=May M=Jun N=Jul Q=Aug U=Sep V=Oct X=Nov Z=Dec
const CONTRACTS = [
  'CL F27', // Jan 2027
  'CL G27', // Feb 2027
  'CL H27', // Mar 2027
  'CL J27', // Apr 2027
  'CL K27', // May 2027
  'CL M27', // Jun 2027
  'CL N27', // Jul 2027
  'CL Q27', // Aug 2027
  'CL U27', // Sep 2027
  'CL V27', // Oct 2027
  'CL X27', // Nov 2027
  'CL Z27', // Dec 2027
  'CL F28', // Jan 2028
]

export default function TermStructureChart() {
  const W = 580, H = 330
  const ml = 48, mr = 24, mt = 20, mb = 76
  const pw = W - ml - mr
  const ph = H - mt - mb

  const MONTHS = 13
  const SPOT = 100
  const PMIN = 40, PMAX = 155

  const x = (m: number) => ml + (m / MONTHS) * pw
  const y = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph

  const contangoPrice = (t: number) => SPOT + 48 * (1 - Math.exp(-t / 3.5))
  const backwardPrice = (t: number) => SPOT - 55 * (1 - Math.exp(-t / 3.5))

  const N = 80
  const contangoPath = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * MONTHS
    return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(1)},${y(contangoPrice(t)).toFixed(1)}`
  }).join(' ')

  const backwardPath = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * MONTHS
    return `${i === 0 ? 'M' : 'L'}${x(t).toFixed(1)},${y(backwardPrice(t)).toFixed(1)}`
  }).join(' ')

  const ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  const spotX = x(0), spotY = y(SPOT)
  const axisBottom = mt + ph

  const tLabel = 3
  const contangoLabelY = y(contangoPrice(tLabel))
  const backwardLabelY = y(backwardPrice(tLabel))

  return (
    <div className="mt-6 bg-black border border-zinc-800 p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '300px' }}>
        {ticks.map(t => (
          <line key={t} x1={x(t)} y1={mt} x2={x(t)} y2={axisBottom} stroke="#27272a" strokeWidth="1" />
        ))}
        <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="#3f3f46" strokeWidth="1" />
        <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="#3f3f46" strokeWidth="1" />

        <path d={contangoPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={backwardPath} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {ticks.map((t, i) => {
          const cx = x(t)
          const cyC = y(contangoPrice(t))
          const cyB = y(backwardPrice(t))
          const lx = cx, ly = axisBottom + 10
          return (
            <g key={t}>
              <line x1={cx} y1={axisBottom} x2={cx} y2={axisBottom + 5} stroke="#3f3f46" strokeWidth="1" />
              <circle cx={cx} cy={cyC} r="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
              <circle cx={cx} cy={cyB} r="3.5" fill="#22c55e" stroke="#14532d" strokeWidth="1" />
              <text x={lx} y={ly} textAnchor="end" fill="#71717a" fontSize="8.5" fontFamily="monospace"
                transform={`rotate(-45 ${lx} ${ly})`}>{CONTRACTS[i]}</text>
            </g>
          )
        })}

        <circle cx={spotX} cy={spotY} r="5.5" fill="#3b82f6" />
        <circle cx={spotX} cy={spotY} r="9" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
        <text x={11} y={mt + ph / 2} textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace"
          transform={`rotate(-90 11 ${mt + ph / 2})`}>PRICE</text>
        <text x={spotX + 12} y={spotY - 6} fill="#60a5fa" fontSize="9.5" fontFamily="monospace" fontWeight="bold">SPOT</text>
        <text x={x(tLabel) + 8} y={contangoLabelY - 8} fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">CONTANGO</text>
        <text x={x(tLabel) + 8} y={contangoLabelY + 5} fill="#78716c" fontSize="8" fontFamily="monospace">futures {'>'} spot</text>
        <text x={x(tLabel) + 8} y={backwardLabelY + 16} fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">BACKWARDATION</text>
        <text x={x(tLabel) + 8} y={backwardLabelY + 29} fill="#78716c" fontSize="8" fontFamily="monospace">futures {'<'} spot</text>
      </svg>
    </div>
  )
}
