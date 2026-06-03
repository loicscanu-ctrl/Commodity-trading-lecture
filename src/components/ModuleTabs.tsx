import Link from 'next/link'
import { modules } from '@/content'

type Props = { activeId: number }

export default function ModuleTabs({ activeId }: Props) {
  return (
    <nav className="bg-black border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 flex">
        {modules.map(mod => (
          <Link
            key={mod.id}
            href={`/module/${mod.id}`}
            className={`px-5 py-3 text-xs font-mono font-bold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${
              mod.id === activeId
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-200 hover:border-zinc-500'
            }`}
          >
            M{mod.id} — {mod.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
