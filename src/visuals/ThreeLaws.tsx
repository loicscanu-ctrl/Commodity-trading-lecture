export default function ThreeLaws() {
  const laws = [
    {
      label: '01',
      title: 'Ethics',
      body: 'No predatory usury, no plunder. Gain must come from providing real utility to the economy.',
    },
    {
      label: '02',
      title: 'The Papal Audit',
      body: 'Secular validation — every generation. Must prove stable, non-speculative growth.',
    },
    {
      label: '03',
      title: 'Ephemeral Utility',
      body: 'No fixed assets (land, factories), no hoarding. Capital must meet a vital need, be consumed, and be reborn at each transaction.',
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {laws.map(law => (
        <div key={law.label} className="border-t-2 border-amber-500 bg-zinc-900 p-5">
          <div className="text-amber-500 font-mono text-xs mb-3 tracking-widest">{law.label}</div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">{law.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{law.body}</p>
        </div>
      ))}
    </div>
  )
}
