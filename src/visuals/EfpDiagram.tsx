'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'EFP: the exchange, drawn' },
  partyA: { label: 'Party A', value: 'Exporter (HCM)' },
  partyB: { label: 'Party B', value: 'Roaster (Hamburg)' },
  physLabel: { label: 'Physical leg label', value: 'PHYSICAL · 100 t robusta — invoice fixes at EFP price + differential' },
  paperLabel: { label: 'Paper leg label', value: 'PAPER · 10 lots futures change hands at the EFP price' },
  aBefore1: { label: 'A before · physical', value: 'Long physical (sold PTBF, unfixed)' },
  aBefore2: { label: 'A before · paper', value: 'Short 10 lots @ 4,500 (the hedge)' },
  aAfter: { label: 'A after', value: 'Futures flat · invoice fixed · book closed at futures + diff' },
  bBefore1: { label: 'B before · physical', value: 'PTBF purchase — price still floating' },
  bBefore2: { label: 'B before · paper', value: 'No position (holds the fixing right)' },
  bAfter: { label: 'B after', value: 'Purchase priced at 4,200 + diff · short 10 lots = hedge on the priced inventory' },
  registered: { label: 'Registered note', value: 'One transaction, registered with the exchange at one agreed price (4,200) — both legs crystallise simultaneously. No legging risk, no slippage between the legs.' },
  efs: { label: 'EFS note', multiline: true, value: 'EFS — Exchange of Futures for Swaps — is the identical mechanism with the paper leg being an OTC swap position instead of futures: the physical deal is exchanged against a swap at an agreed level. Same purpose: both legs at one price, in one registered step.' },
})

export default function EfpDiagram() {
  const t = useVisualText(textDef)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">{t('heading')}</div>

      {/* The exchange itself */}
      <svg viewBox="0 0 520 150" className="w-full" style={{ maxHeight: '160px' }}>
        <defs>
          <marker id="efp-p" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#34d399" />
          </marker>
          <marker id="efp-f" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Party boxes */}
        <rect x="10" y="45" width="120" height="60" rx="10" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.45)" strokeWidth="1.2" />
        <text x="70" y="72" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">{t('partyA')}</text>
        <text x="70" y="88" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">physical seller</text>

        <rect x="390" y="45" width="120" height="60" rx="10" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.45)" strokeWidth="1.2" />
        <text x="450" y="72" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">{t('partyB')}</text>
        <text x="450" y="88" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">physical buyer</text>

        {/* Physical leg: A -> B (top) */}
        <line x1="135" y1="58" x2="385" y2="58" stroke="#34d399" strokeWidth="2" markerEnd="url(#efp-p)" />
        <text x="260" y="48" textAnchor="middle" fill="#34d399" fontSize="8.5" fontFamily="monospace" fontWeight="bold">{t('physLabel')}</text>

        {/* Paper leg: B -> A (bottom) */}
        <line x1="385" y1="94" x2="135" y2="94" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#efp-f)" />
        <text x="260" y="112" textAnchor="middle" fill="#60a5fa" fontSize="8.5" fontFamily="monospace" fontWeight="bold">{t('paperLabel')}</text>

        {/* Exchange registration stamp */}
        <rect x="212" y="66" width="96" height="20" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x="260" y="79" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontFamily="monospace">registered @ ICE</text>
      </svg>

      {/* Before / after books */}
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-3">
          <div className="font-mono text-xs font-bold text-amber-300">{t('partyA')}</div>
          <div className="mt-2 space-y-1 font-mono text-[11px]">
            <div className="text-slate-500">BEFORE</div>
            <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-300">{t('aBefore1')}</div>
            <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-300">{t('aBefore2')}</div>
            <div className="pt-1 text-slate-500">AFTER THE EFP</div>
            <div className="rounded border border-emerald-500/30 bg-emerald-500/[0.06] px-2 py-1 text-emerald-300">{t('aAfter')}</div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3">
          <div className="font-mono text-xs font-bold text-emerald-300">{t('partyB')}</div>
          <div className="mt-2 space-y-1 font-mono text-[11px]">
            <div className="text-slate-500">BEFORE</div>
            <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-300">{t('bBefore1')}</div>
            <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-300">{t('bBefore2')}</div>
            <div className="pt-1 text-slate-500">AFTER THE EFP</div>
            <div className="rounded border border-emerald-500/30 bg-emerald-500/[0.06] px-2 py-1 text-emerald-300">{t('bAfter')}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-relaxed text-slate-300">
        {t('registered')}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t('efs')}</p>
    </div>
  )
}
