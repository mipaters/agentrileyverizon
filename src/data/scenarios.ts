import type { DemoScenario } from '../types'

export const scenarios: DemoScenario[] = [
  { id: 'pilot', name: 'Controlled Pilot', purpose: 'Validate a bounded, email-only motion with explicit human approvals.', accountMultiplier: 1, responseRate: .041, qualificationRate: .42, closeRate: .18, monthlyAzure: 8420, sellerHours: 3.5, campaigns: 2 },
  { id: 'initial', name: 'Initial Production', purpose: 'Operate across multiple segments with production telemetry and integrations.', accountMultiplier: 5, responseRate: .052, qualificationRate: .48, closeRate: .21, monthlyAzure: 24750, sellerHours: 3.8, campaigns: 8 },
  { id: 'scaled', name: 'Scaled Production', purpose: 'Extend Riley across broad SMB populations with advanced controls.', accountMultiplier: 18, responseRate: .061, qualificationRate: .54, closeRate: .24, monthlyAzure: 68700, sellerHours: 4.1, campaigns: 24 },
]
