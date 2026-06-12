import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-futures-hedge',
  title: 'Futures: The Simplest Hedge',
  type: 'lecture',
  estimatedMinutes: 20,
  sections: [
    {
      id: 'why-futures',
      title: 'The Simplest Instrument',
      body: `The simplest hedging instrument is a **futures contract**:\n\n- Traded only **on, or through, a futures exchange**\n- Bought and sold at a **fixed price**\n- For a **specific quality** of oil, a **specific time frame**, and a **specific delivery location**\n\nThat standardisation is exactly what makes it liquid — and exactly why it can never perfectly match your physical barrel.`,
    },
    {
      id: 'contract-specs',
      title: 'The Contracts',
      body: `The major exchange-traded oil contracts a hedger works with:\n\n| Contract | Quality | Delivery | Expiry | 1 lot |\n|---|---|---|---|---|\n| **Nymex WTI** | Light sweet | Cushing, OK | 20th, M-1 | 1,000 bbl |\n| **ICE WTI** | Light sweet | Cushing, OK *(cash-settled)* | 19th, M-1 | 1,000 bbl |\n| **ICE Brent** | North Sea | North Sea *(cash-settled)* | 30th, M-2 | 1,000 bbl |\n| **DME Oman** | Oman crude | Oman | 31st, M-2 | 1,000 bbl |\n| **IFAD Murban** | Murban | Fujairah | 31st, M-2 | 1,000 bbl |\n| **ICE Gasoil** | Heating oil | ARA | 12th, M | 100 MT |\n| **Nymex Heating Oil** | Heating oil | New York Harbour | 31st, M-1 | 42,000 gal |\n| **Nymex RBOB** | Gasoline blendstock | New York Harbour | 31st, M-1 | 42,000 gal |\n| **ICE WTI Midland** | Permian WTI | USGC (Enterprise/Magellan) | 22nd, M-1 | 1,000 bbl |\n| **INE Shanghai** | Medium sour | Shanghai (in Yuan, storage) | 31st, M-1 | 1,000 bbl |\n\n*M = delivery month; M-1 / M-2 = one / two months before it.* Note that **ICE WTI and ICE Brent are cash-settled** — there is no truck of crude at the end, just a settlement against the index.`,
    },
    {
      id: 'futures-features',
      title: 'Things to Remember',
      body: `Whatever the contract, the same mechanics apply:\n\n- **Expiry date** — the position must be rolled or closed before it\n- **Clearing-house guarantee** — the exchange stands between buyer and seller; no counterparty risk\n- **Initial and variation margin** — cash posted up front and topped up daily as the price moves\n- **Anonymous market** — you don't know who is on the other side\n- **Smaller contract size** — granular enough to size a hedge\n- **Transparency of price** — everyone sees the same screen`,
    },
    {
      id: 'worked-hedge',
      title: 'Worked Example — Hedging a Forties Cargo',
      body: `**You buy a July Forties cargo at a fixed price of \\$82.45/bbl, loading 15–17 July.**\n\n*How do you hedge it?*\n\nYou are **long** ~700,000 bbl at a fixed price — you lose if crude falls before you sell. So you **sell ≈ 700 lots of ICE Brent futures** (700,000 ÷ 1,000) to take an equal-and-opposite short.\n\n*What risk remains?*\n\nThe futures hedge neutralises **flat price**, but **not** the gap between Dated Forties and the Brent futures contract. You are left with:\n\n- **Basis / differential risk** — Forties vs Brent\n- **Timing risk** — the futures month vs your 15–17 July loading\n\nThat residual is precisely what the rest of the Brent complex (DFL, CFD, swaps) exists to manage.`,
      visual: 'exposure-ladder',
    },
    {
      id: 'futures-not-enough',
      title: 'Why Futures Aren’t Enough',
      body: `Real cargoes rarely price at a fixed number. They price off a **Platts formula**, e.g.:\n\n> **"Dated Brent − \\$0.50, using the published quotations for the five working days immediately following the B/L date."**\n\nThat exposure is **floating** — it settles against a published average you don't know yet. A fixed-price futures position can't perfectly offset a floating-formula exposure:\n\n> **Futures alone are not sufficient.**\n\nHedging crude properly is a **combination of futures and swaps**: first understand the value, then work out **how and when to put the hedge on — and, just as important, when to unwind it.**`,
    },
  ],
}

export default topic
