import Link from 'next/link'

type Props = { score: number; total: number; moduleId: number }

export default function QuizSummary({ score, total, moduleId }: Props) {
  const pct = Math.round((score / total) * 100)
  const message = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good effort!' : 'Keep reviewing.'

  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="text-6xl font-bold text-amber-400 mb-2">{pct}%</div>
      <p className="text-slate-300 mb-1">{score} / {total} correct</p>
      <p className="text-slate-500 text-sm mb-10">{message}</p>
      <Link
        href={`/module/${moduleId}`}
        className="block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
      >
        Back to Module
      </Link>
    </div>
  )
}
