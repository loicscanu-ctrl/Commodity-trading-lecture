import { cookies } from 'next/headers'
import { modules } from '@/content'
import { moduleCookieName } from '@/lib/moduleAccess'
import { unlockModule } from '@/app/module/[id]/unlock'

// The per-module spoiler gate. Server component: it reads the httpOnly
// unlock cookie and either renders the module content or a lock screen.
// The code check itself runs in a server action — codes never reach the
// client bundle.
export default function ModuleGate({ moduleId, returnTo, children }: {
  moduleId: number
  returnTo: string
  children: React.ReactNode
}) {
  const store = cookies()
  if (store.get(moduleCookieName(moduleId))?.value === 'valid') return <>{children}</>

  const failed = store.get('module-code-error')?.value === '1'
  const mod = modules[moduleId - 1]
  const action = unlockModule.bind(null, moduleId, returnTo)

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6 45%,#8b5cf6)', boxShadow: '0 14px 40px -10px rgba(59,130,246,0.7)' }}>
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <div className="eyebrow text-brand-cyan/90">Module {moduleId}</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            <span className="text-gradient">{mod?.title ?? 'Locked module'}</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            This module unlocks <span className="font-semibold text-slate-200">in class</span> — enter the
            code your instructor announces at the start of the session. No peeking ahead: the
            simulators only work once, and spoilers ruin them.
          </p>
        </div>

        <form action={action} className="glass flex flex-col gap-3 p-6">
          <input
            type="password"
            name="code"
            placeholder="Module code"
            required
            autoFocus
            autoComplete="off"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-lg tracking-[0.3em] text-white outline-none transition-colors placeholder:tracking-normal placeholder:text-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
          {failed && (
            <p className="text-center font-mono text-xs text-rose-400">Incorrect module code</p>
          )}
          <button type="submit" className="btn-primary w-full py-3">
            Unlock Module {moduleId} →
          </button>
          <p className="text-center font-mono text-[10px] text-slate-600">
            one code per module · remembered on this device
          </p>
        </form>
      </div>
    </main>
  )
}
