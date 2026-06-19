'use client'

// User-inserted slides (PowerPoint-style "add a slide here").
//
// Source slides defined in src/content are immutable. The reader lets an
// editor splice brand-new slides into the deck; those live here in
// localStorage, keyed per topic, and are merged into the running order by
// `buildEffectiveSections`. Use the Export panel to pull them back into source.

import type { Section } from '@/types/content'

export type InsertedSlide = { id: string; afterId: string; title: string; body: string }
export type InsertedMap = Record<string, InsertedSlide[]> // keyed by `${moduleId}/${topicId}`

/** Anchor meaning "before the very first source slide". */
export const START_ANCHOR = '__start__'

const KEY = 'inserted-slides-v1'

export function topicKey(moduleId: number | string, topicId: string): string {
  return `${moduleId}/${topicId}`
}

export function loadInserted(): InsertedMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as InsertedMap) : {}
  } catch {
    return {}
  }
}

function persist(map: InsertedMap): InsertedMap {
  if (typeof window === 'undefined') return map
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map))
  } catch {
    /* quota / disabled storage — ignore */
  }
  return map
}

function genId(): string {
  const rand = Math.random().toString(36).slice(2, 6)
  return `custom-${Date.now().toString(36)}-${rand}`
}

/** Add a new blank slide anchored after `afterId`. Returns the new map + the new slide id. */
export function addInsertedSlide(map: InsertedMap, tkey: string, afterId: string): { map: InsertedMap; id: string } {
  const id = genId()
  const slide: InsertedSlide = { id, afterId, title: 'New slide', body: 'Add your content here…' }
  const arr = [...(map[tkey] ?? []), slide]
  return { map: persist({ ...map, [tkey]: arr }), id }
}

export function updateInsertedSlide(map: InsertedMap, tkey: string, id: string, patch: { title: string; body: string }): InsertedMap {
  const arr = (map[tkey] ?? []).map(s => (s.id === id ? { ...s, title: patch.title, body: patch.body } : s))
  return persist({ ...map, [tkey]: arr })
}

/** Remove an inserted slide, re-anchoring any of its children to its own anchor so they aren't orphaned. */
export function removeInsertedSlide(map: InsertedMap, tkey: string, id: string): InsertedMap {
  const arr = map[tkey] ?? []
  const target = arr.find(s => s.id === id)
  if (!target) return map
  const next = arr
    .filter(s => s.id !== id)
    .map(s => (s.afterId === id ? { ...s, afterId: target.afterId } : s))
  return persist({ ...map, [tkey]: next })
}

export function clearAllInserted(): InsertedMap {
  return persist({})
}

export type EffectiveSection = Section & { inserted?: boolean }

/**
 * Merge source slides with inserted slides into the final running order.
 * Inserted slides appear immediately after their anchor (a source id, another
 * inserted id, or START_ANCHOR for the very front). Insertion order is stable
 * and nesting is supported.
 */
export function buildEffectiveSections(source: Section[], inserted: InsertedSlide[]): EffectiveSection[] {
  const byAnchor = new Map<string, InsertedSlide[]>()
  for (const ins of inserted) {
    const list = byAnchor.get(ins.afterId) ?? []
    list.push(ins)
    byAnchor.set(ins.afterId, list)
  }

  const result: EffectiveSection[] = []
  const seen = new Set<string>()

  function placeInserted(ins: InsertedSlide) {
    if (seen.has(ins.id)) return // guard against accidental cycles
    seen.add(ins.id)
    result.push({ id: ins.id, title: ins.title, body: ins.body, inserted: true })
    for (const child of byAnchor.get(ins.id) ?? []) placeInserted(child)
  }

  for (const ins of byAnchor.get(START_ANCHOR) ?? []) placeInserted(ins)
  for (const s of source) {
    result.push(s)
    for (const child of byAnchor.get(s.id) ?? []) placeInserted(child)
  }
  return result
}
