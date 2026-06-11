'use client'

import { useState } from 'react'

type Props = {
  heading: string            // e.g. "Save your changes"
  tsTabLabel: string         // e.g. "This topic (paste into source)"
  tsText: string             // ready-to-paste TS block
  jsonText: string           // JSON backup of all edits
  sourceHint: React.ReactNode // explanatory line for the TS tab
  editedCount: number
  editedLabel: string        // e.g. "slide" / "question"
  tsFileName: string         // download filename for the TS tab
  jsonFileName: string       // download filename for the JSON tab
  onClose: () => void
  onResetAll: () => void
}

export default function ExportPanel({
  heading, tsTabLabel, tsText, jsonText, sourceHint,
  editedCount, editedLabel, tsFileName, jsonFileName, onClose, onResetAll,
}: Props) {
  const [tab, setTab] = useState<'ts' | 'json'>('ts')
  const [copied, setCopied] = useState(false)

  const text = tab === 'ts' ? tsText : jsonText

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — user can select manually */
    }
  }

  function download() {
    const blob = new Blob([text], { type: tab === 'ts' ? 'text/plain' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = tab === 'ts' ? tsFileName : jsonFileName
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative flex max-h-[85vh] w-full max-w-3xl flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow text-brand-cyan/90">Export edits</div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">{heading}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {editedCount === 0
                ? `No edits yet. Turn on edit mode and change a ${editedLabel} to see it here.`
                : `${editedCount} ${editedLabel}${editedCount === 1 ? '' : 's'} edited in this browser.`}
            </p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/5 hover:text-white">✕</button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium">
          <button onClick={() => setTab('ts')}
            className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${tab === 'ts' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
            {tsTabLabel}
          </button>
          <button onClick={() => setTab('json')}
            className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${tab === 'json' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
            All edits (JSON backup)
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {tab === 'ts'
            ? sourceHint
            : 'A backup of every edit stored in this browser. Keep it safe — clearing browser data erases edits.'}
        </p>

        <textarea
          readOnly
          value={text}
          spellCheck={false}
          className="mt-3 min-h-[220px] flex-1 resize-none rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[12px] leading-relaxed text-slate-200 outline-none"
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <button onClick={onResetAll} disabled={editedCount === 0}
            className="btn-ghost text-xs text-rose-300 hover:!border-rose-400/40 disabled:opacity-40">
            Reset all edits
          </button>
          <div className="flex gap-2">
            <button onClick={download} className="btn-ghost text-xs">Download</button>
            <button onClick={copy} className="btn-primary text-xs">{copied ? 'Copied ✓' : 'Copy'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
