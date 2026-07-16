'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Vietnam 2024–25: the exchange as buyer of last resort' },
  overlayLabel: { label: 'Overlay toggle · label', value: 'Show Gd2 as cash price ($/t)' },
  cashSeries: { label: 'Overlay series · name', value: 'Gd2 5% implied cash, FOB HCMC ($/t)' },
  gapLabel: { label: 'Overlay gap · label', value: 'gap = the differential' },
  p1Title: { label: 'Panel 1 · title', value: 'RC futures, front month (US$/t)' },
  p2Title: { label: 'Panel 2 · title', value: 'Gd2 5% cash differential, FOB Ho Chi Minh (US$/t)' },
  p3Title: { label: 'Panel 3 · title', value: 'Vietnamese lots graded at ICE (per month)' },
  lagLabel: { label: 'Lag annotation', value: '≈ 3-month lag' },
  caption: { label: 'Caption', multiline: true, value: 'The sequence to read top to bottom: front-month futures spike, so the cash differential collapses — Vietnamese Gd2 traded as much as $298/t UNDER the screen. When physical buyers pay less than the exchange, coffee flows to the exchange: gradings surge with a roughly three-month lag. That is "buyer of last resort" in action.' },
  source: { label: 'Source note', value: 'Indicative monthly series, reconstructed from an ICE coffee presentation (Sep 2024 – Dec 2025).' },
})

// Monthly series, Sep 2024 → Dec 2025.
const MONTHS = ['Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25']
const FUT = [5500, 4400, 5300, 4650, 5550, 5050, 4900, 4950, 4150, 3350, 3050, 4300, 3650, 3900, 3850, 3400]
const DIF = [-50, -150, -220, -100, -180, -298, -150, -40, 60, 150, 330, 420, 650, 300, 50, -60]
const GRD = [0, 0, 0, 0, 40, 0, 0, 0, 630, 0, 331, 15, 6, 0, 4, 0]

// Palette validated against the app's dark surface (#070912):
const C_FUT = '#3b82f6'
const C_DIF = '#d97706'
const C_GRD = '#0891b2'

const W = 560
const ML = 52, MR = 14
const PW = W - ML - MR
const N = MONTHS.length

const x = (i: number) => ML + (i / (N - 1)) * PW

type Panel = { top: number; h: number; min: number; max: number }
const P1: Panel = { top: 30, h: 104, min: 2800, max: 5800 }
const P2: Panel = { top: 172, h: 104, min: -400, max: 700 }
const P3: Panel = { top: 314, h: 92, min: 0, max: 700 }

const py = (p: Panel, v: number) => p.top + (1 - (v - p.min) / (p.max - p.min)) * p.h

function linePath(p: Panel, data: number[]) {
  return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${py(p, v).toFixed(1)}`).join(' ')
}

// Bar with rounded top corners, flush at the baseline.
function topRoundedBar(cx: number, yTop: number, w: number, yBase: number, r: number) {
  const x0 = cx - w / 2
  const rr = Math.min(r, (yBase - yTop) / 2, w / 2)
  return `M${x0},${yBase} V${yTop + rr} Q${x0},${yTop} ${x0 + rr},${yTop} H${x0 + w - rr} Q${x0 + w},${yTop} ${x0 + w},${yTop + rr} V${yBase} Z`
}

function PanelTitle({ y, color, children }: { y: number; color: string; children: React.ReactNode }) {
  return (
    <g>
      <circle cx={ML + 4} cy={y - 12} r="3.5" fill={color} />
      <text x={ML + 12} y={y - 9} fill="#94a3b8" fontSize="9" fontFamily="monospace">{children}</text>
    </g>
  )
}

export default function VietnamCaseStudy() {
  const t = useVisualText(textDef)
  const [overlay, setOverlay] = useState(false)

  const futMaxI = FUT.indexOf(Math.max(...FUT))
  const futMinI = FUT.indexOf(Math.min(...FUT))
  const difMinI = DIF.indexOf(Math.min(...DIF))
  const zeroY = py(P2, 0)
  const base3 = P3.top + P3.h

  // Gd2 expressed as an outright cash price: futures + differential ($/t).
  const CASH = FUT.map((v, i) => v + DIF[i])
  // Shaded band between the two lines — the gap IS the differential.
  const bandPath =
    FUT.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${py(P1, v).toFixed(1)}`).join(' ') +
    ' ' +
    [...CASH].reverse().map((v, i) => `L${x(N - 1 - i).toFixed(1)},${py(P1, v).toFixed(1)}`).join(' ') +
    ' Z'

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">{t('heading')}</div>
        <button
          onClick={() => setOverlay(o => !o)}
          title="Overlay the Gd2 differential as an outright cash price on the futures panel"
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            overlay
              ? 'border-amber-400/50 bg-amber-400/15 text-amber-200'
              : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${overlay ? 'bg-amber-400' : 'bg-slate-500'}`} />
          {t('overlayLabel')}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} 452`} className="w-full" style={{ maxHeight: '470px' }}>
        <defs>
          <marker id="vn-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Shared vertical gridlines */}
        {MONTHS.map((_, i) => i % 2 === 0 && (
          <line key={`g-${i}`} x1={x(i)} y1={P1.top} x2={x(i)} y2={base3} stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
        ))}

        {/* ── Panel 1: futures ── */}
        <PanelTitle y={P1.top} color={C_FUT}>{t('p1Title')}</PanelTitle>
        {[3000, 4000, 5000].map(v => (
          <g key={`p1-${v}`}>
            <line x1={ML} y1={py(P1, v)} x2={ML + PW} y2={py(P1, v)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={ML - 6} y={py(P1, v) + 3} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace">{v.toLocaleString()}</text>
          </g>
        ))}
        <path d={linePath(P1, FUT)} fill="none" stroke={C_FUT} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {FUT.map((v, i) => (
          <g key={`f-${i}`}>
            <circle cx={x(i)} cy={py(P1, v)} r="3" fill={C_FUT} stroke="#070912" strokeWidth="1" />
            <circle cx={x(i)} cy={py(P1, v)} r="10" fill="transparent">
              <title>{`${MONTHS[i]} · $${v.toLocaleString()}/t`}</title>
            </circle>
          </g>
        ))}
        <text x={x(futMaxI)} y={py(P1, FUT[futMaxI]) - 8} textAnchor="middle" fill="#e2e8f0" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
          ${FUT[futMaxI].toLocaleString()}
        </text>
        <text x={x(futMinI)} y={py(P1, FUT[futMinI]) + 14} textAnchor="middle" fill="#e2e8f0" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
          ${FUT[futMinI].toLocaleString()}
        </text>

        {/* ── Overlay: Gd2 as an outright cash price on the futures axis ── */}
        {overlay && (
          <g>
            <path d={bandPath} fill={C_DIF} opacity="0.14" />
            <path d={linePath(P1, CASH)} fill="none" stroke={C_DIF} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {CASH.map((v, i) => (
              <g key={`c-${i}`}>
                <circle cx={x(i)} cy={py(P1, v)} r="3" fill={C_DIF} stroke="#070912" strokeWidth="1" />
                <circle cx={x(i)} cy={py(P1, v)} r="10" fill="transparent">
                  <title>{`${MONTHS[i]} · Gd2 cash $${v.toLocaleString()}/t (futures ${DIF[i] >= 0 ? '+' : '−'}$${Math.abs(DIF[i])})`}</title>
                </circle>
              </g>
            ))}
            {/* Second series → legend entry beside the panel title */}
            <circle cx={300} cy={P1.top - 12} r="3.5" fill={C_DIF} />
            <text x={308} y={P1.top - 9} fill="#94a3b8" fontSize="9" fontFamily="monospace">{t('cashSeries')}</text>
            {/* The vertical gap between the lines is the differential */}
            <text x={x(12)} y={(py(P1, FUT[12]) + py(P1, CASH[12])) / 2 + 3} textAnchor="middle"
              fill="#d97706" fontSize="8" fontFamily="monospace" fontStyle="italic">
              {t('gapLabel')}
            </text>
          </g>
        )}

        {/* ── Panel 2: differential ── */}
        <PanelTitle y={P2.top} color={C_DIF}>{t('p2Title')}</PanelTitle>
        {[-298, 300, 600].map(v => (
          <text key={`p2t-${v}`} x={ML - 6} y={py(P2, v) + 3} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace">{v}</text>
        ))}
        <line x1={ML} y1={zeroY} x2={ML + PW} y2={zeroY} stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 3" />
        <text x={ML + PW} y={zeroY - 4} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace">0 = par with futures</text>
        <path d={linePath(P2, DIF)} fill="none" stroke={C_DIF} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {DIF.map((v, i) => (
          <g key={`d-${i}`}>
            <circle cx={x(i)} cy={py(P2, v)} r="3" fill={C_DIF} stroke="#070912" strokeWidth="1" />
            <circle cx={x(i)} cy={py(P2, v)} r="10" fill="transparent">
              <title>{`${MONTHS[i]} · ${v >= 0 ? '+' : '−'}$${Math.abs(v)}/t vs futures`}</title>
            </circle>
          </g>
        ))}
        <circle cx={x(difMinI)} cy={py(P2, DIF[difMinI])} r="5.5" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
        <text x={x(difMinI) + 8} y={py(P2, DIF[difMinI]) + 12} fill="#f43f5e" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
          trough −$298 (Feb 25)
        </text>

        {/* ── Panel 3: gradings ── */}
        <PanelTitle y={P3.top} color={C_GRD}>{t('p3Title')}</PanelTitle>
        {[300, 600].map(v => (
          <g key={`p3-${v}`}>
            <line x1={ML} y1={py(P3, v)} x2={ML + PW} y2={py(P3, v)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={ML - 6} y={py(P3, v) + 3} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace">{v}</text>
          </g>
        ))}
        <line x1={ML} y1={base3} x2={ML + PW} y2={base3} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        {GRD.map((v, i) => v > 0 && (
          <g key={`b-${i}`}>
            <path d={topRoundedBar(x(i), py(P3, v), 14, base3, 4)} fill={C_GRD} />
            <title>{`${MONTHS[i]} · ${v} lots graded`}</title>
            {v >= 40 && (
              <text x={x(i)} y={py(P3, v) - 5} textAnchor="middle" fill="#e2e8f0" fontSize="8.5" fontFamily="monospace" fontWeight="bold">{v}</text>
            )}
          </g>
        ))}
        {/* Lag arrow: from under the Feb-25 trough across to the May-25 grading spike */}
        <line x1={x(difMinI)} y1={P3.top + 18} x2={x(8) - 12} y2={P3.top + 18} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#vn-arrow)" />
        <text x={(x(difMinI) + x(8)) / 2} y={P3.top + 12} textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">{t('lagLabel')}</text>

        {/* Shared x-axis labels */}
        {MONTHS.map((m, i) => i % 2 === 0 && (
          <text key={`xl-${i}`} x={x(i)} y={base3 + 16} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{m}</text>
        ))}
      </svg>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">{t('caption')}</p>
      <p className="mt-2 text-[11px] text-slate-600">{t('source')}</p>
    </div>
  )
}
