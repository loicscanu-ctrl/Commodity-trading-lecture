import Link from 'next/link'
import type { Topic } from '@/types/content'

const TYPE_BADGE: Record<Topic['type'], { label: string; className: string }> = {
  lecture:      { label: 'Lecture',     className: 'text-cyan-400 border-cyan-800' },
  'case-study': { label: 'Case',        className: 'text-purple-400 border-purple-800' },
  quiz:         { label: 'Quiz',        className: 'text-green-400 border-green-800' },
  tool:         { label: 'Tool',        className: 'text-amber-400 border-amber-800' },
  simulation:   { label: 'Sim',         className: 'text-rose-400 border-rose-800' },
}

function getHref(topic: Topic, moduleId: number): string {
  if (topic.type === 'quiz') return `/module/${moduleId}/quiz/${topic.id}`
  if (topic.type === 'tool') return `/module/${moduleId}/tool/${topic.id}`
  if (topic.type === 'simulation') return '#'
  return `/module/${moduleId}/section/${topic.id}`
}

type Props = { topic: Topic; moduleId: number }

export default function TopicCard({ topic, moduleId }: Props) {
  const badge = TYPE_BADGE[topic.type]

  if (topic.v2) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-4 opacity-40 cursor-not-allowed">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-mono border px-1.5 py-0.5 ${badge.className}`}>
            {badge.label}
          </span>
          <span className="text-xs font-mono text-zinc-600 border border-zinc-700 px-1.5 py-0.5">Coming Soon</span>
        </div>
        <h3 className="text-zinc-400 font-semibold text-sm leading-snug">{topic.title}</h3>
        <p className="text-zinc-600 text-xs mt-2 font-mono">{topic.estimatedMinutes}m</p>
      </div>
    )
  }

  return (
    <Link href={getHref(topic, moduleId)}>
      <div className="bg-zinc-900 border border-zinc-800 hover:border-amber-500 hover:bg-zinc-900 p-4 transition-colors cursor-pointer h-full group">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-mono border px-1.5 py-0.5 ${badge.className}`}>
            {badge.label}
          </span>
          <span className="text-zinc-600 text-xs font-mono group-hover:text-zinc-400">{topic.estimatedMinutes}m</span>
        </div>
        <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-amber-100">{topic.title}</h3>
      </div>
    </Link>
  )
}
