import { authenticate } from './actions'

type Props = { searchParams: { error?: string } }

export default function LoginPage({ searchParams }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-9 text-center">
          {/* Brand mark */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6 45%,#8b5cf6)', boxShadow: '0 14px 40px -10px rgba(59,130,246,0.7)' }}>
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l5-6 4 3 5-8 4 5" />
            </svg>
          </div>
          <div className="eyebrow text-brand-cyan/90">Université Paris-Panthéon-Assas</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            <span className="text-gradient">Commodity Trading</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">Masterclass · enter your access code</p>
        </div>

        <form action={authenticate} className="glass flex flex-col gap-3 p-6">
          <input
            type="password"
            name="password"
            placeholder="Access code"
            required
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-lg tracking-[0.3em] text-white outline-none transition-colors placeholder:tracking-normal placeholder:text-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
          {searchParams.error && (
            <p className="text-center font-mono text-xs text-rose-400">Incorrect access code</p>
          )}
          <button type="submit" className="btn-primary w-full py-3">
            Enter →
          </button>
        </form>
      </div>
    </main>
  )
}
