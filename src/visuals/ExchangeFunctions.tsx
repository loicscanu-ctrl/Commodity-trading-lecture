'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Three functions the physical trade depends on' },
  hub: { label: 'Hub · label', value: 'Liquidity' },
  sat1: { label: 'Satellite · top', value: 'Price discovery' },
  sat2: { label: 'Satellite · bottom-left', value: 'Risk management' },
  sat3: { label: 'Satellite · bottom-right', value: 'Buyer / seller of last resort' },
  whoTitle: { label: 'Chip row · title', value: 'Who relies on it' },
  who1: { label: 'Chip 1', value: 'Producers' },
  who2: { label: 'Chip 2', value: 'Exporters' },
  who3: { label: 'Chip 3', value: 'Trade houses' },
  who4: { label: 'Chip 4', value: 'Roasters' },
  who5: { label: 'Chip 5', value: 'Funds & investors' },
  caption: { label: 'Caption', multiline: true, value: 'A single, centrally-cleared marketplace where the whole supply chain can transfer price risk and read one transparent price — and, because it is physically deliverable, the buyer and seller of last resort for standard-spec coffee.' },
})

// Hub-and-spoke geometry (viewBox 480 x 300)
const HUB = { x: 240, y: 152, r: 58 }
const SATS = [
  { x: 240, y: 46, r: 40 }, // top
  { x: 88, y: 246, r: 44 }, // bottom-left
  { x: 392, y: 246, r: 44 }, // bottom-right
]

/** Greedy word-wrap so satellite labels fit inside their circles. */
function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function Satellite({ cx, cy, r, label }: { cx: number; cy: number; r: number; label: string }) {
  const lines = wrapLines(label, 11)
  const lineHeight = 13
  const y0 = cy - ((lines.length - 1) * lineHeight) / 2
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text textAnchor="middle" fill="#fff" fontSize="11.5" fontWeight="600">
        {lines.map((line, i) => (
          <tspan key={i} x={cx} y={y0 + i * lineHeight + 4}>{line}</tspan>
        ))}
      </text>
    </g>
  )
}

const WHO_DOTS = ['#22d3ee', '#f59e0b', '#8b5cf6', '#34d399', '#f43f5e']

export default function ExchangeFunctions() {
  const t = useVisualText(textDef)
  const satellites = [t('sat1'), t('sat2'), t('sat3')]
  const who = [t('who1'), t('who2'), t('who3'), t('who4'), t('who5')]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-3">{t('heading')}</div>

      <svg viewBox="0 0 480 300" className="w-full" style={{ maxHeight: '300px' }}>
        {/* Spokes (under the circles) */}
        {SATS.map((s, i) => (
          <line key={i} x1={HUB.x} y1={HUB.y} x2={s.x} y2={s.y}
            stroke="#3b82f6" strokeWidth="2" opacity="0.45" />
        ))}

        {/* Hub */}
        <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="#3b82f6" opacity="0.9" />
        <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <text x={HUB.x} y={HUB.y + 5} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="bold">
          {t('hub')}
        </text>

        {/* Satellites */}
        {SATS.map((s, i) => (
          <Satellite key={i} cx={s.x} cy={s.y} r={s.r} label={satellites[i]} />
        ))}
      </svg>

      {/* Who relies on it */}
      <div className="mt-4">
        <div className="eyebrow mb-2">{t('whoTitle')}</div>
        <div className="flex flex-wrap gap-2">
          {who.map((name, i) => (
            <span key={name} className="chip inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: WHO_DOTS[i] }} />
              {name}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-slate-400 text-sm leading-relaxed">{t('caption')}</p>
    </div>
  )
}
