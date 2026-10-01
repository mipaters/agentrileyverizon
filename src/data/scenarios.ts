import type { DemoScenario } from '../types'

export const scenarios: DemoScenario[] = [
  { id: 'pilot', name: 'Controlled Pilot', purpose: 'Validate a bounded, email-only agentic motion with optional program-manager offer validation.', accountMultiplier: 1, responseRate: .041, qualificationRate: .42, closeRate: .18, monthlyAzure: 8420, agenticCoverage: 12000, campaigns: 2 },
  { id: 'initial', name: 'Initial Production', purpose: 'Operate agentic qualification and private-offer publication across multiple SMB segments.', accountMultiplier: 5, responseRate: .052, qualificationRate: .48, closeRate: .21, monthlyAzure: 24750, agenticCoverage: 60000, campaigns: 8 },
  { id: 'scaled', name: 'Scaled Production', purpose: 'Scale Riley-to-Beyond Now private offers across a broad SMB population.', accountMultiplier: 18, responseRate: .061, qualificationRate: .54, closeRate: .24, monthlyAzure: 68700, agenticCoverage: 216000, campaigns: 24 },
]
