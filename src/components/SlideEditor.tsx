'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const PREVIEW_PROSE =
  'prose prose-invert prose-sm max-w-none leading-relaxed ' +
  'prose-headings:tracking-tight prose-headings:text-white prose-p:text-slate-300 ' +
  'prose-li:text-slate-300 prose-strong:text-white prose-a:text-brand-cyan ' +
  'prose-code:rounded prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:text-brand-cyan ' +
  'prose-code:before:content-none prose-code:after:content-none'

type Props = {
  title: string
  body: string
  isEdited: boolean
  onSave: (title: string, body: string) => void
  onCancel: () => void
  onReset: () => void
}

export default function SlideEditor({ title, body, isEdited, onSave, onCancel, onReset }: Props) {
  const [draftTitle, setDraftTitle] = useState(title)
  const [draftBody, setDraftBody] = useState(body)
  const dirty = draftTitle !== title || draftBody !== body

  return (
    <div className="flex h-full animate-fade-in flex-col px-6 pb-6 pt-8 sm:px-8">
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="eyebrow flex items-center gap-2 text-brand-cyan/90">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Editing slide
        </div>
        <div className="flex items-center gap-2">
          {isEdited && (
            <button onClick={onReset} className="btn-ghost !px-3 !py-1.5 text-xs text-rose-300 hover:!border-rose-400/40">
              Reset to original
            </button>
          )}
          <button onClick={onCancel} className="btn-ghost !px-3 !py-1.5 text-xs">Cancel</button>
          <button onClick={() => onSave(draftTitle, draftBody)} disabled={!dirty}
            className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-40">
            Save
          </button>
        </div>
      </div>

      {/* Title field */}
      <input
        value={draftTitle}
        onChange={e => setDraftTitle(e.target.value)}
        placeholder="Slide title"
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-lg font-semibold tracking-tight text-white outline-none transition-colors placeholder:text-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
      />

      {/* Split editor / preview */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col">
          <div className="eyebrow mb-2 text-slate-500">Markdown</div>
          <textarea
            value={draftBody}
            onChange={e => setDraftBody(e.target.value)}
            spellCheck={false}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 font-mono text-[13px] leading-relaxed text-slate-200 outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
          <p className="mt-2 font-mono text-[10px] text-slate-600">
            **bold** · *italic* · # heading · - list · `code`
          </p>
        </div>
        <div className="flex min-h-0 flex-col">
          <div className="eyebrow mb-2 text-slate-500">Preview</div>
          <div className="glass flex-1 overflow-y-auto p-5">
            <div className={PREVIEW_PROSE}>
              <ReactMarkdown>{draftBody || '_Nothing yet…_'}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
