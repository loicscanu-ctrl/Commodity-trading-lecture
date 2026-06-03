import Link from 'next/link'
import { modules } from '@/content'

type Props = { activeId: number }

export default function ModuleTabs({ activeId }: Props) {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 flex overflow-x-auto">
        {modules.map(mod => (
          <Link
            key={mod.id}
            href={`/module/${mod.id}`}
            className={`px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              mod.id === activeId
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
            }`}
          >
            <span className="hidden md:inline">Module {mod.id} — </span>
            <span>{mod.title}</span>
            <span className="hidden lg:inline text-xs ml-2 opacity-60">({mod.level})</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
