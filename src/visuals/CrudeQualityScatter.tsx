'use client'

import { useState } from 'react'

type Grade = { name: string; api: number; sulphur: number; country: string; benchmark?: boolean }

// World crude grades — API gravity (density) vs sulphur content.
const GRADES: Grade[] = [
  { name: 'Eagle Ford condensate', api: 50, sulphur: 0.1, country: 'US' },
  { name: 'Tapis', api: 45, sulphur: 0.03, country: 'Malaysia' },
  { name: 'Bakken', api: 42, sulphur: 0.1, country: 'US' },
  { name: 'WTI', api: 40, sulphur: 0.3, country: 'US', benchmark: true },
  { name: 'Brent', api: 38, sulphur: 0.4, country: 'UK', benchmark: true },
  { name: 'Louisiana Light Sweet', api: 36, sulphur: 0.35, country: 'US' },
  { name: 'Bonny Light', api: 35, sulphur: 0.15, country: 'Nigeria' },
  { name: 'Iran Light', api: 34, sulphur: 1.4, country: 'Iran' },
  { name: 'Arab Light', api: 33, sulphur: 1.8, country: 'Saudi Arabia' },
  { name: 'Urals', api: 32, sulphur: 1.3, country: 'Russia/FSU' },
  { name: 'West Texas Sour', api: 32, sulphur: 1.9, country: 'US' },
  { name: 'Dubai', api: 31, sulphur: 2.0, country: 'UAE', benchmark: true },
  { name: 'Iran Heavy', api: 30, sulphur: 1.7, country: 'Iran' },
  { name: 'Mars', api: 29, sulphur: 2.0, country: 'US' },
  { name: 'Arab Heavy', api: 28, sulphur: 2.9, country: 'Saudi Arabia' },
  { name: 'Oriente', api: 24, sulphur: 1.0, country: 'Ecuador' },
  { name: 'Maya', api: 22, sulphur: 3.3, country: 'Mexico' },
  { name: 'Western Canada Select', api: 21, sulphur: 3.5, country: 'Canada' },
  { name: 'Hondo Monterey', api: 19, sulphur: 4.7, country: 'US' },
]

function classify(api: number, sulphur: number) {
  const gravity = api > 44 ? 'Very light' : api >= 34 ? 'Light' : api >= 23 ? 'Medium' : 'Heavy'
  const sulph = sulphur < 0.5 ? 'Sweet' : sulphur <= 1.5 ? 'Medium-sour' : 'Sour'
  return `${gravity} · ${sulph}`
}

export default function CrudeQualityScatter() {
  const [sel, setSel] = useState(() => GRADES.findIndex(g => g.name === 'Brent'))

  const W = 560, H = 320
  const ml = 46, mr = 16, mt = 16, mb = 48
  const pw = W - ml - mr, ph = H - mt - mb
  const AMIN = 14, AMAX = 54
  const SMIN = 0, SMAX = 5

  const x = (api: number) => ml + ((api - AMIN) / (AMAX - AMIN)) * pw
  const y = (s: number) => mt + (s - SMIN) / (SMAX - SMIN) * ph // sour at top

  const selected = GRADES[sel]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3">Crude quality matrix · API gravity vs sulphur</div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '320px' }}>
          {/* Quadrant shading: light-sweet (premium) bottom-right; heavy-sour (discount) top-left */}
          <rect x={x(34)} y={y(0.5)} width={ml + pw - x(34)} height={mt + ph - y(0.5)} fill="#34d399" opacity="0.06" />
          <rect x={ml} y={mt} width={x(34) - ml} height={y(1.5) - mt} fill="#f43f5e" opacity="0.07" />

          {/* Reference lines */}
          <line x1={x(34)} y1={mt} x2={x(34)} y2={mt + ph} stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="4 3" />
          <line x1={ml} y1={y(0.5)} x2={ml + pw} y2={y(0.5)} stroke="rgba(52,211,153,0.30)" strokeWidth="1" strokeDasharray="4 3" />
          <line x1={ml} y1={y(1.5)} x2={ml + pw} y2={y(1.5)} stroke="rgba(244,63,94,0.30)" strokeWidth="1" strokeDasharray="4 3" />

          {/* Axes */}
          <line x1={ml} y1={mt} x2={ml} y2={mt + ph} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <line x1={ml} y1={mt + ph} x2={ml + pw} y2={mt + ph} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

          {/* Axis ticks */}
          {[20, 30, 40, 50].map(a => (
            <text key={a} x={x(a)} y={mt + ph + 14} textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="monospace">{a}</text>
          ))}
          {[1, 2, 3, 4].map(s => (
            <text key={s} x={ml - 6} y={y(s) + 3} textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily="monospace">{s.toFixed(1)}</text>
          ))}

          {/* Axis labels */}
          <text x={ml + pw} y={mt + ph + 30} textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">API gravity →  lighter</text>
          <text x={14} y={mt + 4} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" transform={`rotate(-90 14 ${mt + ph / 2})`}>sulphur % →  sourer</text>

          {/* Quadrant tags */}
          <text x={ml + pw - 6} y={mt + ph - 6} textAnchor="end" fill="#34d399" fontSize="8.5" fontFamily="monospace" fontWeight="bold">light · sweet (premium)</text>
          <text x={ml + 6} y={mt + 12} textAnchor="start" fill="#f43f5e" fontSize="8.5" fontFamily="monospace" fontWeight="bold">heavy · sour (discount)</text>

          {/* Points */}
          {GRADES.map((g, i) => {
            const isSel = i === sel
            const r = g.benchmark ? 5 : 3.5
            return (
              <g key={g.name} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
                {g.benchmark && <circle cx={x(g.api)} cy={y(g.sulphur)} r={r + 4} fill="none" stroke="#22d3ee" strokeWidth="1" opacity={isSel ? 0.9 : 0.4} />}
                <circle cx={x(g.api)} cy={y(g.sulphur)} r={isSel ? r + 2 : r}
                  fill={g.benchmark ? '#22d3ee' : '#f59e0b'} stroke="#070912" strokeWidth="1"
                  opacity={isSel ? 1 : 0.85} />
                {(g.benchmark || isSel) && (
                  <text x={x(g.api) + 7} y={y(g.sulphur) + 3} fill="#e2e8f0" fontSize="8.5" fontFamily="monospace">{g.name}</text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Detail panel */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:w-56 font-mono text-xs">
          <div className="eyebrow mb-2">Selected grade</div>
          <div className="text-white font-bold text-base mb-1 leading-tight">{selected.name}</div>
          {selected.benchmark && <span className="chip bg-brand-cyan/15 text-brand-cyan mb-2 inline-block">Benchmark</span>}
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between"><span className="text-slate-500">API gravity</span><span className="text-white tabular-nums">{selected.api}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Sulphur</span><span className="text-white tabular-nums">{selected.sulphur.toFixed(2)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Origin</span><span className="text-slate-200">{selected.country}</span></div>
            <div className="border-t border-white/10 pt-1.5 text-amber-300">{classify(selected.api, selected.sulphur)}</div>
          </div>
          <p className="text-slate-500 mt-3 leading-relaxed text-[11px]">Click any point. Light, sweet crudes yield more high-value light products; heavy, sour grades make more fuel oil and trade at a discount.</p>
        </div>
      </div>
    </div>
  )
}
