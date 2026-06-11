'use client'

import { useState, useEffect } from 'react'
import QuizQuestion from '@/components/QuizQuestion'
import QuizSummary from '@/components/QuizSummary'
import QuizEditor from '@/components/QuizEditor'
import ExportPanel from '@/components/ExportPanel'
import Breadcrumb from '@/components/Breadcrumb'
import ProgressBar from '@/components/ProgressBar'
import type { Question } from '@/types/content'
import { loadEditMode, saveEditMode } from '@/lib/slideOverrides'
import {
  quizKey, loadQuizOverrides, setQuizOverride, clearQuizOverride, clearAllQuizOverrides,
  applyQuizOverride, type QuizOverrideMap,
} from '@/lib/quizOverrides'
import { buildQuizTs } from '@/lib/exportBuilders'

type Props = {
  questions: Question[]
  moduleId: number
  topicTitle: string
  topicId?: string
}

export default function QuizRunner({ questions, moduleId, topicTitle, topicId = '' }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [overrides, setOverrides] = useState<QuizOverrideMap>({})
  const [rev, setRev] = useState(0)

  useEffect(() => {
    setOverrides(loadQuizOverrides())
    setEditMode(loadEditMode())
  }, [])

  const baseQuestion = questions[currentIndex]
  const key = quizKey(moduleId, topicId, baseQuestion.id)
  const ov = overrides[key]
  const question = applyQuizOverride(baseQuestion, ov)
  const isEdited = !!ov
  const editedCount = Object.keys(overrides).length

  function handleAnswer(correct: boolean) {
    if (correct) setScore(s => s + 1)
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1)
    else setDone(true)
  }

  function toggleEditMode() {
    setEditMode(m => {
      const next = !m
      saveEditMode(next)
      if (!next) setEditing(false)
      return next
    })
  }

  function handleSave(patch: Pick<Question, 'question' | 'options' | 'correctIndex' | 'explanation'>) {
    setOverrides(prev => setQuizOverride(prev, key, patch))
    setEditing(false)
    setRev(r => r + 1)
  }

  function handleResetQuestion() {
    setOverrides(prev => clearQuizOverride(prev, key))
    setEditing(false)
    setRev(r => r + 1)
  }

  function handleResetAll() {
    setOverrides(clearAllQuizOverrides())
    setRev(r => r + 1)
  }

  if (done) {
    return (
      <div className="min-h-screen text-white">
        <Breadcrumb moduleId={moduleId} topicTitle={topicTitle} />
        <QuizSummary score={score} total={questions.length} moduleId={moduleId} />
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      <Breadcrumb moduleId={moduleId} topicTitle={topicTitle} />
      <ProgressBar current={currentIndex + 1} total={questions.length} />

      {/* Edit toolbar */}
      <div className="mx-auto flex max-w-2xl items-center justify-end gap-2 px-6 pt-5">
        {editMode && !editing && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-4 py-2 text-xs font-medium text-cyan-200 transition-all hover:bg-brand-cyan/20"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit question
            </button>
            <button onClick={() => setShowExport(true)} className="btn-ghost !px-3 !py-2 text-xs">
              Export{editedCount > 0 ? ` (${editedCount})` : ''}
            </button>
          </>
        )}
        <button
          onClick={toggleEditMode}
          title="Toggle edit mode"
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
            editMode
              ? 'border-emerald-400/50 bg-emerald-400/15 text-emerald-200'
              : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${editMode ? 'bg-emerald-400' : 'bg-slate-500'}`}
            style={editMode ? { boxShadow: '0 0 8px #34d399' } : undefined} />
          {editMode ? 'Edit mode' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <QuizEditor
          key={`edit-${currentIndex}-${rev}`}
          question={question}
          isEdited={isEdited}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          onReset={handleResetQuestion}
        />
      ) : (
        <QuizQuestion
          key={`${currentIndex}-${rev}`}
          question={question}
          questionNumber={currentIndex + 1}
          total={questions.length}
          onAnswer={handleAnswer}
          edited={isEdited}
        />
      )}

      {showExport && (
        <ExportPanel
          heading="Save your quiz changes"
          tsTabLabel="This quiz (paste into source)"
          tsText={buildQuizTs(questions, overrides, moduleId, topicId)}
          jsonText={JSON.stringify(overrides, null, 2)}
          editedLabel="question"
          editedCount={editedCount}
          tsFileName={`${topicId}.questions.txt`}
          jsonFileName="quiz-edits.json"
          sourceHint={<>Replace the <code className="rounded bg-white/[0.06] px-1 text-brand-cyan">questions: [ … ]</code> array in <code className="rounded bg-white/[0.06] px-1 text-brand-cyan">src/content/module-{moduleId}/…{topicId}.ts</code> with the block below to make edits permanent.</>}
          onClose={() => setShowExport(false)}
          onResetAll={handleResetAll}
        />
      )}
    </div>
  )
}
