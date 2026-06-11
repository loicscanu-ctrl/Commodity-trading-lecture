'use client'

import { createContext, useContext } from 'react'

// Framework for editable text inside visual components.
//
// A visual declares its editable strings with `defineVisualText`, then reads
// them via `useVisualText`. The effective value for a key is, in order:
//   live localStorage edit  →  per-slide source override (Section.visualText)
//   →  the component's built-in default.
// SectionReader supplies the merged override map through <VisualTextProvider>.

export type VisualTextField = { key: string; label: string; value: string; multiline?: boolean }
export type VisualTextDef = { fields: VisualTextField[]; defaults: Record<string, string> }

export function defineVisualText(
  spec: Record<string, { label: string; value: string; multiline?: boolean }>,
): VisualTextDef {
  const fields = Object.entries(spec).map(([key, v]) => ({
    key, label: v.label, value: v.value, multiline: v.multiline,
  }))
  const defaults = Object.fromEntries(fields.map(f => [f.key, f.value]))
  return { fields, defaults }
}

const VisualTextContext = createContext<Record<string, string>>({})
export const VisualTextProvider = VisualTextContext.Provider

/** Returns a `t(key)` accessor that resolves overrides then falls back to defaults. */
export function useVisualText(def: VisualTextDef): (key: string) => string {
  const overrides = useContext(VisualTextContext)
  return (key: string) => overrides[key] ?? def.defaults[key] ?? ''
}
