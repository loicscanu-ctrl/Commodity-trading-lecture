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
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-slate-500 text-xs font-mono mb-4 tracking-wider">QUESTION {questionNumber} / {total}</p>
      <h2 className="text-lg font-semibold text-white mb-8 leading-snug">{question.question}</h2>
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          let cls = 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white'
          if (answered) {
            if (i === question.correctIndex) cls = 'bg-green-950 border-green-600 text-green-300'
            else if (i === selected) cls = 'bg-red-950 border-red-700 text-red-300'
            else cls = 'bg-slate-900 border-slate-800 text-slate-600'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`border px-4 py-3 text-left text-sm transition-colors ${cls} disabled:cursor-default`}
            >
              <span className="font-mono font-bold mr-3 text-xs">{['A', 'B', 'C', 'D'][i]}.</span>
              {option}
            </button>
          )
        })}
      </div>
      {answered && question.explanation && (
        <p className="mt-6 text-slate-400 text-sm border-l-2 border-blue-500 pl-4 leading-relaxed font-mono text-xs">
          {question.explanation}
        </p>
      )}
    </div>
  )
}
