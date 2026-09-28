import type { Prospect, Qualification, RouteType } from '../types'
import { calculateQualificationScore } from './qualificationScoring'

export function determineRoute(p: Prospect, q: Qualification): RouteType | 'Blocked' {
  if (!q.consent || p.consent !== 'Confirmed') return 'Blocked'
  if (q.existingPartner || p.partner !== 'No preferred partner recorded') return 'No sale'
  return calculateQualificationScore(q) >= 72 && q.digitalReadiness >= 70 && q.complexity < 65 ? 'Marketplace' : 'No sale'
}
