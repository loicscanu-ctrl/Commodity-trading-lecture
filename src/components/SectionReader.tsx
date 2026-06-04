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
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      <Breadcrumb moduleId={moduleId} topicTitle={topicTitle} />
      <ProgressBar current={current + 1} total={sections.length} />

      {/* Main content area */}
      <main className="flex-1 flex overflow-hidden">

        {/* LEFT: Notes panel (collapsible) */}
        {notesOpen && (
          <aside className="w-80 xl:w-96 shrink-0 bg-slate-900 border-r border-slate-800/60 flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">Lecture Notes</span>
              <button onClick={() => setNotesOpen(false)} className="text-slate-500 hover:text-white text-sm leading-none px-1 transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed prose-headings:text-blue-400 prose-headings:font-semibold prose-strong:text-white prose-code:text-blue-300 prose-code:bg-slate-800 prose-table:text-slate-300">
                <ReactMarkdown>{section.body}</ReactMarkdown>
              </div>
            </div>
          </aside>
        )}

        {/* RIGHT: Visual main area */}
        <div className="flex-1 flex flex-col overflow-y-auto">

          {/* Section header */}
          <div className="px-8 pt-8 pb-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">{section.title}</h2>
              {!Visual && !notesOpen && section.body && (
                <p className="text-slate-400 text-base mt-3 leading-relaxed line-clamp-3 max-w-2xl">
                  {section.body.replace(/[#*`_\[\]]/g, '').slice(0, 180)}{section.body.length > 180 ? '…' : ''}
                </p>
              )}
            </div>

            {/* Notes toggle button */}
            {section.body && (
              <button
                onClick={() => setNotesOpen(o => !o)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono border rounded transition-colors shrink-0 ${
                  notesOpen
                    ? 'border-blue-600 text-blue-400 bg-blue-950/40'
                    : 'border-slate-700 text-slate-500 hover:border-blue-700 hover:text-blue-400'
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
          <div className="flex-1 px-8 pb-6">
            {Visual ? (
              <Visual />
            ) : (
              <div className="prose prose-invert prose-lg max-w-3xl text-slate-300 leading-relaxed prose-headings:text-blue-400 prose-headings:font-bold prose-strong:text-white prose-code:text-blue-300 prose-code:bg-slate-900 prose-table:text-slate-300">
                <ReactMarkdown>{section.body}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation bar */}
      <div className="border-t border-slate-800/60 bg-slate-950 px-8 py-4 shrink-0">
        <div className="flex justify-between items-center">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="px-5 py-2 text-sm font-mono border border-slate-700 text-slate-400 hover:border-blue-600 hover:text-blue-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>

          {/* Dot navigation */}
          <div className="flex gap-1.5 items-center">
            {sections.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all ${
                  i === current
                    ? 'w-4 h-2 bg-blue-500 rounded-full'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500 rounded-full'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="px-5 py-2 text-sm font-mono bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
          >
            {isLast ? 'Module →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
