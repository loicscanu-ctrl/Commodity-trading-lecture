export default function GeometricMultiplier() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-6">
      <div className="text-center shrink-0">
        <div className="text-6xl font-mono font-bold text-amber-400 leading-none">1.61%</div>
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2">Net Annual Yield</div>
      </div>
      <div className="flex-1">
        <div className="bg-black border border-zinc-700 px-6 py-4 text-center font-mono text-amber-300 text-base tracking-wide mb-4">
          V(t) = 1.50 × (1 + 0.0161)^1993
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          A difference of just <span className="text-white font-bold">0.11%</span> separates a simple asset manager from a force capable of buying the Earth&apos;s entire infrastructure.
        </p>
      </div>
    </div>
  )
}
