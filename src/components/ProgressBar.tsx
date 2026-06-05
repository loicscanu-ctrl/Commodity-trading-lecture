type Props = { current: number; total: number }

export default function ProgressBar({ current, total }: Props) {
  const pct = total === 0 ? 0 : (current / total) * 100
  return (
    <div className="h-[3px] w-full bg-white/[0.06]">
      <div
        className="h-full rounded-r-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg,#22d3ee,#3b82f6 55%,#8b5cf6)',
          boxShadow: '0 0 14px -1px rgba(59,130,246,0.8)',
        }}
      />
    </div>
  )
}
