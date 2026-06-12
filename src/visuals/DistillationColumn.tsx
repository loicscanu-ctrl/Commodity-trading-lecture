'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Crude oil — fractional distillation' },
  tempTop: { label: 'Top temperature', value: '~150°C' },
  tempBottom: { label: 'Bottom temperature', value: '~370°C' },
  feedLabel: { label: 'Feed label', value: 'Heated crude feed' },
  p1Name: { label: 'Fraction 1 · name', value: 'Refinery gas / LPG' },
  p1Use: { label: 'Fraction 1 · use', value: 'Bottled gas, petrochemicals' },
  p2Name: { label: 'Fraction 2 · name', value: 'Naphtha (Gasoline)' },
  p2Use: { label: 'Fraction 2 · use', value: 'Gasoline, petrochem feedstock' },
  p3Name: { label: 'Fraction 3 · name', value: 'Jet / Kerosene' },
  p3Use: { label: 'Fraction 3 · use', value: 'Aviation, heating' },
  p4Name: { label: 'Fraction 4 · name', value: 'Diesel / Gas oil' },
  p4Use: { label: 'Fraction 4 · use', value: 'Road transport, heating, power' },
  p5Name: { label: 'Fraction 5 · name', value: 'Atmospheric residue / Fuel oil' },
  p5Use: { label: 'Fraction 5 · use', value: 'Shipping, bitumen, further conversion' },
  caption: { label: 'Caption', multiline: true, value: 'Lighter fractions boil off higher and cooler; the heavy residue stays at the bottom. Straight-run cuts are then treated (desulphurised), converted (cracking — FCC, hydrocracker, coker), modified (reforming, isomerisation), combined (alkylation) and blended to spec.' },
})

type Cut = { y: number; key: 'p1' | 'p2' | 'p3' | 'p4' | 'p5'; color: string }
const CUTS: Cut[] = [
  { y: 70, key: 'p1', color: '#22d3ee' },
  { y: 120, key: 'p2', color: '#3b82f6' },
  { y: 170, key: 'p3', color: '#34d399' },
  { y: 220, key: 'p4', color: '#f59e0b' },
  { y: 280, key: 'p5', color: '#f43f5e' },
]

export default function DistillationColumn() {
  const t = useVisualText(textDef)
  const COL_X = 90, COL_W = 86, COL_TOP = 48, COL_BOT = 308
  const BOX_X = 250

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3">{t('heading')}</div>

      <svg viewBox="0 0 470 340" className="w-full" style={{ maxHeight: '360px' }}>
        <defs>
          <linearGradient id="dc-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.20" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        {/* Column body */}
        <rect x={COL_X} y={COL_TOP} width={COL_W} height={COL_BOT - COL_TOP} rx={8}
          fill="url(#dc-grad)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

        {/* Trays */}
        {CUTS.map(c => (
          <line key={`tray-${c.y}`} x1={COL_X + 6} y1={c.y} x2={COL_X + COL_W - 6} y2={c.y}
            stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 3" />
        ))}

        {/* Temperature labels */}
        <text x={COL_X - 8} y={COL_TOP + 6} textAnchor="end" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">{t('tempTop')}</text>
        <text x={COL_X - 8} y={COL_BOT - 2} textAnchor="end" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">{t('tempBottom')}</text>
        <text x={COL_X - 8} y={(COL_TOP + COL_BOT) / 2} textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace" transform={`rotate(-90 ${COL_X - 8} ${(COL_TOP + COL_BOT) / 2})`}>TEMPERATURE</text>

        {/* Feed arrow (bottom-left) */}
        <line x1={28} y1={COL_BOT - 16} x2={COL_X} y2={COL_BOT - 16} stroke="#f43f5e" strokeWidth="2" markerEnd="url(#dc-arrow)" />
        <text x={20} y={COL_BOT - 20} textAnchor="start" fill="#94a3b8" fontSize="8" fontFamily="monospace">{t('feedLabel')}</text>

        <defs>
          <marker id="dc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Draw-offs + product boxes */}
        {CUTS.map(c => {
          const boxY = c.y - 16
          return (
            <g key={c.key}>
              <line x1={COL_X + COL_W} y1={c.y} x2={BOX_X} y2={c.y} stroke={c.color} strokeWidth="2" markerEnd="url(#dc-arrow)" />
              <rect x={BOX_X} y={boxY} width={200} height={32} rx={6} fill="rgba(255,255,255,0.04)" stroke={c.color} strokeWidth="1.2" />
              <rect x={BOX_X} y={boxY} width={4} height={32} fill={c.color} />
              <text x={BOX_X + 12} y={boxY + 13} fill="#fff" fontSize="10" fontFamily="monospace" fontWeight="bold">{t(`${c.key}Name` as 'p1Name')}</text>
              <text x={BOX_X + 12} y={boxY + 25} fill="#94a3b8" fontSize="8" fontFamily="monospace">{t(`${c.key}Use` as 'p1Use')}</text>
            </g>
          )
        })}
      </svg>

      <p className="mt-3 text-slate-400 text-sm leading-relaxed">{t('caption')}</p>
    </div>
  )
}
