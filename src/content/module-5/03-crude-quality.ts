import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-crude-quality',
  title: 'Crude Quality, Grades & Margin',
  type: 'lecture',
  estimatedMinutes: 24,
  sections: [
    {
      id: 'two-measures',
      title: 'The Two Measures That Matter',
      body: `Every crude is summarised by two numbers:\n\n**API gravity — light vs heavy** (how dense it is):\n\n| Class | API | Example |\n|---|---|---|\n| Very light | > 44 | Arun 54 |\n| Light | 34–44 | Brent 38 |\n| Medium | 23–34 | Kuwait 31 |\n| Heavy | < 23 | Maya 22 |\n\n**Sulphur — sweet vs sour** (% weight):\n\n| Class | Sulphur | Example |\n|---|---|---|\n| Sweet | < 0.5% | Brent 0.23 |\n| Medium | 0.5–1.5% | Oman 0.94 |\n| Sour | > 1.5% | Dubai 1.68 |\n\nSulphur causes pollution and corrosion and releases less energy on combustion — so it must be removed, which costs money.`,
    },
    {
      id: 'quality-scatter',
      title: 'The Quality Matrix',
      body: `Plot every grade on **API gravity** (light → right) against **sulphur** (sour → up) and the price logic of the whole crude market appears. Light, sweet crudes (bottom-right) yield more high-value light products and trade at a **premium**; heavy, sour crudes (top-left) make more fuel oil, need expensive conversion kit, and trade at a **discount**. Click any grade to inspect it.`,
      visual: 'crude-quality-scatter',
    },
    {
      id: 'yields',
      title: 'Quality Drives the Yield',
      body: `Simple-distillation yields show why quality matters, % weight:\n\n| Cut | WTI | Brent | Arab Light |\n|---|---|---|---|\n| Naphtha | 26 | 23 | 17 |\n| Kerosene | 14 | 12 | 12 |\n| Gas oil | 23 | 22 | 17 |\n| Fuel oil | 35 | 41 | 53 |\n| Fuel & loss | 2 | 2 | 1 |\n\nLighter **WTI** gives the most light ends; heavy **Arab Light** drops **53%** straight to fuel oil on simple distillation — which is exactly why it needs a complex, coking refinery to be worth running.`,
    },
    {
      id: 'gpw',
      title: 'Gross Product Worth & Refinery Margin',
      body: `To value a crude to a refiner, compute its **Gross Product Worth (GPW)** — the sum of each yield × the product's price — then subtract the crude cost:\n\n> **GPW = Σ (yield % × product price)**  ·  **Margin = GPW − crude cost**\n\nWith North Sea yields and the prices shown, GPW works out to **\\$465.78/MT**. Divide by **7.55** bbl/MT to get **\\$61.69/bbl**; against a crude at **\\$59.16**, the refining margin is **\\$2.53/bbl**. Move the product prices and crude cost to see the margin breathe — when it turns negative, refinery runs get cut.`,
      visual: 'gpw-calculator',
    },
  ],
}

export default topic
