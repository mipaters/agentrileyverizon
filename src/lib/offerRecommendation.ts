import { offers } from '../data/offers'
import type { Prospect } from '../types'

export function recommendOffer(prospect: Prospect) {
  return offers.find(o => o.name === prospect.recommendedOffer) ?? offers[0]
}
