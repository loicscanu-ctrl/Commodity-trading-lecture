'use client'

import { useState } from 'react'
import QuizQuestion from '@/components/QuizQuestion'
import QuizSummary from '@/components/QuizSummary'
import Breadcrumb from '@/components/Breadcrumb'
import ProgressBar from '@/components/ProgressBar'
import type { Question } from '@/types/content'

type Props = {
  questions: Question[]
  moduleId: number
  topicTitle: string
}

export default function QuizRunner({ questions, moduleId, topicTitle }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  function handleAnswer(correct: boolean) {
    if (correct) setScore(s => s + 1)
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <QuizSummary score={score} total={questions.length} moduleId={moduleId} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Breadcrumb moduleId={moduleId} topicTitle={topicTitle} />
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      <QuizQuestion
        key={currentIndex}
        question={questions[currentIndex]}
        questionNumber={currentIndex + 1}
        total={questions.length}
        onAnswer={handleAnswer}
      />
    </div>
  )
}
