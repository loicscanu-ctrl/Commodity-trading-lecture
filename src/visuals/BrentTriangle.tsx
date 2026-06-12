'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Trading as price relationships' },
  nodeDated: { label: 'Node · top', value: 'Dated Brent' },
  nodeFutures: { label: 'Node · bottom-left', value: 'Futures (ICE Brent)' },
  nodeForward: { label: 'Node · bottom-right', value: 'BFOE Forward' },
  dflName: { label: 'Left instrument · name', value: 'DFL' },
  dflDesc: { label: 'Left instrument · description', multiline: true, value: 'Dated-to-Front-Line — a swap linking the futures contract to Dated Brent. Locks the value of Dated relative to futures before the oil trades.' },
  cfdName: { label: 'Right instrument · name', value: 'CFD' },
  cfdDesc: { label: 'Right instrument · description', multiline: true, value: 'Contract for Difference — a swap linking the BFOE forward to Dated Brent. Captures and trades the time / supply-demand value between forward and dated.' },
  efpName: { label: 'Bottom instrument · name', value: 'EFP' },
  efpDesc: { label: 'Bottom instrument · description', multiline: true, value: 'Exchange of Futures for Physical — converts a futures position into a forward (BFOE) cargo. The Brent forward is "always EFP" these days.' },
  caption: { label: 'Caption', multiline: true, value: 'Every leg of the Brent complex trades as a spread. Traders move between futures, forward and dated physical using these three instruments.' },
})

// Triangle geometry (viewBox 480 x 320)
const DATED = { x: 240, y: 56 }
const FUT = { x: 84, y: 250 }
const FWD = { x: 396, y: 250 }

function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function Node({ p, label, w = 132 }: { p: { x: number; y: number }; label: string; w?: number }) {
  const h = 40
  return (
    <g>
      <rect x={p.x - w / 2} y={p.y - h / 2} width={w} height={h} rx={10}
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#fff" fontSize="13"
        fontFamily="monospace" fontWeight="bold">{label}</text>
    </g>
  )
}

function Badge({ p, label, color }: { p: { x: number; y: number }; label: string; color: string }) {
  const w = 50, h = 24
  return (
    <g>
      <rect x={p.x - w / 2} y={p.y - h / 2} width={w} height={h} rx={7}
        fill="#070912" stroke={color} strokeWidth="1.4" />
      <text x={p.x} y={p.y + 4.5} textAnchor="middle" fill={color} fontSize="12"
        fontFamily="monospace" fontWeight="bold">{label}</text>
    </g>
  )
}

export default function BrentTriangle() {
  const t = useVisualText(textDef)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3">{t('heading')}</div>

      <svg viewBox="0 0 480 320" className="w-full" style={{ maxHeight: '320px' }}>
        <defs>
          <marker id="bt-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#34d399" />
          </marker>
        </defs>

        {/* Edges (double-headed) */}
        {[[FUT, DATED], [FWD, DATED], [FUT, FWD]].map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="#34d399" strokeWidth="2" opacity="0.55"
            markerStart="url(#bt-arrow)" markerEnd="url(#bt-arrow)" />
        ))}

        {/* Nodes */}
        <Node p={DATED} label={t('nodeDated')} />
        <Node p={FUT} label={t('nodeFutures')} w={138} />
        <Node p={FWD} label={t('nodeForward')} w={124} />

        {/* Instrument badges at edge midpoints */}
        <Badge p={{ x: mid(FUT, DATED).x - 18, y: mid(FUT, DATED).y }} label={t('dflName')} color="#22d3ee" />
        <Badge p={{ x: mid(FWD, DATED).x + 18, y: mid(FWD, DATED).y }} label={t('cfdName')} color="#f59e0b" />
        <Badge p={{ x: mid(FUT, FWD).x, y: mid(FUT, FWD).y - 16 }} label={t('efpName')} color="#8b5cf6" />
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { name: t('dflName'), desc: t('dflDesc'), color: 'border-brand-cyan/40', dot: '#22d3ee' },
          { name: t('cfdName'), desc: t('cfdDesc'), color: 'border-amber-500/40', dot: '#f59e0b' },
          { name: t('efpName'), desc: t('efpDesc'), color: 'border-violet-500/40', dot: '#8b5cf6' },
        ].map(item => (
          <div key={item.name} className={`rounded-xl border ${item.color} bg-white/[0.03] p-3`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: item.dot }} />
              <span className="font-mono font-bold text-white text-sm">{item.name}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-slate-500 text-xs leading-relaxed">{t('caption')}</p>
    </div>
  )
}
