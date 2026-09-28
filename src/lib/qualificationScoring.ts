import type { Qualification } from '../types'

export function calculateQualificationScore(q: Qualification) {
  if (!q.consent) return 0
  return Math.round(q.need*.28 + q.authority*.18 + q.budget*.14 + q.timing*.18 + q.digitalReadiness*.22)
}

export function determineDisposition(q: Qualification) {
  const score = calculateQualificationScore(q)
  if (!q.consent) return 'Consent withdrawn'
  if (q.existingPartner) return 'Close as no sale — existing partner retained'
  if (q.complexity > 65) return 'Close as no sale — outside digital offer policy'
  if (score >= 72 && q.digitalReadiness >= 70) return 'Route to Verizon Business Marketplace'
  if (score >= 65) return 'Continue agentic qualification'
  return score >= 45 ? 'Continue agentic qualification' : 'Close as no sale'
}
