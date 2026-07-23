export type Topic = {
  id: string
  title: string
  type: 'lecture' | 'case-study' | 'tool' | 'quiz' | 'simulation'
  estimatedMinutes: number
  v2?: boolean        // true = "Coming Soon", card disabled
  sections?: Section[]
  quiz?: Quiz
  tool?: ToolConfig
}

// Routing rule (used by TopicCard):
//   lecture | case-study → /module/[id]/section/[topic.id]
//   quiz                 → /module/[id]/quiz/[topic.id]
//   tool                 → /module/[id]/tool/[topic.id]
//   simulation           → disabled (v2)

export type Section = {
  id: string
  title: string
  body: string        // markdown string
  visual?: string     // key into src/visuals/index.ts registry
  visualText?: Record<string, string>  // optional per-slide overrides for the visual's editable text
}

export type Quiz = {
  questions: Question[]
}

export type Question = {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation?: string
}

export type ToolConfig = {
  componentKey: string  // key into src/tools/index.ts registry
}

export type Module = {
  id: number
  title: string
  objectives: string[] // what the student will know after this module (shown as the hero band)
  topics: Topic[]
}
