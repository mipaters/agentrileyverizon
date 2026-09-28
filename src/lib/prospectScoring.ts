import type { Prospect, ScoreWeights } from '../types'

export const defaultWeights: ScoreWeights = { fit: 22, intent: 24, gap: 18, relationship: 12, renewal: 10, contactability: 7, consent: 7 }

export function calculateProspectScore(p: Prospect, w: ScoreWeights = defaultWeights) {
  const renewal = Math.max(0, 100 - p.renewalMonths * 7)
  const contactability = p.contactability === 'Verified' ? 100 : p.contactability === 'Limited' ? 55 : 15
  const consent = p.consent === 'Confirmed' ? 100 : p.consent === 'Pending' ? 35 : 0
  const total = Object.values(w).reduce((a, b) => a + b, 0) || 1
  return Math.round((p.fit*w.fit + p.intent*w.intent + p.gap*w.gap + p.relationship*w.relationship + renewal*w.renewal + contactability*w.contactability + consent*w.consent) / total)
}

export function rankProspects(items: Prospect[], w: ScoreWeights) {
  return [...items].sort((a, b) => calculateProspectScore(b, w) - calculateProspectScore(a, w))
}
