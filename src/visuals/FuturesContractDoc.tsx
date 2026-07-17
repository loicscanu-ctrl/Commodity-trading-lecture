'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

// A futures contract as what it literally is: one public, pre-printed
// document. Every commercial term is standardized by the exchange — the only
// blank line is the price, which the order book fills. The stamp is the other
// half of the magic: the clearing house guarantees performance, so the
// document can be traded between strangers.
export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'The whole instrument fits on one page' },
  docEyebrow: { label: 'Document · exchange line', value: 'ICE FUTURES EUROPE · PUBLIC RULEBOOK' },
  docTitle: { label: 'Document · title', value: 'STANDARDIZED' },
  docSubtitle: { label: 'Document · subtitle', value: 'Robusta Coffee Futures Contract' },
  volumeLabel: { label: 'Field 1 · label', value: 'Volume' },
  volumeValue: { label: 'Field 1 · value', value: '10 tonnes per lot' },
  priceLabel: { label: 'Field 2 · label', value: 'Price' },
  priceValue: { label: 'Field 2 · value', value: 'set on screen, tick by tick' },
  monthLabel: { label: 'Field 3 · label', value: 'Delivery month' },
  monthValue: { label: 'Field 3 · value', value: 'Jan · Mar · May · Jul · Sep · Nov' },
  termLabel: { label: 'Field 4 · label', value: 'Delivery term' },
  termValue: { label: 'Field 4 · value', value: 'ex-warehouse warrant, ICE-licensed warehouses, Class 1 quality at par' },
  stampLine1: { label: 'Stamp · line 1', value: 'CLEARING HOUSE' },
  stampLine2: { label: 'Stamp · line 2', value: 'GUARANTEED' },
  caption: {
    label: 'Caption',
    multiline: true,
    value: 'Read the blank line: price is the ONLY term the exchange does not pre-print — everything else is fixed, public and identical for every trader on earth. That is why thousands of strangers can trade the same document without negotiating anything but a number. And the stamp is why they never need to know each other’s names: once matched, the clearing house stands behind both sides of every trade.',
  },
})

const FIELDS = [
  { label: 'volumeLabel', value: 'volumeValue', blank: false },
  { label: 'priceLabel', value: 'priceValue', blank: true },
  { label: 'monthLabel', value: 'monthValue', blank: false },
  { label: 'termLabel', value: 'termValue', blank: false },
] as const

export default function FuturesContractDoc() {
  const t = useVisualText(textDef)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-4">{t('heading')}</div>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* ── The document ── */}
        <div className="relative mx-auto md:mx-0 w-full max-w-[340px] shrink-0">
          <div className="relative overflow-hidden rounded-lg border border-white/20 bg-white/[0.05] px-5 pb-14 pt-5 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            {/* folded corner */}
            <div className="absolute right-0 top-0 h-9 w-9" aria-hidden="true">
              <div className="absolute inset-0 bg-[#070912]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
              <div className="absolute inset-0 border-b border-l border-white/20 bg-white/[0.09]" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
            </div>

            {/* letterhead */}
            <div className="font-mono text-[8px] tracking-[0.22em] text-slate-500">{t('docEyebrow')}</div>
            <div className="mt-2 font-mono text-xl font-bold tracking-[0.18em] text-white">{t('docTitle')}</div>
            <div className="mt-0.5 text-[11px] text-slate-400">{t('docSubtitle')}</div>
            <div className="mt-3 border-t border-white/15" />

            {/* the pre-printed terms */}
            <div className="mt-4 space-y-3.5">
              {FIELDS.map(f => (
                <div key={f.label}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-brand-cyan shrink-0">{t(f.label)}</span>
                    <span className="flex-1 border-b border-dotted border-white/25" aria-hidden="true" />
                  </div>
                  {f.blank ? (
                    <div className="mt-1 flex items-baseline gap-2 font-mono text-[11px]">
                      <span className="italic text-amber-300/90">___________</span>
                      <span className="text-[9px] text-slate-500">← the only blank: {t(f.value)}</span>
                    </div>
                  ) : (
                    <div className="mt-1 text-[11px] leading-snug text-slate-300">{t(f.value)}</div>
                  )}
                </div>
              ))}
            </div>

            {/* signature strokes, pre-printed too */}
            <div className="mt-5 flex justify-between font-mono text-[8px] text-slate-600">
              <span>form RC-1 · terms identical for all traders</span>
            </div>

            {/* ── the stamp ── */}
            <div
              className="absolute bottom-3 right-4 rotate-[-12deg] rounded-md border-2 border-emerald-400/80 px-3 py-1.5 text-center"
              style={{ boxShadow: '0 0 0 2px rgba(52,211,153,0.25) inset' }}
            >
              <div className="font-mono text-[10px] font-bold tracking-[0.14em] text-emerald-300">{t('stampLine1')}</div>
              <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-emerald-300">{t('stampLine2')}</div>
            </div>
          </div>
        </div>

        {/* ── caption ── */}
        <p className="flex-1 text-sm leading-relaxed text-slate-400">{t('caption')}</p>
      </div>
    </div>
  )
}
