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
      <div className="glass relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between">
        <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-500" />
        <div>
          <div className="eyebrow text-amber-400 mb-5">The Only Calculation</div>
          <div className="text-7xl font-mono font-bold text-amber-400 leading-none">1.61%</div>
          <div className="eyebrow mt-2 mb-5">Net Annual Yield · Uninterrupted · 2,000 Years</div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 font-mono text-amber-300 text-sm text-center mb-5">
            V(t) = 1.50 × (1 + 0.0161)^1993
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-slate-400">
            <span className="text-amber-400 shrink-0">→</span>
            <span>Trader owns neither field nor ship. Owns the <span className="text-white font-medium">temporary title</span> to wheat, salt, oil.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-400">
            <span className="text-amber-400 shrink-0">→</span>
            <span>If Rome burns, no factories to lose. The flow <span className="text-white font-medium">reroutes to Byzantium</span>.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-400">
            <span className="text-amber-400 shrink-0">→</span>
            <span>Physical trading is not a financial anomaly. It is the <span className="text-white font-medium">ultimate arbiter of time</span>.</span>
          </div>
        </div>
      </div>

      {/* Right: Historical table */}
      <div className="glass rounded-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-3 border-b border-white/10">
          <div className="eyebrow">Capital Through the Ages</div>
        </div>
        <table className="w-full text-xs font-mono flex-1">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-2.5 text-slate-500 font-normal text-left uppercase tracking-wider">Era</th>
              <th className="px-4 py-2.5 text-slate-500 font-normal text-left uppercase tracking-wider">Flow Vector</th>
              <th className="px-4 py-2.5 text-slate-500 font-normal text-right uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody>
            {TABLE.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.04]">
                <td className="px-4 py-3 text-slate-400">{row.era}</td>
                <td className="px-4 py-3 text-slate-300">{row.flow}</td>
                <td className="px-4 py-3 text-right">
                  <div className="text-amber-400 font-bold">{row.value}</div>
                  {row.note && <div className="text-slate-500 text-xs">{row.note}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-white/10 text-slate-500 text-xs italic">
          &ldquo;Physical commodity trading is the guardian of the world&apos;s equilibrium.&rdquo;
        </div>
      </div>
    </div>
  )
}
