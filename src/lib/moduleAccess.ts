// Per-module access codes — the spoiler gate. The site-wide class password
// (middleware + CLASS_PASSWORD) still guards the whole app; these codes
// additionally lock EACH MODULE until the instructor reveals its code in
// class, so sharing the link early spoils nothing.
//
// Override any code without a deploy by setting MODULE_1_CODE … MODULE_5_CODE
// in the environment; otherwise the defaults below apply (one city per
// module — announce it at the start of the session):
//   1 · saigon   — Panorama & Vocabulary (the HCM desk)
//   2 · antwerp  — Operational Mechanics & Hedging (the warehouse port)
//   3 · geneva   — Strategies, ESG & Data (the trading houses)
//   4 · houston  — Crude Oil: Market Analysis & Refining
//   5 · shetland — Crude Oil: The Brent Complex (Sullom Voe terminal)
//
// This module is imported ONLY by server code (server action + server
// components), so the codes never reach the client bundle.
const DEFAULT_CODES: Record<number, string> = {
  1: 'saigon',
  2: 'antwerp',
  3: 'geneva',
  4: 'houston',
  5: 'shetland',
}

export function moduleCode(moduleId: number): string {
  return process.env[`MODULE_${moduleId}_CODE`] ?? DEFAULT_CODES[moduleId] ?? 'instructor'
}

/** Case-insensitive, whitespace-tolerant check of a submitted code. */
export function checkModuleCode(moduleId: number, code: string): boolean {
  return code.trim().toLowerCase() === moduleCode(moduleId).toLowerCase()
}

export const moduleCookieName = (moduleId: number) => `module-${moduleId}-unlocked`
