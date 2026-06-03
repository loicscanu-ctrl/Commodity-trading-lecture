'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { Section } from '@/types/content'
import Breadcrumb from './Breadcrumb'
import ProgressBar from './ProgressBar'

type Props = {
  sections: Section[]
  moduleId: number
  topicTitle: string
  initialIndex?: number
}

export default function SectionReader({ sections, moduleId, topicTitle, initialIndex = 0 }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const router = useRouter()
  const section = sections[current]
  const isLast = current === sections.length - 1
  const isFirst = current === 0

  const goNext = useCallback(() => {
    if (isLast) {
      router.push(`/module/${moduleId}`)
    } else {
      setCurrent(i => i + 1)
    }
  }, [isLast, moduleId, router])

  const goPrev = useCallback(() => {
    if (!isFirst) setCurrent(i => i - 1)
  }, [isFirst])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Breadcrumb moduleId={moduleId} topicTitle={topicTitle} />
      <ProgressBar current={current + 1} total={sections.length} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-amber-400 mb-6">{section.title}</h2>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
          <ReactMarkdown>{section.body}</ReactMarkdown>
        </div>
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-800">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <span className="text-slate-500 text-sm">{current + 1} / {sections.length}</span>
          <button
            onClick={goNext}
            className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors"
          >
            {isLast ? 'Back to Module' : 'Continue →'}
          </button>
        </div>
      </main>
    </div>
  )
}
