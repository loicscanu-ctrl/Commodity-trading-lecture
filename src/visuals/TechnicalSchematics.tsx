'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Reading the chart' },
  trendTitle: { label: 'Panel A · title', value: 'Trend line' },
  trendCaption: { label: 'Panel A · caption', multiline: true, value: 'Connect three rising lows; trade with the trend; a clear break signals reversal.' },
  srTitle: { label: 'Panel B · title', value: 'Support & resistance' },
  srCaption: { label: 'Panel B · caption', multiline: true, value: 'Once broken, resistance becomes support.' },
})

export default function TechnicalSchematics() {
  const t = useVisualText(textDef)

  // ── Panel A: Trend line ──────────────────────────────────────────
  // Idealized rising zigzag with higher-highs and higher-lows, then a
  // final segment that breaks DOWN through the uptrend line.
  // viewBox 0 0 300 200; lower y = higher price.
  const trendPath: [number, number][] = [
    [20, 150],   // start low
    [55, 105],   // peak 1
    [85, 130],   // trough 1 (touches line)
    [120, 80],   // peak 2
    [150, 105],  // trough 2 (touches line)
    [185, 55],   // peak 3 (highest)
    [215, 80],   // trough 3 (touches line)
    [250, 130],  // break DOWN through the line
  ]
  // Uptrend line through the three rising troughs: (85,130),(150,105),(215,80).
  // slope = (80-130)/(215-85) = -50/130 ≈ -0.3846 ; y = 130 - 0.3846*(x-85)
  const trendSlope = (80 - 130) / (215 - 85)
  const trendY = (x: number) => 130 + trendSlope * (x - 85)
  const lineX1 = 70
  const lineX2 = 262
  // Break point: where final segment crosses the trend line.
  const breakPt: [number, number] = [232, trendY(232)]

  const toPolyline = (pts: [number, number][]) => pts.map(p => `${p[0]},${p[1]}`).join(' ')

  // ── Panel B: Support & resistance ────────────────────────────────
  // Horizontal level at y = 80. Price rises to touch it (1), pulls back,
  // breaks above to a higher peak (2 above line), pulls back DOWN to the
  // same line which now acts as support (3), bounces up (4).
  const levelY = 80
  const srPath: [number, number][] = [
    [20, 150],   // start low
    [60, 80],    // touch 1 — hits resistance
    [90, 120],   // pull back
    [135, 45],   // break ABOVE to higher peak (2)
    [170, 80],   // pull back DOWN to the line (3) — now support
    [210, 50],   // bounce up
    [245, 95],   // (4) retest support from above
    [280, 55],   // continue up
  ]
  const srTouches: { n: number; x: number; y: number }[] = [
    { n: 1, x: 60, y: 80 },
    { n: 2, x: 135, y: 45 },
    { n: 3, x: 170, y: 80 },
    { n: 4, x: 245, y: 95 },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-cyan-300 mb-4">{t('heading')}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Panel A — Trend line */}
        <div>
          <div className="eyebrow text-amber-400 mb-2">{t('trendTitle')}</div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.07] p-3">
            <svg viewBox="0 0 300 200" className="w-full">
              {/* baseline */}
              <line x1="20" y1="180" x2="285" y2="180" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

              {/* uptrend line (extended across) */}
              <line x1={lineX1} y1={trendY(lineX1)} x2={lineX2} y2={trendY(lineX2)}
                stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 4" />

              {/* price path */}
              <polyline points={toPolyline(trendPath)} fill="none" stroke="#22d3ee"
                strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

              {/* highlight the three touched troughs */}
              {[[85, 130], [150, 105], [215, 80]].map(([cx, cy]) => (
                <circle key={`${cx}`} cx={cx} cy={cy} r="3" fill="#3b82f6" stroke="#070912" strokeWidth="1" />
              ))}

              {/* break marker */}
              <circle cx={breakPt[0]} cy={breakPt[1]} r="4.5" fill="none" stroke="#f43f5e" strokeWidth="1.8" />
              <text x={breakPt[0] + 8} y={breakPt[1] + 4} fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">break</text>
            </svg>
          </div>
          <p className="text-slate-400 text-xs mt-3 leading-relaxed">{t('trendCaption')}</p>
        </div>

        {/* Panel B — Support & resistance */}
        <div>
          <div className="eyebrow text-amber-400 mb-2">{t('srTitle')}</div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.07] p-3">
            <svg viewBox="0 0 300 200" className="w-full">
              {/* baseline */}
              <line x1="20" y1="180" x2="285" y2="180" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

              {/* horizontal level */}
              <line x1="20" y1={levelY} x2="285" y2={levelY}
                stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" />
              <text x="24" y={levelY - 6} fill="#94a3b8" fontSize="9" fontFamily="monospace">Resistance</text>
              <text x="232" y={levelY + 14} fill="#94a3b8" fontSize="9" fontFamily="monospace">Support</text>

              {/* price path */}
              <polyline points={toPolyline(srPath)} fill="none" stroke="#22d3ee"
                strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

              {/* numbered touch points */}
              {srTouches.map(p => (
                <g key={p.n}>
                  <circle cx={p.x} cy={p.y} r="7" fill="#070912" stroke="#22d3ee" strokeWidth="1.5" />
                  <text x={p.x} y={p.y + 3.2} textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">{p.n}</text>
                </g>
              ))}
            </svg>
          </div>
          <p className="text-slate-400 text-xs mt-3 leading-relaxed">{t('srCaption')}</p>
        </div>
      </div>
    </div>
  )
}
