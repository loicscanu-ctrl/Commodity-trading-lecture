const CONVERSIONS = [
  { product: 'Brent Crude', factor: '7.55' },
  { product: 'Dubai Crude', factor: '7.30' },
  { product: 'Naphtha', factor: '8.90' },
  { product: 'Gasoline', factor: '8.33' },
  { product: 'Jet / Kerosene', factor: '7.90' },
  { product: 'Gas Oil', factor: '7.45' },
  { product: 'LSFO', factor: '6.40' },
  { product: 'HSFO', factor: '6.35' },
  { product: 'VLSFO', factor: '6.35' },
]

const QUOTATIONS = [
  { market: 'Crude (global)', unit: '$/bbl' },
  { market: 'Products — Europe', unit: '$/MT' },
  { market: 'Products — US', unit: 'c/gallon (FO: $/bbl)' },
  { market: 'Products — Singapore', unit: '$/bbl (FO: $/MT)' },
  { market: 'Products — Arab Gulf', unit: '$/bbl (Jet, Gasoil: $/MT)' },
  { market: 'Arabica Coffee', unit: 'cents/lb (× 22.046 = $/MT)' },
  { market: 'Robusta Coffee', unit: '$/MT' },
]

export default function UnitConversions() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Quotation conventions */}
      <div className="bg-zinc-900 border border-zinc-800">
        <div className="text-amber-400 text-xs font-mono uppercase tracking-widest px-4 py-2 border-b border-zinc-800">
          Price Quotation Conventions
        </div>
        <table className="w-full text-xs font-mono">
          <tbody>
            {QUOTATIONS.map((q, i) => (
              <tr key={i} className="border-b border-zinc-800 last:border-0">
                <td className="px-4 py-2 text-zinc-400">{q.market}</td>
                <td className="px-4 py-2 text-white text-right">{q.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conversion factors */}
      <div className="bg-zinc-900 border border-zinc-800">
        <div className="text-amber-400 text-xs font-mono uppercase tracking-widest px-4 py-2 border-b border-zinc-800">
          Conversion Factors (bbl/MT)
        </div>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-2 text-zinc-500 text-left font-normal">Product</th>
              <th className="px-4 py-2 text-zinc-500 text-right font-normal">bbl/MT</th>
              <th className="px-4 py-2 text-zinc-500 text-right font-normal">MT/bbl</th>
            </tr>
          </thead>
          <tbody>
            {CONVERSIONS.map((c, i) => (
              <tr key={i} className="border-b border-zinc-800 last:border-0">
                <td className="px-4 py-2 text-zinc-300">{c.product}</td>
                <td className="px-4 py-2 text-amber-400 text-right">{c.factor}</td>
                <td className="px-4 py-2 text-zinc-500 text-right">{(1 / parseFloat(c.factor)).toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-zinc-800 text-zinc-600 text-xs font-mono">
          1 barrel = 42 US gallons · Volume → Weight varies by API gravity
        </div>
      </div>
    </div>
  )
}
