import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '00-introduction',
  title: 'The Coffee Odyssey: A History of Coffee Trading',
  type: 'lecture',
  estimatedMinutes: 25,
  sections: [
    {
      id: 'origins',
      title: 'Out of the Forests of East Africa',
      body: `Every commodity market has a birthplace. Coffee's is precise: the highland forests of **Kaffa, in south-western Ethiopia**, where *Coffea arabica* still grows wild today.\n\nLegend credits a goatherd named **Kaldi**, whose goats danced after eating the red cherries of a strange shrub. The truth is less picturesque and more interesting: for centuries, highland communities chewed the cherries and brewed the leaves long before anyone roasted a bean.\n\nBy the 15th century the plant had crossed the Red Sea to **Yemen**, where **Sufi monks** brewed *qahwa* to stay awake through night prayers. The name travelled with the drink: *qahwa* → Turkish *kahve* → Italian *caffè* → **coffee**.\n\nMark this point on the map. Six hundred years later, traders still call Ethiopian coffees by their forest origins — and the entire global arabica gene pool descends from this one region.`,
    },
    {
      id: 'mocha-monopoly',
      title: 'Mocha & the Ottoman Monopoly',
      body: `Yemen turned the wild plant into an **industry** — terraced mountain farms, irrigation, and one export funnel: the Red Sea port of **Mocha** (al-Makha), whose name still means coffee.\n\nUnder Ottoman control, coffee became arguably the world's **first great commodity monopoly**:\n\n- Every exported bean was **boiled or parched sterile**, so it could never germinate abroad\n- **No live plant or fertile seed** was allowed to leave; foreigners were kept away from the farms\n- Demand exploded anyway — **Constantinople's first coffeehouses opened in 1554**, and the habit swept the Islamic world and then Europe\n\nFor roughly **200 years**, all the world's coffee flowed through this single chokepoint at monopoly prices. Venice, Marseille, London, Amsterdam — everyone bought at Mocha, on Mocha's terms.\n\n**The first trading lesson of this course:** whoever controls the *seed* controls the trade. And the corollary every monopolist forgets: a margin that fat is a **standing bribe** for the whole world to break it.`,
    },
    {
      id: 'breaking-monopoly',
      title: 'Smugglers, Merchants & Botanists',
      body: `The monopoly didn't fall to an army. It fell to a pilgrim, a trading company, and a botanical garden.\n\n**~1670 — the pilgrim.** Returning from Mecca, the Indian Sufi **Baba Budan** strapped **seven fertile seeds** to his body and planted them in the hills of **Mysore**. Indian coffee still grows in the hills that carry his name.\n\n**1690s — the company.** The **Dutch East India Company (VOC)** obtained live plants and established plantations in Ceylon and then **Java** (1699). Within a generation, "Java" rivalled "Mocha" — the world's first competing origins.\n\n**1706 — the garden.** Java sent a single tree back to the **Amsterdam botanic garden**. It survived, and its offspring became the most consequential houseplant in economic history.\n\n**1714 — the gift.** Amsterdam presented one of those offspring to **Louis XIV of France**. It was installed, pampered and guarded in the **Jardin du Roi in Paris** — the "**Noble Tree**". France had coffee. But it was 4,000 miles from anywhere France could grow it.`,
    },
    {
      id: 'de-clieu',
      title: 'A Lieutenant, a Seedling & Half a Water Ration',
      body: `Enter **Gabriel de Clieu**, a young French naval officer stationed in **Martinique** — and one of history's great obsessives.\n\nConvinced coffee would thrive in the French Caribbean, he asked for a cutting of the Noble Tree. The court refused. So around **1720**, he got one anyway — the legend says with the help of a well-placed lady of the court and a night visit to the royal greenhouse. A *passionné* with a stolen seedling.\n\nThe Atlantic crossing nearly killed both of them:\n\n- A **corsair attack** and a storm that flooded the ship\n- A jealous passenger who tried to destroy the plant and **tore off a branch**\n- Weeks **becalmed**, water rationed — and de Clieu famously **shared his own ration** with the seedling in its glass frame\n\nIt reached **Martinique in 1723**, planted under armed guard. Fifty years later the island counted **~18 million trees**, and the plant's descendants had leapt island to island. In **1727**, the Portuguese officer **Francisco de Melo Palheta** charmed cuttings out of French Guiana (folklore says via the governor's wife and a farewell bouquet) and carried them to **Brazil** — today's coffee superpower, sprung from that single Parisian tree.\n\nOne man, one seedling, half a water ration: the supply map of a global commodity, redrawn.`,
    },
    {
      id: 'odyssey',
      title: 'One Seed’s Journey',
      body: `Trace the whole route. Nine centuries, four continents — and every leg of the journey is either a **monopoly being built** or a **monopoly being broken**.\n\nNotice what the map really shows: coffee's production geography was never "natural". It was **carried, smuggled, gifted and planted** — by pilgrims, trading companies, botanists, one lieutenant, and finally by empires.`,
      visual: 'coffee-odyssey',
    },
    {
      id: 'colonial-spread',
      title: 'Vietnam, West Africa & the Colonial Machine',
      body: `The final act of propagation wasn't romantic. It was **systematic** — coffee became a cash crop of empire.\n\n**Java & the Dutch.** Under the *cultuurstelsel* ("cultivation system"), Javanese villages were **forced to grow export crops** including coffee for the colonial state — the industrial template others copied.\n\n**Vietnam & the French.** French **missionaries planted arabica in 1857**; colonial Indochina built plantations, and hardy **robusta** proved perfectly suited to the lowland climate. After a century of war and a state replanting drive in the 1990s, Vietnam exploded into the **world's #1 robusta producer and #2 coffee producer overall** — the fastest origin build-out in the market's history.\n\n**West Africa.** A twist: **robusta is native to West and Central Africa's forests** — this time the plant stayed home and the *system* arrived. Colonial France turned **Côte d'Ivoire** into a robusta export machine (with forced-labour regimes until 1946); by the 1960s it was the **third-largest producer on earth**, and robusta remains an economic pillar of the region.\n\nThe colonial system left coffee with its modern shape — and its modern injustices: production concentrated in the global South, consumption and pricing power in the North. When you trade coffee, you trade inside this history.`,
    },
    {
      id: 'legacy',
      title: 'What This History Trades Like Today',
      body: `Strip the story to its market lessons and you get the skeleton of this whole course:\n\n1. **Supply geography is man-made — and it moves.** Ethiopia → Yemen → Java → Martinique → Brazil → Vietnam. Every move crushed someone's margin and made someone else's fortune.\n2. **Monopolies and chokepoints set prices — until arbitrage breaks them.** Mocha's 200-year premium ended with seven smuggled seeds.\n3. **Concentration never left.** Brazil + Vietnam grow roughly half the world's coffee — one Brazilian frost or Vietnamese drought still moves the global price, exactly as a Forties outage moves Brent.\n4. **The two species tell the whole story.** Arabica (born in Ethiopia, spread via Paris and Martinique) and robusta (born in West Africa, industrialised via Indochina) grow in different places, taste different — and trade on **different exchanges, in different units**.\n\nThat split is where history hands over to the market mechanics we study next.`,
      visual: 'arabica-robusta',
    },
  ],
}

export default topic
