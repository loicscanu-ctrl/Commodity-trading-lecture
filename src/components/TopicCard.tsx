import Link from 'next/link'
import type { Topic } from '@/types/content'
import { TOPIC_META, TopicIcon } from './topicMeta'

function getHref(topic: Topic, moduleId: number): string {
  if (topic.type === 'quiz') return `/module/${moduleId}/quiz/${topic.id}`
  if (topic.type === 'tool') return `/module/${moduleId}/tool/${topic.id}`
  if (topic.type === 'simulation') return '#'
  return `/module/${moduleId}/section/${topic.id}`
}

type Props = { topic: Topic; moduleId: number; index?: number }

export default function TopicCard({ topic, moduleId, index = 0 }: Props) {
  const meta = TOPIC_META[topic.type]

  // Coming-soon / disabled state
  if (topic.v2) {
    return (
      <div className="glass relative flex h-full flex-col overflow-hidden p-5 opacity-50">
        <span className="absolute left-0 top-0 h-full w-[3px]" style={{ background: meta.glow, opacity: 0.4 }} />
        <div className="flex items-center justify-between">
          <span className={`chip ${meta.text}`}>
            <TopicIcon type={topic.type} className="h-3 w-3" />
            {meta.label}
          </span>
          <span className="chip text-slate-500">Coming Soon</span>
        </div>
        <h3 className="mt-4 text-sm font-semibold leading-snug text-slate-400">{topic.title}</h3>
        <p className="mt-auto pt-3 font-mono text-[11px] text-slate-600">{topic.estimatedMinutes} min</p>
      </div>
    )
  }

  return (
    <Link href={getHref(topic, moduleId)} className="group block h-full animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}>
      <div className="glass glass-hover relative flex h-full flex-col overflow-hidden p-5">
        {/* Accent rail */}
        <span className="absolute left-0 top-0 h-full w-[3px] transition-all duration-300 group-hover:w-[5px]"
          style={{ background: meta.glow }} />
        {/* Hover bloom */}
        <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ backgroundColor: meta.hex }} />

        <div className="relative flex items-center justify-between">
          <span className={`chip ${meta.text} ${meta.ring}`}>
            <TopicIcon type={topic.type} className="h-3 w-3" />
            {meta.label}
          </span>
          <span className="font-mono text-[11px] text-slate-500 transition-colors group-hover:text-slate-300">
            {topic.estimatedMinutes} min
          </span>
        </div>

        <h3 className="relative mt-4 text-[15px] font-semibold leading-snug text-slate-100 transition-colors group-hover:text-white">
          {topic.title}
        </h3>

        <div className="relative mt-auto flex items-center gap-1.5 pt-4 text-xs font-medium text-slate-500 transition-colors group-hover:text-slate-300">
          <span>Open</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  )
}
