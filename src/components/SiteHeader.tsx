import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="border-b border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
        <Link href="/module/1" className="group flex items-center gap-3">
          {/* Gradient brand mark */}
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6 45%,#8b5cf6)', boxShadow: '0 8px 24px -8px rgba(59,130,246,0.7)' }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l5-6 4 3 5-8 4 5" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="eyebrow text-brand-cyan/90">Commodity Trading Masterclass</div>
            <div className="text-[15px] font-semibold tracking-tight text-white">Université Paris-Panthéon-Assas</div>
          </div>
        </Link>
        <span className="hidden items-center gap-2 sm:flex">
          <span className="chip text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px #34d399' }} />
            Live
          </span>
        </span>
      </div>
    </header>
  )
}
