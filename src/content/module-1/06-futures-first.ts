import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '06-futures-first',
  title: 'Trade the News: Your First Futures Screen',
  type: 'case-study',
  estimatedMinutes: 25,
  sections: [
    {
      id: 'futures-first-brief',
      title: 'Before Hedging: Feel the Market Move',
      body: `You now know what a futures contract *is*. Before learning what professionals **do** with one (that is Module 2), spend a session learning what a futures market **feels** like.\n\nThe screen below is deliberately minimal: **London Robusta futures, and two buttons — Buy and Sell.** No physical coffee, no differentials, no freight. You are a speculator with a clean P&L, and your only job is to read the news faster and better than the room.\n\nPress **▶ Live market** and a 45-month tape plays — **one month every 20 seconds**, identical for every student. The tape runs its **own scenario** — regular, realistic stories drawn from this module (stocks-to-use, fund positioning, certified stocks, the dollar, margin rules, crop calendars) — and it is NOT the Module 2 floor’s script: nothing learnt by heart here will replay there. What to watch for:\n\n- **News moves the price — with a lag.** Each story breaks, the tape keeps breathing for ~3 seconds, then drifts to its new level over up to 35 seconds. The fast readers position *during* the lag.\n- **The market never sits still.** Between stories the price keeps breathing — minor news, fund flows, noise. Distinguishing *signal* from *noise* is the whole job.\n- **Beware the FLASH events.** A few times per session the tape spikes or collapses for seconds and **fully reverts** — a fat-finger order walking the book, an unverified export-ban tweet, a stop-run cascade, a recycled frost headline. They exist to punish positions taken without thinking.\n- **Your P&L marks to market every second.** Long into a rally it swells; long into a collapse it bleeds. Average in with clips, cut with the opposite button, and notice how it *feels* — that feeling is what Module 2's hedgers are paying to get rid of.\n\n**Class format:** everyone starts together, trades the same tape, and compares P&L at the close. Then ask the uncomfortable question: *was your profit skill, or luck?* You read the same news as everyone — the winners were mostly better positioned for randomness. That discomfort is the point: **module 2 shows how physical traders turn this casino into a business** — by hedging, and trading the differential instead of the flat price.`,
    },
    {
      id: 'futures-sim',
      title: 'The Futures Screen — Live Against the News',
      body: `Your desk: the live chart with its news flags, the news feed, the two buttons, and a running P&L. In sandbox mode (before pressing Live) you can slide the price yourself to see how the position maths works — long × price up = profit, short × price up = loss, and the average entry moves as you add clips.\n\nSuggested drills, in order:\n\n1. **One trade, one story.** Wait for a clearly bullish or bearish headline, take one position of 10 lots, hold it to the next story, close. Did the market do what the news said?\n2. **Scale in.** Build the same view in 3 clips instead of 1 — watch your average entry, and compare it with the one-shot version.\n3. **Trade a flash.** When the ⚡ siren fires, decide fast: is this real news or a reverting trap? (Hint: flashes revert. Real news drifts and *holds*.)\n4. **Go the other way.** Spend one stretch only selling short. Most beginners have a long bias; the screen does not care.`,
      visual: 'futures-ticker',
    },
  ],
}

export default topic
