import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '05-day-one-desk',
  title: 'A Day in the Life: First Day on the Desk',
  type: 'case-study',
  estimatedMinutes: 30,
  sections: [
    {
      id: 'day-one-brief',
      title: '06:30 — Junior Analyst, HCM Desk',
      body: `Everything in this module — margin and the clearing house, the order book, news lags and flash traps, contango and carry, the players, stocks-to-use, what "deliverable" really means — you are about to use **before lunch**.\n\nYou are the desk's new **junior analyst** in Ho Chi Minh City. You inherit a small *training book* (long or short a handful of lots — nothing that can hurt the firm, everything that can hurt your pride) and an inbox that fills up from 06:45.\n\nSeven emails will land. Each one looks like an ordinary desk question — a margin wire to confirm, a broker fill to explain, a rumour spiking the screen, a supplier asking an honest question. Each one is actually a Module 1 concept wearing work clothes:\n\n- get the **margin arithmetic** wrong and treasury wires the wrong amount;\n- misread the **order book** and you will dispute your own market order;\n- chase a **flash rumour** and the tape will teach you what "unconfirmed" means;\n- delete a **warehouse tariff email** as spam, and the afternoon\u2019s delivery question will find you unarmed;\n- and when long lots head into the **delivery period** — take delivery, roll, or close? — the answer is a *carry calculation*, not a coin flip: the contango, the storage rate, and the bank\u2019s 8% decide it.\n\n**How to play:** the whole inbox is readable from the start — open the emails in any order, take your time, and *do the arithmetic before you click*. Every reply prints its consequence immediately, in dollars. A clean day banks **+$2,000**; the record for a first day stands at considerably less.`,
    },
    {
      id: 'day-one-inbox',
      title: 'The Inbox — Run the Day',
      body: `Reply to all seven. The scoring is unforgiving in the same way the desk is: being *roughly* right with the wrong reasoning still costs.\n\nWhen you are done, compare with a neighbour: which email cost the room the most money — the arithmetic ones, or the judgment ones?`,
      visual: 'analyst-inbox',
    },
  ],
}

export default topic
