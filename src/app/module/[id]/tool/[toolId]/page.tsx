import { notFound } from 'next/navigation'
import { modules } from '@/content'
import { toolRegistry } from '@/tools'
import Breadcrumb from '@/components/Breadcrumb'
import ModuleGate from '@/components/ModuleGate'

type Props = { params: { id: string; toolId: string } }

export default function ToolPage({ params }: Props) {
  const moduleId = parseInt(params.id, 10)
  const mod = modules[moduleId - 1]
  if (!mod) notFound()

  const topic = mod.topics.find(t => t.id === params.toolId)
  if (!topic || !topic.tool) notFound()

  const Tool = toolRegistry[topic.tool.componentKey]
  if (!Tool) notFound()

  return (
    <ModuleGate moduleId={moduleId} returnTo={`/module/${moduleId}/tool/${topic.id}`}>
      <div className="min-h-screen text-white">
        <Breadcrumb moduleId={moduleId} topicTitle={topic.title} />
        <Tool />
      </div>
    </ModuleGate>
  )
}
