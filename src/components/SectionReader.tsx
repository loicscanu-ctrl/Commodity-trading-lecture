'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { Section } from '@/types/content'
import Breadcrumb from './Breadcrumb'
import ProgressBar from './ProgressBar'
import { visualRegistry } from '@/visuals'

type Props = {
  sections: Section[]
  moduleId: number
  topicTitle: string
  initialIndex?: number
}

const PROSE =
  'prose prose-invert max-w-none leading-relaxed ' +
  'prose-headings:tracking-tight prose-headings:text-white prose-headings:font-semibold ' +
  'prose-p:text-slate-300 prose-li:text-slate-300 ' +
  'prose-strong:text-white ' +
  'prose-a:text-brand-cyan prose-a:no-underline hover:prose-a:underline ' +
  'prose-code:rounded prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-brand-cyan prose-code:before:content-none prose-code:after:content-none ' +
  'prose-table:text-slate-300 prose-th:text-slate-200 prose-blockquote:border-l-brand-blue prose-blockquote:text-slate-400'

export default function SectionReader({ sections, moduleId, topicTitle, initialIndex = 0 }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const [notesOpen, setNotesOpen] = useState(false)
  const router = useRouter()
  const section = sections[current]
  const isLast = current === sections.length - 1
  const isFirst = current === 0
  const Visual = section.visual ? (visualRegistry[section.visual] ?? null) : null

  const goNext = useCallback(() => {
    if (isLast) router.push(`/module/${moduleId}`)
    else setCurrent(i => i + 1)
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

  // Reset notes panel when changing section
  useEffect(() => { setNotesOpen(false) }, [current])

  return (
    <div className="flex h-screen flex-col">
      <Breadcrumb moduleId={moduleId} topicTitle={topicTitle} />
      <ProgressBar current={current + 1} total={sections.length} />

      {/* Main content area */}
      <main className="flex flex-1 overflow-hidden">

        {/* LEFT: Notes panel (collapsible) */}
        {notesOpen && (
          <aside className="flex w-80 shrink-0 animate-fade-in flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-md xl:w-96">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
              <span className="eyebrow">Lecture Notes</span>
              <button onClick={() => setNotesOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white/5 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className={`${PROSE} prose-sm`}>
                <ReactMarkdown>{section.body}</ReactMarkdown>
              </div>
            </div>
          </aside>
        )}

        {/* RIGHT: Visual main area */}
        <div key={current} className="flex flex-1 animate-fade-in flex-col overflow-y-auto">

          {/* Section header */}
          <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-8 sm:px-8">
            <div className="min-w-0 flex-1">
              <div className="eyebrow mb-2.5 flex items-center gap-2 text-slate-500">
                <span>Section</span>
                <span className="text-slate-400">{current + 1} / {sections.length}</span>
              </div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">{section.title}</h2>
            </div>

            {/* Notes toggle button */}
            {section.body && (
              <button
                onClick={() => setNotesOpen(o => !o)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  notesOpen
                    ? 'border-brand-blue/50 bg-brand-blue/15 text-blue-200'
                    : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
                }`}
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
                  <rect y="0" width="14" height="1.5" rx="0.75" />
                  <rect y="4" width="10" height="1.5" rx="0.75" />
                  <rect y="8" width="6" height="1.5" rx="0.75" />
                </svg>
                <span>{notesOpen ? 'Close notes' : 'Notes'}</span>
              </button>
            )}
          </div>

          {/* Visual / content */}
          <div className="flex-1 px-6 pb-6 sm:px-8">
            {Visual ? (
              <Visual />
            ) : (
              <div className={`${PROSE} prose-lg max-w-3xl`}>
                <ReactMarkdown>{section.body}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation bar */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#070912]/70 px-6 py-4 backdrop-blur-xl sm:px-8">
        <div className="flex items-center justify-between">
          <button onClick={goPrev} disabled={isFirst} className="btn-ghost">
            ← Back
          </button>

          {/* Dot navigation */}
          <div className="flex items-center gap-1.5">
            {sections.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to section ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 bg-gradient-to-r from-brand-cyan to-brand-blue'
                    : 'w-2 bg-white/15 hover:bg-white/35'
                }`}
              />
            ))}
          </div>

          <button onClick={goNext} className="btn-primary">
            {isLast ? 'Back to Module' : 'Continue'} →
          </button>
        </div>
      </div>
    </div>
  )
}
