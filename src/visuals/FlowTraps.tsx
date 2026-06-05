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
        <div key={trap.label} className="glass glass-hover relative overflow-hidden rounded-2xl p-5">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-rose-500" />
          <div className="eyebrow mb-2">{trap.label}</div>
          <div className="chip border-rose-500/30 bg-rose-500/10 text-rose-400 mb-3">{trap.verdict}</div>
          <p className="text-slate-400 text-sm leading-relaxed">{trap.body}</p>
        </div>
      ))}
    </div>
  )
}
