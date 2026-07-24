import { notFound } from 'next/navigation'
import { modules } from '@/content'
import SectionReader from '@/components/SectionReader'
import ModuleGate from '@/components/ModuleGate'

type Props = { params: { id: string; sectionId: string } }

export default function SectionPage({ params }: Props) {
  const moduleId = parseInt(params.id, 10)
  const mod = modules[moduleId - 1]
  if (!mod) notFound()

  const topic = mod.topics.find(t => t.id === params.sectionId)
  if (!topic || !topic.sections || topic.sections.length === 0) notFound()

  return (
    <ModuleGate moduleId={moduleId} returnTo={`/module/${moduleId}/section/${topic.id}`}>
      <SectionReader
        sections={topic.sections}
        moduleId={moduleId}
        topicTitle={topic.title}
        topicId={topic.id}
      />
    </ModuleGate>
  )
}
