'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  coinLabel: { label: 'Coin label (fallback)', value: 'I QUADRANS' },
  caption: { label: 'Caption', value: 'I Quadrans · Anno XXXIII · Jerusalem' },
  value: { label: 'Value', value: '≈ $1.50' },
  subtitle: { label: 'Subtitle', value: 'The 2,000-Year Mandate' },
})

function FallbackCoin({ label }: { label: string }) {
  const dotAngles = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="88" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="77" fill="#09090b" />
      {dotAngles.map(a => {
        const rad = (a * Math.PI) / 180
        return <circle key={a} cx={100 + 83 * Math.cos(rad)} cy={100 + 83 * Math.sin(rad)} r="1.8" fill="#f59e0b" opacity="0.5" />
      })}
      <text x="100" y="108" textAnchor="middle" fill="#f59e0b" fontSize="12" fontFamily="monospace" fontWeight="bold">{label}</text>
    </svg>
  )
}

export default function RiddleScene() {
  const t = useVisualText(textDef)
  const [failed, setFailed] = useState(false)

  return (
    <div className="mt-6 flex justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-2xl bg-amber-500 opacity-15" />
          {failed ? (
            <FallbackCoin label={t('coinLabel')} />
          ) : (
            <img
              src="https://i.ebayimg.com/images/g/BU0AAeSwz9pp1tgB/s-l1600.webp"
              alt="Ancient Roman Quadrans coin"
              onError={() => setFailed(true)}
              className="relative z-10 rounded-full border border-amber-500/30 object-cover"
              style={{ width: '200px', height: '200px', filter: 'sepia(15%) contrast(1.05) brightness(0.95)' }}
            />
          )}
        </div>
        <div className="glass rounded-2xl px-6 py-4 text-center">
          <div className="eyebrow text-amber-400 mb-1">{t('caption')}</div>
          <div className="text-white font-mono font-bold text-2xl">{t('value')}</div>
          <div className="text-slate-500 font-mono text-xs mt-1 tracking-wider">{t('subtitle')}</div>
        </div>
      </div>
    </div>
  )
}
