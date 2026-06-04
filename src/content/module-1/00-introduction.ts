import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '00-introduction',
  title: 'Welcome & Why Commodity Trading',
  type: 'lecture',
  estimatedMinutes: 20,
  sections: [
    {
      id: 'riddle',
      title: 'A Thought Experiment',
      body: `Before diving into the technical aspects of trading, let's begin with a thought experiment.

Imagine we are in the **year 33 AD**. The Magi entrust you with a sacred mandate: to finance the ecological restoration of the world — 2,000 years from now, meaning our current era.

Not with magic. With **pure material power**.

You have two millennia. You have no technology. You have one obligation: **do not fail**.`,
      visual: 'riddle-scene',
    },
    {
      id: 'three-laws',
      title: 'Ground Zero & The 3 Laws',
      body: `Your starting stake? **One Quadrans** — the price of a coffee. **$1.50**.

But beware. You have strict rules.

**No stealing. No pillaging.** Your gain must be clean and contribute to the life of men.

At the end of each century, you must present your accounts to the Pope. **Stable, auditable, non-speculative growth** — or you lose the mandate.

And above all: **Rule Number 3 — The Anonymity of the Servant.**

No political power. No taxes. No marriage for money. No inheritance. You operate in the shadows. Your only weapon is that starting quadrans. Fixed assets are strictly forbidden.`,
      visual: 'three-laws',
    },
    {
      id: 'dead-ends',
      title: 'The Dead Ends',
      body: `With the 3 Laws in place — what fails?

Almost everything we call "wealth preservation" collapses under at least one rule. Conventional assets, institutions, and even flow-based strategies all hit a wall.

*Open **Notes** for the full analysis of each dead end.*`,
      visual: 'dead-ends',
    },
    {
      id: 'revelation',
      title: 'The Revelation',
      body: `So — what is the **only calculation** that holds up over 2,000 years?

$1.50 → $100 Trillion. A net **1.61%** annually. Uninterrupted. Shielded from every empire.

The vehicle: **Physical Commodity Trading**. The trader owns the temporary title to wheat, salt, oil — goods consumed and reborn as liquidity. If Rome burns, the flow reroutes to Byzantium.

**The lesson:** Physical trading is not a financial anomaly. It is the ultimate arbiter of time. *This is what you are about to learn.*`,
      visual: 'mandate-reveal',
    },
  ],
}

export default topic
