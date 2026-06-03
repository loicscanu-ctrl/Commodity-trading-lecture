'use client'

import { useState } from 'react'
import type { Question } from '@/types/content'

type Props = {
  question: Question
  questionNumber: number
  total: number
  onAnswer: (correct: boolean) => void
}

export default function QuizQuestion({ question, questionNumber, total, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  function handleSelect(index: number) {
    if (answered) return
    setSelected(index)
    setTimeout(() => onAnswer(index === question.correctIndex), 800)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <p className="text-slate-500 text-sm mb-4">
        Question {questionNumber} / {total}
      </p>
      <h2 className="text-xl font-semibold text-white mb-8 leading-snug">{question.question}</h2>
      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => {
          let cls = 'bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-500'
          if (answered) {
            if (i === question.correctIndex) cls = 'bg-green-900 border-green-600 text-green-100'
            else if (i === selected) cls = 'bg-red-900 border-red-700 text-red-100'
            else cls = 'bg-slate-800 border-slate-700 text-slate-500'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`border rounded-lg px-5 py-4 text-left transition-colors ${cls} disabled:cursor-default`}
            >
              <span className="font-medium mr-3 text-sm">{['A', 'B', 'C', 'D'][i]}.</span>
              {option}
            </button>
          )
        })}
      </div>
      {answered && question.explanation && (
        <p className="mt-6 text-slate-400 text-sm border-l-2 border-amber-500 pl-4 leading-relaxed">
          {question.explanation}
        </p>
      )}
    </div>
  )
}
