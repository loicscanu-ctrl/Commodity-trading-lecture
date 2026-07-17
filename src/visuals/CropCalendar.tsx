'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Coffee crop calendar' },
  o1: { label: 'Origin 1 · label', value: 'Brazil (arabica) — May–Sep' },
  o2: { label: 'Origin 2 · label', value: 'Vietnam (robusta) — Nov–Feb' },
  o3: { label: 'Origin 3 · label', value: 'Colombia — Oct–Jan main crop, Apr–Jun mitaca' },
  o4: { label: 'Origin 4 · label', value: 'Indonesia (Sumatra) — Oct–Mar' },
  caption: {
    label: 'Caption',
    multiline: true,
    value: 'Somewhere, it is always harvest: supply pressure rotates through the year, which is why softs curves carry crop-year structure (remember wheat’s September break) and why differentials have seasons. And note the needle: on the course’s trading date, Vietnam’s harvest is just beginning — exactly the backdrop of the Y1 Nov round in the live-market exercise.',
  },
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CX = 180
const CY = 180

/** Point at radius r, angle in degrees measured clockwise from 12 o’clock. */
function pt(r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

/**
 * Annular-sector path spanning months [startMonth..endMonth] inclusive
 * (0 = Jan), allowing ranges that wrap the year end (e.g. Nov -> Feb).
 */
function monthArc(startMonth: number, endMonth: number, rOuter: number, rInner: number, padDeg = 2): string {
  const span = ((endMonth - startMonth + 12) % 12) + 1 // months, inclusive
  const a0 = startMonth * 30 + padDeg
  const a1 = (startMonth + span) * 30 - padDeg
  const largeArc = a1 - a0 > 180 ? 1 : 0
  const [x0, y0] = pt(rOuter, a0)
  const [x1, y1] = pt(rOuter, a1)
  const [x2, y2] = pt(rInner, a1)
  const [x3, y3] = pt(rInner, a0)
  const f = (n: number) => n.toFixed(2)
  return [
    `M ${f(x0)} ${f(y0)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${f(x1)} ${f(y1)}`,
    `L ${f(x2)} ${f(y2)}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${f(x3)} ${f(y3)}`,
    'Z',
  ].join(' ')
}

// Arc geometry stays in code; labels are editable via textDef.
const RINGS = [
  { key: 'o1', hex: '#f59e0b', arcs: [{ start: 4, end: 8, rOuter: 148, rInner: 130 }] }, // Brazil May–Sep
  { key: 'o2', hex: '#22d3ee', arcs: [{ start: 10, end: 1, rOuter: 124, rInner: 106 }] }, // Vietnam Nov–Feb (wraps)
  {
    key: 'o3',
    hex: '#34d399',
    arcs: [
      { start: 9, end: 0, rOuter: 100, rInner: 82 }, // Colombia main Oct–Jan
      { start: 3, end: 5, rOuter: 96, rInner: 86 }, // mitaca Apr–Jun (thinner)
    ],
  },
  { key: 'o4', hex: '#8b5cf6', arcs: [{ start: 9, end: 2, rOuter: 76, rInner: 58 }] }, // Indonesia Oct–Mar
] as const

export default function CropCalendar() {
  const t = useVisualText(textDef)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-3">{t('heading')}</div>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <svg
          viewBox="0 0 360 360"
          className="w-full max-w-[340px] mx-auto md:mx-0 shrink-0"
          role="img"
          aria-label="Circular 12-month calendar showing main coffee harvest windows by origin"
        >
          {/* month boundary ticks */}
          {MONTHS.map((_, m) => {
            const [x0, y0] = pt(52, m * 30)
            const [x1, y1] = pt(152, m * 30)
            return (
              <line
                key={m}
                x1={x0.toFixed(2)}
                y1={y0.toFixed(2)}
                x2={x1.toFixed(2)}
                y2={y1.toFixed(2)}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            )
          })}

          {/* faint tracks for each origin ring */}
          {RINGS.map(ring => {
            const { rOuter, rInner } = ring.arcs[0]
            return (
              <circle
                key={ring.key}
                cx={CX}
                cy={CY}
                r={(rOuter + rInner) / 2}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={rOuter - rInner}
              />
            )
          })}

          {/* harvest arcs */}
          {RINGS.map(ring =>
            ring.arcs.map((a, i) => (
              <path
                key={ring.key + i}
                d={monthArc(a.start, a.end, a.rOuter, a.rInner)}
                fill={ring.hex}
                fillOpacity={i === 0 ? 0.85 : 0.55}
                stroke={ring.hex}
                strokeOpacity={0.4}
                strokeWidth="1"
              />
            )),
          )}

          {/* outer ring of month labels, clockwise from the top */}
          {MONTHS.map((label, m) => {
            const [x, y] = pt(163, m * 30 + 15)
            return (
              <text
                key={label}
                x={x.toFixed(2)}
                y={y.toFixed(2)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#94a3b8"
                fontSize="12"
                className="font-mono"
              >
                {label}
              </text>
            )
          })}

          {/* "today" needle — the course's trading date, 12 November */}
          {(() => {
            const angle = 10 * 30 + 12; // ~12 Nov
            const [nx0, ny0] = pt(50, angle)
            const [nx1, ny1] = pt(155, angle)
            const [lx, ly] = pt(120, angle - 14)
            return (
              <g>
                <line x1={nx0.toFixed(2)} y1={ny0.toFixed(2)} x2={nx1.toFixed(2)} y2={ny1.toFixed(2)}
                  stroke="#f43f5e" strokeWidth="1.5" opacity="0.85" />
                <circle cx={nx1.toFixed(2)} cy={ny1.toFixed(2)} r="3" fill="#f43f5e" />
                <text x={lx.toFixed(2)} y={ly.toFixed(2)} textAnchor="end" fill="#f43f5e" fontSize="8.5" className="font-mono" fontWeight="bold">
                  12 Nov · today
                </text>
              </g>
            )
          })()}

          {/* center hub */}
          <circle cx={CX} cy={CY} r="46" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={CX} y={CY - 6} textAnchor="middle" fill="#64748b" fontSize="9" letterSpacing="2" className="font-mono">
            MAIN
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" fill="#64748b" fontSize="9" letterSpacing="2" className="font-mono">
            HARVEST
          </text>
        </svg>

        <div className="flex-1">
          <ul className="space-y-3">
            {RINGS.map(ring => (
              <li key={ring.key} className="flex items-start gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ring.hex }}
                  aria-hidden="true"
                />
                <span className="text-slate-300 text-sm leading-relaxed">{t(ring.key)}</span>
              </li>
            ))}
          </ul>

          <p className="text-slate-400 text-sm leading-relaxed mt-5 border-t border-white/5 pt-4">{t('caption')}</p>
        </div>
      </div>
    </div>
  )
}
