'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'A real-life OTC swap: NWE gasoline' },
  sellerName: { label: 'Swap seller', value: 'TotalEnergies (TOTSA, Geneva desk)' },
  sellerRole: { label: 'Seller role', value: 'Refiner — long physical gasoline production. Sells the swap: receives fixed, pays floating.' },
  buyerName: { label: 'Swap buyer', value: 'NordFuel GmbH (German road-fuel distributor)' },
  buyerRole: { label: 'Buyer role', value: 'Buys gasoline all month at market. Buys the swap: pays fixed, receives floating.' },
  brokerName: { label: 'Broker', value: 'PVM Oil Associates, London' },
  brokerRole: { label: 'Broker role', value: 'Matches the two principals by phone/screen, never takes a position, earns ~$0.10/MT from each side.' },
  index: { label: 'Index', value: 'Argus Eurobob oxy gasoline barges FOB ARA — monthly average' },
  volume: { label: 'Volume', value: '5,000 MT' },
  period: { label: 'Period', value: 'February (cal-month)' },
  fixed: { label: 'Fixed price', value: '$780/MT' },
  quote: { label: 'The broker call', multiline: true, value: '"Total offers Feb Eurobob barges at 780, 5 kt" — PVM broadcasts it to the market; NordFuel lifts the offer. Done. The trade is bilateral between the two principals under their ISDA master agreement; PVM drops out with its brokerage.' },
  settlement: { label: 'Settlement walk-through', multiline: true, value: 'February’s Argus average prints $802/MT. Floating (802) > fixed (780), so Total pays NordFuel 22 × 5,000 = $110,000. Check both books: NordFuel paid ~802 for its physical all month, receives 22 back → net $780/MT, fixed as planned. Total sold its physical output at ~802, pays 22 away → net $780/MT: the refiner locked its selling value. Same machine as the futures hedge — but the index, size and period were negotiated, not standardised.' },
  caption: { label: 'Caption', multiline: true, value: 'Names are real market participants used for realism; the terms are illustrative. Many such swaps are now given up for clearing (ICE/CME "swap futures"), which keeps the OTC flexibility but replaces bilateral credit risk with margin.' },
})

export default function GasolineSwap() {
  const t = useVisualText(textDef)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-4">{t('heading')}</div>

      {/* Who's who: principal — broker — principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-3">
          <div className="font-mono text-xs font-bold text-amber-300">{t('sellerName')}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{t('sellerRole')}</p>
        </div>
        <div className="rounded-xl border border-brand-cyan/30 bg-brand-cyan/[0.05] p-3">
          <div className="font-mono text-xs font-bold text-brand-cyan">{t('brokerName')}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{t('brokerRole')}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-3">
          <div className="font-mono text-xs font-bold text-emerald-300">{t('buyerName')}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{t('buyerRole')}</p>
        </div>
      </div>

      {/* Flow: quotes via broker, execution bilateral */}
      <svg viewBox="0 0 480 96" className="mt-2 w-full" style={{ maxHeight: '110px' }}>
        <defs>
          <marker id="gs-a" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#22d3ee" />
          </marker>
          <marker id="gs-b" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>
        {/* quote flow via broker (dashed) */}
        <line x1="88" y1="24" x2="216" y2="24" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" markerStart="url(#gs-a)" markerEnd="url(#gs-a)" />
        <line x1="264" y1="24" x2="392" y2="24" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" markerStart="url(#gs-a)" markerEnd="url(#gs-a)" />
        <text x="240" y="16" textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="monospace">quotes &amp; match via broker</text>
        <text x="80" y="28" textAnchor="end" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">SELLER</text>
        <text x="240" y="40" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">brokerage from each side</text>
        <text x="400" y="28" textAnchor="start" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">BUYER</text>
        {/* executed swap: direct bilateral */}
        <line x1="88" y1="72" x2="392" y2="72" stroke="#94a3b8" strokeWidth="2" markerStart="url(#gs-b)" markerEnd="url(#gs-b)" />
        <text x="240" y="64" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace" fontWeight="bold">executed swap: bilateral, under an ISDA master</text>
        <text x="240" y="86" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">fixed vs monthly-average floating · cash settled</text>
      </svg>

      {/* Deal ticket */}
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs">
          <div className="eyebrow mb-2">Deal ticket</div>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-3"><span className="text-slate-500">Index</span><span className="text-right text-slate-200">{t('index')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Volume</span><span className="text-slate-200">{t('volume')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Period</span><span className="text-slate-200">{t('period')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Fixed price</span><span className="font-bold text-amber-300">{t('fixed')}</span></div>
          </div>
          <p className="mt-3 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-slate-400">{t('quote')}</p>
        </div>

        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3">
          <div className="eyebrow mb-2 text-emerald-400">Settlement</div>
          <p className="text-[11px] leading-relaxed text-slate-300">{t('settlement')}</p>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{t('caption')}</p>
    </div>
  )
}
