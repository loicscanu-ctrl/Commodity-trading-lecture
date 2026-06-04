export default function FlowTraps() {
  const traps = [
    {
      label: 'PURE FX — CURRENCY ARBITRAGE',
      verdict: 'AUDIT FAILURE',
      body: 'Arbitraging currencies? For 1,000 years, the Church condemned money making money without real physical risk. That is usury — grounds for excommunication and seizure of assets.',
    },
    {
      label: 'PURE LOGISTICS — OWNING SHIPS',
      verdict: 'RISK FAILURE — RULE 3',
      body: 'Owning the ships? Heavy fixed assets (ship, cart) are systematically requisitioned by the State in times of war. The shipowner loses everything. The trader simply changes ships.',
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
      {traps.map(trap => (
        <div key={trap.label} className="border border-zinc-700 bg-zinc-900 p-5">
          <div className="text-zinc-500 font-mono text-xs mb-1 tracking-widest">{trap.label}</div>
          <div className="text-red-500 font-mono text-xs mb-3 tracking-wide">{trap.verdict}</div>
          <p className="text-zinc-400 text-sm leading-relaxed">{trap.body}</p>
        </div>
      ))}
    </div>
  )
}
