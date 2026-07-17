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
  // Crude oil in $/bbl: spot at $60, contango adding ~$9 of carry over the
  // strip, backwardation stripping ~$10 of shortage premium off the deferred.
  const SPOT = 60
  const PMIN = 46, PMAX = 74

  const x = (m: number) => ml + (m / MONTHS) * pw
  const y = (p: number) => mt + (1 - (p - PMIN) / (PMAX - PMIN)) * ph

  const contangoPrice = (t: number) => SPOT + 9 * (1 - Math.exp(-t / 3.5))
  const backwardPrice = (t: number) => SPOT - 10 * (1 - Math.exp(-t / 3.5))

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
    <div className="mt-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '300px' }}>
        {ticks.map(t => (
          <line key={t} x1={x(t)} y1={mt} x2={x(t)} y2={axisBottom} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        <line x1={ml} y1={mt} x2={ml} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <line x1={ml} y1={axisBottom} x2={ml + pw} y2={axisBottom} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

        <path d={contangoPath} fill="none" stroke="#fb923c" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={backwardPath} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {ticks.map((t, i) => {
          const cx = x(t)
          const pC = contangoPrice(t)
          const pB = backwardPrice(t)
          const cyC = y(pC)
          const cyB = y(pB)
          const lx = cx, ly = axisBottom + 10
          return (
            <g key={t}>
              <line x1={cx} y1={axisBottom} x2={cx} y2={axisBottom + 5} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
              <circle cx={cx} cy={cyC} r="3.5" fill="#fb923c" stroke="#070912" strokeWidth="1" />
              <circle cx={cx} cy={cyB} r="3.5" fill="#34d399" stroke="#070912" strokeWidth="1" />
              {/* example prices: contango above its points, backwardation below */}
              <text x={cx} y={cyC - 7} textAnchor="middle" fill="#fdba74" fontSize="7" fontFamily="monospace">
                {pC.toFixed(1)}
              </text>
              <text x={cx} y={cyB + 13} textAnchor="middle" fill="#6ee7b7" fontSize="7" fontFamily="monospace">
                {pB.toFixed(1)}
              </text>
              <text x={lx} y={ly} textAnchor="end" fill="#94a3b8" fontSize="8.5" fontFamily="monospace"
                transform={`rotate(-45 ${lx} ${ly})`}>{CONTRACTS[i]}</text>
            </g>
          )
        })}

        <circle cx={spotX} cy={spotY} r="5.5" fill="#3b82f6" />
        <circle cx={spotX} cy={spotY} r="9" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
        <text x={11} y={mt + ph / 2} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace"
          transform={`rotate(-90 11 ${mt + ph / 2})`}>PRICE $/bbl</text>
        <text x={spotX + 12} y={spotY - 6} fill="#22d3ee" fontSize="9.5" fontFamily="monospace" fontWeight="bold">SPOT $60.00</text>
        <text x={x(tLabel) + 8} y={contangoLabelY - 20} fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">CONTANGO</text>
        <text x={x(tLabel) + 8} y={contangoLabelY - 8} fill="#94a3b8" fontSize="8" fontFamily="monospace">futures {'>'} spot</text>
        <text x={x(tLabel) + 8} y={backwardLabelY + 26} fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">BACKWARDATION</text>
        <text x={x(tLabel) + 8} y={backwardLabelY + 39} fill="#94a3b8" fontSize="8" fontFamily="monospace">futures {'<'} spot</text>
      </svg>
    </div>
  )
}
