import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '07-careers-desk',
  title: 'Careers: Front, Middle & Back Office',
  type: 'lecture',
  estimatedMinutes: 12,
  sections: [
    {
      id: 'three-offices',
      title: 'The Three Offices — and Where You Might Fit',
      body: `Everything so far has been about the market. This part is about **the building** — how a commodity trading house organises the people around a trade, and where a graduate actually enters it.\n\n**Front Office** — traders, originators, sales\n- Prices and executes trades, manages positions, engages with counterparties\n- **Owns the P&L**\n\n**Middle Office** — risk management, product control, compliance\n- Monitors positions against limits, validates the marks (mark-to-market), vets counterparty credit\n- **Owns the limits and the marks** — an independent check on the front office\n\n**Back Office** — operations, settlements, documentation\n- Confirms trades, wires margin, processes invoices, coordinates shipping documents, warehouse warrants and quality certificates\n- **Owns the trade actually happening** in the physical world\n\nTwo things to take away as a future applicant. First, the **classic career path runs through the back office**: operations → execution/logistics → junior trader — the desk trusts people who know how cargo really moves. Second, the separation of the three offices is not bureaucracy, it is a **control**: when one person sits on both sides of the wall (Barings, 1995), operational losses stay hidden until they are fatal. Every interview in this industry will assume you understand this structure.`,
      visual: 'desk-organisation',
    },
    {
      id: 'trade-workflow',
      title: 'One Trade, Every Desk: the Workflow',
      body: `The org chart says who sits where. This shows **how they actually interact** \u2014 by following ONE trade through the building.\n\nThe deal: the desk buys **200 t PTBF** from a supplier and hedges with **20 lots**. Step through the map below and watch the trade travel: **front office** does the deal and the hedge (steps 1\u20132, minutes) \u2014 then the trade leaves the trader\u2019s hands. **Middle office** captures it and checks it against limits (step 3), **back office** matches the confirmations (step 4), **treasury** wires the margin and finances the purchase (step 5), **operations / logistics** turns the contract into a moving cargo \u2014 trucks, container, vessel, warehouse slot (step 6), back office cuts the shipping documents from what ops executed (step 7), and middle office marks the book and hands the desk head the P&L to sign (step 8).\n\nRead it as a future applicant, twice:\n\n- **As a map of jobs**: eight touches, five departments \u2014 and only one touch is the part outsiders call \u201ctrading\u201d. Every other step is a role you can be hired into next year, and each one sees the WHOLE trade.\n- **As a map of controls**: the person who does the deal never confirms it, never wires the cash, never marks their own book. Every handoff is the Barings lesson built into the furniture.`,
      visual: 'trade-workflow',
    },
    {
      id: 'physical-flow',
      title: 'The Physical Flow: Supplier to Customer',
      body: `Finally, zoom out of the building and put the trade back into the world: a **supplier** in Dak Lak, the **trading house** in the middle, a **warehouse** in Antwerp, a **customer** in Hamburg.\n\nThree flows run through that chain \u2014 and they do not run together:\n\n- **GOODS move forward, slowly** \u2014 truck, mill, container, vessel, warehouse, roastery: months.\n- **DOCUMENTS chase the goods** \u2014 purchase contract, weighbridge slip, bill of lading, quality and phyto certificates, invoice. No clean documents, no payment: the paper IS the trade.\n- **MONEY flows BACKWARD** \u2014 the desk pays the farmer in November, and is paid by the roaster against documents months later. The gap in between is financed, insured, and hedged.\n\nToggle the flows in the visual and notice which office owns each one \u2014 operations move the goods, back office owns the paper, treasury moves the cash \u2014 while the front office\u2019s hedge (Module 2\u2019s subject) protects the price the whole way. THAT is the machine you would be joining: not a trading screen, but a chain that turns a farmer\u2019s crop into a roaster\u2019s delivery \u2014 profitably, and on paper that banks will finance.`,
      visual: 'physical-flow',
    },
  ],
}

export default topic
