import { notFound } from 'next/navigation'
import { modules } from '@/content'
import QuizRunner from './QuizRunner'
import ModuleGate from '@/components/ModuleGate'

type Props = { params: { id: string; quizId: string } }

export default function QuizPage({ params }: Props) {
  const moduleId = parseInt(params.id, 10)
  const mod = modules[moduleId - 1]
  if (!mod) notFound()

  const topic = mod.topics.find(t => t.id === params.quizId)
  if (!topic || !topic.quiz || topic.quiz.questions.length === 0) notFound()

  return (
    <ModuleGate moduleId={moduleId} returnTo={`/module/${moduleId}/quiz/${topic.id}`}>
      <QuizRunner
        questions={topic.quiz.questions}
        moduleId={moduleId}
        topicTitle={topic.title}
        topicId={topic.id}
      />
    </ModuleGate>
  )
}
