'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'From cherry to contract: the warrant lifecycle' },
  s1Title: { label: 'Step 1 · title', value: 'Arrival' },
  s1Desc: { label: 'Step 1 · description', multiline: true, value: 'Coffee lands at an exchange-licensed warehouse.' },
  s2Title: { label: 'Step 2 · title', value: 'Intake' },
  s2Desc: { label: 'Step 2 · description', multiline: true, value: 'Weighed, condition-checked, lot registered.' },
  s3Title: { label: 'Step 3 · title', value: 'Sampling' },
  s3Desc: { label: 'Step 3 · description', multiline: true, value: 'Exchange samplers draw from the lot.' },
  s4Title: { label: 'Step 4 · title', value: 'Grading' },
  s4Desc: { label: 'Step 4 · description', multiline: true, value: 'Graded against the quality ladder → class assigned.' },
  s5Title: { label: 'Step 5 · title', value: 'Warrant' },
  s5Desc: { label: 'Step 5 · description', multiline: true, value: 'An electronic warrant is issued: the coffee is now a deliverable instrument.' },
  s6Title: { label: 'Step 6 · title', value: 'Tender' },
  s6Desc: { label: 'Step 6 · description', multiline: true, value: 'The warrant can be delivered against a short futures position.' },
  caption: {
    label: 'Caption',
    multiline: true,
    value: 'A warrant is coffee that has passed the exchange’s exam — that exam is what makes 10 tonnes in Antwerp fungible with 10 tonnes in Hamburg.',
  },
})

export default function WarrantLifecycle() {
  const t = useVisualText(textDef)

  const steps = [
    { title: t('s1Title'), desc: t('s1Desc'), hex: '#94a3b8', text: 'text-slate-300' },
    { title: t('s2Title'), desc: t('s2Desc'), hex: '#22d3ee', text: 'text-brand-cyan' },
    { title: t('s3Title'), desc: t('s3Desc'), hex: '#3b82f6', text: 'text-brand-blue' },
    { title: t('s4Title'), desc: t('s4Desc'), hex: '#f59e0b', text: 'text-amber-400' },
    { title: t('s5Title'), desc: t('s5Desc'), hex: '#34d399', text: 'text-emerald-400' },
    { title: t('s6Title'), desc: t('s6Desc'), hex: '#34d399', text: 'text-emerald-400' },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow text-brand-cyan mb-3">{t('heading')}</div>

      <div className="flex flex-col lg:flex-row lg:items-stretch gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col lg:flex-row lg:items-stretch lg:flex-1 gap-2">
            <div
              className="relative flex-1 rounded-xl border border-white/5 bg-white/[0.03] p-4"
              style={{ borderTopColor: s.hex, borderTopWidth: 3 }}
            >
              <div className={'font-mono text-xs ' + s.text}>{String(i + 1).padStart(2, '0')}</div>
              <div className={'font-semibold tracking-tight text-sm uppercase mt-1 ' + s.text}>{s.title}</div>
              <div className="text-slate-400 text-xs leading-relaxed mt-2">{s.desc}</div>
            </div>

            {i < steps.length - 1 && (
              <div className="flex items-center justify-center shrink-0 text-slate-500">
                {/* down chevron on mobile, right chevron on desktop */}
                <svg className="lg:hidden" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M4 6 L9 12 L14 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className="hidden lg:block" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M6 4 L12 9 L6 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm leading-relaxed mt-4 border-t border-white/5 pt-4">{t('caption')}</p>
    </div>
  )
}
