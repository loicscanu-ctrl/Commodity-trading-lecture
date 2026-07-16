import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-cherry-to-terminal',
  title: 'From Cherry to Terminal: Group Trading Exercise',
  type: 'case-study',
  estimatedMinutes: 90,
  sections: [
    {
      id: 'briefing',
      title: 'The Exercise',
      body: `One coffee season. Four desks. Three rounds. This is the practice session for everything the course has taught: you will **price a PTBF chain end-to-end, hedge it, and survive the events the instructor throws at you**.\n\n**Learning goals:**\n\n1. Negotiate real prices at every link: VND farm-gate → FOB differential → CIF/instore differential → PTBF fixing\n2. Decide a hedge ratio and *live with its cash consequences* (variation margin is real in this game)\n3. Decompose your final P&L into **flat / basis / costs** — the discipline every desk report requires\n\n**Format:** teams of 3–5 students per desk. Each round is ~20 minutes of negotiation plus an event. The instructor plays "the market" and publishes the screen between rounds. Deals are written on deal sheets *when agreed* — a price spoken is a price done.`,
    },
    {
      id: 'setup-roles',
      title: 'Setup & Roles',
      body: `**Opening screen (the instructor writes this up):**\n\n| Market | Level |\n|---|---|\n| London Robusta (Jan) | **\\$4,800/t** |\n| FX | **25,500 VND/USD** |\n| Farm-gate Dak Lak | **120,000 VND/kg** (implied ≈ Jan −\\$94) |\n| FOB HCM differential | **Jan −\\$60** |\n| Freight HCM → Antwerp | **\\$70/t** (+\\$100/t CIF→instore) |\n| Instore Antwerp | **Jan +\\$120** |\n\n**The four desks:**\n\n- **Farmer Cooperative (Dak Lak):** holds 500 t of cherry-equivalent; costs ≈ 105,000 VND/kg; wants to sell across the season, in VND. May hold stock, but pays 1,500 VND/kg per round in storage/finance.\n- **Exporter (HCM):** working-capital line of \\$2.5m; buys VND, sells FOB in differential; owns the processing margin. No futures access — their only hedge is back-to-back selling.\n- **Trade House:** buys FOB, charters, sells CIF/instore Antwerp; full London futures access (hedge whenever you like, but mark variation margin each round); pays the freight and instore costs.\n- **Roaster (Antwerp):** must secure 300 t for Q1 roastings; buys instore **PTBF, buyer's call**; decides when to fix; walks away from anything worse than +\\$160 instore.\n\n**The instructor ("the market")** publishes futures, FX, differentials and freight at the start of each round, reads the event cards mid-round, and arbitrates disputes by the contract terms written on the deal sheets.`,
    },
    {
      id: 'round1',
      title: 'Round 1 — Origination',
      body: `**20 minutes.** The coop negotiates VND/kg with the exporter; the exporter negotiates an FOB differential with the trade house; the trade house may open its hedge; the roaster may pre-buy PTBF.\n\nEvery desk should be computing the same two numbers before shaking hands:\n\n> **Implied local differential** = (VND/kg × 1,000 ÷ FX) − futures\n> **Origination margin** = FOB differential − implied local differential\n\n**Mid-round event card (instructor reads aloud):**\n\n> *"Reuters: Central Highlands rainfall 40% below average for a third week; Dak Lak farmers withholding stock."*\n\nWatch what should happen: farm-gate VND firms, the implied local diff strengthens, and any exporter who sold FOB **before** buying their VND is now short the basis into a strengthening market. Whoever wrote quantities and pricing terms on the deal sheet first wins the argument later.`,
    },
    {
      id: 'round2',
      title: 'Round 2 — Shipping & Paper',
      body: `**20 minutes.** New screen from the instructor (typical: futures gap to **\\$5,200**, freight quoted **\\$85/t**, FOB firms to **−\\$40**). Then, mid-round:\n\n**Event card 1 — the margin call:**\n\n> *"London +\\$400 overnight. Every desk short futures pays variation margin NOW: \\$400/t × hedged tonnage, in cash, off your working-capital line."*\n\nTrade house desks must show the arithmetic on their deal sheet (e.g. short 20 lots = 200 t → **\\$80,000 out**). Any desk that cannot fund the call must reduce the hedge — at the worst possible moment. *This is the margin-funding lesson from Module 1, live.*\n\n**Event card 2 — the laycan:**\n\n> *"Congestion at Cat Lai: your vessel's laycan slips 10 days. Exporter pays 4,500 VND/kg equivalent in storage/finance, or renegotiates the shipment period with the buyer."*\n\nThe roaster may fix part of its PTBF this round — buyer's call, executed as an **EFP** against the trade house's hedge at the screen price the instructor publishes.`,
    },
    {
      id: 'round3',
      title: 'Round 3 — Destination & Settlement',
      body: `**20 minutes.** Final screen (typical: futures settle back to **\\$4,900**, instore Antwerp **+\\$140**). Then:\n\n**Event card 1 — the claim:**\n\n> *"Arrival sampling, Antwerp: 2.8% defects against a 2.5% contract maximum. Roaster claims −\\$25/t. Independent re-sampling costs \\$2/t and takes the rest of the round."*\n\nRoaster and trade house must settle it: allowance, re-sample, or arbitration (arbitration = instructor rules by the contract, loser pays \\$18/t of fees).\n\n**Event card 2 — the audit:**\n\n> *"EU competent authority requests the due-diligence statement and plot-level geolocation for this consignment. Any desk that cannot produce the traceability line on its deal sheet sells the parcel outside the EU at −\\$80/t."*\n\n(Teams were warned: the EUDR module was on the syllabus. The deal sheets have a traceability field for a reason.)\n\nAll remaining PTBF fixings must be completed by end of round — unfixed positions are cash-settled at the final screen, and the instructor applies the worse side of the spread.`,
    },
    {
      id: 'deliverables-scoring',
      title: 'Deliverables & Scoring',
      body: `Each desk hands in **one deal sheet** at the end:\n\n- Every trade: counterparty, tonnage, price *and its form* (VND/kg, FOB diff, instore diff, futures level, EFP level)\n- Hedge record: lots, levels, and the **variation-margin cash line** round by round\n- Final **P&L decomposed into three legs**: flat price / basis (differentials) / costs (freight, instore, storage, claims, fees)\n- One paragraph: *what was your risk at its worst moment, and what would you do differently?*\n\n**Scoring (100 points):**\n\n| Criterion | Points |\n|---|---|\n| P&L (risk-adjusted — a lucky unhedged win scores poorly) | 40 |\n| Risk discipline: hedge logic, margin funding shown, no naked gaps | 30 |\n| Negotiation & realism: prices defensible vs the published screen | 20 |\n| Deal sheet quality & the debrief paragraph | 10 |`,
    },
    {
      id: 'debrief',
      title: 'Debrief: Who Should Have Made Money, and Why',
      body: `**The model answer, by desk:**\n\n- **Trade house:** the structural winner *if disciplined* — it earns (instore diff − FOB diff − freight − instore costs) ≈ (120 − (−60) − 70 − 100) = **+\\$10/t at the opening screen**, more if it bought before Round 1's rainfall event. But it carries the margin-call event: the +\\$400 gap costs a hedged book cash (survivable) and an unhedged book its P&L (not).\n- **Exporter:** lives on the origination margin (FOB diff minus implied local diff, ≈ \\$34/t at the open). Back-to-back timing is everything: buy VND *then* sell FOB, or be short a strengthening basis after the rainfall card.\n- **Coop:** the rainfall event rewards patience (withholding into a firming market) — but storage costs 1,500 VND/kg per round, so holding is a *position*, not a default.\n- **Roaster:** its edge is the **fixing right**. Fixing before the +\\$400 gap beats fixing after it by \\$400/t; the collar logic from the options module is the discussion to have here.\n\n**The three classic mistakes** (seen every time this game runs):\n\n1. Selling a differential before securing the physical (short basis, no coffee) — killed by the rainfall card\n2. Hedging correctly but never budgeting the **variation-margin cash** — killed by the gap card\n3. Treating documents (deal-sheet terms, traceability) as paperwork — killed by the laycan and EUDR cards\n\n**Discussion questions:** Which desk carried the most *undiversifiable* risk? Where in the chain did the differential risk actually sit at each moment? What single contract clause would each desk renegotiate next season?`,
    },
  ],
}

export default topic
