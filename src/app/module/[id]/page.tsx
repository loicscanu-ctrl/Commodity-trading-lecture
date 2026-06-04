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
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-950 border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-blue-500 text-xs font-mono tracking-widest uppercase mb-0.5">Commodity Trading Masterclass</div>
            <h1 className="text-white font-bold text-lg tracking-tight">Université Paris-Panthéon-Assas</h1>
          </div>
        </div>
      </header>
      <ModuleTabs activeId={moduleId} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">{mod.title}</h2>
          <div className="h-0.5 w-16 bg-blue-600 mt-3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mod.topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} moduleId={moduleId} />
          ))}
        </div>
      </main>
    </div>
  )
}
