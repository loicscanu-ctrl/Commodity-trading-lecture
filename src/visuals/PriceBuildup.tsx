'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  step1Title: { label: 'Step 1 · title', value: 'Futures' },
  step1Desc: { label: 'Step 1 · description', multiline: true, value: 'Visible, exchange-traded price. The core value of Brent.' },
  step2Title: { label: 'Step 2 · title', value: 'Forward (BFOE)' },
  step2Desc: { label: 'Step 2 · description', multiline: true, value: 'Trades at a premium/discount to futures.' },
  step3Title: { label: 'Step 3 · title', value: 'Dated (physical)' },
  step3Desc: { label: 'Step 3 · description', multiline: true, value: 'Priced off futures + forward activity.' },
  step4Title: { label: 'Step 4 · title', value: 'Physical Deal' },
  step4Desc: { label: 'Step 4 · description', multiline: true, value: 'Benchmark price ± a negotiated differential.' },
  differential: { label: 'Differential callout', value: '+ differential' },
})

export default function PriceBuildup() {
  const t = useVisualText(textDef)

  const steps = [
    { title: t('step1Title'), desc: t('step1Desc'), hex: '#3b82f6', text: 'text-brand-blue' },
    { title: t('step2Title'), desc: t('step2Desc'), hex: '#22d3ee', text: 'text-brand-cyan' },
    { title: t('step3Title'), desc: t('step3Desc'), hex: '#f59e0b', text: 'text-amber-400' },
    { title: t('step4Title'), desc: t('step4Desc'), hex: '#34d399', text: 'text-emerald-400' },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-3">Price discovery cascade</div>

      <div className="flex flex-col md:flex-row md:items-stretch gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-stretch md:flex-1 gap-2">
            <div
              className="relative flex-1 rounded-xl border border-white/5 bg-white/[0.03] p-4"
              style={{ borderTopColor: s.hex, borderTopWidth: 3 }}
            >
              <div className={'font-mono text-xs ' + s.text}>{String(i + 1).padStart(2, '0')}</div>
              <div className={'font-semibold tracking-tight text-sm uppercase mt-1 ' + s.text}>{s.title}</div>
              <div className="text-slate-400 text-xs leading-relaxed mt-2">{s.desc}</div>

              {i === steps.length - 1 && (
                <span className="chip mt-3 inline-block bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold">
                  {t('differential')}
                </span>
              )}
            </div>

            {i < steps.length - 1 && (
              <div className="flex items-center justify-center shrink-0 text-slate-500">
                {/* down chevron on mobile, right chevron on desktop */}
                <svg className="md:hidden" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M4 6 L9 12 L14 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className="hidden md:block" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M6 4 L12 9 L6 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
