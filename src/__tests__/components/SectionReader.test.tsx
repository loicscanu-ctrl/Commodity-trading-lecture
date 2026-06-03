import { render, screen, fireEvent } from '@testing-library/react'
import SectionReader from '@/components/SectionReader'
import type { Section } from '@/types/content'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('react-markdown', () => ({ __esModule: true, default: ({ children }: { children: string }) => <p>{children}</p> }))

const sections: Section[] = [
  { id: 's1', title: 'Section One', body: 'Body of section one' },
  { id: 's2', title: 'Section Two', body: 'Body of section two' },
  { id: 's3', title: 'Section Three', body: 'Body of section three' },
]

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

test('shows section counter', () => {
  render(<SectionReader sections={sections} moduleId={1} topicTitle="Test" />)
  expect(screen.getByText('1 / 3')).toBeInTheDocument()
})
