// Real futures-contract spec cards, surfaced as clickable ticker chips in the
// Commodity Universe (hard vs soft) chart. The point of reading several is the
// CONTRAST: origin specs from "US-grown only" to ~28 origins to none at all;
// delivery from ex-warehouse warrants to FOB the buyer's vessel to a pipeline
// hub to pure cash settlement; quotes in ¢/lb, €/t, $/t, $/bbl and $/gal.
// Months & prices are indicative, anchored to the course's mid-November
// trading date; specs summarise the exchange rulebooks (verify before use).
export type ContractSpec = {
  key: string
  name: string
  symbol: string
  segment: string // donut-chart segment the chip lives under
  exchange: string
  size: string
  quote: string
  months: string[]
  curve: string
  origin: string
  quality: string
  delivery: string
  incoterm: string
  accent: string
}

export const CONTRACT_SPECS: ContractSpec[] = [
  // ── Energy · Petroleum Products ──────────────────────────────────────────
  {
    key: 'wti', name: 'WTI Crude', symbol: 'CL', segment: 'Petroleum Products',
    exchange: 'NYMEX (CME)', size: '1,000 bbl', quote: '$/bbl',
    months: ['Jan F · 74.60', 'Feb G · 74.30', 'Mar H · 74.05', 'Apr J · 73.85', 'May K · 73.70', 'Jun M · 73.55', 'Jul N · 73.45', 'Aug Q · 73.35', 'Sep U · 73.25', 'Oct V · 73.15', 'Nov X · 73.10', 'Dec Z · 73.05'],
    curve: 'backwardation — every month listed, all 12, trades under Brent',
    origin: 'US domestic light sweet crude streams, delivered at the Cushing hub.',
    quality: '37–42° API gravity, ≤ 0.42% sulphur — “light sweet” by specification.',
    delivery: 'One point only: Cushing, Oklahoma — pipeline or in-tank transfer at the inland storage hub.',
    incoterm: 'Physical — free-in-pipeline / in-tank transfer at Cushing (April 2020’s negative print was this mechanism at work).',
    accent: '#22d3ee',
  },
  {
    key: 'brent', name: 'Brent Crude', symbol: 'B', segment: 'Petroleum Products',
    exchange: 'ICE Futures Europe', size: '1,000 bbl', quote: '$/bbl',
    months: ['Jan F · 78.50', 'Feb G · 78.10', 'Mar H · 77.80', 'Apr J · 77.50', 'May K · 77.20', 'Jun M · 76.95', 'Jul N · 76.75', 'Aug Q · 76.55', 'Sep U · 76.40', 'Oct V · 76.25', 'Nov X · 76.15', 'Dec Z · 76.05'],
    curve: 'backwardation — every month listed, all 12, unlike the ags',
    origin: 'No deliverable origins at all — a light, sweet North Sea benchmark referencing the BFOET basket (see the oil track).',
    quality: 'None to tender — nothing is physically graded because nothing is physically delivered.',
    delivery: 'None. CASH-SETTLED against the ICE Brent Index at expiry; physical players convert via EFPs.',
    incoterm: 'n/a — pure financial settlement: the “delivery” is a cash difference.',
    accent: '#3b82f6',
  },
  {
    key: 'lsgo', name: 'Low Sulphur Gasoil', symbol: 'G', segment: 'Petroleum Products',
    exchange: 'ICE Futures Europe', size: '100 t', quote: '$/t — the only energy contract here quoted per tonne',
    months: ['Dec Z · 700.00', 'Jan F · 697.50', 'Feb G · 695.25', 'Mar H · 693.00', 'Apr J · 691.00', 'May K · 689.25', 'Jun M · 687.75', 'Jul N · 686.50', 'Aug Q · 685.50', 'Sep U · 684.75', 'Oct V · 684.25', 'Nov X · 684.00'],
    curve: 'backwardation — every month listed, all 12: Europe’s diesel benchmark',
    origin: 'No origin spec — any gasoil meeting the quality spec, wherever it was refined.',
    quality: 'Ultra-low sulphur: max 10 ppm, plus density and cold-flow limits — the EN 590-compatible diesel barrel.',
    delivery: 'The ARA hub (Amsterdam–Rotterdam–Antwerp): barge, coaster or in-tank transfer.',
    incoterm: 'Physical — FOB ARA barge / in-tank transfer; most positions EFP out before tender.',
    accent: '#f43f5e',
  },
  {
    key: 'rbob', name: 'RBOB Gasoline', symbol: 'RB', segment: 'Petroleum Products',
    exchange: 'NYMEX (CME)', size: '42,000 US gal (1,000 bbl)', quote: '$/gal',
    months: ['Dec Z · 2.05', 'Jan F · 2.03', 'Feb G · 2.02', 'Mar H · 2.04', 'Apr J · 2.19 (summer spec)', 'May K · 2.21', 'Jun M · 2.22', 'Jul N · 2.20', 'Aug Q · 2.17', 'Sep U · 2.08', 'Oct V · 1.99 (winter spec)', 'Nov X · 1.98'],
    curve: 'all 12 months listed — watch the Apr step UP and the Oct step DOWN: the SUMMER-SPEC breaks, a seasonality no crude curve has',
    origin: 'No origin — any refinery blendstock meeting the New York Harbor specification.',
    quality: 'RBOB = Reformulated Blendstock for Oxygenate Blending (ethanol is blended in later); the vapour-pressure (RVP) spec switches between winter and summer grades — hence the April price step.',
    delivery: 'New York Harbor — barge or intra-facility transfer.',
    incoterm: 'Physical — FOB New York Harbor.',
    accent: '#c084fc',
  },
  // ── Agriculture · Crop Products & Forestry ───────────────────────────────
  {
    key: 'arabica', name: 'Arabica Coffee "C"', symbol: 'KC', segment: 'Crop Products & Forestry',
    exchange: 'ICE Futures US', size: '37,500 lb', quote: '¢/lb',
    months: ['Dec Z · 250.00', 'Mar H · 253.50', 'May K · 255.80', 'Jul N · 257.60', 'Sep U · 259.10'],
    curve: 'contango — the curve finances storage · only 5 delivery months a year (H K N U Z)',
    origin: '~20 licensed growths (Mexico, Guatemala, Honduras, Colombia, Kenya…). Colombia +2¢/lb premium, several growths at discounts; Brazilian naturals not deliverable.',
    quality: 'Washed arabica, exchange-graded on green defects and cup against the basis "C" grade.',
    delivery: 'Licensed warehouses in the US (NY area, New Orleans, Houston, Miami) and Europe (Antwerp, Hamburg/Bremen, Barcelona).',
    incoterm: 'Physical — in-store warehouse warrant (ex-warehouse).',
    accent: '#f59e0b',
  },
  {
    key: 'robusta', name: 'Robusta Coffee', symbol: 'RC', segment: 'Crop Products & Forestry',
    exchange: 'ICE Futures Europe', size: '10 t', quote: '$/t',
    months: ['Jan F · 4,800', 'Mar H · 4,760', 'May K · 4,720', 'Jul N · 4,690', 'Sep U · 4,665', 'Nov X · 4,645'],
    curve: 'backwardation — a tight market pays for coffee NOW (the course’s trading backdrop) · 6 delivery months a year (F H K N U X)',
    origin: 'Any origin — Vietnamese robusta, Brazilian conilon, Indonesian and West African coffee all tender against the same ladder.',
    quality: 'Graded Class 1–4 on defects and moisture against the exchange quality ladder — Class 1 at par, premiums and discounts fixed by the exchange, not negotiated.',
    delivery: 'ICE-licensed warehouses in Europe (Antwerp, Hamburg/Bremen, Le Havre, Rotterdam, Trieste…) and the US.',
    incoterm: 'Physical — ex-warehouse warrant. This is the contract every PTBF trade in this course fixes against.',
    accent: '#d97706',
  },
  {
    key: 'cotton', name: 'Cotton No. 2', symbol: 'CT', segment: 'Crop Products & Forestry',
    exchange: 'ICE Futures US', size: '50,000 lb (~100 bales)', quote: '¢/lb',
    months: ['Dec Z · 70.20', 'Mar H · 71.50', 'May K · 72.40', 'Jul N · 73.10', 'Oct V · 73.80'],
    curve: 'contango — storable, like coffee · 5 delivery months a year (H K N V Z)',
    origin: 'US-grown cotton ONLY — a single-origin contract: one country’s crop defines the world benchmark.',
    quality: 'Base grade Strict Low Middling (SLM), staple 1‑2/32″, every bale USDA-classed; fixed grade/staple differentials.',
    delivery: 'USDA-licensed warehouses at 5 US points: Galveston, Houston, New Orleans, Memphis, Greenville/Spartanburg.',
    incoterm: 'Physical — electronic warehouse receipt (in-warehouse, US).',
    accent: '#e2e8f0',
  },
  {
    key: 'sugar', name: 'Sugar No. 11', symbol: 'SB', segment: 'Crop Products & Forestry',
    exchange: 'ICE Futures US', size: '112,000 lb (50 long tons)', quote: '¢/lb',
    months: ['Mar H · 21.40', 'May K · 20.90', 'Jul N · 20.30', 'Oct V · 19.80', 'Mar+1 · 19.60'],
    curve: 'backwardation — the leanest calendar here: only 4 delivery months a year (H K N V)',
    origin: '~28 listed origins (Brazil, Thailand, Australia, India, Guatemala…) — the widest origin menu here.',
    quality: 'Raw centrifugal cane sugar, average 96° polarization.',
    delivery: 'No warehouses: a port in the country of origin — the BUYER charters the vessel and collects.',
    incoterm: 'Physical — FOB receiver’s vessel, stowed & trimmed, origin port. The only true FOB of the nine.',
    accent: '#34d399',
  },
  {
    key: 'wheat', name: 'Milling Wheat No. 2 ("blé MATIF")', symbol: 'EBM', segment: 'Crop Products & Forestry',
    exchange: 'Euronext Paris', size: '50 t', quote: '€/t — the only euro contract here',
    months: ['Dec Z · 228.50', 'Mar H · 232.00', 'May K · 234.75', 'Sep U · 219.25', 'Dec+1 · 223.00'],
    curve: '4 delivery months following the crop calendar (Z H K U) — carry within the crop year, then the NEW-CROP break at Sep',
    origin: 'EU-grown milling wheat — the benchmark every French farmer and cooperative hedges on.',
    quality: 'Milling wheat: min 76 kg/hl specific weight, max 15% moisture, capped broken/sprouted grains & impurities.',
    delivery: 'Approved silos in Rouen and Dunkirk (France) — the export ports of the French wheat belt.',
    incoterm: 'Physical — in-silo delivery (ex-silo warrant).',
    accent: '#8b5cf6',
  },
]

export const SPEC_ROWS: { label: string; get: (c: ContractSpec) => string | string[] }[] = [
  { label: 'Exchange', get: c => c.exchange },
  { label: 'Lot size', get: c => c.size },
  { label: 'Quotation', get: c => c.quote },
  { label: 'Typical year contracts structure', get: c => c.months },
  { label: 'Term structure', get: c => c.curve },
  { label: 'Origin spec', get: c => c.origin },
  { label: 'Quality spec', get: c => c.quality },
  { label: 'Delivery points', get: c => c.delivery },
  { label: 'Incoterm / settlement', get: c => c.incoterm },
]
