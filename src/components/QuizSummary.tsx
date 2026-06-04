import Link from 'next/link'

type Props = { score: number; total: number; moduleId: number }

export default function QuizSummary({ score, total, moduleId }: Props) {
  const pct = Math.round((score / total) * 100)
  const color = pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
  const message = pct >= 80 ? 'PASS' : pct >= 60 ? 'REVIEW' : 'FAIL'

  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className={`text-7xl font-mono font-bold mb-2 ${color}`}>{pct}%</div>
      <div className={`text-xs font-mono tracking-widest mb-2 ${color}`}>{message}</div>
      <p className="text-slate-500 text-sm font-mono mb-10">{score} / {total} correct</p>
      <Link
        href={`/module/${moduleId}`}
        className="block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm font-mono uppercase tracking-widest transition-colors"
      >
        Back to Module
      </Link>
    </div>
  )
}
