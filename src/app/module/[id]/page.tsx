import { notFound } from 'next/navigation'
import { modules } from '@/content'
import ModuleTabs from '@/components/ModuleTabs'
import TopicCard from '@/components/TopicCard'
import KpiCard from '@/components/KpiCard'
import SiteHeader from '@/components/SiteHeader'

type Props = { params: { id: string } }

export default function ModulePage({ params }: Props) {
  const moduleId = parseInt(params.id, 10)
  if (isNaN(moduleId) || moduleId < 1 || moduleId > modules.length) notFound()
  const mod = modules[moduleId - 1]

  const topics = mod.topics
  const count = (t: string) => topics.filter(x => x.type === t).length
  const totalMin = topics.reduce((s, t) => s + (t.estimatedMinutes || 0), 0)
  const interactive = count('tool') + count('quiz') + count('simulation')

  // Decorative trend textures for the KPI sparklines
  const sparkA = [4, 5, 5, 6, 7, 6, 8, 9, 8, 10, 11, 12, 12, 13]
  const sparkB = [8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 13, 12, 14, 15]
  const sparkC = [3, 4, 4, 5, 6, 7, 7, 8, 9, 9, 10, 11, 11, 12]
  const sparkD = [10, 11, 10, 12, 11, 13, 12, 14, 13, 15, 14, 16, 15, 17]

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <ModuleTabs activeId={moduleId} />

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-6">
        {/* Hero */}
        <section className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="chip text-slate-300">Module {mod.id}</span>
            <span className="chip text-slate-400">{mod.level}</span>
          </div>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient">{mod.title}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-400">
            {topics.length} sessions · {Math.round(totalMin / 60 * 10) / 10} hours of material. Work through lectures,
            interactive tools and quizzes — read the whole module at a glance, then dive in.
          </p>
        </section>

        {/* Hero KPI band */}
        <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Sessions" value={String(topics.length)} delta={`${count('lecture')} lectures`} trend="up" spark={sparkA} color="#3b82f6" />
          <KpiCard label="Interactive" value={String(interactive)} delta={`${count('tool')} tools`} trend="up" spark={sparkB} color="#22d3ee" />
          <KpiCard label="Est. time" value={`${Math.round(totalMin / 60 * 10) / 10}h`} delta={`${totalMin} min`} trend="flat" spark={sparkC} color="#8b5cf6" />
          <KpiCard label="Quizzes" value={String(count('quiz'))} delta="check-points" trend="up" spark={sparkD} color="#34d399" />
        </section>

        {/* Topic grid */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Course content</h3>
            <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} moduleId={moduleId} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
