// The trading house drawn as a building: one trade travelling through the
// three offices, then each office as a career destination — who sits there,
// what they own, and where the door in is.
const OFFICES = [
  {
    key: 'front',
    name: 'FRONT OFFICE',
    hex: '#f59e0b',
    tone: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/[0.05]',
    who: 'Traders · originators · sales',
    owns: 'Owns the P&L',
    does: 'Prices, executes and manages positions; talks to counterparties; decides the book’s risk within its limits.',
    day: 'Markets at 08:00, differentials quoted by phone, hedges on screen, a position report at the close.',
    entry: 'Entry: deal-desk / origination analyst, junior trader — often reached THROUGH the back office (see below).',
    icon: (
      <g fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="8" width="28" height="19" rx="2" />
        <path d="M10 21 l6-5 4 3 6-7 4 4" />
        <path d="M16 32 h8 m-4-5 v5" />
      </g>
    ),
  },
  {
    key: 'middle',
    name: 'MIDDLE OFFICE',
    hex: '#22d3ee',
    tone: 'text-brand-cyan',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/[0.05]',
    who: 'Market risk · credit risk · product control · compliance',
    owns: 'Owns the limits & the marks',
    does: 'Independently values every position (mark-to-market), checks exposures against limits, vets counterparty credit, polices the rules.',
    day: 'The overnight VaR run, a limit-breach conversation with a trader, validating the desk’s P&L before it is published.',
    entry: 'Entry: risk analyst, product controller — quantitative profiles feel at home here.',
    icon: (
      <g fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 l11 4 v9 c0 8-5 13-11 15 c-6-2-11-7-11-15 v-9 z" />
        <path d="M14 20 l4 4 8-8" />
      </g>
    ),
  },
  {
    key: 'back',
    name: 'BACK OFFICE',
    hex: '#34d399',
    tone: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/[0.05]',
    who: 'Operations · settlements · documentation · logistics',
    owns: 'Owns the trade actually happening',
    does: 'Confirms every trade with the counterparty, moves the margin cash, issues invoices, chases bills of lading, warrants and quality certificates, books the vessel space.',
    day: 'A confirmation mismatch to resolve before noon, a margin wire, a ship loading in HCM that needs its documents tonight.',
    entry: 'Entry: operations / trade-support analyst — the classic FIRST job in a trade house, and the best schooling in how cargo really moves.',
    icon: (
      <g fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6 h15 l7 7 v21 H9 z M24 6 v7 h7" />
        <path d="M14 20 h12 M14 25 h12 M14 30 h8" />
      </g>
    ),
  },
]

const LIFECYCLE = [
  { office: 'FRONT', hex: '#f59e0b', act: 'executes: sells 10 lots RC Jan @ $4,500 as the hedge of a physical purchase' },
  { office: 'MIDDLE', hex: '#22d3ee', act: 'checks: position within limits, counterparty credit OK, marks the book at the settle' },
  { office: 'BACK', hex: '#34d399', act: 'settles: confirms with the broker, wires the initial margin, files the contract & documents' },
]

export default function DeskOrganisation() {
  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-3">One trade, three offices</div>

      {/* The lifecycle of a single trade through the building */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="font-mono text-[10px] text-slate-500">09:42 · A TRADE IS BORN</div>
        <div className="mt-2 flex flex-col md:flex-row md:items-stretch gap-2">
          {LIFECYCLE.map((s, i) => (
            <div key={s.office} className="flex flex-col md:flex-row md:items-center md:flex-1 gap-2">
              <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
                style={{ borderTopColor: s.hex, borderTopWidth: 2 }}>
                <span className="font-mono text-[10px] font-bold" style={{ color: s.hex }}>{s.office} </span>
                <span className="text-[11px] leading-relaxed text-slate-300">{s.act}</span>
              </div>
              {i < LIFECYCLE.length - 1 && <span className="hidden md:block font-mono text-slate-500">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* The three offices as career destinations */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {OFFICES.map(o => (
          <div key={o.key} className={`rounded-xl border p-4 ${o.border} ${o.bg}`}>
            <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">{o.icon}</svg>
            <div className={`mt-2 font-mono text-xs font-bold ${o.tone}`}>{o.name}</div>
            <div className="mt-0.5 font-mono text-[10px] text-slate-500">{o.who}</div>
            <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-wide" style={{ color: o.hex }}>{o.owns}</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">{o.does}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400"><span className="font-bold text-slate-300">A day here: </span>{o.day}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{o.entry}</p>
          </div>
        ))}
      </div>

      {/* Career path + segregation lesson */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wide text-brand-cyan">The classic career path</div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
            In commodity houses the road to a trading book usually runs <span className="text-white font-semibold">through the back office</span>: operations → execution/logistics → junior trader. The trader who has chased a bill of lading through a port strike prices freight, demurrage and documentary risk better than one who has only seen screens. Middle office is its own career too — senior risk officers sit at the table where the firm’s limits are set.
          </p>
        </div>
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.05] p-3">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wide text-rose-300">Why the walls exist: Barings, 1995</div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
            Nick Leeson ran <span className="text-white font-semibold">both</span> the trading desk and the settlements office in Singapore — so nobody independent confirmed his trades, and losses hid in account 88888 until they reached £827m and sank a 233-year-old bank. One person on both sides of the wall is how operational losses happen; the three-office separation is the control.
          </p>
        </div>
      </div>
    </div>
  )
}
