import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-swaps-cfds',
  title: 'Swaps & CFDs',
  type: 'lecture',
  estimatedMinutes: 22,
  sections: [
    {
      id: 'what-is-swap',
      title: 'What Is a Swap?',
      body: `> "A financial instrument that allows market participants to trade **the value of a particular market at some time in the future**."\n\nLess formally, a swap is:\n\n- A **"bet"** on where prices will go — the **exchange of price risk**\n- Priced the same way futures are\n- Most often: **exchange a fixed price for a floating price** (or one floating price for another)\n\nNo barrels change hands. Only the **difference in value** is settled in cash.`,
    },
    {
      id: 'the-index',
      title: 'The Index — the Floating Leg',
      body: `The "floating" side of a swap settles against an **index**:\n\n- A **report of the price** of clearly assessable trades in a given market, usually on a **spot** basis\n- It is a **floating price record** — published by a Price Reporting Agency (Platts, Argus, OPIS…)\n\nA simple swap, then, is the purchase/sale at a **fixed** price versus the sale/purchase at the **floating** index average, over a future period.`,
    },
    {
      id: 'swap-example',
      title: 'Swap Example — FOB Barges 3.5% Fuel Oil',
      body: `Concrete terms for a standard swap:\n\n- **Index:** FOB Barges 3.5% fuel oil *(as published by Platts / Argus)*\n- **Volume:** 5,000 MT *(the standard clip; negotiable)*\n- **Period:** 1–30 November 2024 *(completely flexible)*\n- **Price:** **\\$630.00 / MT** fixed\n- **Contract:** Company A **sells** the swap at the fixed price to Company B, and **buys** the floating average back from them\n\nSo A is locked at \\$630; B carries the floating outcome. Now watch what settlement does.`,
    },
    {
      id: 'swap-settlement',
      title: 'Settlement',
      body: `At the end of the pricing period the **floating average** is compared with the **fixed price**, and the difference × volume is paid in cash. Drag the inputs below — the default reproduces the canonical example: floating settles at **\\$653.25** vs **\\$630.00** fixed, so over 5,000 MT, **Company A pays Company B \\$116,250**.`,
      visual: 'swap-simulator',
    },
    {
      id: 'structure-cfd',
      title: 'Market Structure → CFDs',
      body: `**Backwardation** and **contango** are just adjectives for the price of oil in the future *relative* to oil today. **In crude, that structure is traded as CFDs.**\n\nWhy it bites: two cargoes with an **identical floating formula** (e.g. priced 5 days after B/L) are worth **different amounts** depending on *when they load* — a cargo offered 2–4 August is not the same value as one offered 21–25 August. That **time value can be quantified and locked in with CFDs.**`,
    },
    {
      id: 'cfd-curve',
      title: 'The CFD Curve',
      body: `A snapshot of the real CFD market on **26 July 2017** — eight weekly windows, all quoted against **OCT BFOE**. Dated trades **below** the forward, and the discount **narrows** steadily from −1.26 to −0.50 as you move out in time: a contango-shaped CFD curve where the nearest dates are the cheapest.`,
      visual: 'cfd-curve',
    },
    {
      id: 'cfd-trade',
      title: 'Worked Example — A CFD Trade',
      body: `On **15 June 2017** you **buy** a CFD for the week **3–7 July**. It is offered at **AUG − 0.80** — that number is what you trade.\n\nThrough that week, Monday to Friday, you compare the published **Dated Brent** with the published **Brent front month**:\n\n- If the difference **narrows**, the **seller pays you**\n- If the difference **widens**, **you pay the seller**\n\nBuying the CFD makes you **long Dated / short the forward** — you profit as Dated strengthens relative to the front month.`,
    },
    {
      id: 'making-price',
      title: 'Making a Price to a Refiner',
      body: `Pull it together. When you quote a physical price to a refiner, it bundles up everything in this module:\n\n- The value of the **differential** (grade vs benchmark)\n- The cost of **freight, insurance and losses**\n- The value of **time** — i.e. market structure, captured via CFDs\n\nA price to a refiner includes **all of these** at once. The Brent complex is simply the toolkit for pricing and hedging each piece.`,
    },
  ],
}

export default topic
