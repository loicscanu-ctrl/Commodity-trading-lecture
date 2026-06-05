const FACTORS = [
  { label: 'Stocks', color: 'bg-emerald-600' },
  { label: 'Geopolitics', color: 'bg-sky-500' },
  { label: 'Transport', color: 'bg-amber-500' },
  { label: 'Seasonality', color: 'bg-amber-500' },
  { label: 'Refining', color: 'bg-emerald-600' },
  { label: 'Quality / Location', color: 'bg-sky-500' },
  { label: 'Alternatives', color: 'bg-emerald-600' },
  { label: 'Taxation', color: 'bg-amber-500' },
  { label: 'Environment', color: 'bg-zinc-500' },
  { label: 'Renewables', color: 'bg-zinc-500' },
  { label: 'Regulation', color: 'bg-sky-500' },
  { label: 'USD', color: 'bg-emerald-600' },
]

export default function PriceFactorsGrid() {
  return (
    <div className="mt-6">
      {/* Supply → Demand header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full bg-amber-500 text-black font-bold text-sm px-6 py-3 font-mono shadow-glow">SUPPLY</div>
        <div className="flex-1 h-px bg-white/15" />
        <div className="rounded-full bg-sky-500 text-black font-bold text-sm px-6 py-3 font-mono shadow-glow">DEMAND</div>
      </div>

      {/* 3-column factor grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
        {FACTORS.map((f) => (
          <div key={f.label} className={`${f.color} rounded-xl text-white text-sm font-semibold text-center py-3 px-2 transition-all hover:-translate-y-0.5 hover:brightness-110`}>
            {f.label}
          </div>
        ))}
      </div>

      {/* Price at bottom */}
      <div className="flex justify-center mt-2.5">
        <div className="rounded-full bg-white/10 text-white font-bold text-sm px-16 py-3 font-mono">PRICE</div>
      </div>

      <p className="text-slate-500 text-xs mt-4 text-center">
        Analysis of these fundamental factors helps determine if the market is balanced, oversupplied, or undersupplied.
      </p>
    </div>
  )
}
