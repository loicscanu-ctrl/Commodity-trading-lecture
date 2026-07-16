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
      body: `Yemen turned the wild plant into an **industry** — terraced mountain farms, irrigation, and one export funnel: the Red Sea port of **Mocha** (al-Makha), whose name became synonymous with coffee itself.\n\nUnder Ottoman control (Yemen came under Ottoman rule in the 16th century), coffee became one of the **earliest documented export monopolies** in a globally traded good:\n\n- Exported beans were **rendered infertile** — contemporary accounts describe boiling or part-roasting them so they could not germinate abroad\n- **No live plant or fertile seed** was permitted to leave, and foreigners were kept away from the growing areas\n- Demand exploded anyway — **Constantinople's first coffeehouses opened in 1554**, and the habit spread through the Islamic world and on to Europe\n\nFor the better part of **two centuries**, virtually all the world's traded coffee shipped through this one funnel. Venice, Marseille, London, Amsterdam — everyone bought at Mocha, on Mocha's terms.\n\n**The first trading lesson of this course:** whoever controls the *seed* controls the trade. And the corollary every monopolist forgets: a margin that wide is a **standing incentive** for the whole world to break it.`,
    },
    {
      id: 'breaking-monopoly',
      title: 'Smugglers, Merchants & Botanists',
      body: `The monopoly didn't fall to an army. It fell to a pilgrim, a trading company, and a botanical garden.\n\n**~1670 — the pilgrim.** Tradition holds that the Indian Sufi **Baba Budan**, returning from pilgrimage, carried **seven fertile seeds** out of Yemen and planted them in the hills of **Mysore**. Whatever the precise details, Indian coffee cultivation dates from this era, and the Chikmagalur hills where it began still carry his name.\n\n**1690s — the company.** The **Dutch East India Company (VOC)** shipped live plants from India's Malabar coast to Ceylon and then **Java**, with successful plantings from **1699**. Within a generation, "Java" rivalled "Mocha" — the market's first competing origins.\n\n**1706 — the garden.** Java sent a young tree back to the **Amsterdam botanic garden**, where it survived and propagated. Most cultivated arabica in the Americas descends from this one Amsterdam line.\n\n**1714 — the gift.** Amsterdam presented an offspring of that tree to **Louis XIV of France**. It was installed and guarded in the royal botanical garden in Paris (the **Jardin du Roi**) — later writers called it the "**Noble Tree**". France now had coffee. But it stood 4,000 miles from anywhere France could grow it commercially.`,
    },
    {
      id: 'de-clieu',
      title: 'A Lieutenant, a Seedling & Half a Water Ration',
      body: `Enter **Gabriel de Clieu**, a French naval officer serving in **Martinique**, convinced that coffee would thrive in the French Caribbean.\n\nHe asked for a cutting of the Noble Tree; the court initially refused. In his **own published account (1774)**, de Clieu says he finally obtained a seedling around **1720** through the intervention of the royal physician, aided by a lady of the court. Later retellings embellished this into a midnight theft from the royal greenhouse — the *theft* is legend; the *persistence* is documented.\n\nThe Atlantic crossing, as de Clieu himself described it, nearly killed the plant:\n\n- An encounter with a **corsair** and a storm that damaged the ship\n- A jealous fellow passenger who attacked the plant and **tore off a branch**\n- Weeks **becalmed** with drinking water rationed — de Clieu wrote that he **shared his own ration** with the seedling in its glass case\n\nIt reached **Martinique** (sources cite 1720 or 1723 for the arrival), where it was planted and guarded. The colonial **census of 1777 counted nearly 19 million coffee trees** on the island, and the plant's descendants spread island to island through the Caribbean.\n\nIn **1727** the Luso-Brazilian officer **Francisco de Melo Palheta** returned to Brazil from Cayenne (French Guiana) with viable seeds and cuttings — folklore adds that the French governor's wife hid them in a farewell bouquet, a detail history cannot verify. Brazil, today the world's largest producer, dates its industry to that trip.\n\nOne officer, one seedling, half a water ration — and the supply map of a global commodity began shifting across the Atlantic.`,
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
      body: `The final act of propagation wasn't romantic. It was **systematic** — coffee became a cash crop of empire.\n\n**Java & the Dutch.** Under the *cultuurstelsel* ("cultivation system", **1830–1870**), Javanese villages were **required to grow export crops** — coffee prominent among them — for the colonial state. It became the template for industrial-scale colonial cash cropping.\n\n**Vietnam & the French.** French **missionaries introduced arabica in 1857**; colonial Indochina built plantations, and **robusta — introduced in the early 1900s — proved far better suited to the lowland climate**. The real explosion came much later: after the **Đổi Mới reforms (1986)**, a state-backed planting drive made Vietnam the **world's largest robusta producer and second-largest coffee producer overall** within roughly a decade — one of the fastest supply build-outs any commodity market has seen.\n\n**West Africa.** A twist: **robusta (Coffea canephora) is native to West and Central Africa's forests** — here the plant stayed home and the *system* arrived. The French colonial administration pushed coffee as an export cash crop in **Côte d'Ivoire** from the early 1900s, relying on forced-labour regimes until their **abolition in 1946**; by the **1960s Côte d'Ivoire was the world's third-largest producer**, and robusta remains an economic pillar of the region.\n\nThe colonial system left coffee with its modern shape — and its modern asymmetries: production concentrated in the global South, consumption and pricing power in the North. When you trade coffee, you trade inside this history.`,
    },
    {
      id: 'legacy',
      title: 'What This History Trades Like Today',
      body: `Strip the story to its market lessons and you get the skeleton of this whole course:\n\n1. **Supply geography is man-made — and it moves.** Ethiopia → Yemen → Java → Martinique → Brazil → Vietnam. Every move crushed someone's margin and made someone else's fortune.\n2. **Monopolies and chokepoints set prices — until arbitrage breaks them.** Mocha's 200-year premium ended with seven smuggled seeds.\n3. **Concentration never left.** Brazil + Vietnam grow roughly half the world's coffee — one Brazilian frost or Vietnamese drought still moves the global price, exactly as a Forties outage moves Brent.\n4. **The two species tell the whole story.** Arabica (native to Ethiopia, spread via Amsterdam, Paris and Martinique) and robusta (native to West and Central Africa, scaled up in Asia and West Africa) grow in different places, taste different — and trade on **different exchanges, in different units**.\n\nThat split is where history hands over to the market mechanics we study next.`,
      visual: 'arabica-robusta',
    },
  ],
}

export default topic
