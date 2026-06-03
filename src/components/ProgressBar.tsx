type Props = { current: number; total: number }

export default function ProgressBar({ current, total }: Props) {
  const pct = total === 0 ? 0 : (current / total) * 100
  return (
    <div className="h-1 bg-slate-700 w-full">
      <div
        className="h-full bg-amber-500 transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
