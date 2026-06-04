export default function DeadEnds() {
  const items = [
    {
      label: 'PAPER & FINANCE',
      verdict: null,
      body: 'Every fiat currency in history has gone to zero. No empire survived 2,000 years without a monetary collapse.',
    },
    {
      label: 'LAND & REAL ESTATE',
      verdict: 'VIOLATES LAW 3 — FIXED',
      body: 'Land is not consumed. It endures history — and gets confiscated in every war, epidemic, or revolution.',
    },
    {
      label: 'GOLD — HOARDING',
      verdict: 'VIOLATES LAW 3 — IDLE',
      body: 'Gold sleeps. Two bars in a vault will never produce a third. It stores value but creates none.',
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {items.map(item => (
        <div key={item.label} className="border border-zinc-700 bg-zinc-900 p-5">
          <div className="text-zinc-500 font-mono text-xs mb-2 tracking-widest">{item.label}</div>
          {item.verdict && (
            <div className="text-red-400 font-mono text-xs mb-3 tracking-wide">{item.verdict}</div>
          )}
          <p className="text-zinc-400 text-sm leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  )
}
