export type ScenarioId = 'pilot' | 'initial' | 'scaled'
export type RouteType = 'Marketplace' | 'No sale'
export type RileyStatus = 'Prioritized' | 'Ready' | 'Qualifying' | 'Qualified' | 'Nurture' | 'Blocked'

export interface Prospect {
  id: string
  company: string
  state: string
  metro: string
  industry: string
  employees: number
  revenueBand: string
  verizonCustomer: boolean
  verizonServices: string[]
  microsoftProducts: string[]
  renewalMonths: number
  cluster: 'Act Now' | 'Evaluate' | 'Nurture' | 'Educate'
  fit: number
  intent: number
  gap: number
  relationship: number
  contactability: 'Verified' | 'Limited' | 'Unknown'
  consent: 'Confirmed' | 'Pending' | 'Withdrawn'
  lastEngagementDays: number
  decisionMaker: string
  partner: string
  cspOpportunity: number
  verizonOpportunity: number
  recommendedOffer: string
  route: RouteType
  status: RileyStatus
  riskFlags: string[]
  confidence: number
  sources: string[]
}

export interface DemoScenario {
  id: ScenarioId
  name: string
  purpose: string
  accountMultiplier: number
  responseRate: number
  qualificationRate: number
  closeRate: number
  monthlyAzure: number
  agenticCoverage: number
  campaigns: number
}

export interface OfferBundle {
  id: string
  name: string
  description: string
  products: string[]
  verizonServices: string[]
  target: string
  route: RouteType
  monthlyPrice: number
  setupCost: number
  microsoftAcv: number
  verizonAcv: number
  margin: number
}

export interface ScoreWeights {
  fit: number
  intent: number
  gap: number
  relationship: number
  renewal: number
  contactability: number
  consent: number
}

export interface Qualification {
  need: number
  authority: number
  budget: number
  timing: number
  digitalReadiness: number
  complexity: number
  consent: boolean
  existingPartner: boolean
}

export interface DemoState {
  scenarioId: ScenarioId
  selectedProspectId: string
  currency: 'USD' | 'CAD'
  workflowStep: number
  outreachStarted: boolean
  privateOfferPublished: boolean
  paused: boolean
  optedOut: boolean
  conversationPath: number
  conversationTurn: number
  conversationChoice: number
  bantResponses: number[]
  tourStep: number
  scoreWeights: ScoreWeights
  qualification: Qualification
}
