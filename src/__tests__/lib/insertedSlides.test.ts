import type { Section } from '@/types/content'
import {
  buildEffectiveSections, addInsertedSlide, removeInsertedSlide,
  updateInsertedSlide, START_ANCHOR, type InsertedSlide, type InsertedMap,
} from '@/lib/insertedSlides'

const source: Section[] = [
  { id: 'a', title: 'A', body: '' },
  { id: 'b', title: 'B', body: '' },
  { id: 'c', title: 'C', body: '' },
]
const ids = (xs: { id: string }[]) => xs.map(x => x.id)

test('no inserts returns the source order unchanged', () => {
  expect(ids(buildEffectiveSections(source, []))).toEqual(['a', 'b', 'c'])
})

test('insert after a slide lands immediately after its anchor', () => {
  const ins: InsertedSlide[] = [{ id: 'x', afterId: 'a', title: 'X', body: '' }]
  expect(ids(buildEffectiveSections(source, ins))).toEqual(['a', 'x', 'b', 'c'])
})

test('START_ANCHOR prepends before the first source slide', () => {
  const ins: InsertedSlide[] = [{ id: 'x', afterId: START_ANCHOR, title: 'X', body: '' }]
  expect(ids(buildEffectiveSections(source, ins))).toEqual(['x', 'a', 'b', 'c'])
})

test('multiple inserts after the same anchor keep insertion order', () => {
  const ins: InsertedSlide[] = [
    { id: 'x', afterId: 'b', title: 'X', body: '' },
    { id: 'y', afterId: 'b', title: 'Y', body: '' },
  ]
  expect(ids(buildEffectiveSections(source, ins))).toEqual(['a', 'b', 'x', 'y', 'c'])
})

test('a slide can be inserted after another inserted slide (nesting)', () => {
  const ins: InsertedSlide[] = [
    { id: 'x', afterId: 'a', title: 'X', body: '' },
    { id: 'y', afterId: 'x', title: 'Y', body: '' },
  ]
  expect(ids(buildEffectiveSections(source, ins))).toEqual(['a', 'x', 'y', 'b', 'c'])
})

test('inserted slides are flagged; source slides are not', () => {
  const ins: InsertedSlide[] = [{ id: 'x', afterId: 'a', title: 'X', body: '' }]
  const eff = buildEffectiveSections(source, ins)
  expect(eff.find(s => s.id === 'x')?.inserted).toBe(true)
  expect(eff.find(s => s.id === 'a')?.inserted).toBeUndefined()
})

test('add / update / remove round-trip; deleting re-parents children', () => {
  const tkey = '9/topic'
  let map: InsertedMap = {}
  const a1 = addInsertedSlide(map, tkey, 'a'); map = a1.map
  const a2 = addInsertedSlide(map, tkey, a1.id); map = a2.map // child of the first insert

  // edit the first inserted slide
  map = updateInsertedSlide(map, tkey, a1.id, { title: 'Edited', body: 'Body' })
  expect(buildEffectiveSections(source, map[tkey]).find(s => s.id === a1.id)?.title).toBe('Edited')

  // order so far: a, a1(Edited), a2, b, c
  expect(ids(buildEffectiveSections(source, map[tkey]))).toEqual(['a', a1.id, a2.id, 'b', 'c'])

  // delete the parent insert → its child re-anchors to 'a' and survives
  map = removeInsertedSlide(map, tkey, a1.id)
  expect(ids(buildEffectiveSections(source, map[tkey]))).toEqual(['a', a2.id, 'b', 'c'])
})
