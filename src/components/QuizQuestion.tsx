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
    setTimeout(() => onAnswer(index === question.correctIndex), 900)
  }

  return (
    <div key={questionNumber} className="mx-auto max-w-2xl animate-fade-up px-6 py-10">
      <div className="eyebrow mb-4">Question {questionNumber} / {total}</div>
      <h2 className="mb-8 text-xl font-semibold leading-snug tracking-tight text-white">{question.question}</h2>
      <div className="flex flex-col gap-2.5">
        {question.options.map((option, i) => {
          let cls = 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-brand-blue/60 hover:bg-white/[0.06] hover:text-white'
          let badge = 'bg-white/[0.06] text-slate-400'
          if (answered) {
            if (i === question.correctIndex) {
              cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
              badge = 'bg-emerald-500/20 text-emerald-300'
            } else if (i === selected) {
              cls = 'border-rose-500/50 bg-rose-500/10 text-rose-200'
              badge = 'bg-rose-500/20 text-rose-300'
            } else {
              cls = 'border-white/5 bg-white/[0.01] text-slate-600'
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-200 disabled:cursor-default ${cls}`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${badge}`}>
                {['A', 'B', 'C', 'D'][i]}
              </span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>
      {answered && question.explanation && (
        <div className="mt-6 animate-fade-in rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="eyebrow mb-2 text-brand-cyan/80">Why</div>
          <p className="text-sm leading-relaxed text-slate-300">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
