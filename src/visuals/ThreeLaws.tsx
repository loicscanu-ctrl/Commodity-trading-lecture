'use client'

import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  law1Label: { label: 'Law 1 · number', value: '01' },
  law1Title: { label: 'Law 1 · title', value: 'Absolute Ethics' },
  law1Body: { label: 'Law 1 · body', multiline: true, value: 'No stealing, no pillaging, no extortion. Your gain must be clean and actively contribute to the life of men. Building your fortune on the ruin or predatory usury of others is forbidden.' },
  law2Label: { label: 'Law 2 · number', value: '02' },
  law2Title: { label: 'Law 2 · title', value: 'The Papal Audit' },
  law2Body: { label: 'Law 2 · body', multiline: true, value: 'At the end of each century, you present yourself before the Pope to have your accounts audited. You must prove that your growth was regular, stable — and that your fortune does not rest on speculative bubbles or ephemeral strokes of luck.' },
  law3Label: { label: 'Law 3 · number', value: '03' },
  law3Title: { label: 'Law 3 · title', value: 'The Anonymity of the Servant' },
  law3Body: { label: 'Law 3 · body', multiline: true, value: 'You must operate in the shadows through the ages. No political power, no taxes, no marriage for money, no inheritances. Your only weapon is the starting quadrans.' },
})

export default function ThreeLaws() {
  const t = useVisualText(textDef)
  const laws = [
    { label: t('law1Label'), title: t('law1Title'), body: t('law1Body') },
    { label: t('law2Label'), title: t('law2Title'), body: t('law2Body') },
    { label: t('law3Label'), title: t('law3Title'), body: t('law3Body') },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {laws.map(law => (
        <div key={law.label} className="glass glass-hover relative overflow-hidden rounded-2xl p-5">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-500" />
          <div className="eyebrow text-amber-400 mb-3">{law.label}</div>
          <h3 className="text-white font-semibold tracking-tight text-sm uppercase mb-3">{law.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{law.body}</p>
        </div>
      ))}
    </div>
  )
}
