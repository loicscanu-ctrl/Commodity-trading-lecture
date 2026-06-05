import Link from 'next/link'
import { modules } from '@/content'

type Props = { activeId: number }

export default function ModuleTabs({ activeId }: Props) {
  return (
    <nav className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#070912]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-5 py-2.5">
        {modules.map(mod => {
          const active = mod.id === activeId
          return (
            <Link
              key={mod.id}
              href={`/module/${mod.id}`}
              className={`group relative flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2 transition-all duration-200 ${
                active
                  ? 'bg-white/[0.06] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-100'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-colors ${
                  active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                }`}
                style={active ? { background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 0 16px -2px rgba(99,102,241,0.8)' } : { background: 'rgba(255,255,255,0.05)' }}
              >
                {mod.id}
              </span>
              <span className="whitespace-nowrap text-[13px] font-medium tracking-tight">{mod.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
