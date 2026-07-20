import { notFound } from 'next/navigation'
import { modules } from '@/content'
import ModuleTabs from '@/components/ModuleTabs'
import TopicCard from '@/components/TopicCard'
import SiteHeader from '@/components/SiteHeader'

type Props = { params: { id: string } }

export default function ModulePage({ params }: Props) {
  const moduleId = parseInt(params.id, 10)
  if (isNaN(moduleId) || moduleId < 1 || moduleId > modules.length) notFound()
  const mod = modules[moduleId - 1]

  const topics = mod.topics
  const totalMin = topics.reduce((s, t) => s + (t.estimatedMinutes || 0), 0)

  // One accent per objective tile — the house palette
  const objectiveColors = ['#3b82f6', '#22d3ee', '#8b5cf6', '#34d399']

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

        {/* Module objectives — what you will know after this module */}
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">What you’ll know after this module</h3>
            <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mod.objectives.map((obj, i) => (
              <div key={i} className="glass relative overflow-hidden p-4">
                <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: objectiveColors[i % objectiveColors.length] }} />
                <span
                  className="font-mono text-[11px] font-bold tracking-wide"
                  style={{ color: objectiveColors[i % objectiveColors.length] }}
                >
                  Objective {i + 1}
                </span>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{obj}</p>
              </div>
            ))}
          </div>
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
