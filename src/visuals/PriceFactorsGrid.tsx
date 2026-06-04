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
        <div className="bg-amber-500 text-black font-bold text-sm px-6 py-3 font-mono">SUPPLY</div>
        <div className="flex-1 h-px bg-zinc-600" />
        <div className="bg-sky-500 text-black font-bold text-sm px-6 py-3 font-mono">DEMAND</div>
      </div>

      {/* 3-column factor grid */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {FACTORS.map((f) => (
          <div key={f.label} className={`${f.color} text-white text-sm font-semibold text-center py-3 px-2`}>
            {f.label}
          </div>
        ))}
      </div>

      {/* Price at bottom */}
      <div className="flex justify-center mt-2">
        <div className="bg-zinc-600 text-white font-bold text-sm px-16 py-3 font-mono">PRICE</div>
      </div>

      <p className="text-zinc-500 text-xs font-mono mt-4 text-center">
        Analysis of these fundamental factors helps determine if the market is balanced, oversupplied, or undersupplied.
      </p>
    </div>
  )
}
