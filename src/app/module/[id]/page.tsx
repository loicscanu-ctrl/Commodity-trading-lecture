import { notFound } from 'next/navigation'
import { modules } from '@/content'
import ModuleTabs from '@/components/ModuleTabs'
import TopicCard from '@/components/TopicCard'

type Props = { params: { id: string } }

export default function ModulePage({ params }: Props) {
  const moduleId = parseInt(params.id)
  if (isNaN(moduleId) || moduleId < 1 || moduleId > 3) notFound()

  const mod = modules[moduleId - 1]

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-lg font-bold text-white">Commodity Trading Lecture</h1>
        </div>
      </header>
      <ModuleTabs activeId={moduleId} />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{mod.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{mod.level}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mod.topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} moduleId={moduleId} />
          ))}
        </div>
      </main>
    </div>
  )
}
