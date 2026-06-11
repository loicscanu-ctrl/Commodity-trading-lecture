'use client'

import type { Question } from '@/types/content'

// In-browser quiz-question overrides — same model as slideOverrides, keyed
// per question (module/quiz/question). The edit-mode toggle itself is shared
// with slides (see slideOverrides.loadEditMode / saveEditMode).

export type QuizOverride = {
  question?: string
  options?: [string, string, string, string]
  correctIndex?: 0 | 1 | 2 | 3
  explanation?: string
}
export type QuizOverrideMap = Record<string, QuizOverride>

const QUIZ_OVERRIDES_KEY = 'quiz-overrides-v1'

export function quizKey(moduleId: number | string, quizId: string, questionId: string): string {
  return `${moduleId}/${quizId}/${questionId}`
}

export function loadQuizOverrides(): QuizOverrideMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(QUIZ_OVERRIDES_KEY)
    return raw ? (JSON.parse(raw) as QuizOverrideMap) : {}
  } catch {
    return {}
  }
}

function persist(map: QuizOverrideMap): QuizOverrideMap {
  if (typeof window === 'undefined') return map
  try {
    window.localStorage.setItem(QUIZ_OVERRIDES_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
  return map
}

export function setQuizOverride(map: QuizOverrideMap, key: string, ov: QuizOverride): QuizOverrideMap {
  return persist({ ...map, [key]: ov })
}

export function clearQuizOverride(map: QuizOverrideMap, key: string): QuizOverrideMap {
  const next = { ...map }
  delete next[key]
  return persist(next)
}

export function clearAllQuizOverrides(): QuizOverrideMap {
  return persist({})
}

/** Apply an override to a question, falling back to the original fields. */
export function applyQuizOverride(q: Question, ov?: QuizOverride): Question {
  if (!ov) return q
  return {
    ...q,
    question: ov.question ?? q.question,
    options: ov.options ?? q.options,
    correctIndex: ov.correctIndex ?? q.correctIndex,
    explanation: ov.explanation ?? q.explanation,
  }
}
