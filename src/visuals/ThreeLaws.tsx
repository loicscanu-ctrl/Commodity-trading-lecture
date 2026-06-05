export default function ThreeLaws() {
  const laws = [
    {
      label: '01',
      title: 'Absolute Ethics',
      body: 'No stealing, no pillaging, no extortion. Your gain must be clean and actively contribute to the life of men. Building your fortune on the ruin or predatory usury of others is forbidden.',
    },
    {
      label: '02',
      title: 'The Papal Audit',
      body: 'At the end of each century, you present yourself before the Pope to have your accounts audited. You must prove that your growth was regular, stable — and that your fortune does not rest on speculative bubbles or ephemeral strokes of luck.',
    },
    {
      label: '03',
      title: 'The Anonymity of the Servant',
      body: 'You must operate in the shadows through the ages. No political power, no taxes, no marriage for money, no inheritances. Your only weapon is the starting quadrans.',
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {laws.map(law => (
        <div key={law.label} className="glass glass-hover relative overflow-hidden rounded-2xl p-5">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-500" />
          <div className="eyebrow text-amber-400 mb-3">{law.label}</div>
          <h3 className="text-white font-semibold tracking-tight text-sm uppercase mb-3">{law.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{law.body}</p>
        </div>
      ))}
    </div>
  )
}
