'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'One seed’s journey around the world' },
  caption: { label: 'Caption', multiline: true, value: 'Nine centuries, four continents: from wild forests in Kaffa to a guarded monopoly at Mocha, smuggled to India and Java, gifted to a king, carried across the Atlantic by one obsessive lieutenant — then spread through the colonial system to Vietnam and West Africa. Today’s production map is this journey, frozen.' },
  s1: { label: 'Station 1 · name', value: 'Kaffa forests, Ethiopia' },
  d1: { label: 'Station 1 · date', value: '~850 · wild arabica' },
  s2: { label: 'Station 2 · name', value: 'Mocha, Yemen' },
  d2: { label: 'Station 2 · date', value: '1400s · Ottoman monopoly' },
  s3: { label: 'Station 3 · name', value: 'Constantinople' },
  d3: { label: 'Station 3 · date', value: '1554 · first coffeehouses' },
  s4: { label: 'Station 4 · name', value: 'Mysore, India' },
  d4: { label: 'Station 4 · date', value: '~1670 · Baba Budan’s 7 seeds' },
  s5: { label: 'Station 5 · name', value: 'Java, Dutch East Indies' },
  d5: { label: 'Station 5 · date', value: '1699 · VOC plantations' },
  s6: { label: 'Station 6 · name', value: 'Amsterdam botanic garden' },
  d6: { label: 'Station 6 · date', value: '1706 · one tree survives' },
  s7: { label: 'Station 7 · name', value: 'Jardin du Roi, Paris' },
  d7: { label: 'Station 7 · date', value: '1714 · gift to Louis XIV' },
  s8: { label: 'Station 8 · name', value: 'Martinique' },
  d8: { label: 'Station 8 · date', value: '1723 · de Clieu’s seedling' },
  s9: { label: 'Station 9 · name', value: 'Brazil & the Caribbean' },
  d9: { label: 'Station 9 · date', value: '1727 · Palheta’s cuttings' },
  s10: { label: 'Station 10 · name', value: 'Vietnam (Indochina)' },
  d10: { label: 'Station 10 · date', value: '1857 · French missions' },
  s11: { label: 'Station 11 · name', value: 'Côte d’Ivoire, West Africa' },
  d11: { label: 'Station 11 · date', value: '1900s · colonial robusta' },
  leg1: { label: 'Legend · era 1', value: 'Origins & monopoly' },
  leg2: { label: 'Legend · era 2', value: 'Breaking the monopoly' },
  leg3: { label: 'Legend · era 3', value: 'To the Americas' },
  leg4: { label: 'Legend · era 4', value: 'The colonial era' },
})

const ERA_COLORS = ['#f59e0b', '#22d3ee', '#34d399', '#8b5cf6']

// Serpentine path: 4 rows, alternating direction. Station = position + era index.
type Station = { x: number; y: number; era: number; n: number }
const ROW_Y = [64, 168, 272, 376]
const STATIONS: Station[] = [
  { x: 80, y: ROW_Y[0], era: 0, n: 1 },
  { x: 280, y: ROW_Y[0], era: 0, n: 2 },
  { x: 480, y: ROW_Y[0], era: 0, n: 3 },
  { x: 480, y: ROW_Y[1], era: 1, n: 4 },
  { x: 280, y: ROW_Y[1], era: 1, n: 5 },
  { x: 80, y: ROW_Y[1], era: 1, n: 6 },
  { x: 80, y: ROW_Y[2], era: 2, n: 7 },
  { x: 280, y: ROW_Y[2], era: 2, n: 8 },
  { x: 480, y: ROW_Y[2], era: 2, n: 9 },
  { x: 480, y: ROW_Y[3], era: 3, n: 10 },
  { x: 280, y: ROW_Y[3], era: 3, n: 11 },
]

const PATH = [
  `M 80 ${ROW_Y[0]} L 480 ${ROW_Y[0]}`,
  `C 548 ${ROW_Y[0]}, 548 ${ROW_Y[1]}, 480 ${ROW_Y[1]}`,
  `L 80 ${ROW_Y[1]}`,
  `C 12 ${ROW_Y[1]}, 12 ${ROW_Y[2]}, 80 ${ROW_Y[2]}`,
  `L 480 ${ROW_Y[2]}`,
  `C 548 ${ROW_Y[2]}, 548 ${ROW_Y[3]}, 480 ${ROW_Y[3]}`,
  `L 190 ${ROW_Y[3]}`,
].join(' ')

export default function CoffeeOdyssey() {
  const t = useVisualText(textDef)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3">{t('heading')}</div>

      <svg viewBox="0 0 560 412" className="w-full" style={{ maxHeight: '430px' }}>
        <defs>
          <marker id="co-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* The route */}
        <path d={PATH} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6" strokeLinecap="round" />
        <path d={PATH} fill="none" stroke="rgba(245,158,11,0.35)" strokeWidth="2" strokeLinecap="round" markerEnd="url(#co-arrow)" />

        {/* Stations */}
        {STATIONS.map(st => {
          const color = ERA_COLORS[st.era]
          return (
            <g key={st.n}>
              <circle cx={st.x} cy={st.y} r="9" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
              <circle cx={st.x} cy={st.y} r="6" fill={color} stroke="#070912" strokeWidth="1.5" />
              <text x={st.x} y={st.y - 16} textAnchor="middle" fill="#fff" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                {t(`s${st.n}`)}
              </text>
              <text x={st.x} y={st.y + 22} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                {t(`d${st.n}`)}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Era legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {[t('leg1'), t('leg2'), t('leg3'), t('leg4')].map((label, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ERA_COLORS[i] }} />
            <span className="font-mono text-xs text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">{t('caption')}</p>
    </div>
  )
}
