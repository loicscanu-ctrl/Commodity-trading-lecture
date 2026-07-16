'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { VisualTextField } from '@/lib/visualText'

const PREVIEW_PROSE =
  'prose prose-invert prose-sm max-w-none leading-relaxed ' +
  'prose-headings:tracking-tight prose-headings:text-white prose-p:text-slate-300 ' +
  'prose-li:text-slate-300 prose-strong:text-white prose-a:text-brand-cyan ' +
  'prose-code:rounded prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:text-brand-cyan ' +
  'prose-code:before:content-none prose-code:after:content-none'

type SaveData = { title: string; body: string; visual?: Record<string, string> }

type Props = {
  title: string
  body: string
  visualFields?: VisualTextField[]
  visualValues?: Record<string, string>
  isEdited: boolean
  isInserted?: boolean
  onSave: (data: SaveData) => void
  onCancel: () => void
  onReset: () => void
  onDelete?: () => void
}

export default function SlideEditor({ title, body, visualFields, visualValues, isEdited, isInserted = false, onSave, onCancel, onReset, onDelete }: Props) {
  const [draftTitle, setDraftTitle] = useState(title)
  const [draftBody, setDraftBody] = useState(body)
  const [draftVisual, setDraftVisual] = useState<Record<string, string>>(visualValues ?? {})

  const hasVisual = !!visualFields && visualFields.length > 0
  const visualDirty = hasVisual && visualFields!.some(f => (draftVisual[f.key] ?? f.value) !== (visualValues?.[f.key] ?? f.value))
  const dirty = draftTitle !== title || draftBody !== body || visualDirty

  function save() {
    let visual: Record<string, string> | undefined
    if (hasVisual) {
      // Only persist fields that differ from the component default
      visual = {}
      for (const f of visualFields!) {
        const v = draftVisual[f.key] ?? f.value
        if (v !== f.value) visual[f.key] = v
      }
    }
    onSave({ title: draftTitle, body: draftBody, visual })
  }

  return (
    <div className="flex h-full animate-fade-in flex-col px-6 pb-6 pt-8 sm:px-8">
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="eyebrow flex items-center gap-2 text-brand-cyan/90">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          {isInserted ? 'Editing inserted slide' : 'Editing slide'}
        </div>
        <div className="flex items-center gap-2">
          {isInserted ? (
            onDelete && (
              <button onClick={onDelete} className="btn-ghost !px-3 !py-1.5 text-xs text-rose-300 hover:!border-rose-400/40">
                Delete slide
              </button>
            )
          ) : (
            isEdited && (
              <button onClick={onReset} className="btn-ghost !px-3 !py-1.5 text-xs text-rose-300 hover:!border-rose-400/40">
                Reset to original
              </button>
            )
          )}
          <button onClick={onCancel} className="btn-ghost !px-3 !py-1.5 text-xs">Cancel</button>
          <button onClick={save} disabled={!dirty} className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-40">Save</button>
        </div>
      </div>

      {/* Title field */}
      <div className="eyebrow mb-2 text-slate-500">Slide heading</div>
      <input
        value={draftTitle}
        onChange={e => setDraftTitle(e.target.value)}
        placeholder="Slide title"
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-lg font-semibold tracking-tight text-white outline-none transition-colors placeholder:text-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left column: graphic text (if any) + markdown */}
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
          {hasVisual && (
            <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/[0.04] p-4">
              <div className="eyebrow mb-3 text-brand-cyan/90">Graphic text</div>
              <div className="flex flex-col gap-3">
                {visualFields!.map(f => {
                  const val = draftVisual[f.key] ?? f.value
                  return (
                    <label key={f.key} className="block">
                      <span className="mb-1 block text-[11px] font-medium text-slate-400">{f.label}</span>
                      {f.multiline ? (
                        <textarea
                          value={val}
                          rows={3}
                          spellCheck={false}
                          onChange={e => setDraftVisual(p => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] leading-relaxed text-slate-100 outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                        />
                      ) : (
                        <input
                          value={val}
                          spellCheck={false}
                          onChange={e => setDraftVisual(p => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-slate-100 outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                        />
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex min-h-[180px] flex-1 flex-col">
            <div className="eyebrow mb-2 text-slate-500">{hasVisual ? 'Notes (markdown)' : 'Markdown'}</div>
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
        </div>

        {/* Right column: live markdown preview */}
        <div className="flex min-h-0 flex-col">
          <div className="eyebrow mb-2 text-slate-500">Preview {hasVisual && '· notes'}</div>
          <div className="glass flex-1 overflow-y-auto p-5">
            <div className={PREVIEW_PROSE}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{draftBody || '_Nothing yet…_'}</ReactMarkdown>
            </div>
          </div>
          {hasVisual && (
            <p className="mt-2 text-[11px] text-slate-500">
              Graphic-text changes appear on the slide after you press Save.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
