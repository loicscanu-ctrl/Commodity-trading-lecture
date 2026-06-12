import { topics as module1Topics } from './module-1'
import { topics as module2Topics } from './module-2'
import { topics as module3Topics } from './module-3'
import { topics as module4Topics } from './module-4'
import type { Module } from '@/types/content'

export const modules: Module[] = [
  {
    id: 1,
    title: 'Panorama & Vocabulary',
    level: 'Licence / M1',
    topics: module1Topics,
  },
  {
    id: 2,
    title: 'Operational Mechanics & Hedging',
    level: 'M1 / M2',
    topics: module2Topics,
  },
  {
    id: 3,
    title: 'Strategies, ESG & Data',
    level: 'M2 Spécialisé',
    topics: module3Topics,
  },
  {
    id: 4,
    title: 'Crude Oil: The Brent Complex & Hedging',
    level: 'Oil Track',
    topics: module4Topics,
  },
]
