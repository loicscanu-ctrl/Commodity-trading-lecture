'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { Section } from '@/types/content'
import Breadcrumb from './Breadcrumb'
import ProgressBar from './ProgressBar'
import SlideEditor from './SlideEditor'
import ExportPanel from './ExportPanel'
import { visualRegistry, visualTextRegistry } from '@/visuals'
import { VisualTextProvider } from '@/lib/visualText'
import {
  slideKey, loadOverrides, setOverride, clearOverride, clearAllOverrides,
  loadEditMode, saveEditMode, type OverrideMap,
} from '@/lib/slideOverrides'
import { buildTopicTs } from '@/lib/exportBuilders'

type Props = {
  sections: Section[]
  moduleId: number
  topicTitle: string
  topicId?: string
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

export default function SectionReader({ sections, moduleId, topicTitle, topicId = '', initialIndex = 0 }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const [notesOpen, setNotesOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [overrides, setOverrides] = useState<OverrideMap>({})
  const router = useRouter()

  const section = sections[current]
  const isLast = current === sections.length - 1
  const isFirst = current === 0
  const Visual = section.visual ? (visualRegistry[section.visual] ?? null) : null

  // Effective (possibly edited) content for the current slide
  const key = slideKey(moduleId, topicId, section.id)
  const ov = overrides[key]
  const title = ov?.title ?? section.title
  const body = ov?.body ?? section.body
  const isEdited = !!ov
  const editedCount = Object.keys(overrides).length

  // Editable text inside the visual component (if it declares any)
  const visualDef = section.visual ? visualTextRegistry[section.visual] : undefined
  const visualTextOverrides = { ...(section.visualText ?? {}), ...(ov?.visual ?? {}) }
  const visualValues = visualDef ? { ...visualDef.defaults, ...visualTextOverrides } : undefined

  // Hydrate overrides + edit-mode preference on mount (client only)
  useEffect(() => {
    setOverrides(loadOverrides())
    setEditMode(loadEditMode())
  }, [])

  const goNext = useCallback(() => {
    if (isLast) router.push(`/module/${moduleId}`)
    else setCurrent(i => i + 1)
  }, [isLast, moduleId, router])

  const goPrev = useCallback(() => {
    if (!isFirst) setCurrent(i => i - 1)
  }, [isFirst])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't hijack arrows while typing in the editor or export modal
      if (editing || showExport) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, editing, showExport])

  // Reset transient panels when changing section
  useEffect(() => { setNotesOpen(false); setEditing(false) }, [current])

  function toggleEditMode() {
    setEditMode(m => {
      const next = !m
      saveEditMode(next)
      if (!next) setEditing(false)
      return next
    })
  }

  function handleSave(data: { title: string; body: string; visual?: Record<string, string> }) {
    setOverrides(prev => setOverride(prev, key, {
      title: data.title,
      body: data.body,
      ...(data.visual && Object.keys(data.visual).length ? { visual: data.visual } : {}),
    }))
    setEditing(false)
  }

  function handleResetSlide() {
    setOverrides(prev => clearOverride(prev, key))
    setEditing(false)
  }

  function handleResetAll() {
    setOverrides(clearAllOverrides())
  }

  return (
    <div className="flex h-screen flex-col">
      <Breadcrumb moduleId={moduleId} topicTitle={topicTitle} />
      <ProgressBar current={current + 1} total={sections.length} />

      {/* Main content area */}
      <main className="flex flex-1 overflow-hidden">

        {/* LEFT: Notes panel (collapsible) */}
        {notesOpen && !editing && (
          <aside className="flex w-80 shrink-0 animate-fade-in flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-md xl:w-96">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
              <span className="eyebrow">Lecture Notes</span>
              <button onClick={() => setNotesOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white/5 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className={`${PROSE} prose-sm`}>
                <ReactMarkdown>{body}</ReactMarkdown>
              </div>
            </div>
          </aside>
        )}

        {/* RIGHT: Visual / editor main area */}
        <div key={current} className="flex flex-1 animate-fade-in flex-col overflow-y-auto">
          {editing ? (
            <SlideEditor
              title={title}
              body={body}
              visualFields={visualDef?.fields}
              visualValues={visualValues}
              isEdited={isEdited}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
              onReset={handleResetSlide}
            />
          ) : (
            <>
              {/* Section header */}
              <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-8 sm:px-8">
                <div className="min-w-0 flex-1">
                  <div className="eyebrow mb-2.5 flex items-center gap-2 text-slate-500">
                    <span>Section</span>
                    <span className="text-slate-400">{current + 1} / {sections.length}</span>
                    {isEdited && (
                      <span className="chip !py-0.5 text-brand-cyan/90">edited</span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">{title}</h2>
                </div>

                {/* Action buttons */}
                <div className="flex shrink-0 items-center gap-2">
                  {editMode && (
                    <>
                      <button
                        onClick={() => { setNotesOpen(false); setEditing(true) }}
                        className="flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-4 py-2 text-xs font-medium text-cyan-200 transition-all hover:bg-brand-cyan/20"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        Edit slide
                      </button>
                      <button onClick={() => setShowExport(true)} className="btn-ghost !px-3 !py-2 text-xs">
                        Export{editedCount > 0 ? ` (${editedCount})` : ''}
                      </button>
                    </>
                  )}

                  {/* Edit-mode toggle */}
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

                  {/* Notes toggle */}
                  {body && (
                    <button
                      onClick={() => setNotesOpen(o => !o)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
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
              </div>

              {/* Visual / content */}
              <div className="flex-1 px-6 pb-6 sm:px-8">
                {Visual ? (
                  <VisualTextProvider value={visualTextOverrides}>
                    <Visual />
                  </VisualTextProvider>
                ) : (
                  <div className={`${PROSE} prose-lg max-w-3xl`}>
                    <ReactMarkdown>{body}</ReactMarkdown>
                  </div>
                )}
              </div>
            </>
          )}
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

      {showExport && (
        <ExportPanel
          heading="Save your slide changes"
          tsTabLabel="This topic (paste into source)"
          tsText={buildTopicTs(sections, overrides, moduleId, topicId)}
          jsonText={JSON.stringify(overrides, null, 2)}
          editedLabel="slide"
          editedCount={editedCount}
          tsFileName={`${topicId}.sections.txt`}
          jsonFileName="slide-edits.json"
          sourceHint={<>Replace the <code className="rounded bg-white/[0.06] px-1 text-brand-cyan">sections: [ … ]</code> array in <code className="rounded bg-white/[0.06] px-1 text-brand-cyan">src/content/module-{moduleId}/…{topicId}.ts</code> with the block below to make edits permanent.</>}
          onClose={() => setShowExport(false)}
          onResetAll={handleResetAll}
        />
      )}
    </div>
  )
}
