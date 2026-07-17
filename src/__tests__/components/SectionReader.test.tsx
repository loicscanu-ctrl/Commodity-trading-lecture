import { render, screen, fireEvent } from '@testing-library/react'
import SectionReader from '@/components/SectionReader'
import type { Section } from '@/types/content'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('react-markdown', () => ({ __esModule: true, default: ({ children }: { children: string }) => <p>{children}</p> }))
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => undefined })) // ESM-only; not needed under the react-markdown mock

const sections: Section[] = [
  { id: 's1', title: 'Section One', body: 'Body of section one' },
  { id: 's2', title: 'Section Two', body: 'Body of section two' },
  { id: 's3', title: 'Section Three', body: 'Body of section three' },
]

beforeEach(() => { window.localStorage.clear() })

test('renders first section title and body', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" />)
  expect(screen.getByText('Section One')).toBeInTheDocument()
  expect(screen.getByText(/Body of section one/)).toBeInTheDocument()
})

test('Back button is disabled on first section', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" />)
  expect(screen.getByRole('button', { name: /Back/ })).toBeDisabled()
})

test('Continue advances to next section', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" />)
  fireEvent.click(screen.getByRole('button', { name: /Continue/ }))
  expect(screen.getByText('Section Two')).toBeInTheDocument()
})

test('last section shows "Back to Module" button', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" initialIndex={2} />)
  expect(screen.getByRole('button', { name: /Back to Module/ })).toBeInTheDocument()
})

test('ArrowRight key advances section', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" />)
  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(screen.getByText('Section Two')).toBeInTheDocument()
})

test('ArrowLeft key goes to previous section', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" initialIndex={1} />)
  fireEvent.keyDown(window, { key: 'ArrowLeft' })
  expect(screen.getByText('Section One')).toBeInTheDocument()
})

test('arrow keys inside an input do not change slides', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" />)
  const input = document.createElement('input')
  document.body.appendChild(input)
  fireEvent.keyDown(input, { key: 'ArrowRight' })
  expect(screen.getByText('Section One')).toBeInTheDocument()
  document.body.removeChild(input)
})

test('a live session locks all navigation until it ends', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" />)
  fireEvent(window, new CustomEvent('ptbf-live-lock', { detail: true }))
  // Buttons disabled, arrows dead, lock banner shown
  expect(screen.getByRole('button', { name: /Continue/ })).toBeDisabled()
  expect(screen.getByText(/LIVE session in progress/)).toBeInTheDocument()
  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(screen.getByText('Section One')).toBeInTheDocument()
  // Session ends → navigation unlocks
  fireEvent(window, new CustomEvent('ptbf-live-lock', { detail: false }))
  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(screen.getByText('Section Two')).toBeInTheDocument()
})

test('shows section counter', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" />)
  expect(screen.getByText('1 / 3')).toBeInTheDocument()
})

test('edit-mode toggle is off by default (no Edit slide button)', () => {
  render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  expect(screen.queryByRole('button', { name: /Edit slide/ })).not.toBeInTheDocument()
})

test('enabling edit mode lets you edit and save a slide override', () => {
  render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  // Toggle edit mode on
  fireEvent.click(screen.getByRole('button', { name: /^Edit$/ }))
  // The "Edit slide" affordance now appears
  fireEvent.click(screen.getByRole('button', { name: /Edit slide/ }))
  // Change the body in the markdown textarea and save
  const textarea = screen.getByDisplayValue('Body of section one')
  fireEvent.change(textarea, { target: { value: 'Rewritten body' } })
  fireEvent.click(screen.getByRole('button', { name: /^Save$/ }))
  // The slide now renders the edited text and is flagged as edited
  expect(screen.getByText('Rewritten body')).toBeInTheDocument()
  expect(screen.getByText('edited')).toBeInTheDocument()
})

test('graphic-text fields edit the text rendered inside a visual', () => {
  const visualSections: Section[] = [
    { id: 'v1', title: 'Laws', body: 'notes', visual: 'three-laws' },
  ]
  render(<SectionReader sections={visualSections} moduleId={1} topicId="t1" topicTitle="Test" />)
  // The visual renders its default text
  expect(screen.getByText('Absolute Ethics')).toBeInTheDocument()
  // Enter edit mode and open the editor
  fireEvent.click(screen.getByRole('button', { name: /^Edit$/ }))
  fireEvent.click(screen.getByRole('button', { name: /Edit slide/ }))
  // A graphic-text field is prefilled with the default and editable
  fireEvent.change(screen.getByDisplayValue('Absolute Ethics'), { target: { value: 'Clean Hands' } })
  fireEvent.click(screen.getByRole('button', { name: /^Save$/ }))
  // The visual now shows the edited text
  expect(screen.getByText('Clean Hands')).toBeInTheDocument()
  expect(screen.queryByText('Absolute Ethics')).not.toBeInTheDocument()
})

test('inserting a slide after the current one grows the deck and opens it for editing', () => {
  render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  fireEvent.click(screen.getByRole('button', { name: /^Edit$/ }))
  expect(screen.getByText('1 / 3')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /\+ After/ }))
  // The editor opens directly on the new inserted slide
  expect(screen.getByText('Editing inserted slide')).toBeInTheDocument()
  fireEvent.change(screen.getByDisplayValue('New slide'), { target: { value: 'My New Slide' } })
  fireEvent.click(screen.getByRole('button', { name: /^Save$/ }))
  // Now slide 2 of 4, flagged inserted, between section one and two
  expect(screen.getByText('2 / 4')).toBeInTheDocument()
  expect(screen.getByText('inserted')).toBeInTheDocument()
  expect(screen.getByText('My New Slide')).toBeInTheDocument()
})

test('inserting before the first slide prepends a new slide', () => {
  render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  fireEvent.click(screen.getByRole('button', { name: /^Edit$/ }))
  fireEvent.click(screen.getByRole('button', { name: /\+ Before/ }))
  fireEvent.change(screen.getByDisplayValue('New slide'), { target: { value: 'Intro' } })
  fireEvent.click(screen.getByRole('button', { name: /^Save$/ }))
  // The new slide is now the very first one
  expect(screen.getByText('1 / 4')).toBeInTheDocument()
  expect(screen.getByText('Intro')).toBeInTheDocument()
  expect(screen.getByText('inserted')).toBeInTheDocument()
})

test('an inserted slide can be deleted, restoring the deck', () => {
  render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  fireEvent.click(screen.getByRole('button', { name: /^Edit$/ }))
  fireEvent.click(screen.getByRole('button', { name: /\+ After/ }))
  fireEvent.change(screen.getByDisplayValue('New slide'), { target: { value: 'Throwaway' } })
  fireEvent.click(screen.getByRole('button', { name: /^Save$/ }))
  expect(screen.getByText('2 / 4')).toBeInTheDocument()
  // Re-open the inserted slide and delete it
  fireEvent.click(screen.getByRole('button', { name: /Edit slide/ }))
  fireEvent.click(screen.getByRole('button', { name: /Delete slide/ }))
  // Deck restored to 3 source slides; the inserted slide is gone
  expect(screen.getByText('1 / 3')).toBeInTheDocument()
  expect(screen.queryByText('Throwaway')).not.toBeInTheDocument()
})

test('inserted slides persist to localStorage and reload on remount', () => {
  const { unmount } = render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  fireEvent.click(screen.getByRole('button', { name: /^Edit$/ }))
  fireEvent.click(screen.getByRole('button', { name: /\+ After/ }))
  fireEvent.change(screen.getByDisplayValue('New slide'), { target: { value: 'Persisted slide' } })
  fireEvent.click(screen.getByRole('button', { name: /^Save$/ }))
  unmount()
  render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  // Deck still has the 4th slide after remount
  expect(screen.getByText('1 / 4')).toBeInTheDocument()
})

test('override persists to localStorage and reapplies on remount', () => {
  const { unmount } = render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  fireEvent.click(screen.getByRole('button', { name: /^Edit$/ }))
  fireEvent.click(screen.getByRole('button', { name: /Edit slide/ }))
  fireEvent.change(screen.getByDisplayValue('Body of section one'), { target: { value: 'Persisted body' } })
  fireEvent.click(screen.getByRole('button', { name: /^Save$/ }))
  unmount()
  render(<SectionReader sections={sections} moduleId={1} topicId="t1" topicTitle="Test" />)
  expect(screen.getByText('Persisted body')).toBeInTheDocument()
})
