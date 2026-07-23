import { topics as module1Topics } from './module-1'
import { topics as module2Topics } from './module-2'
import { topics as module3Topics } from './module-3'
import { topics as module4Topics } from './module-4'
import { topics as module5Topics } from './module-5'
import type { Module } from '@/types/content'

export const modules: Module[] = [
  {
    id: 1,
    title: 'Panorama & Vocabulary',
    objectives: [
      'Map the commodity universe — hard vs soft markets, the players (farmers, trade houses, roasters) and how a parcel travels from Dak Lak to the cup',
      'Read a futures contract like a professional: standardisation, margin & clearing, swaps, and the EFP that links paper to physical',
      'Explain market structure — contango vs backwardation, the roll, and what the curve says about stocks',
      'Trade your first futures screen: buy and sell London Robusta against a live news tape — and feel the risk that hedgers pay to shed',
    ],
    topics: module1Topics,
  },
  {
    id: 2,
    title: 'Operational Mechanics & Hedging',
    objectives: [
      'Run the two PTBF trades — split any physical deal into a futures leg and a differential leg — and manage the basis: quality, freight, tenderable parity',
      'Measure any book’s exposure (flat, basis, spread) and build the hedge that matches it',
      'Follow a cargo from FOB origin to CIF Antwerp: vessels, chartering, demurrage and every cost between quay and warehouse',
      'Trade the live floor: run a full book through news, margin calls and customer tenders — the course’s practical exam',
    ],
    topics: module2Topics,
  },
  {
    id: 3,
    title: 'Strategies, ESG & Data',
    objectives: [
      'Use options on futures: calls, puts, premiums — and when optionality beats a straight hedge',
      'Work the basis with numbers: quote, compare and arbitrate differentials with the calculator',
      'Assess ESG & EUDR: what the regulatory revolution does to compliant vs non-compliant coffee — and to its price',
      'Model supply & demand like an analyst, from cherry on the tree to the terminal screen',
    ],
    topics: module3Topics,
  },
  {
    id: 4,
    title: 'Crude Oil: Market Analysis & Refining',
    objectives: [
      'Analyse oil supply, demand and price: OPEC+, shale, inventories — the data that moves the barrel',
      'Follow the value chain from wellhead to pump: refining, cracks and product slates',
      'Grade a crude — API, sulphur, yields — and explain why quality sets its price against the benchmarks',
      'Read the market’s information flow and its technicals: reports, curves and positioning',
    ],
    topics: module5Topics,
  },
  {
    id: 5,
    title: 'Crude Oil: The Brent Complex & Hedging',
    objectives: [
      'Identify an oil book’s exposures and apply the logic of hedging to each one',
      'Execute the simplest hedge — futures: sizing, rolling and the basis risk that remains',
      'Navigate the Brent complex: Dated, Cash BFOET, futures and how the world’s benchmark is actually built',
      'Use swaps and CFDs to hedge the gaps futures leave open',
    ],
    topics: module4Topics,
  },
]
