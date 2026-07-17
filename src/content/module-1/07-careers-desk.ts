import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '07-careers-desk',
  title: 'Careers: Front, Middle & Back Office',
  type: 'lecture',
  estimatedMinutes: 10,
  sections: [
    {
      id: 'three-offices',
      title: 'The Three Offices — and Where You Might Fit',
      body: `Everything so far has been about the market. This part is about **the building** — how a commodity trading house organises the people around a trade, and where a graduate actually enters it.\n\n**Front Office** — traders, originators, sales\n- Prices and executes trades, manages positions, engages with counterparties\n- **Owns the P&L**\n\n**Middle Office** — risk management, product control, compliance\n- Monitors positions against limits, validates the marks (mark-to-market), vets counterparty credit\n- **Owns the limits and the marks** — an independent check on the front office\n\n**Back Office** — operations, settlements, documentation\n- Confirms trades, wires margin, processes invoices, coordinates shipping documents, warehouse warrants and quality certificates\n- **Owns the trade actually happening** in the physical world\n\nTwo things to take away as a future applicant. First, the **classic career path runs through the back office**: operations → execution/logistics → junior trader — the desk trusts people who know how cargo really moves. Second, the separation of the three offices is not bureaucracy, it is a **control**: when one person sits on both sides of the wall (Barings, 1995), operational losses stay hidden until they are fatal. Every interview in this industry will assume you understand this structure.`,
      visual: 'desk-organisation',
    },
  ],
}

export default topic
