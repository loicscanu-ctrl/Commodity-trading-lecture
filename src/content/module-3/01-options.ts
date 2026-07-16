import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-options',
  title: 'Options in Commodity Markets',
  type: 'lecture',
  estimatedMinutes: 55,
  sections: [
    {
      id: 'options-basics',
      title: 'Options: The Right Without the Obligation',
      body: `An **option** gives the buyer the right — but not the obligation — to buy (**call**) or sell (**put**) at a specified **strike** price. In commodities, listed options are almost always **options on futures**: exercising a KC call puts a *long futures position* in your account, not a container of coffee.\n\n- **Call** — right to buy → consumers use calls to **cap** their purchase cost\n- **Put** — right to sell → producers use puts to set a **price floor**\n- **Premium** — paid upfront by the buyer: their maximum loss, and the seller's maximum gain (the seller's risk on a naked call is unbounded)\n- **American style** (exercisable any day) is the norm for US listed commodity options; expiry falls *before* the underlying futures month\n\n**Value decomposes into two parts — always with numbers:** with KC March futures at **250¢/lb**, a **240 call** trading at **18¢** has:\n\n- **Intrinsic value** = max(F − K, 0) = 250 − 240 = **10¢**\n- **Time value** = 18 − 10 = **8¢** — what you pay for the *remaining* optionality\n\nAn out-of-the-money option is *pure* time value; at expiry, time value is zero and only intrinsic remains. Everything in option pricing is a theory of that 8¢.`,
    },
    {
      id: 'payoff-lab',
      title: 'Payoff Lab',
      body: `Before any formula, own the **payoff diagrams** — they are the grammar of every hedge you will ever structure.\n\nWork through the four building blocks below. For the producer strategies the y-axis switches to the number a producer actually cares about: the **effective sale price** after the hedge, compared against the dashed unhedged diagonal.\n\nThings to try:\n\n1. **Long call:** find the breakeven (strike + premium). Why is the line flat at −premium below the strike?\n2. **Protective put:** confirm the floor = strike − premium, and that upside is kept (shifted down by the premium).\n3. **Producer collar** at 230/275 with 8¢ against 8¢: a **zero-cost collar** — the sold call *pays for* the put. Now drag the call strike down to 260 and watch the net premium turn positive: tighter cap, better-than-free protection. That trade-off is the daily bread of hedging desks.`,
      visual: 'option-payoff',
    },
    {
      id: 'strategies',
      title: 'The Standard Hedging Structures',
      body: `**Protective put (producer floor).** Own the coffee, buy a put. Floor = strike − premium; upside retained. It is price *insurance*, and like insurance it costs real money — persistent put-buying programs can give away several ¢/lb per year.\n\n**Cap (consumer hedge).** A roaster buys calls: worst case = strike + premium, full benefit if the market falls. \n\n**Zero-cost collar (the workhorse).** Producer buys the 230 put and sells the 275 call, premiums offsetting (8¢ vs 8¢). Per 37,500 lb lot: guaranteed at least 230¢, surrenders everything above 275¢, zero upfront cost. Structurally: *long put + short call + long physical* — you have sold your own upside to finance your floor. **The catch M2 students must see:** the short call leg is margined; a violent rally means variation-margin calls on the hedge *before* the physical is sold — the funding squeeze that has broken real hedging programs.\n\n**Straddle / strangle (volatility trades).** Buy both a call and a put: you are not trading direction but **realised vs implied volatility** — profitable only if the move exceeds the *two* premiums paid. Used around known event risk (frost season, WASDE, an EUDR ruling).`,
    },
    {
      id: 'pricing',
      title: 'Pricing: Black-76 & Put-Call Parity',
      body: `Options on futures are priced with **Black-76** (Black-Scholes adapted to a futures underlying — the futures price already embeds carry, so no storage/yield terms appear):\n\n> **C = e^(−rT) · [F·N(d₁) − K·N(d₂)]**\n> **P = e^(−rT) · [K·N(−d₂) − F·N(−d₁)]**\n> d₁ = [ln(F/K) + σ²T/2] / (σ√T),  d₂ = d₁ − σ√T\n\n**One priced example (Robusta, \\$/t):** F = 4,500, K = 4,500 (at-the-money), σ = 35%, T = 0.25y, r = 4%:\n\n- d₁ = (0 + 0.35²·0.25/2)/(0.35·√0.25) = **0.0875**, d₂ = **−0.0875**\n- N(d₁) ≈ 0.535, N(d₂) ≈ 0.465\n- C = e^(−0.01) · 4,500 · (0.535 − 0.465) ≈ **\\$311/t** — about 7% of the price for three months of ATM protection\n\n(Sanity check every trader knows: ATM ≈ 0.4·F·σ√T ≈ 0.4·4500·0.35·0.5 ≈ \\$315.)\n\n**Put-call parity** for futures options: **C − P = e^(−rT)(F − K)** — so at-the-money (K = F), *call and put are worth the same*. Any deviation is pure arbitrage.\n\n**Implied volatility** is the σ that makes Black-76 match the market premium — options are *quoted* in price but *traded* in vol. Commodity vol surfaces **smile and skew**: in coffee, out-of-the-money **calls** usually carry higher implied vol than puts, because the market pays up for frost/drought tail risk. The smile is the market pricing what Black's lognormal world leaves out.`,
    },
    {
      id: 'greeks',
      title: 'The Greeks: Managing an Option Book',
      body: `The Greeks are the sensitivities a desk actually risk-manages:\n\n| Greek | Measures | Desk intuition |\n|---|---|---|\n| **Delta (Δ)** | ∂V/∂F — futures-equivalent exposure | An ATM option ≈ 0.5Δ: a 100-lot ATM call position hedges like 50 futures. Delta is also a rough *probability of expiring in the money* |\n| **Gamma (Γ)** | ∂Δ/∂F — how fast delta changes | Peaks at-the-money near expiry. Long gamma: your hedge improves as the market moves (you re-hedge at better prices); short gamma: it worsens — you chase the market |\n| **Theta (Θ)** | ∂V/∂t — time decay | The rent a long-option position pays each day; gamma's mirror image (long gamma ⇔ paying theta) |\n| **Vega** | ∂V/∂σ — volatility exposure | ±\\$ per vol point. The straddle buyer is long vega; the collar is roughly vega-flat |\n\nThe producer's protective put in Greek terms: **long delta from the physical, negative delta from the put** (partially hedged), **long gamma** (protection accelerates as prices fall), **paying theta** for it. Nothing about the Greeks is exotic — they are just the derivative chain rule applied to the position you already hold.`,
    },
    {
      id: 'physical-options',
      title: 'Physical & Real Options: Storage, Refining, Blending',
      body: `In physical markets, optionality is embedded in **infrastructure** — and it prices exactly like the paper kind:\n\n**Storage option (worked).** You hold 1,000 t of Robusta; spot \\$4,200; the 3-month future bids \\$4,380 (+\\$180); full carry (warehouse + finance + insurance) is **\\$120 for the period**.\n- Store, sell the future: lock in 180 − 120 = **+\\$60/t** → the storage option is *in the money*: exercise it.\n- If the spread were only +\\$90 < \\$120 carry, the option is out of the money — sell spot instead.\nOwning the warehouse is owning a **call on the calendar spread** (this is the cash-and-carry logic from Module 1, in option language).\n\n**Refinery option.** A refinery is a strip of calls on the **crack spread** (product value − crude cost): run when the crack covers variable cost, throttle when it doesn't. Refining margins' floor-at-zero behaviour *is* option payoff behaviour.\n\n**Blending option.** Holding multiple origins is an option to assemble a **tenderable grade** when tenderable parity moves in the money — the Module 2 calculation, held as an option rather than executed once.\n\nThese real options are why integrated traders pay for "boring" assets: tanks, warehouses and blending stations are **volatility earners** — their value rises with the very uncertainty that hurts a naked position.`,
    },
  ],
}

export default topic
