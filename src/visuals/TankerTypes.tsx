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
      <div className="glass rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-white/15">
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
              <tr key={t.rank} className="border-b border-white/10 last:border-0 hover:bg-white/[0.06] transition-colors">
                <td className="px-3 py-2.5 text-slate-500">{t.rank}</td>
                <td className="px-3 py-2.5 text-white font-semibold">{t.name}</td>
                <td className="px-3 py-2.5 text-slate-300 text-right">{t.length}</td>
                <td className="px-3 py-2.5 text-slate-300 text-right">{t.beam}</td>
                <td className="px-3 py-2.5 text-slate-300 text-right">{t.draft}</td>
                <td className="px-3 py-2.5 text-slate-400 text-right">{t.dwt} DWT</td>
                <td className="px-3 py-2.5 text-amber-400 text-right">{t.bbls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="glass glass-hover relative overflow-hidden rounded-2xl p-4 text-xs">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-brand-cyan" />
          <div className="eyebrow text-brand-cyan mb-1.5">Clean tankers</div>
          <div className="text-slate-300 font-mono">Gasoline · Naphtha · Gasoil · Jet fuel</div>
          <div className="text-slate-500 text-xs mt-1">No prior dirty cargo — inspected & certified</div>
        </div>
        <div className="glass glass-hover relative overflow-hidden rounded-2xl p-4 text-xs">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-600" />
          <div className="eyebrow text-amber-400 mb-1.5">Dirty tankers</div>
          <div className="text-slate-300 font-mono">Crude oil · Fuel oil · Heavy residuals</div>
          <div className="text-slate-500 text-xs mt-1">Cannot carry clean products without full tank cleaning</div>
        </div>
      </div>
    </div>
  )
}
