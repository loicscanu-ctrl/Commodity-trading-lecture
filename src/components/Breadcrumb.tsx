import Link from 'next/link'

type Props = { moduleId: number; topicTitle: string }

export default function Breadcrumb({ moduleId, topicTitle }: Props) {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-3">
      <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-slate-400">
        <Link href={`/module/${moduleId}`} className="hover:text-amber-400 transition-colors">
          Module {moduleId}
        </Link>
        <span>›</span>
        <span className="text-slate-200 truncate">{topicTitle}</span>
      </div>
    </nav>
  )
}
