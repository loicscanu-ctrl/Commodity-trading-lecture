'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading1: { label: 'Heading', value: 'A world with and without the exchange' },
  takeaway: {
    label: 'Takeaway',
    multiline: true,
    value: 'Add a participant to the bilateral world and the negotiation burden explodes quadratically; add one to the exchange and it grows by exactly one line.',
  },
})

// ---------------------------------------------------------------------------
// Part 1 · network geometry (viewBox 480 x 260)
// ---------------------------------------------------------------------------
const NET = { w: 480, h: 260, leftX: 32, rightX: 448, topY: 34, bottomY: 244 }
const HUB = { x: 240, y: (NET.topY + NET.bottomY) / 2, r: 28 }

function columnYs(count: number): number[] {
  return Array.from({ length: count }, (_, i) =>
    NET.topY + (count === 1 ? 0.5 : i / (count - 1)) * (NET.bottomY - NET.topY),
  )
}

export default function NetworkExplosion() {
  const t = useVisualText(textDef)
  const [mode, setMode] = useState<'bilateral' | 'exchange'>('bilateral')
  const [n, setN] = useState(14)

  const half = n / 2
  const producerYs = columnYs(half)
  const buyerYs = columnYs(half)
  const bilateralLinks = half * half

  return (
    <div className="glass mt-5 p-5 text-white">
      {/* ------------------------------------------------------------------ */}
      {/* Part 1 — bilateral spaghetti vs one exchange                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="eyebrow text-brand-cyan mb-3">{t('heading1')}</div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex gap-2">
          {([
            ['bilateral', 'Bilateral world'],
            ['exchange', 'One exchange'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                mode === key
                  ? 'border-brand-blue/60 bg-brand-blue/20 text-blue-100'
                  : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 text-xs text-slate-400">
          <span>Market participants</span>
          <input
            type="range"
            min={6}
            max={30}
            step={2}
            value={n}
            onChange={e => setN(Number(e.target.value))}
            className="w-36 accent-brand-blue"
          />
          <span className="font-mono text-slate-300 tabular-nums w-6 text-right">{n}</span>
        </label>
      </div>

      <svg viewBox={`0 0 ${NET.w} ${NET.h}`} className="mt-3 w-full" style={{ maxHeight: '260px' }}>
        {/* Column headers */}
        <text x={NET.leftX} y={16} textAnchor="start" fill="#34d399" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
          Producers ({half})
        </text>
        <text x={NET.rightX} y={16} textAnchor="end" fill="#f59e0b" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
          Buyers ({half})
        </text>

        {/* Links (under the dots) */}
        {mode === 'bilateral'
          ? producerYs.map((py, i) =>
              buyerYs.map((by, j) => (
                <line key={`b-${i}-${j}`} x1={NET.leftX} y1={py} x2={NET.rightX} y2={by}
                  stroke="rgba(244,63,94,0.25)" strokeWidth="0.8" />
              )),
            )
          : (
            <g>
              {producerYs.map((py, i) => (
                <line key={`pl-${i}`} x1={NET.leftX} y1={py} x2={HUB.x} y2={HUB.y}
                  stroke="#22d3ee" strokeWidth="0.9" opacity="0.55" />
              ))}
              {buyerYs.map((by, i) => (
                <line key={`bl-${i}`} x1={HUB.x} y1={HUB.y} x2={NET.rightX} y2={by}
                  stroke="#22d3ee" strokeWidth="0.9" opacity="0.55" />
              ))}
            </g>
          )}

        {/* Central exchange node */}
        {mode === 'exchange' && (
          <g>
            <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="#3b82f6" opacity="0.9" />
            <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <text x={HUB.x} y={HUB.y + 1} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
              ICE
            </text>
            <text x={HUB.x} y={HUB.y + 13} textAnchor="middle" fill="#dbeafe" fontSize="7.5" fontFamily="monospace">
              4,800
            </text>
            <text x={HUB.x} y={HUB.y + HUB.r + 14} textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">
              one price, visible to all
            </text>
          </g>
        )}

        {/* Participant dots */}
        {producerYs.map((py, i) => (
          <circle key={`p-${i}`} cx={NET.leftX} cy={py} r="4" fill="#34d399" stroke="#070912" strokeWidth="1" />
        ))}
        {buyerYs.map((by, i) => (
          <circle key={`y-${i}`} cx={NET.rightX} cy={by} r="4" fill="#f59e0b" stroke="#070912" strokeWidth="1" />
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-sm">
        <span className={mode === 'bilateral' ? '' : 'opacity-45'}>
          <span className="text-slate-400">bilateral: </span>
          <span className="text-xl font-bold text-rose-400 tabular-nums">{bilateralLinks}</span>
          <span className="text-slate-300"> private negotiations</span>
        </span>
        <span className={mode === 'exchange' ? '' : 'opacity-45'}>
          <span className="text-slate-400">exchange: </span>
          <span className="text-xl font-bold text-cyan-300 tabular-nums">{n}</span>
          <span className="text-slate-300"> links · one public price</span>
        </span>
        <span className="text-[11px] text-slate-500">({(bilateralLinks / n).toFixed(1)}× fewer)</span>
      </div>

      <p className="mt-2 text-slate-400 text-sm leading-relaxed">{t('takeaway')}</p>
    </div>
  )
}
