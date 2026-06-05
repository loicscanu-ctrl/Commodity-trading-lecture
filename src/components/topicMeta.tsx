import type { Topic } from '@/types/content'

export type TopicMeta = {
  label: string
  hex: string          // accent colour for this type
  text: string         // tailwind text class
  ring: string         // tailwind border/ring class
  glow: string         // gradient for the accent rail
  icon: React.ReactNode
}

const I = {
  lecture: (
    <path d="M4 5h16M4 5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h7M4 5l8 4 8-4M20 5a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-7m0-9v9" />
  ),
  case: (
    <path d="M9 4h6a1 1 0 0 1 1 1v2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h3V5a1 1 0 0 1 1-1Zm1 3h4V6h-4v1Z" />
  ),
  quiz: (
    <path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.9.5-1.6 1.2-1.6 2.3M12 17h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
  ),
  tool: (
    <path d="M14.5 5.5a3.5 3.5 0 0 1-4.7 4.3L5 14.6V19h4.4l4.8-4.8a3.5 3.5 0 0 0 4.3-4.7l-2.3 2.3-2-2 2.3-2.3Z" />
  ),
  simulation: (
    <path d="M3 17l5-5 3 3 4-6 3 4M3 21h18M5 3v4M3 5h4" />
  ),
}

export const TOPIC_META: Record<Topic['type'], Omit<TopicMeta, 'icon'> & { iconPath: React.ReactNode }> = {
  lecture: {
    label: 'Lecture', hex: '#3b82f6', text: 'text-blue-300', ring: 'border-blue-400/30',
    glow: 'linear-gradient(180deg,#60a5fa,#3b82f6)', iconPath: I.lecture,
  },
  'case-study': {
    label: 'Case Study', hex: '#a78bfa', text: 'text-violet-300', ring: 'border-violet-400/30',
    glow: 'linear-gradient(180deg,#c4b5fd,#8b5cf6)', iconPath: I.case,
  },
  quiz: {
    label: 'Quiz', hex: '#34d399', text: 'text-emerald-300', ring: 'border-emerald-400/30',
    glow: 'linear-gradient(180deg,#6ee7b7,#10b981)', iconPath: I.quiz,
  },
  tool: {
    label: 'Tool', hex: '#22d3ee', text: 'text-cyan-300', ring: 'border-cyan-400/30',
    glow: 'linear-gradient(180deg,#67e8f9,#06b6d4)', iconPath: I.tool,
  },
  simulation: {
    label: 'Simulation', hex: '#fb7185', text: 'text-rose-300', ring: 'border-rose-400/30',
    glow: 'linear-gradient(180deg,#fda4af,#f43f5e)', iconPath: I.simulation,
  },
}

export function TopicIcon({ type, className = 'h-4 w-4' }: { type: Topic['type']; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      {TOPIC_META[type].iconPath}
    </svg>
  )
}
