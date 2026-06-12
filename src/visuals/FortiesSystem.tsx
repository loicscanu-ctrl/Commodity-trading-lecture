'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  title: { label: 'Eyebrow title', value: 'The Forties Pipeline System' },
  hubLabel: { label: 'Hub label', value: 'Forties Unity Riser' },
  terminalLabel: { label: 'Terminal label', value: 'Kinneil / Hound Point (export jetty)' },
  caption: {
    label: 'Caption',
    multiline: true,
    value: '≈150 North Sea fields funnel through one pipeline to one export point — so a single outage moves the global Brent benchmark.',
  },
})

// Deterministic field-node layout (left two-thirds of the 560-wide viewBox).
// A handful carry labels; the rest are anonymous dots.
type Field = { x: number; y: number; label?: string }
const FIELDS: Field[] = [
  { x: 44, y: 48, label: 'Buzzard' },
  { x: 96, y: 28 },
  { x: 150, y: 40, label: 'Nelson' },
  { x: 38, y: 96 },
  { x: 88, y: 80 },
  { x: 140, y: 92, label: 'Britannia' },
  { x: 200, y: 60 },
  { x: 60, y: 140, label: 'Montrose' },
  { x: 112, y: 132 },
  { x: 168, y: 122 },
  { x: 214, y: 110 },
  { x: 30, y: 184 },
  { x: 82, y: 196, label: 'Brae' },
  { x: 134, y: 176 },
  { x: 186, y: 168 },
  { x: 232, y: 150 },
  { x: 56, y: 238 },
  { x: 108, y: 250 },
  { x: 160, y: 226 },
  { x: 208, y: 212 },
  { x: 246, y: 196 },
  { x: 90, y: 286, label: 'Forties Alpha' },
  { x: 150, y: 274 },
  { x: 204, y: 262 },
  { x: 250, y: 244 },
  { x: 18, y: 140 },
]

// Hub (Unity Riser) and terminal (export jetty) positions.
const HUB = { x: 360, y: 150 }
const TERMINAL = { x: 500, y: 150 }

export default function FortiesSystem() {
  const t = useVisualText(textDef)
  const W = 560, H = 300

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">{t('title')}</div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '320px' }}>
          {/* Converging field → hub lines */}
          {FIELDS.map((f, i) => (
            <line
              key={`l-${i}`}
              x1={f.x} y1={f.y} x2={HUB.x} y2={HUB.y}
              stroke="rgba(52,211,153,0.4)" strokeWidth="1"
            />
          ))}

          {/* Thick trunk line: hub → terminal */}
          <line
            x1={HUB.x} y1={HUB.y} x2={TERMINAL.x} y2={TERMINAL.y}
            stroke="#34d399" strokeWidth="4.5" strokeLinecap="round"
          />

          {/* Field nodes */}
          {FIELDS.map((f, i) => (
            <g key={`n-${i}`}>
              {f.label ? (
                <rect
                  x={f.x - 4} y={f.y - 4} width="8" height="8" rx="1.5"
                  fill="#f59e0b" stroke="#070912" strokeWidth="1"
                />
              ) : (
                <circle cx={f.x} cy={f.y} r="2.6" fill="#f59e0b" opacity="0.85" />
              )}
              {f.label && (
                <text
                  x={f.x + 8} y={f.y + 3}
                  fill="#fbbf24" fontSize="8.5" fontFamily="monospace"
                >
                  {f.label}
                </text>
              )}
            </g>
          ))}

          {/* Hub node (larger) */}
          <circle cx={HUB.x} cy={HUB.y} r="13" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.4" />
          <circle cx={HUB.x} cy={HUB.y} r="8" fill="#34d399" stroke="#070912" strokeWidth="1.5" />
          <text
            x={HUB.x} y={HUB.y - 18} textAnchor="middle"
            fill="#34d399" fontSize="9.5" fontFamily="monospace" fontWeight="bold"
          >
            {t('hubLabel')}
          </text>

          {/* Terminal node */}
          <rect
            x={TERMINAL.x - 9} y={TERMINAL.y - 9} width="18" height="18" rx="2"
            fill="#22d3ee" stroke="#070912" strokeWidth="1.5"
          />
          <text
            x={TERMINAL.x} y={TERMINAL.y - 16} textAnchor="middle"
            fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold"
          >
            {t('terminalLabel')}
          </text>
          <text
            x={TERMINAL.x} y={TERMINAL.y + 28} textAnchor="middle"
            fill="#94a3b8" fontSize="8" fontFamily="monospace"
          >
            → to global Brent market
          </text>

          {/* ~150 fields annotation on the cluster */}
          <text x={18} y={16} fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
            ≈150 North Sea fields
          </text>
        </svg>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed mt-3">{t('caption')}</p>
    </div>
  )
}
