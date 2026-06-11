import type { Section, Question } from '@/types/content'
import { slideKey, type OverrideMap } from './slideOverrides'
import { quizKey, type QuizOverrideMap } from './quizOverrides'

// Escape a string for embedding inside a TS template literal.
const tl = (s: string) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')

/** Build a ready-to-paste `sections: [ … ]` TS block for a lecture topic. */
export function buildTopicTs(sections: Section[], overrides: OverrideMap, moduleId: number, topicId: string): string {
  const blocks = sections.map(s => {
    const ov = overrides[slideKey(moduleId, topicId, s.id)]
    const title = ov?.title ?? s.title
    const body = ov?.body ?? s.body
    return [
      `  {`,
      `    id: '${s.id}',`,
      `    title: \`${tl(title)}\`,`,
      `    body: \`${tl(body)}\`,`,
      s.visual ? `    visual: '${s.visual}',` : null,
      `  },`,
    ].filter(Boolean).join('\n')
  })
  return `sections: [\n${blocks.join('\n')}\n]`
}

/** Build a ready-to-paste `questions: [ … ]` TS block for a quiz topic. */
export function buildQuizTs(questions: Question[], overrides: QuizOverrideMap, moduleId: number, quizId: string): string {
  const blocks = questions.map(q => {
    const ov = overrides[quizKey(moduleId, quizId, q.id)]
    const question = ov?.question ?? q.question
    const options = ov?.options ?? q.options
    const correctIndex = ov?.correctIndex ?? q.correctIndex
    const explanation = ov?.explanation ?? q.explanation
    const optionLines = options.map(o => `      \`${tl(o)}\`,`).join('\n')
    return [
      `  {`,
      `    id: '${q.id}',`,
      `    question: \`${tl(question)}\`,`,
      `    options: [`,
      optionLines,
      `    ],`,
      `    correctIndex: ${correctIndex},`,
      explanation ? `    explanation: \`${tl(explanation)}\`,` : null,
      `  },`,
    ].filter(Boolean).join('\n')
  })
  return `questions: [\n${blocks.join('\n')}\n]`
}
