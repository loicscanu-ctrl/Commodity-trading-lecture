import { render, screen } from '@testing-library/react'
import TopicCard from '@/components/TopicCard'
import type { Topic } from '@/types/content'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const lectureTopic: Topic = {
  id: 'test-lecture',
  title: 'Test Lecture Topic',
  type: 'lecture',
  estimatedMinutes: 20,
  sections: [],
}

const v2Topic: Topic = {
  id: 'test-v2',
  title: 'Coming Feature',
  type: 'simulation',
  estimatedMinutes: 60,
  v2: true,
}

const quizTopic: Topic = {
  id: 'test-quiz',
  title: 'Test Quiz',
  type: 'quiz',
  estimatedMinutes: 15,
}

const toolTopic: Topic = {
  id: 'test-tool',
  title: 'Test Tool',
  type: 'tool',
  estimatedMinutes: 10,
}

const caseStudyTopic: Topic = {
  id: 'test-case',
  title: 'Test Case Study',
  type: 'case-study',
  estimatedMinutes: 30,
  sections: [],
}

test('renders topic title', () => {
  render(<TopicCard topic={lectureTopic} moduleId={1} />)
  expect(screen.getByText('Test Lecture Topic')).toBeInTheDocument()
})

test('renders type badge', () => {
  render(<TopicCard topic={lectureTopic} moduleId={1} />)
  expect(screen.getByText('Lecture')).toBeInTheDocument()
})

test('links to section reader for lecture type', () => {
  render(<TopicCard topic={lectureTopic} moduleId={1} />)
  expect(screen.getByRole('link')).toHaveAttribute('href', '/module/1/section/test-lecture')
})

test('renders Coming Soon badge for v2 topics', () => {
  render(<TopicCard topic={v2Topic} moduleId={1} />)
  expect(screen.getByText('Coming Soon')).toBeInTheDocument()
})

test('v2 topics do not render as links', () => {
  render(<TopicCard topic={v2Topic} moduleId={1} />)
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})

test('links to quiz page for quiz type', () => {
  render(<TopicCard topic={quizTopic} moduleId={1} />)
  expect(screen.getByRole('link')).toHaveAttribute('href', '/module/1/quiz/test-quiz')
})

test('links to tool page for tool type', () => {
  render(<TopicCard topic={toolTopic} moduleId={1} />)
  expect(screen.getByRole('link')).toHaveAttribute('href', '/module/1/tool/test-tool')
})

test('links to section reader for case-study type', () => {
  render(<TopicCard topic={caseStudyTopic} moduleId={1} />)
  expect(screen.getByRole('link')).toHaveAttribute('href', '/module/1/section/test-case')
})
