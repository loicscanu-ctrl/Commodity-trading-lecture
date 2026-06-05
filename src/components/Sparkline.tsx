type Props = {
  data: number[]
  color?: string
  className?: string
  width?: number
  height?: number
}

/**
 * Lightweight inline SVG sparkline — a soft area + line used as the
 * texture behind Hero KPI cards. Deterministic from its `data` prop.
 */
export default function Sparkline({
  data,
  color = '#3b82f6',
  className = '',
  width = 200,
  height = 56,
}: Props) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const stepX = width / (data.length - 1)

  const pts = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / span) * (height - 8) - 4
    return [x, y] as const
  })

  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`
  const gid = `spark-${color.replace('#', '')}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      width={width}
      height={height}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
