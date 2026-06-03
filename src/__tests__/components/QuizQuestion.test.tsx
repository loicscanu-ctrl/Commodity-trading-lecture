import { render, screen, fireEvent } from '@testing-library/react'
import QuizQuestion from '@/components/QuizQuestion'
import type { Question } from '@/types/content'

const question: Question = {
  id: 'q1',
  question: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  correctIndex: 1,
  explanation: 'Basic arithmetic: 2 + 2 = 4.',
}

const onAnswer = jest.fn()

beforeEach(() => onAnswer.mockClear())

test('renders question and all 4 options', () => {
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  const buttons = screen.getAllByRole('button')
  expect(buttons).toHaveLength(4)
  expect(buttons[0]).toHaveTextContent('3')
  expect(buttons[1]).toHaveTextContent('4')
  expect(buttons[2]).toHaveTextContent('5')
  expect(buttons[3]).toHaveTextContent('6')
})

test('calls onAnswer(true) when correct option clicked', () => {
  jest.useFakeTimers()
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  fireEvent.click(screen.getAllByRole('button')[1]) // index 1 = "4" = correct
  jest.runAllTimers()
  expect(onAnswer).toHaveBeenCalledWith(true)
  jest.useRealTimers()
})

test('calls onAnswer(false) when wrong option clicked', () => {
  jest.useFakeTimers()
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  fireEvent.click(screen.getAllByRole('button')[0]) // index 0 = "3" = wrong
  jest.runAllTimers()
  expect(onAnswer).toHaveBeenCalledWith(false)
  jest.useRealTimers()
})

test('shows explanation after answering', () => {
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  fireEvent.click(screen.getAllByRole('button')[1])
  expect(screen.getByText('Basic arithmetic: 2 + 2 = 4.')).toBeInTheDocument()
})

test('disables all buttons after answering', () => {
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  fireEvent.click(screen.getAllByRole('button')[0])
  screen.getAllByRole('button').forEach(btn => {
    expect(btn).toBeDisabled()
  })
})
