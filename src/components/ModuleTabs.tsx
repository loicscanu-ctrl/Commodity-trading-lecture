import Link from 'next/link'
import { modules } from '@/content'

type Props = { activeId: number }

export default function ModuleTabs({ activeId }: Props) {
  return (
    <nav className="bg-slate-950 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
        {modules.map(mod => (
          <Link
            key={mod.id}
            href={`/module/${mod.id}`}
            className={`px-5 py-4 text-xs font-mono uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors ${
              mod.id === activeId
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            M{mod.id} — {mod.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
