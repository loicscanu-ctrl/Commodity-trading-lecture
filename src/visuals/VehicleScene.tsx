export default function VehicleScene() {
  return (
    <div className="mt-6 bg-black border border-zinc-800 overflow-hidden" style={{ height: '130px' }}>
      <svg viewBox="0 0 400 130" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Sky gradient effect */}
        <rect x="0" y="0" width="400" height="85" fill="#09090b" />

        {/* Stars */}
        {[[30,15],[80,8],[150,20],[230,12],[310,18],[370,7],[55,30],[190,5],[280,25]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.8" fill="#f59e0b" opacity="0.4" />
        ))}

        {/* Trade route dashed line */}
        <path d="M20,88 Q200,60 380,88" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.3" />

        {/* Water */}
        <rect x="0" y="85" width="400" height="45" fill="#0c1a2e" />
        {[0,50,100,150,200,250,300,350].map(x => (
          <path key={x} d={`M${x},88 Q${x+12},84 ${x+25},88`} fill="none" stroke="#1e3a8a" strokeWidth="0.8" opacity="0.6" />
        ))}
        {[0,50,100,150,200,250,300,350].map(x => (
          <path key={x} d={`M${x+5},95 Q${x+17},91 ${x+30},95`} fill="none" stroke="#1e3a8a" strokeWidth="0.6" opacity="0.3" />
        ))}

        {/* Ship hull */}
        <path d="M150,72 L250,72 L242,88 L158,88 Z" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />

        {/* Mast */}
        <line x1="200" y1="18" x2="200" y2="72" stroke="#52525b" strokeWidth="1.5" />

        {/* Main sail — amber */}
        <path d="M200,20 L200,66 L238,56 L238,24 Z" fill="#f59e0b" opacity="0.75" />
        <line x1="200" y1="42" x2="238" y2="38" stroke="#92400e" strokeWidth="0.5" opacity="0.5" />

        {/* Small front sail */}
        <path d="M200,22 L200,50 L168,40 Z" fill="#f59e0b" opacity="0.45" />

        {/* Cargo */}
        <rect x="162" y="60" width="18" height="12" fill="#1c1c1c" stroke="#3f3f46" strokeWidth="0.5" />
        <rect x="184" y="60" width="18" height="12" fill="#262626" stroke="#3f3f46" strokeWidth="0.5" />
        <rect x="220" y="60" width="18" height="12" fill="#1c1c1c" stroke="#3f3f46" strokeWidth="0.5" />

        {/* Route labels */}
        <text x="22" y="108" fill="#52525b" fontSize="8" fontFamily="monospace">BYZANTIUM</text>
        <text x="330" y="108" fill="#52525b" fontSize="8" fontFamily="monospace">ROME</text>

        {/* Reflection */}
        <path d="M150,88 L250,88 L242,96 L158,96 Z" fill="#1e293b" opacity="0.4" />
      </svg>
    </div>
  )
}
