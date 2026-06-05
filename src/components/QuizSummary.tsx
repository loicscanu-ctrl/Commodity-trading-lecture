import Link from 'next/link'

type Props = { score: number; total: number; moduleId: number }

export default function QuizSummary({ score, total, moduleId }: Props) {
  const pct = Math.round((score / total) * 100)
  const tier = pct >= 80
    ? { color: '#34d399', label: 'Pass', text: 'text-emerald-300' }
    : pct >= 60
    ? { color: '#fbbf24', label: 'Review', text: 'text-amber-300' }
    : { color: '#fb7185', label: 'Retry', text: 'text-rose-300' }

  const R = 54
  const C = 2 * Math.PI * R
  const dash = (pct / 100) * C

  return (
    <div className="mx-auto max-w-md animate-fade-up px-6 py-20 text-center">
      <div className="glass mx-auto flex flex-col items-center p-10">
        {/* Radial gauge */}
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
            <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
            <circle cx="64" cy="64" r={R} fill="none" stroke={tier.color} strokeWidth="10"
              strokeLinecap="round" strokeDasharray={`${dash} ${C}`}
              style={{ filter: `drop-shadow(0 0 8px ${tier.color})`, transition: 'stroke-dasharray 1s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums">{pct}%</span>
            <span className={`mt-1 font-mono text-[11px] uppercase tracking-[0.2em] ${tier.text}`}>{tier.label}</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-400">
          <span className="font-semibold text-white">{score}</span> of {total} correct
        </p>

        <Link href={`/module/${moduleId}`} className="btn-primary mt-8 w-full">
          ← Back to module
        </Link>
      </div>
    </div>
  )
}
