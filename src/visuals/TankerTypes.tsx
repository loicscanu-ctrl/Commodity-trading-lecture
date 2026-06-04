const TANKERS = [
  { rank: '1', name: 'Coastal tankers', length: '205 m', beam: '29 m', draft: '16 m', dwt: '25,000–70,000', bbls: '~180k–525k' },
  { rank: '2', name: 'Aframax', length: '245 m', beam: '34 m', draft: '20 m', dwt: '80,000–120,000', bbls: '~600k–900k' },
  { rank: '3', name: 'Suezmax', length: '285 m', beam: '45 m', draft: '23 m', dwt: '120,000–160,000', bbls: '~900k–1.125M' },
  { rank: '4', name: 'VLCC', length: '350 m', beam: '55 m', draft: '28 m', dwt: '160,000–320,000', bbls: '~1.2M–2.4M' },
  { rank: '5', name: 'ULCC', length: '415 m', beam: '63 m', draft: '35 m', dwt: '320,000+', bbls: '~2.4M+' },
]

export default function TankerTypes() {
  return (
    <div className="mt-6">
      <div className="bg-zinc-900 border border-zinc-800 overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="px-3 py-2 text-amber-400 text-left font-normal uppercase tracking-wider">#</th>
              <th className="px-3 py-2 text-amber-400 text-left font-normal uppercase tracking-wider">Type</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">Length</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">Beam</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">Draft</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">DWT</th>
              <th className="px-3 py-2 text-amber-400 text-right font-normal uppercase tracking-wider">Approx. bbl</th>
            </tr>
          </thead>
          <tbody>
            {TANKERS.map((t) => (
              <tr key={t.rank} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800 transition-colors">
                <td className="px-3 py-2.5 text-zinc-600">{t.rank}</td>
                <td className="px-3 py-2.5 text-white font-semibold">{t.name}</td>
                <td className="px-3 py-2.5 text-zinc-300 text-right">{t.length}</td>
                <td className="px-3 py-2.5 text-zinc-300 text-right">{t.beam}</td>
                <td className="px-3 py-2.5 text-zinc-300 text-right">{t.draft}</td>
                <td className="px-3 py-2.5 text-zinc-400 text-right">{t.dwt} DWT</td>
                <td className="px-3 py-2.5 text-amber-400 text-right">{t.bbls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-3 text-xs font-mono">
          <div className="text-amber-400 uppercase tracking-wider mb-1">Clean tankers</div>
          <div className="text-zinc-400">Gasoline · Naphtha · Gasoil · Jet fuel</div>
          <div className="text-zinc-500 text-xs mt-1">No prior dirty cargo — inspected & certified</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 text-xs font-mono">
          <div className="text-zinc-400 uppercase tracking-wider mb-1">Dirty tankers</div>
          <div className="text-zinc-400">Crude oil · Fuel oil · Heavy residuals</div>
          <div className="text-zinc-500 text-xs mt-1">Cannot carry clean products without full tank cleaning</div>
        </div>
      </div>
    </div>
  )
}
