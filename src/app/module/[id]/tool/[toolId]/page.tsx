import { notFound } from 'next/navigation'
import { modules } from '@/content'
import { toolRegistry } from '@/tools'
import Breadcrumb from '@/components/Breadcrumb'

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
    <div className="min-h-screen bg-slate-900 text-white">
      <Breadcrumb moduleId={moduleId} topicTitle={topic.title} />
      <Tool />
    </div>
  )
}
