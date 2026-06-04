export default function RiddleScene() {
  const dotAngles = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <div className="mt-6 flex justify-center">
      <svg viewBox="0 0 280 200" className="w-full max-w-xs opacity-80" style={{ maxHeight: '180px' }}>
        {/* Outer ring */}
        <circle cx="140" cy="100" r="88" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="140" cy="100" r="78" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.4" />
        {/* Inner fill */}
        <circle cx="140" cy="100" r="77" fill="#09090b" />
        {/* Dot border markers */}
        {dotAngles.map(a => {
          const rad = (a * Math.PI) / 180
          return (
            <circle key={a}
              cx={140 + 83 * Math.cos(rad)}
              cy={100 + 83 * Math.sin(rad)}
              r="1.8" fill="#f59e0b" opacity="0.5" />
          )
        })}
        {/* Profile silhouette (simplified) */}
        <ellipse cx="140" cy="85" rx="22" ry="26" fill="#1c1917" stroke="#78716c" strokeWidth="0.5" />
        <ellipse cx="152" cy="78" rx="10" ry="14" fill="#1c1917" />
        {/* ANNO label */}
        <text x="140" y="128" textAnchor="middle" fill="#78716c" fontSize="9" fontFamily="monospace" letterSpacing="3">ANNO · XXXIII</text>
        {/* Value label */}
        <text x="140" y="148" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">I QUADRANS</text>
        <text x="140" y="162" textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace">≈ $1.50</text>
        {/* Mandate text */}
        <text x="140" y="190" textAnchor="middle" fill="#3f3f46" fontSize="8" fontFamily="monospace" letterSpacing="1">THE 2000-YEAR MANDATE</text>
      </svg>
    </div>
  )
}
