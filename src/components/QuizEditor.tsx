'use client'

import { useState } from 'react'
import type { Question } from '@/types/content'

type Props = {
  question: Question
  isEdited: boolean
  onSave: (q: Pick<Question, 'question' | 'options' | 'correctIndex' | 'explanation'>) => void
  onCancel: () => void
  onReset: () => void
}

const LETTERS = ['A', 'B', 'C', 'D'] as const

export default function QuizEditor({ question, isEdited, onSave, onCancel, onReset }: Props) {
  const [text, setText] = useState(question.question)
  const [options, setOptions] = useState<string[]>([...question.options])
  const [correct, setCorrect] = useState<number>(question.correctIndex)
  const [explanation, setExplanation] = useState(question.explanation ?? '')

  const dirty =
    text !== question.question ||
    correct !== question.correctIndex ||
    (explanation || '') !== (question.explanation || '') ||
    options.some((o, i) => o !== question.options[i])

  function setOption(i: number, v: string) {
    setOptions(prev => prev.map((o, idx) => (idx === i ? v : o)))
  }

  function save() {
    onSave({
      question: text,
      options: [options[0], options[1], options[2], options[3]],
      correctIndex: correct as 0 | 1 | 2 | 3,
      explanation: explanation.trim() ? explanation : undefined,
    })
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in px-6 py-10">
      {/* Toolbar */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="eyebrow flex items-center gap-2 text-brand-cyan/90">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Editing question
        </div>
        <div className="flex items-center gap-2">
          {isEdited && (
            <button onClick={onReset} className="btn-ghost !px-3 !py-1.5 text-xs text-rose-300 hover:!border-rose-400/40">
              Reset to original
            </button>
          )}
          <button onClick={onCancel} className="btn-ghost !px-3 !py-1.5 text-xs">Cancel</button>
          <button onClick={save} disabled={!dirty} className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-40">Save</button>
        </div>
      </div>

      {/* Question text */}
      <div className="eyebrow mb-2 text-slate-500">Question</div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={2}
        spellCheck={false}
        className="mb-5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base font-medium text-white outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
      />

      {/* Options + correct selector */}
      <div className="eyebrow mb-2 text-slate-500">Answers — click the circle to mark the correct one</div>
      <div className="flex flex-col gap-2.5">
        {options.map((opt, i) => {
          const isCorrect = correct === i
          return (
            <div key={i}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors ${
                isCorrect ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/[0.03]'
              }`}>
              <button
                type="button"
                onClick={() => setCorrect(i)}
                aria-label={`Mark ${LETTERS[i]} correct`}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                  isCorrect
                    ? 'border-emerald-400 bg-emerald-400/20 text-emerald-200'
                    : 'border-white/15 text-slate-400 hover:border-emerald-400/60 hover:text-emerald-200'
                }`}>
                {isCorrect ? '✓' : LETTERS[i]}
              </button>
              <input
                value={opt}
                onChange={e => setOption(i, e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
                placeholder={`Answer ${LETTERS[i]}`}
              />
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      <div className="eyebrow mb-2 mt-5 text-slate-500">Explanation (optional)</div>
      <textarea
        value={explanation}
        onChange={e => setExplanation(e.target.value)}
        rows={3}
        spellCheck={false}
        placeholder="Why the correct answer is correct…"
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
      />
    </div>
  )
}
