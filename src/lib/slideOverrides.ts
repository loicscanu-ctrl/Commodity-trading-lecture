'use client'

// In-browser slide-text overrides.
// Edits are stored per-section in localStorage so they survive reloads and
// override the built-in content everywhere the slide is rendered. Nothing is
// written to the source files — use the Export panel to pull edits back out.

export type SlideOverride = { title?: string; body?: string; visual?: Record<string, string> }
export type OverrideMap = Record<string, SlideOverride>

const OVERRIDES_KEY = 'slide-overrides-v1'
const EDIT_MODE_KEY = 'slide-edit-mode'

export function slideKey(moduleId: number | string, topicId: string, sectionId: string): string {
  return `${moduleId}/${topicId}/${sectionId}`
}

export function loadOverrides(): OverrideMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY)
    return raw ? (JSON.parse(raw) as OverrideMap) : {}
  } catch {
    return {}
  }
}

function persist(map: OverrideMap): OverrideMap {
  if (typeof window === 'undefined') return map
  try {
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map))
  } catch {
    /* quota / disabled storage — ignore */
  }
  return map
}

export function setOverride(map: OverrideMap, key: string, ov: SlideOverride): OverrideMap {
  return persist({ ...map, [key]: ov })
}

export function clearOverride(map: OverrideMap, key: string): OverrideMap {
  const next = { ...map }
  delete next[key]
  return persist(next)
}

export function clearAllOverrides(): OverrideMap {
  return persist({})
}

export function loadEditMode(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(EDIT_MODE_KEY) === '1'
}

export function saveEditMode(on: boolean): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(EDIT_MODE_KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
}
