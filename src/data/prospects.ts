import type { Prospect } from '../types'

const names = [
  ['Northstar Fabrication', 'OH', 'Cleveland', 'Manufacturing'],
  ['Juniper Ridge Dental', 'CO', 'Denver', 'Healthcare'],
  ['Copperline Logistics', 'TX', 'Dallas', 'Transportation'],
  ['Blue Harbor Legal', 'MA', 'Boston', 'Professional services'],
  ['Summit Grove Markets', 'WA', 'Seattle', 'Retail'],
  ['Prairie Signal Energy', 'OK', 'Tulsa', 'Energy services'],
  ['Redwood Fieldworks', 'CA', 'Sacramento', 'Construction'],
  ['Lighthouse Learning Lab', 'NC', 'Raleigh', 'Education'],
  ['Evergreen Home Health', 'OR', 'Portland', 'Healthcare'],
  ['Atlas Peak Advisors', 'NY', 'Albany', 'Financial services'],
  ['Silver Birch Foods', 'MN', 'Minneapolis', 'Food services'],
  ['Cobalt Creek Design', 'GA', 'Atlanta', 'Professional services'],
  ['Mesa Vista Hospitality', 'AZ', 'Phoenix', 'Hospitality'],
  ['Ironwood Auto Group', 'MI', 'Detroit', 'Automotive'],
  ['Clearwater Marine Supply', 'FL', 'Tampa', 'Distribution'],
  ['Golden Elm Property Co.', 'PA', 'Pittsburgh', 'Real estate'],
] as const

const offers = [
  'Verizon Secure Productivity Starter',
  'Verizon Modern Work Growth',
  'Verizon AI-Ready Business',
  'Verizon Teams Phone and Connectivity',
  'Verizon Secure Hybrid Workforce',
  'Verizon Connected Copilot Business',
  'Verizon Marketplace Digital Starter',
  'Verizon Business Complete',
]

export const prospects: Prospect[] = names.map(([company, state, metro, industry], i) => {
  const withdrawn = i === 13
  const partner = i % 6 === 3
  const fit = 58 + ((i * 7) % 39)
  const intent = 52 + ((i * 11) % 45)
  const gap = 55 + ((i * 13) % 42)
  const relationship = 45 + ((i * 17) % 50)
  return {
    id: `VB-${String(i + 1).padStart(4, '0')}`,
    company,
    state,
    metro,
    industry,
    employees: 32 + i * 27,
    revenueBand: i < 5 ? '$5M-$15M' : i < 11 ? '$15M-$40M' : '$40M-$75M',
    verizonCustomer: i % 4 !== 2,
    verizonServices: i % 3 === 0 ? ['Business wireless', 'Business Internet'] : i % 3 === 1 ? ['Business wireless'] : [],
    microsoftProducts: i % 3 === 0 ? ['Microsoft 365 Business Basic'] : i % 3 === 1 ? ['Microsoft 365 Business Standard'] : ['Microsoft 365 Apps'],
    renewalMonths: 1 + (i % 12),
    cluster: i < 4 ? 'Act Now' : i < 9 ? 'Evaluate' : i < 13 ? 'Nurture' : 'Educate',
    fit,
    intent,
    gap,
    relationship,
    contactability: i % 5 === 4 ? 'Limited' : 'Verified',
    consent: withdrawn ? 'Withdrawn' : i % 5 === 2 ? 'Pending' : 'Confirmed',
    lastEngagementDays: 8 + i * 17,
    decisionMaker: i % 2 ? 'Chief Operating Officer' : 'IT Director',
    partner: partner ? 'Northwind Technology Partners' : 'No preferred partner recorded',
    cspOpportunity: 18000 + i * 4200,
    verizonOpportunity: 7200 + i * 1750,
    recommendedOffer: offers[i % offers.length],
    route: withdrawn || partner ? 'No sale' : 'Marketplace',
    status: withdrawn ? 'Blocked' : i < 5 ? 'Ready' : i < 10 ? 'Prioritized' : 'Nurture',
    riskFlags: withdrawn ? ['Consent withdrawn'] : partner ? ['Existing partner preference'] : i % 5 === 2 ? ['Consent validation required'] : [],
    confidence: 72 + (i % 6) * 4,
    sources: ['Synthetic CRM profile', 'Synthetic licensing footprint', 'CloudAscent-style propensity', 'Synthetic engagement history'],
  }
})
