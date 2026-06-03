import Link from 'next/link'

type Props = { moduleId: number; topicTitle: string }

export default function Breadcrumb({ moduleId, topicTitle }: Props) {
  return (
    <nav className="bg-black border-b border-zinc-800 px-6 py-2">
      <div className="max-w-3xl mx-auto flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href={`/module/${moduleId}`} className="hover:text-amber-400 transition-colors uppercase tracking-wider">
          M{moduleId}
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300 uppercase tracking-wider truncate">{topicTitle}</span>
      </div>
    </nav>
  )
}
