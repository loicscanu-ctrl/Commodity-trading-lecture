'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

// The EFP drawn as what it really is: two counterparties' hedges meeting
// through a broker, and the screen price travelling into the physical
// contract. The exporter holds 100 t of physical + a short hedge of 10 lots;
// the roaster holds a long hedge of 10 lots. At fixing, the roaster's long is
// exchanged (via broker, registered at ICE) against the price fixation of the
// physical contract: it offsets the exporter's short, and the same number —
// 4,200 + the $120 differential — is written into the invoice.
export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'EFP: two hedges meet, one price fixes the contract' },
  iceLine1: { label: 'Exchange · line 1', value: 'ICE LONDON' },
  iceLine2: { label: 'Exchange · line 2', value: 'Jan Robusta futures · $4,200' },
  partyA: { label: 'Exporter', value: 'Exporter · HCM' },
  aPos1: { label: 'Exporter · position 1', value: 'PHYSICAL · 100 t robusta' },
  aPos2: { label: 'Exporter · position 2', value: 'SHORT hedge · 10 lots Jan @ 4,500' },
  partyB: { label: 'Roaster', value: 'Roaster · Hamburg' },
  bPos1: { label: 'Roaster · position 1', value: 'LONG hedge · 10 lots Jan @ 4,250' },
  bPos2: { label: 'Roaster · position 2', value: 'PTBF buy · Jan +$120 · unfixed' },
  broker: { label: 'Broker chip', value: 'broker · Marex, London' },
  step1: { label: 'Arrow ① label', value: '① the roaster calls the fix at the screen price' },
  step2: { label: 'Arrow ② label', value: '② EFP · his LONG 10 lots transfer @ 4,200' },
  step2b: { label: 'Arrow ② sublabel', value: 'offsets the exporter’s SHORT — both futures books go flat' },
  step3: { label: 'Arrow ③ label', value: '③ 4,200 + 120 → the invoice' },
  docTitle: { label: 'Document · title', value: 'PTBF CONTRACT' },
  docSpec: { label: 'Document · spec line', value: '100 t robusta · Jan + $120 · buyer’s call' },
  docPriceLabel: { label: 'Document · price label', value: 'Price' },
  docPriceValue: { label: 'Document · price value', value: '$4,320/t' },
  docStamp: { label: 'Document · stamp', value: 'FIXED' },
  aAfter: {
    label: 'Exporter · after', multiline: true,
    value: 'Futures flat — his short is offset by the roaster’s long via the EFP. Invoice fixed at 4,200 + 120 = $4,320/t; add the $300/t gain on the 4,500 hedge → $4,620/t net, as per PTBF.',
  },
  bAfter: {
    label: 'Roaster · after', multiline: true,
    value: 'Futures flat — his long is delivered into the EFP. Purchase fixed at $4,320/t; the −$50/t on the 4,250 hedge makes $4,370/t effective — exactly what he locked in October (4,250 + 120).',
  },
  registered: {
    label: 'Registered note', multiline: true,
    value: 'One transaction, negotiated privately through the broker and registered with the exchange at one agreed price (4,200): the roaster’s long and the exporter’s short offset each other, and the same number fixes the physical invoice — both legs crystallise simultaneously. No screen, no legging risk, no slippage between the legs.',
  },
  efs: {
    label: 'EFS note', multiline: true,
    value: 'EFS — Exchange of Futures for Swaps — is the identical mechanism with the paper leg being an OTC swap position instead of futures: the physical deal is exchanged against a swap at an agreed level. Same purpose: both legs at one price, in one registered step.',
  },
})

export default function EfpDiagram() {
  const t = useVisualText(textDef)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">{t('heading')}</div>

      {/* The price's journey: screen → roaster's long → EFP → the contract */}
      <svg viewBox="0 0 560 330" className="w-full" style={{ maxHeight: '340px' }}>
        <defs>
          <marker id="efp-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#22d3ee" />
          </marker>
          <marker id="efp-amb" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* ── The exchange, top center ── */}
        <rect x="195" y="8" width="170" height="36" rx="9" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.5)" strokeWidth="1.2" />
        <text x="280" y="23" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="bold">{t('iceLine1')}</text>
        <text x="280" y="36" textAnchor="middle" fill="#dbeafe" fontSize="8.5" fontFamily="monospace">{t('iceLine2')}</text>

        {/* ① screen price → roaster */}
        <path d="M 200 40 C 150 55, 120 65, 105 88" fill="none" stroke="#22d3ee" strokeWidth="1.8" markerEnd="url(#efp-arr)" />
        <text x="118" y="52" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">{t('step1')}</text>

        {/* ── Roaster (left) ── */}
        <rect x="15" y="92" width="180" height="72" rx="10" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.45)" strokeWidth="1.2" />
        <text x="105" y="110" textAnchor="middle" fill="#34d399" fontSize="10.5" fontFamily="monospace" fontWeight="bold">{t('partyB')}</text>
        <text x="105" y="127" textAnchor="middle" fill="#e2e8f0" fontSize="8.5" fontFamily="monospace">{t('bPos1')}</text>
        <text x="105" y="142" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">{t('bPos2')}</text>

        {/* ── Exporter (right) ── */}
        <rect x="365" y="92" width="180" height="72" rx="10" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.45)" strokeWidth="1.2" />
        <text x="455" y="110" textAnchor="middle" fill="#fbbf24" fontSize="10.5" fontFamily="monospace" fontWeight="bold">{t('partyA')}</text>
        <text x="455" y="127" textAnchor="middle" fill="#e2e8f0" fontSize="8.5" fontFamily="monospace">{t('aPos1')}</text>
        <text x="455" y="142" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">{t('aPos2')}</text>

        {/* ② the EFP: roaster's long → broker → exporter's short */}
        <line x1="195" y1="122" x2="240" y2="122" stroke="#22d3ee" strokeWidth="1.8" />
        <line x1="320" y1="122" x2="360" y2="122" stroke="#22d3ee" strokeWidth="1.8" markerEnd="url(#efp-arr)" />
        <rect x="240" y="110" width="80" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        <text x="280" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace">{t('broker')}</text>
        <text x="280" y="103" textAnchor="middle" fill="#22d3ee" fontSize="8.5" fontFamily="monospace" fontWeight="bold">{t('step2')}</text>
        <text x="280" y="148" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">{t('step2b')}</text>
        <text x="280" y="160" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">registered @ ICE</text>

        {/* ③ exporter → the contract document */}
        <path d="M 455 168 C 455 195, 420 215, 372 232" fill="none" stroke="#f59e0b" strokeWidth="1.8" markerEnd="url(#efp-amb)" />
        <text x="463" y="205" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">{t('step3')}</text>

        {/* ── The contract document, bottom center ── */}
        <g>
          <rect x="200" y="190" width="165" height="126" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
          {/* folded corner */}
          <path d="M 345 190 L 365 210 L 345 210 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <path d="M 345 190 L 365 190 L 365 210" fill="#070912" stroke="none" />

          <text x="214" y="212" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1.5">{t('docTitle')}</text>
          <text x="214" y="228" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">{t('docSpec')}</text>
          <line x1="214" y1="238" x2="350" y2="238" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* pre-printed lines */}
          <line x1="214" y1="252" x2="330" y2="252" stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="214" y1="264" x2="330" y2="264" stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="2 3" />

          {/* the price line — the blank the EFP fills */}
          <text x="214" y="286" fill="#22d3ee" fontSize="8" fontFamily="monospace" fontWeight="bold">{t('docPriceLabel')}:</text>
          <text x="252" y="286" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">{t('docPriceValue')}</text>
          <text x="214" y="302" fill="#64748b" fontSize="7" fontFamily="monospace">= EFP 4,200 + differential 120</text>

          {/* FIXED stamp */}
          <g transform="rotate(-11 330 297)">
            <rect x="305" y="286" width="52" height="22" rx="4" fill="none" stroke="#34d399" strokeWidth="1.8" opacity="0.9" />
            <text x="331" y="301" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="2">{t('docStamp')}</text>
          </g>
        </g>
      </svg>

      {/* After-the-EFP books */}
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3">
          <div className="font-mono text-xs font-bold text-emerald-300">{t('partyB')}</div>
          <div className="mt-2 space-y-1 font-mono text-[11px]">
            <div className="text-slate-500">BEFORE</div>
            <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-300">{t('bPos2')}</div>
            <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-300">{t('bPos1')}</div>
            <div className="pt-1 text-slate-500">AFTER THE EFP</div>
            <div className="rounded border border-emerald-500/30 bg-emerald-500/[0.06] px-2 py-1 leading-relaxed text-emerald-300">{t('bAfter')}</div>
          </div>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-3">
          <div className="font-mono text-xs font-bold text-amber-300">{t('partyA')}</div>
          <div className="mt-2 space-y-1 font-mono text-[11px]">
            <div className="text-slate-500">BEFORE</div>
            <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-300">{t('aPos1')}</div>
            <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-300">{t('aPos2')}</div>
            <div className="pt-1 text-slate-500">AFTER THE EFP</div>
            <div className="rounded border border-emerald-500/30 bg-emerald-500/[0.06] px-2 py-1 leading-relaxed text-emerald-300">{t('aAfter')}</div>
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
