import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-value-chain-refining',
  title: 'The Value Chain & Refining',
  type: 'lecture',
  estimatedMinutes: 26,
  sections: [
    {
      id: 'value-chain',
      title: 'Upstream to Downstream',
      body: `Oil moves along a value chain from the ground to the consumer:\n\n**Upstream** — Exploration & Production\n↓ *(transport: tanker & pipeline · storage)*\n**Refining** — turning crude into a slate of products\n↓ *(transport & storage)*\n**Downstream** — Marketing & Distribution\n\nOut the far end comes the product slate — LPG, naphtha, gasoline, jet/kerosene, diesel, gas oil, fuel oil — each delivered to its consumer: petrochemical plants, cars, aircraft, trucks, power stations, homes and ships.`,
    },
    {
      id: 'distillation',
      title: 'Fractional Distillation',
      body: `Refining starts by **separating** crude in the distillation column. Crude is heated and rises up the tower; lighter fractions boil off higher and cooler, the heavy residue stays at the hot bottom. These are the **straight-run** cuts.`,
      visual: 'distillation-column',
    },
    {
      id: 'conversion',
      title: 'Treating, Converting, Blending',
      body: `Straight-run cuts are rarely the final product. Refineries then:\n\n- **Treat** — remove sulphur (desulphurisation / hydrotreating)\n- **Convert** — **cracking** breaks big molecules into smaller, more valuable ones using heat, pressure and catalysts: the **Fluid Catalytic Cracker (FCC)**, **Hydrocracker**, **Visbreaker** (thermal, no catalyst) and **Coker** (turns vacuum residue into light products)\n- **Modify** — **reforming** and **isomerisation** raise gasoline octane\n- **Combine** — **alkylation** builds larger molecules\n- **Blend** — mix components to hit an exact specification\n\nThe deeper a refinery's conversion kit, the more light product it can squeeze from a barrel — and the cheaper, heavier crude it can afford to run.`,
    },
    {
      id: 'refinery-types',
      title: 'Refinery Complexity Tiers',
      body: `Refineries come in four archetypes of increasing complexity. Each tier inherits the units below it and adds more conversion capability.`,
      visual: 'refinery-types',
    },
    {
      id: 'capacity-utilisation',
      title: 'Capacity, Throughput & Configuration',
      body: `Three numbers, never equal: **capacity** > **consumption** > **throughput**. Global refining capacity (~103 mb/d) runs ahead of what's actually processed; **utilisation** is the swing factor, and periods of overcapacity (the 1980s, and again today) compress margins.\n\nConfiguration follows **regional demand**: US refineries maximise **gasoline** (~41% of the barrel), Europe is **diesel**-heavy, and Asia makes the most **fuel oil**. Same barrel of crude, different product mix — because each region built its kit around what it sells.`,
    },
  ],
}

export default topic
