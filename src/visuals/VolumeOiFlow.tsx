'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Volume vs Open Interest — two counters, two questions' },
  step0: {
    label: 'Step 0 caption',
    multiline: true,
    value: 'Fresh session. Nobody has traded: volume 0, open interest 0. Press the first trade.',
  },
  step1: {
    label: 'Step 1 caption',
    multiline: true,
    value: 'A BUYS 1 lot, B SELLS 1 lot — through the exchange, so neither knows the other. One lot traded: volume +1. And BOTH sides now hold an open promise to the clearing house: open interest +1.',
  },
  step2: {
    label: 'Step 2 caption',
    multiline: true,
    value: 'A sells its lot on — C buys it. One more lot traded: volume +1. But the promise just CHANGED HANDS: A is out, C is now the long, B is still the short. Open interest UNCHANGED.',
  },
  takeaway: {
    label: 'Takeaway',
    multiline: true,
    value: 'VOLUME counts every lot traded — activity, reset to zero each morning. OPEN INTEREST counts lots still outstanding — positions, carried overnight. OI rises only when BOTH sides open (+1), falls only when both close (−1), and ignores a position changing hands. Rising OI = new money entering; draining OI = holders leaving — exactly what you saw on the nearby contract before its delivery period.',
  },
})

type Party = { key: 'A' | 'B' | 'C'; x: number; y: number }
const PARTIES: Party[] = [
  { key: 'A', x: 70, y: 52 },
  { key: 'B', x: 410, y: 52 },
  { key: 'C', x: 70, y: 168 },
]
const EX = { x: 240, y: 110, r: 30 }

export default function VolumeOiFlow() {
  const t = useVisualText(textDef)
  const [stage, setStage] = useState(0)

  const volume = stage === 0 ? 0 : stage === 1 ? 1 : 2
  const oi = stage === 0 ? 0 : 1
  const posOf = (k: Party['key']) =>
    stage === 0 ? 'flat'
    : stage === 1 ? (k === 'A' ? 'LONG 1' : k === 'B' ? 'SHORT 1' : 'flat')
    : k === 'A' ? 'flat' : k === 'B' ? 'SHORT 1' : 'LONG 1'

  const arrow = (from: { x: number; y: number }, to: { x: number; y: number }, color: string, label: string, key: string) => {
    const dx = to.x - from.x, dy = to.y - from.y
    const len = Math.hypot(dx, dy)
    const ux = dx / len, uy = dy / len
    const x1 = from.x + ux * 26, y1 = from.y + uy * 26
    const x2 = to.x - ux * (EX.r + 8), y2 = to.y - uy * (EX.r + 8)
    return (
      <g key={key}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" markerEnd="url(#voi-arrow)" />
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 7} textAnchor="middle" fill={color} fontSize="9.5" fontFamily="monospace" fontWeight="bold">{label}</text>
      </g>
    )
  }

  const steps = [
    { n: 0, label: 'Reset' },
    { n: 1, label: '1 · A buys, B sells' },
    { n: 2, label: '2 · A passes its lot to C' },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-3">{t('heading')}</div>

      <div className="flex flex-wrap gap-2">
        {steps.map(s => (
          <button key={s.n} type="button" onClick={() => setStage(s.n)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              stage === s.n ? 'border-brand-blue/60 bg-brand-blue/20 text-blue-100' : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_190px] gap-4">
        <svg viewBox="0 0 480 215" className="w-full" style={{ maxHeight: '230px' }}>
          <defs>
            <marker id="voi-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 z" fill="currentColor" />
            </marker>
          </defs>

          {/* the clearing house in the middle — every trade faces IT */}
          <circle cx={EX.x} cy={EX.y} r={EX.r} fill="#3b82f6" opacity="0.9" />
          <circle cx={EX.x} cy={EX.y} r={EX.r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
          <text x={EX.x} y={EX.y - 2} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">EXCHANGE</text>
          <text x={EX.x} y={EX.y + 11} textAnchor="middle" fill="#dbeafe" fontSize="7" fontFamily="monospace">clearing house</text>

          {/* arrows per stage */}
          {stage === 1 && (
            <g>
              {arrow(PARTIES[0], EX, '#34d399', 'BUY 1', 'a-buy')}
              {arrow(PARTIES[1], EX, '#f43f5e', 'SELL 1', 'b-sell')}
            </g>
          )}
          {stage === 2 && (
            <g>
              {arrow(PARTIES[0], EX, '#f43f5e', 'SELL 1', 'a-sell')}
              {arrow(PARTIES[2], EX, '#34d399', 'BUY 1', 'c-buy')}
              <text x={PARTIES[1].x} y={PARTIES[1].y + 34} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">unchanged — still short</text>
            </g>
          )}

          {/* parties with their live positions */}
          {PARTIES.map(p => {
            const pos = posOf(p.key)
            const col = pos.startsWith('LONG') ? '#34d399' : pos.startsWith('SHORT') ? '#f43f5e' : '#64748b'
            return (
              <g key={p.key}>
                <circle cx={p.x} cy={p.y} r="20" fill="rgba(255,255,255,0.06)" stroke={col} strokeWidth="1.5" />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">{p.key}</text>
                <text x={p.x} y={p.y + 32} textAnchor="middle" fill={col} fontSize="9" fontFamily="monospace" fontWeight="bold">{pos}</text>
              </g>
            )
          })}
        </svg>

        {/* the two counters */}
        <div className="space-y-2 self-center">
          <div className="rounded-xl border border-brand-cyan/30 bg-brand-cyan/[0.05] p-3 text-center">
            <div className="font-mono text-[10px] uppercase tracking-wide text-slate-400">Volume (today)</div>
            <div className="font-mono text-2xl font-bold tabular-nums text-cyan-200">{volume}</div>
            {stage > 0 && <div className="font-mono text-[10px] font-bold text-emerald-300">+1 this trade</div>}
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-3 text-center">
            <div className="font-mono text-[10px] uppercase tracking-wide text-slate-400">Open interest</div>
            <div className="font-mono text-2xl font-bold tabular-nums text-amber-200">{oi}</div>
            {stage === 1 && <div className="font-mono text-[10px] font-bold text-emerald-300">+1 — both sides OPENED</div>}
            {stage === 2 && <div className="font-mono text-[10px] font-bold text-slate-400">unchanged — it changed hands</div>}
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        {stage === 0 ? t('step0') : stage === 1 ? t('step1') : t('step2')}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{t('takeaway')}</p>
    </div>
  )
}
