export default function MandateReveal() {
  const TABLE = [
    { era: '500 AD · Byzantium', flow: 'Grain & Salt',      value: '6 gold Solidi',        note: 'price of a horse' },
    { era: '1300 AD · Venice',   flow: 'Spices & Wool',     value: '6 million Florins',     note: '' },
    { era: '1700 AD · London',   flow: 'Coffee & Copper',   value: 'Billions £ Sterling',   note: '' },
    { era: '2026 · World',       flow: 'Energy & Data',     value: '$100 Trillion',         note: 'mandate fulfilled' },
  ]

  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left: The formula + vehicle concept */}
      <div className="bg-black border border-zinc-800 p-6 flex flex-col justify-between">
        <div>
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-5">The Only Calculation</div>
          <div className="text-7xl font-mono font-bold text-amber-400 leading-none">1.61%</div>
          <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1 mb-5">Net Annual Yield · Uninterrupted · 2,000 Years</div>
          <div className="bg-zinc-950 border border-zinc-700 px-4 py-3 font-mono text-amber-300 text-sm text-center mb-5">
            V(t) = 1.50 × (1 + 0.0161)^1993
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs font-mono">
          <div className="flex items-start gap-2 text-zinc-400">
            <span className="text-amber-500 shrink-0">→</span>
            <span>Trader owns neither field nor ship. Owns the <span className="text-white">temporary title</span> to wheat, salt, oil.</span>
          </div>
          <div className="flex items-start gap-2 text-zinc-400">
            <span className="text-amber-500 shrink-0">→</span>
            <span>If Rome burns, no factories to lose. The flow <span className="text-white">reroutes to Byzantium</span>.</span>
          </div>
          <div className="flex items-start gap-2 text-zinc-400">
            <span className="text-amber-500 shrink-0">→</span>
            <span>Physical trading is not a financial anomaly. It is the <span className="text-white">ultimate arbiter of time</span>.</span>
          </div>
        </div>
      </div>

      {/* Right: Historical table */}
      <div className="bg-black border border-zinc-800 flex flex-col">
        <div className="px-5 py-3 border-b border-zinc-800">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Capital Through the Ages</div>
        </div>
        <table className="w-full text-xs font-mono flex-1">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-2 text-zinc-600 font-normal text-left">Era</th>
              <th className="px-4 py-2 text-zinc-600 font-normal text-left">Flow Vector</th>
              <th className="px-4 py-2 text-zinc-600 font-normal text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {TABLE.map((row, i) => (
              <tr key={i} className="border-b border-zinc-900 last:border-0">
                <td className="px-4 py-3 text-zinc-500">{row.era}</td>
                <td className="px-4 py-3 text-zinc-400">{row.flow}</td>
                <td className="px-4 py-3 text-right">
                  <div className="text-amber-400 font-bold">{row.value}</div>
                  {row.note && <div className="text-zinc-600 text-xs">{row.note}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-zinc-800 text-zinc-600 text-xs italic">
          &ldquo;Physical commodity trading is the guardian of the world&apos;s equilibrium.&rdquo;
        </div>
      </div>
    </div>
  )
}
