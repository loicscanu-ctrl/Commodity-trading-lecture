import { notFound } from 'next/navigation'
import { modules } from '@/content'
import ModuleTabs from '@/components/ModuleTabs'
import TopicCard from '@/components/TopicCard'

type Props = { params: { id: string } }

export default function ModulePage({ params }: Props) {
  const moduleId = parseInt(params.id, 10)
  if (isNaN(moduleId) || moduleId < 1 || moduleId > modules.length) notFound()

  const mod = modules[moduleId - 1]

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-black border-b border-zinc-800 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-amber-400 text-xs font-mono tracking-widest uppercase mr-3">COMMODITY TRADING</span>
            <span className="text-zinc-600 text-xs font-mono">LECTURE PLATFORM</span>
          </div>
          <span className="text-zinc-600 text-xs font-mono">v1.0</span>
        </div>
      </header>
      <ModuleTabs activeId={moduleId} />
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="border-l-2 border-amber-500 pl-4 mb-6">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">{mod.title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mod.topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} moduleId={moduleId} />
          ))}
        </div>
      </main>
    </div>
  )
}
