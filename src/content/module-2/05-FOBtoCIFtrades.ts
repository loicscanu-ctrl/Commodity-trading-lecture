import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '05-FOBtoCIFtrades',
  title: 'FOB to CIF: Guided Trade Simulation',
  type: 'case-study',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'briefing',
      title: 'Your Book, Your Calls',
      body: `You are the junior robusta trader on a trade-house desk in Ho Chi Minh City. This morning the senior trader bought **200 t FOB HCM at January −\\$60/t** and went into a meeting, leaving you a note: *"Ship it to Antwerp. Don't be a hero."*\n\nThe plan on paper:\n\n| | $/t |\n|---|---|\n| Buy FOB HCM | Jan − 60 |\n| Target sale, instore Antwerp | Jan + 120 |\n| Gross differential | **+180** |\n| Freight (booked at plan) | −70 |\n| CIF → instore costs | −100 |\n| **Paper margin** | **+10** |\n\nTen dollars a tonne — **\\$2,000 on the parcel** — if *everything* goes right. That thin margin is the honest arithmetic of physical trading, and it is why every one of the five decisions ahead of you matters more than any market view.\n\nEverything you need has been covered in this course: hedging at execution (Module 2), freight as exposure (shipping), differentials as a market (basis), EFP fixings (Module 1), and claims (contracts). **Play it before you read on — then compare your reasoning with the debrief.**`,
    },
    {
      id: 'simulation',
      title: 'The Simulation',
      body: `Five decisions, in the order the desk would face them. Choose, read the consequence, and watch the impact accumulate against your +\\$10/t paper margin. There is a defensible best answer at every step — and each wrong answer is a mistake that gets made, somewhere, every season.`,
      visual: 'guided-trade-sim',
    },
    {
      id: 'debrief',
      title: 'Debrief: The Shape of a Good Physical Trade',
      body: `Whatever your score, notice the structure of what you just played:\n\n1. **The margin was made at entry** — buy −60 against a +120 destination market, minus 170 of costs. Nothing you did *after* entry could improve on +10/t; every decision could only protect it or lose it. Good physical trading is mostly **not losing the margin you already bought**.\n2. **Four of the five decisions were risk decisions, not market decisions.** The hedge, the freight, the fixing, the claim — none required a price forecast. The only "view" decision (holding for +135) was the trap.\n3. **The killers are asymmetric.** The best outcome on each step was roughly zero; the worst was −15 to −70. A physical book is short a portfolio of small options — discipline is the premium you collect.\n4. **Cash is a constraint, not a footnote.** The hedge that saved you \\$70/t also generates variation-margin calls while the coffee floats. Survival requires the liquidity line to be sized *with* the hedge.\n\n> The senior trader's note, decoded: *"Don't be a hero"* = hedge at execution, book the freight, hit the bid, EFP the fixing, verify the claim. **The boring path was worth \\$26,200 more than the worst one.**\n\nNow you are ready for the group exercise in Module 3 — same chain, but with real counterparties across the table.`,
    },
  ],
}

export default topic
