import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-shipping',
  title: 'Shipping: Vessels, Chartering & Demurrage',
  type: 'lecture',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'vessel-types',
      title: 'Classification of Vessels',
      body: `Traders move cargo on different vessel types depending on what it is:\n\n**Tankers** — liquid bulk (crude oil, products, vegetable oils, chemicals). *Clean* tankers carry refined products; *dirty* tankers carry crude and residual fuels. Product incompatibility (a previous cargo tainting the next) is a constant operational concern.\n\n**Bulk carriers** — open holds for dry bulk (grain, coal, iron ore).\n\n**Container ships** — standardised TEU boxes; most bagged commodities (e.g. green coffee) move this way.\n\n**Ro-Ro** — vehicles and machinery.\n\nFor crude and products, the tanker is the workhorse — and its **size** is the first thing a charterer thinks about.`,
    },
    {
      id: 'tanker-types',
      title: 'Tanker Sizes & AFRA',
      body: `Tanker selection depends on route, cargo volume, port draft limits and canal access. The size classes — from coastal tankers up to the VLCC and ULCC — are named partly by geography (**Suezmax** = the largest that transits the Suez Canal) and partly by economics (**Aframax** comes from the *Average Freight Rate Assessment*, the AFRA scale once used to benchmark rates).\n\nBigger ships give a lower cost **per tonne**, but only where the ports and channels can take them.`,
      visual: 'tanker-types',
    },
    {
      id: 'chartering-process',
      title: 'The Charterer’s Process',
      body: `Securing a ship is a five-step sequence, each step with its own concern:\n\n1. **Pre-cargo trade** — *market knowledge* (S&D balances, how owners cost a voyage, vessel types, port restrictions, routes)\n2. **Securing shipping** — *timing*: fix the freight at the lowest level that still meets the requirement\n3. **Requesting an offer** — *negotiation*\n4. **Vessel "on subjects"** — *double-checking* (subs / STEM)\n5. **Drawing up the charter party** — *confirmations*: a **recap** is sent, then the deal is **fixed or dropped**\n\nThe owner, meanwhile, prices the voyage from two maxims: **time = money**, and **higher speed = more bunkers**. How many days at sea? How much fuel? What port costs?`,
    },
    {
      id: 'charter-types',
      title: 'Types of Charter Party',
      body: `The freight offer comes as a **lumpsum** (when the voyage is fully defined) or in **\\$/MT**. But there are four structurally different ways to hire a ship — trading off how much risk the charterer carries against how much they pay.`,
      visual: 'charter-types',
    },
    {
      id: 'worldscale-intro',
      title: 'Freight Pricing: Worldscale',
      body: `When the final destination isn't known at the time of fixing, a flat \\$/MT quote doesn't work. **Worldscale** solves this — a single, universally accepted schedule:\n\n- Independently calculated for *every* voyage on a consistent basis\n- The cost of a **theoretical standard tanker** doing the round trip (load port → discharge port → back)\n- Updated **annually** for exchange rates, bunker costs and port charges\n\nThe rate in the book is **Worldscale 100 ("flat rate")**, quoted in \\$/MT. The market then trades a **percentage** of it: *WS80* means 80% of flat, *WS190* means 190%.`,
    },
    {
      id: 'worldscale-calculator',
      title: 'Worldscale Calculator',
      body: `The core formula is deceptively simple:\n\n> **Actual rate paid = Flat (book) rate × (Worldscale points ÷ 100)**\n\nThen multiply by the cargo to get the voyage freight. Drag the market rate to see how the negotiated WS% scales the freight bill — and note the standard "Worldscale tanker" the flat rate is built on.`,
      visual: 'worldscale-calculator',
    },
    {
      id: 'worldscale-complications',
      title: '“Is It Really This Simple?” — The Small Print',
      body: `Not quite. Looking up a rate means: **discharge port first** (White pages), then the load port, reading off the \\$/MT flat rate, the **route** (via Suez "S" or the Cape "C") and the round-trip distance — *always* checking the small print and amendment circulars.\n\nTwo wrinkles change the maths:\n\n**Blue pages — load-port extensions.** Arabian Gulf, Black Sea and Lake Maracaibo rates are quoted only to a **notional reference point** at the regional chokepoint: **Quoin Island** (Strait of Hormuz, AG), **Üsküdar** (the Bosphorus, Black Sea) and **San Carlos Island** (the entrance to Lake Maracaibo). The Blue-page extension from that point to the actual load port is added to the flat rate **before** the WS% is applied.\n\n**Pink pages — differentials** for ports, terminals and canals (a "D" number by the port name):\n- **Variable** differentials are added **before** the market-rate %\n- **Fixed** differentials are added **after** it\n\nGet the order of operations wrong and the freight is wrong.`,
    },
    {
      id: 'freight-drivers',
      title: 'What Moves the Market Rate',
      body: `Worldscale percentages float with supply and demand for tonnage — both real and *perceived*:\n\n- **Bunker prices** and **vessel size**\n- Activity on the oil market (and other commodity markets)\n- **Change in tonnage** available — and the *perception* of change\n- **Journey length** — tonne-miles (TM): a longer average haul soaks up tonnage and tightens the market\n- **Disasters** and **legislation**\n\nUnder a **spot (voyage) charter** the charterer is most exposed: market volatility, range restrictions, demurrage, deadfreight, and the owner's operational record and financial stability all bite.`,
    },
    {
      id: 'demurrage-intro',
      title: 'Demurrage — Who Pays Whom',
      body: `**Demurrage** is money paid as **damages for detaining a ship beyond the laytime** agreed in the charter party. If the vessel berths and works straight away it's a non-issue; if it's delayed, the owner seeks compensation from the charterer — who in turn recovers it down the commercial chain.\n\nThat chain is the whole point: demurrage flows from one contractual party to the next. The rate can be set three ways — a **fixed \\$ pdpr** (per day pro rata), **as per the charter party**, or on **AFRA** terms.`,
      visual: 'demurrage-whopays',
    },
    {
      id: 'demurrage-risk',
      title: 'Why Demurrage Bites',
      body: `Demurrage is often a major **unexpected** cost in a trader's book, because it is easy to underestimate and easy to miscalculate:\n\n- **Time bars** — miss the deadline to file the claim and you lose it\n- **Mismatch** between the charter party, the purchase contract(s) and the sale contract(s)\n- **Poor knowledge** of the various C/P forms (Asbatankvoy, ShellVoy, BPVoy…)\n- Calculating it correctly needs C/P and maritime-law competence plus shipping-ops expertise\n\nThe deadly version is the **back-to-back mismatch**: if even one sales contract gives a counterparty softer laytime terms than the charter party allows, the trader is left holding the difference.`,
    },
    {
      id: 'laytime-demurrage',
      title: 'Laytime Distribution — the $41,667 Lesson',
      body: `Here is the classic worked example. One voyage, **two load ports and two discharge ports**, under a charter party allowing **72 hours laytime at \\$50,000 pdpr**. Total time used across the four ports is **110 hours** — so the Owners claim demurrage on **38 hours = \\$79,167**.\n\nIf every sales contract is **back-to-back** (laytime prorated by cargo share, at the C/P rate), the demurrage you *collect* from suppliers and receivers exactly covers the Owners' claim: **exposure = \\$0**.\n\nNow toggle Buyer D's "generous" clause — *50% of the full C/P laytime, at a prorated rate*. Nothing else changes, yet the trader is suddenly **−\\$41,667** out of pocket on a single voyage. Drag the inputs and flip the clause to feel it.`,
      visual: 'laytime-demurrage',
    },
    {
      id: 'vessel-acceptability',
      title: 'Vessel Acceptability & Laycan',
      body: `Finally, not every ship can lift every cargo. Contracts and terminals impose **acceptability** criteria: tank cleanliness and previous-cargo restrictions, **age limits**, P&I Club cover, vetting (SIRE) and an independent pre-loading survey.\n\nTiming is governed by the **laycan** — the *layday* (earliest the vessel may present) and the *cancelling* date (latest the charterer must accept it). If the vessel is late, the remedy depends on the C/P form: under **Asbatankvoy** the charterer can cancel; under **ShellVoy / BPVoy** the owner can ask the charterer to declare a new laycan, with a window to respond.\n\nAnd once delay starts, the old rule holds: **"once on demurrage, always on demurrage."**`,
    },
  ],
}

export default topic
