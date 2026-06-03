import Link from 'next/link'
import type { Topic } from '@/types/content'

const TYPE_BADGE: Record<Topic['type'], { label: string; className: string }> = {
  lecture:      { label: 'Lecture',     className: 'bg-blue-900 text-blue-300' },
  'case-study': { label: 'Case Study',  className: 'bg-purple-900 text-purple-300' },
  quiz:         { label: 'Quiz',        className: 'bg-green-900 text-green-300' },
  tool:         { label: 'Tool',        className: 'bg-orange-900 text-orange-300' },
  simulation:   { label: 'Simulation',  className: 'bg-rose-900 text-rose-300' },
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
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 opacity-50 cursor-not-allowed select-none">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded ${badge.className}`}>
            {badge.label}
          </span>
          <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">Coming Soon</span>
        </div>
        <h3 className="text-white font-semibold text-sm leading-snug">{topic.title}</h3>
        <p className="text-slate-500 text-xs mt-2">{topic.estimatedMinutes} min</p>
      </div>
    )
  }

  return (
    <Link href={getHref(topic, moduleId)}>
      <div className="bg-slate-800 border border-slate-700 hover:border-amber-500 rounded-xl p-5 transition-colors cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded ${badge.className}`}>
            {badge.label}
          </span>
          <span className="text-slate-500 text-xs">{topic.estimatedMinutes} min</span>
        </div>
        <h3 className="text-white font-semibold text-sm leading-snug">{topic.title}</h3>
      </div>
    </Link>
  )
}
