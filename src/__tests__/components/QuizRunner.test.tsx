import { render, screen, fireEvent } from '@testing-library/react'
import QuizRunner from '@/app/module/[id]/quiz/[quizId]/QuizRunner'
import type { Question } from '@/types/content'

const questions: Question[] = [
  { id: 'q1', question: 'What is 2+2?', options: ['3', '4', '5', '6'], correctIndex: 1, explanation: 'Arithmetic.' },
]

beforeEach(() => { window.localStorage.clear() })

test('quiz edit mode is off by default', () => {
  render(<QuizRunner questions={questions} moduleId={1} topicId="qz" topicTitle="Q" />)
  expect(screen.queryByRole('button', { name: /Edit question/ })).not.toBeInTheDocument()
  expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
})

test('editing a question saves and reapplies an override', () => {
  const { unmount } = render(<QuizRunner questions={questions} moduleId={1} topicId="qz" topicTitle="Q" />)
  fireEvent.click(screen.getByRole('button', { name: /^Edit$/ }))
  fireEvent.click(screen.getByRole('button', { name: /Edit question/ }))

  // Rewrite the question text and the first answer, then save
  fireEvent.change(screen.getByDisplayValue('What is 2+2?'), { target: { value: 'Two plus two equals?' } })
  fireEvent.change(screen.getByDisplayValue('3'), { target: { value: 'three' } })
  fireEvent.click(screen.getByRole('button', { name: /^Save$/ }))

  expect(screen.getByText('Two plus two equals?')).toBeInTheDocument()
  expect(screen.getByText('three')).toBeInTheDocument()
  expect(screen.getByText('edited')).toBeInTheDocument()

  // Persists across remount
  unmount()
  render(<QuizRunner questions={questions} moduleId={1} topicId="qz" topicTitle="Q" />)
  expect(screen.getByText('Two plus two equals?')).toBeInTheDocument()
})
