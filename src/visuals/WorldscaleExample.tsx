export default function WorldscaleExample() {
  const flatRate = 4.68
  const marketRate = 130
  const cargo = 80000
  const actualRate = (flatRate * marketRate / 100)
  const voyageCost = cargo * actualRate

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Worldscale explanation */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 text-xs font-mono">
        <div className="text-amber-400 uppercase tracking-widest mb-3">What is Worldscale?</div>
        <div className="text-zinc-300 leading-relaxed mb-3">
          Worldscale (W) is a standard freight rate schedule used in tanker markets. W100 = the flat rate (Worldscale Association rate) for a specific route. The actual market freight is quoted as a percentage: W130 = 130% of the flat rate.
        </div>
        <div className="border-t border-zinc-800 pt-3 space-y-1">
          <div className="flex justify-between"><span className="text-zinc-500">Formula</span><span className="text-white">Flat rate × (W / 100)</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Voyage cost</span><span className="text-white">Cargo (MT) × Actual rate</span></div>
        </div>
      </div>

      {/* Worked example */}
      <div className="bg-black border border-zinc-700 p-4 font-mono text-xs">
        <div className="text-amber-400 uppercase tracking-widest mb-3">Worked Example</div>
        <div className="space-y-1.5">
          <div className="flex justify-between"><span className="text-zinc-500">Route</span><span className="text-white">Primorsk → Rotterdam</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Cargo</span><span className="text-white">80,000 MT</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Flat rate</span><span className="text-white">$4.68/MT</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Market rate</span><span className="text-amber-400 font-bold">W130</span></div>
        </div>

        <div className="border-t border-zinc-800 mt-3 pt-3 space-y-2">
          <div>
            <div className="text-zinc-500 mb-1">Actual freight rate</div>
            <div className="text-white">$4.68 × 130/100 = <span className="text-amber-400 font-bold">${actualRate.toFixed(3)}/MT</span></div>
          </div>
          <div>
            <div className="text-zinc-500 mb-1">Total voyage cost</div>
            <div className="text-white">80,000 × ${actualRate.toFixed(3)} = <span className="text-green-400 font-bold">${voyageCost.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-3 pt-3 space-y-1">
          <div className="text-zinc-500 uppercase tracking-wider mb-1">Key terms</div>
          <div className="text-zinc-400"><span className="text-zinc-300">Laytime</span> — agreed time to load/discharge. Lay-can = layday + cancellation date.</div>
          <div className="text-zinc-400 mt-1"><span className="text-zinc-300">Demurrage</span> — penalty rate per day when laytime is exceeded during loading or discharge.</div>
        </div>
      </div>
    </div>
  )
}
