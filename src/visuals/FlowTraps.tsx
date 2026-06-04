export default function FlowTraps() {
  const traps = [
    {
      label: 'PURE FX — CURRENCY ARBITRAGE',
      verdict: 'FAILS THE AUDIT',
      body: 'Making money from nothing, with no physical risk? The Church condemned it as usury. Grounds for excommunication and seizure.',
    },
    {
      label: 'PURE LOGISTICS — OWNING SHIPS',
      verdict: 'VIOLATES LAW 3',
      body: 'Heavy fixed assets are systematically requisitioned by the State in wartime. The ship you own becomes the State\'s ship the moment war is declared.',
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {traps.map(trap => (
        <div key={trap.label} className="border border-zinc-700 bg-zinc-900 p-5">
          <div className="text-zinc-500 font-mono text-xs mb-2 tracking-widest">{trap.label}</div>
          <div className="text-red-400 font-mono text-xs mb-3 tracking-wide">{trap.verdict}</div>
          <p className="text-zinc-400 text-sm leading-relaxed">{trap.body}</p>
        </div>
      ))}
    </div>
  )
}
