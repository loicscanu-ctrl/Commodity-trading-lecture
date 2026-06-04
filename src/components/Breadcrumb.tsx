import Link from 'next/link'

type Props = { moduleId: number; topicTitle: string }

export default function Breadcrumb({ moduleId, topicTitle }: Props) {
  return (
    <nav className="bg-slate-950 border-b border-slate-800/60 px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href={`/module/${moduleId}`} className="hover:text-blue-400 transition-colors uppercase tracking-wider">
          Module {moduleId}
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-slate-300 uppercase tracking-wider truncate">{topicTitle}</span>
      </div>
    </nav>
  )
}
