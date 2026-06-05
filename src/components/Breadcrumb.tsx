import Link from 'next/link'

type Props = { moduleId: number; topicTitle: string }

export default function Breadcrumb({ moduleId, topicTitle }: Props) {
  return (
    <nav className="border-b border-white/[0.06] bg-[#070912]/70 px-5 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs">
        <Link href="/module/1" className="text-slate-500 transition-colors hover:text-brand-cyan">
          Home
        </Link>
        <span className="text-slate-700">/</span>
        <Link href={`/module/${moduleId}`} className="font-medium text-slate-400 transition-colors hover:text-brand-blue">
          Module {moduleId}
        </Link>
        <span className="text-slate-700">/</span>
        <span className="truncate font-medium text-slate-200">{topicTitle}</span>
      </div>
    </nav>
  )
}
