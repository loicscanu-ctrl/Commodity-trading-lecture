import Link from 'next/link'
import type { Topic } from '@/types/content'

const TYPE_STYLE: Record<Topic['type'], { label: string; bar: string; text: string }> = {
  lecture:      { label: 'LECTURE',    bar: 'bg-blue-600',   text: 'text-blue-400' },
  'case-study': { label: 'CASE',       bar: 'bg-violet-600', text: 'text-violet-400' },
  quiz:         { label: 'QUIZ',       bar: 'bg-emerald-600',text: 'text-emerald-400' },
  tool:         { label: 'TOOL',       bar: 'bg-cyan-600',   text: 'text-cyan-400' },
  simulation:   { label: 'SIMULATION', bar: 'bg-rose-700',   text: 'text-rose-400' },
}

function getHref(topic: Topic, moduleId: number): string {
  if (topic.type === 'quiz') return `/module/${moduleId}/quiz/${topic.id}`
  if (topic.type === 'tool') return `/module/${moduleId}/tool/${topic.id}`
  if (topic.type === 'simulation') return '#'
  return `/module/${moduleId}/section/${topic.id}`
}

type Props = { topic: Topic; moduleId: number }

export default function TopicCard({ topic, moduleId }: Props) {
  const style = TYPE_STYLE[topic.type]

  if (topic.v2) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden opacity-40 cursor-not-allowed">
        <div className={`h-1 ${style.bar} opacity-30`} />
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-mono ${style.text}`}>{style.label}</span>
            <span className="text-xs font-mono text-slate-600 border border-slate-700 px-2 py-0.5 rounded">SOON</span>
          </div>
          <h3 className="text-slate-500 font-semibold text-sm leading-snug">{topic.title}</h3>
          <p className="text-slate-700 text-xs mt-2 font-mono">{topic.estimatedMinutes}m</p>
        </div>
      </div>
    )
  }

  return (
    <Link href={getHref(topic, moduleId)}>
      <div className="bg-slate-900 border border-slate-800 hover:border-blue-700 rounded-xl overflow-hidden transition-all cursor-pointer group hover:bg-slate-800/60">
        <div className={`h-1 ${style.bar}`} />
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-mono ${style.text}`}>{style.label}</span>
            <span className="text-slate-600 text-xs font-mono group-hover:text-slate-400">{topic.estimatedMinutes}m</span>
          </div>
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-blue-100">{topic.title}</h3>
        </div>
      </div>
    </Link>
  )
}
