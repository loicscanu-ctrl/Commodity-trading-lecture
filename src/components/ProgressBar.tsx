type Props = { current: number; total: number }

export default function ProgressBar({ current, total }: Props) {
  const pct = total === 0 ? 0 : (current / total) * 100
  return (
    <div className="h-0.5 bg-slate-800 w-full">
      <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${pct}%` }} />
    </div>
  )
}
