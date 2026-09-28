import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bot, Check, CheckCircle2, Circle, Clock3, DollarSign, ExternalLink, FileCheck2, Filter, Mail, MessageSquare, Pause, Play, Search, Send, ShieldCheck, ShoppingCart, Sparkles, Store, Target, UserCheck, Users, XCircle } from 'lucide-react'
import { customerZero } from '../data/customerZero'
import { governanceControls, raiTests } from '../data/governance'
import { microsoftProducts, offers, verizonProducts } from '../data/offers'
import { prospects } from '../data/prospects'
import { scenarios } from '../data/scenarios'
import { azureCosts, implementationPhases } from '../data/tcoData'
import { CostChart, FunnelChart, RouteChart, SensitivityChart, TrendChart } from '../components/Charts'
import { Badge, Button, Card, Disclaimer, Input, Journey, Metric, Notice, PageHeader, Progress, SectionTitle, Select } from '../components/UI'
import { calculateFinOpsAlerts } from '../lib/finOps'
import { calculateFunnel } from '../lib/funnelCalculations'
import { recommendOffer } from '../lib/offerRecommendation'
import { calculateProspectScore, rankProspects } from '../lib/prospectScoring'
import { calculateQualificationScore, determineDisposition } from '../lib/qualificationScoring'
import { determineRoute } from '../lib/routingRules'
import { formatCurrency } from '../lib/currency'
import { calculateBusinessCase } from '../lib/tcoCalculations'
import { useDemo } from '../state/DemoContext'
import type { Qualification, ScoreWeights } from '../types'

const conclusion = 'The Agent Riley business case is not simply whether an AI conversation is inexpensive. It is whether Verizon can create qualified Microsoft CSP and Verizon Business pipeline, marketplace transactions, and recurring gross margin at a lower marginal cost than expanding its existing demand-generation and inside-sales model.'
const getScenario = (id: string) => scenarios.find(s => s.id === id) ?? scenarios[0]

export function ExecutiveOverview() {
  const { state } = useDemo()
  const scenario = getScenario(state.scenarioId)
  const funnel = calculateFunnel(scenario)
  const business = calculateBusinessCase(scenario)
  const accounts = funnel[0].value
  const qualified = funnel.find(x => x.name === 'Qualified')?.value ?? 0
  const closed = funnel.at(-1)?.value ?? 0
  return <>
    <PageHeader eyebrow="AI-powered digital inside-sales engine" title="Turn Verizon’s SMB reach into measurable Microsoft CSP growth">
      <p>Agent Riley uses Verizon customer intelligence, Microsoft propensity signals, compliant digital engagement, transparent qualification, and human-controlled routing to create a repeatable lead-to-order journey for Verizon Business.</p>
    </PageHeader>
    <Journey/>
    <div className="metric-grid">
      <Metric label="SMB accounts analyzed" value={accounts.toLocaleString()} note={scenario.name}/>
      <Metric label="High-propensity accounts" value={funnel[1].value.toLocaleString()} note="Transparent weighted score"/>
      <Metric label="Contactable prospects" value={funnel[2].value.toLocaleString()} note="Synthetic evidence"/>
      <Metric label="Response rate" value={`${(scenario.responseRate*100).toFixed(1)}%`} tone="positive"/>
      <Metric label="Qualified opportunities" value={qualified.toLocaleString()} tone="positive"/>
      <Metric label="Estimated qualified pipeline" value={formatCurrency(qualified*69000, state.currency)} tone="positive"/>
      <Metric label="Microsoft CSP bookings" value={formatCurrency(business.bookings*.72, state.currency)} tone="positive"/>
      <Metric label="Verizon services bookings" value={formatCurrency(business.bookings*.28, state.currency)} tone="positive"/>
      <Metric label="Microsoft 365 seats" value={(closed*74).toLocaleString()}/>
      <Metric label="Copilot seats" value={(closed*26).toLocaleString()}/>
      <Metric label="Cost per qualified opportunity" value={formatCurrency(business.costPerQualified, state.currency)} tone="azure"/>
      <Metric label="Azure cost per completed sale" value={formatCurrency(business.costPerSale, state.currency)} tone="azure"/>
      <Metric label="Seller hours returned" value={Math.round(qualified*scenario.sellerHours).toLocaleString()} note="Estimated capacity"/>
      <Metric label="Projected 3-year net value" value="Pending scope" note="Enter implementation investment in TCO" tone="warning"/>
    </div>
    <div className="two-col">
      <Card className="feature-panel dark">
        <Badge tone="success">Growth without proportional seller expansion</Badge>
        <h2>Let sellers focus on the moments that need human judgment.</h2>
        <p>Riley automates repetitive prospect research, outreach, early qualification, offer matching, and opportunity preparation. Verizon sellers retain control of exceptions, complex solution design, pricing, negotiation, and closing.</p>
        <div className="feature-stats"><div><strong>{Math.round(qualified*scenario.sellerHours).toLocaleString()}</strong><span>seller hours returned</span></div><div><strong>{closed.toLocaleString()}</strong><span>completed sales</span></div></div>
      </Card>
      <Card><SectionTitle title="Lead-to-order funnel" copy="Volumes respond to the selected operating scenario."/><FunnelChart data={funnel}/></Card>
    </div>
    <div className="two-col">
      <Card><SectionTitle title="Route mix" copy="Human-approved destinations for qualified opportunities."/><RouteChart multiplier={scenario.accountMultiplier}/></Card>
      <Card><SectionTitle title="Pipeline growth vs. Azure run rate" copy="Pipeline expands faster than platform operating cost in the synthetic scenario."/><TrendChart scaled={scenario.accountMultiplier}/></Card>
    </div>
    <Card className="executive-conclusion"><Sparkles/><div><h2>Executive conclusion</h2><p>{conclusion}</p><p><b>Evaluate Riley using cost per qualified opportunity, cost per completed sale, attributable gross margin, marketplace conversion, seller capacity returned, and SMB coverage created without proportional seller growth.</b></p></div></Card>
    <Disclaimer/>
  </>
}

export function ProspectIntelligence() {
  const { state, update } = useDemo()
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')
  const [cluster, setCluster] = useState('All')
  const ranked = useMemo(() => rankProspects(prospects, state.scoreWeights).filter(p =>
    (!search || `${p.company} ${p.state} ${p.industry}`.toLowerCase().includes(search.toLowerCase())) &&
    (industry === 'All' || p.industry === industry) && (cluster === 'All' || p.cluster === cluster)
  ), [search, industry, cluster, state.scoreWeights])
  const selected = prospects.find(p => p.id === state.selectedProspectId) ?? ranked[0]
  const score = calculateProspectScore(selected, state.scoreWeights)
  const updateWeight = (key: keyof ScoreWeights, value: number) => update({ scoreWeights: { ...state.scoreWeights, [key]: value } })
  return <>
    <PageHeader eyebrow="Signal-driven targeting" title="Prospect Intelligence"><p>Prioritize fictional SMB accounts using explainable, editable scoring. Propensity is a signal—not a qualified lead.</p></PageHeader>
    <Notice tone="warning"><b>Propensity is not the same as a qualified lead.</b> Riley must still confirm contactability, consent, business need, product fit, timing, buyer involvement, partner relationships, and buying readiness.</Notice>
    <Card className="toolbar">
      <label className="search"><Search size={18}/><input aria-label="Search prospects" placeholder="Search account, state, or industry" value={search} onChange={e => setSearch(e.target.value)}/></label>
      <Select label="Industry" value={industry} onChange={e => setIndustry(e.target.value)}><option>All</option>{[...new Set(prospects.map(p => p.industry))].map(x => <option key={x}>{x}</option>)}</Select>
      <Select label="Propensity" value={cluster} onChange={e => setCluster(e.target.value)}><option>All</option><option>Act Now</option><option>Evaluate</option><option>Nurture</option><option>Educate</option></Select>
      <div className="toolbar-count"><Filter size={16}/>{ranked.length} accounts</div>
    </Card>
    <div className="prospect-layout">
      <Card className="table-card"><div className="table-wrap"><table><thead><tr><th>Account</th><th>Industry</th><th>Employees</th><th>Propensity</th><th>Score</th><th>Consent</th><th>Opportunity</th><th>Route</th></tr></thead><tbody>{ranked.map(p => <tr key={p.id} className={p.id === selected.id ? 'selected' : ''} onClick={() => update({ selectedProspectId: p.id })}><td><b>{p.company}</b><small>{p.metro}, {p.state}</small></td><td>{p.industry}</td><td>{p.employees}</td><td><Badge tone={p.cluster === 'Act Now' ? 'success' : p.cluster === 'Evaluate' ? 'azure' : 'neutral'}>{p.cluster}</Badge></td><td><b>{calculateProspectScore(p, state.scoreWeights)}</b><Progress value={calculateProspectScore(p, state.scoreWeights)} tone="red"/></td><td><Badge tone={p.consent === 'Confirmed' ? 'success' : p.consent === 'Withdrawn' ? 'danger' : 'warning'}>{p.consent}</Badge></td><td>{formatCurrency(p.cspOpportunity+p.verizonOpportunity, state.currency)}</td><td>{p.route}</td></tr>)}</tbody></table></div></Card>
      <div className="detail-stack">
        <Card className="prospect-detail"><div className="detail-head"><div><Badge tone="azure">{selected.id}</Badge><h2>{selected.company}</h2><p>{selected.industry} · {selected.employees} employees · {selected.revenueBand}</p></div><div className="score-ring"><strong>{score}</strong><span>priority score</span></div></div>
          <div className="detail-grid"><div><span>Verizon relationship</span><b>{selected.verizonCustomer ? selected.verizonServices.join(', ') : 'Net-new relationship'}</b></div><div><span>Microsoft footprint</span><b>{selected.microsoftProducts.join(', ')}</b></div><div><span>Decision maker</span><b>{selected.decisionMaker}</b></div><div><span>Renewal window</span><b>{selected.renewalMonths} months</b></div><div><span>Existing partner</span><b>{selected.partner}</b></div><div><span>Last activity</span><b>{selected.lastEngagementDays} days ago</b></div></div>
          <SectionTitle title="Recommended next action"/><div className="recommendation"><Target/><div><b>{selected.recommendedOffer}</b><p>Route to {selected.route.toLowerCase()} after consent and qualification validation.</p></div></div>
          <div className="chip-row">{selected.sources.map(x => <Badge key={x}>{x}</Badge>)}</div>
          {selected.riskFlags.length > 0 && <Notice tone="warning">{selected.riskFlags.join(' · ')}</Notice>}
          <Button onClick={() => location.href = '/workspace'}>Open in Agent Riley Workspace <ArrowRight size={16}/></Button>
        </Card>
        <Card><SectionTitle title="Editable ranking weights" copy="Ranking recalculates immediately; weights are normalized."/><div className="weight-list">{Object.entries(state.scoreWeights).map(([key, value]) => <label key={key}><span>{key.replace(/^\w/, c => c.toUpperCase())}<b>{value}</b></span><input type="range" min="0" max="40" value={value} onChange={e => updateWeight(key as keyof ScoreWeights, Number(e.target.value))}/></label>)}</div></Card>
      </div>
    </div>
  </>
}

const workflowSteps = [
  ['Prospect selected','Agent Riley'],['Synthetic signals retrieved','Prospect Intelligence Skill'],['Account identity matched','Prospect Intelligence Skill'],['Contactability checked','Consent and Policy Skill'],['Consent policy checked','Consent and Policy Skill'],['Existing partner checked','Consent and Policy Skill'],['Account researched','Account Research Skill'],['Product gaps identified','Account Research Skill'],['Outreach drafted','Agent Riley'],['Initial outreach approved','Agent Riley'],['Outreach sent in simulation','Agent Riley'],['Customer response received','Agent Riley'],['Qualification conversation started','Qualification Skill'],['Need confirmed','Qualification Skill'],['Authority assessed','Qualification Skill'],['Budget range captured','Qualification Skill'],['Timing captured','Qualification Skill'],['Security requirements captured','Qualification Skill'],['Data-residency concerns captured','Qualification Skill'],['Digital purchase readiness captured','Qualification Skill'],['Private offer recommendation produced','Offer Recommendation Skill'],['Recommendation validated','Offer Recommendation Skill'],['Private offer approval requested','Agent Riley'],['Private marketplace offer created','Marketplace Routing Skill'],['Marketplace or no-sale outcome selected','Agent Riley'],['Outcome telemetry recorded','Telemetry and FinOps Skill'],['Azure consumption recorded','Telemetry and FinOps Skill'],['FinOps thresholds evaluated','Telemetry and FinOps Skill'],
]

const pathReplies = [
  'Ready for a digital private offer', 'Interested and needs digital information', 'Already works with a Microsoft partner', 'Requirements exceed the digital offer', 'Not interested / withdraw consent',
]

const conversationSequences = [
  [
    ['customer', 'We are ready to evaluate a digital private offer. We need a secure Microsoft 365 plan for about 120 people before our renewal.'],
    ['riley', 'To make sure I recommend only relevant offers, what business outcome is most important for your team?'],
    ['customer', 'We need to standardize secure productivity and collaboration for our growing workforce.'],
    ['riley', 'Who is involved in evaluating and approving this purchase?'],
    ['customer', 'I lead the recommendation and our COO provides final approval.'],
    ['riley', 'Has a budget range been established for licensing, connectivity, and standard deployment services?'],
    ['customer', 'Yes. Funding is allocated, subject to confirming the final configuration and value.'],
    ['riley', 'When do you need the solution selected and available to users?'],
    ['customer', 'We need to select this quarter and begin before our renewal.'],
    ['riley', 'Thank you. I have captured your business need, decision process, budget readiness, and timing. I will now evaluate the approved Verizon Marketplace catalog and prepare the best-fit private offer if the account is eligible.'],
  ],
  [
    ['customer', 'Interested, but we need more information before we can decide.'],
    ['riley', 'I can help narrow the relevant information. What business outcome or current challenge prompted your interest?'],
    ['customer', 'We need clearer security coverage and a simpler way to manage Microsoft licensing.'],
    ['riley', 'Who would evaluate the recommendation and make the final purchase decision?'],
    ['customer', 'I am gathering options for our operating leadership and finance team.'],
    ['riley', 'Has the business established a budget range or funding approach for this initiative?'],
    ['customer', 'The initiative is planned, but the budget will depend on the proposed value and scope.'],
    ['riley', 'What timing would make this initiative useful to the business?'],
    ['customer', 'We would like to decide within three to six months.'],
    ['riley', 'Thank you. I have captured the need, decision process, budget status, and timing. I will compare those requirements with the approved Verizon Marketplace catalog and present a private offer only if there is a suitable digital fit.'],
  ],
  [
    ['customer', 'We already work with a Microsoft partner. Please coordinate through that relationship.'],
    ['riley', 'I will preserve that relationship and will not attempt to displace the partner. This Agent Riley journey does not transfer customer information to an external partner.'],
    ['customer', 'Understood. We will continue through our current partner.'],
    ['riley', 'Understood. I will respect your existing partner relationship and end this Verizon digital outreach. No customer information will be shared with another party.'],
  ],
  [
    ['customer', 'We have complex security, data-residency, and migration requirements.'],
    ['riley', 'Those requirements exceed Riley’s approved digital catalog and policy boundaries. I will not make security assurances, pricing exceptions, or contract commitments.'],
    ['customer', 'Understood. The standard digital offer does not meet our current requirements.'],
    ['riley', 'Thank you for clarifying. The approved digital catalog does not cover those requirements, so I will not make an unsupported recommendation or continue this outreach.'],
  ],
  [
    ['customer', 'Not interested. Please do not contact us again.'],
    ['riley', 'Understood. Your consent withdrawal is recorded, this conversation is stopped, and the account is suppressed from future Riley campaign outreach until policy permits.'],
  ],
] as const

const contextualCustomerOptions = [
  [
    'I lead the recommendation with our COO. We want a decision this quarter and have budget allocated for a standard deployment.',
    'I can recommend a solution, but finance has not approved a budget yet. We still want to decide this quarter.',
    'I am gathering options for our COO. The final decision will involve finance and our operations leadership.',
  ],
  [
    'Please clarify the included security coverage and standard deployment assumptions.',
    'Start with licensing, connectivity, and the total private-offer value.',
    'The bounded digital offer does not meet our needs, so please close this opportunity.',
  ],
  [
    'We will continue through our current partner. Do not share any additional customer information.',
    'Our partner should remain the primary contact, so this Verizon marketplace opportunity should close.',
    'We are not authorizing any partner handoff from this digital journey.',
  ],
  [
    'The standard digital offer cannot satisfy our identity, retention, and data-residency requirements.',
    'We require regulated-data assurances that are outside this approved digital catalog.',
    'We need custom contract terms and pricing exceptions, so the standard digital offer is not suitable for us.',
  ],
] as const

const bantStages = [
  {
    name: 'Business need',
    helper: 'Clarify the problem, desired outcome, users, and relevant product gap.',
    options: [
      'We need to standardize secure productivity and collaboration for a growing workforce of about 120 people.',
      'We want to introduce Copilot safely while improving Microsoft 365 security and governance.',
      'Our priority is replacing fragmented calling and connectivity with a simpler Microsoft Teams experience.',
    ],
  },
  {
    name: 'Authority',
    helper: 'Understand the customer’s role and who participates in the purchase decision.',
    options: [
      'I own the recommendation and have authority to approve the purchase within our operating budget.',
      'I lead the evaluation, with final approval from our COO and finance team.',
      'I am researching options, but I am not yet connected to the final decision maker.',
    ],
  },
  {
    name: 'Budget',
    helper: 'Establish budget readiness without pressuring the customer or inventing pricing.',
    options: [
      'Funding is allocated, subject to confirming the final configuration and value.',
      'The initiative is planned, but the budget will depend on the proposed value and scope.',
      'No budget has been established yet. We are still determining whether this is a priority.',
    ],
  },
  {
    name: 'Timing',
    helper: 'Confirm the decision and deployment window relative to the business need.',
    options: [
      'We need to select this quarter and begin deployment before our renewal.',
      'We are targeting a decision in three to six months.',
      'This is exploratory and likely more than six months away.',
    ],
  },
] as const

export function AgentWorkspace() {
  const { state, update } = useDemo()
  const selected = prospects.find(p => p.id === state.selectedProspectId) ?? prospects[0]
  const step = workflowSteps[state.workflowStep]
  const qualificationScore = calculateQualificationScore(state.qualification)
  const route = determineRoute(selected, state.qualification)
  const advance = () => !state.paused && update({ workflowStep: Math.min(workflowSteps.length-1, state.workflowStep+1) })
  const applyPath = (path: number, conversationTurn = 0) => {
    const base = { conversationPath: path, conversationTurn, conversationChoice: -1, bantResponses: [], optedOut: path === 5, handoffApproved: false }
    if (path === 3) update({ ...base, qualification: { ...state.qualification, consent: true, existingPartner: true } })
    else if (path === 4) update({ ...base, qualification: { ...state.qualification, consent: true, existingPartner: false, complexity: 92 } })
    else if (path === 5) update({ ...base, qualification: { ...state.qualification, consent: false, existingPartner: false } })
    else update({ ...base, qualification: { ...state.qualification, consent: true, existingPartner: false, complexity: path === 2 ? 48 : 28 } })
  }
  const sequence = conversationSequences[state.conversationPath - 1]
  const conversationComplete = state.conversationTurn >= sequence.length
  const privateOfferReady = conversationComplete && route === 'Marketplace' && (state.conversationPath === 1 || (state.conversationPath === 2 && state.conversationChoice !== 2))
  const noSale = conversationComplete && !privateOfferReady
  const customerOptions = state.conversationPath < 5 ? contextualCustomerOptions[state.conversationPath - 1] : []
  const visibleMessages = sequence.slice(0, state.conversationTurn).map(([speaker, text], index) => {
    if (state.conversationPath <= 2 && index >= 2 && index <= 8 && index % 2 === 0) {
      const stageIndex = index / 2 - 1
      const response = state.bantResponses[stageIndex]
      return [speaker, response === undefined ? text : bantStages[stageIndex].options[response]]
    }
    if (state.conversationPath > 2 && index === 2 && state.conversationChoice >= 0) return [speaker, customerOptions[state.conversationChoice]]
    return [speaker, text]
  })
  const progressConversation = () => {
    if (!state.outreachApproved || state.paused) return
    const nextTurn = state.conversationPath <= 2
      ? state.conversationTurn % 2 === 1 ? Math.min(sequence.length, state.conversationTurn + 1) : state.conversationTurn
      : state.conversationPath === 5
        ? Math.min(2, state.conversationTurn + 1)
        : state.conversationTurn === 1 ? 2 : state.conversationTurn === 3 ? 4 : state.conversationTurn
    if (nextTurn === state.conversationTurn) return
    const workflowByTurn = [11, 12, 16, 20]
    update({
      conversationTurn: nextTurn,
      workflowStep: Math.max(state.workflowStep, workflowByTurn[Math.min(nextTurn - 1, workflowByTurn.length - 1)]),
      optedOut: state.conversationPath === 5,
    })
  }
  const chooseBantResponse = (stage: number, choice: number) => {
    const qualification = { ...state.qualification }
    const scores = [
      [92, 84, 76],
      [94, 74, 34],
      [90, 64, 24],
      [92, 70, 36],
    ]
    const fields = ['need', 'authority', 'budget', 'timing'] as const
    qualification[fields[stage]] = scores[stage][choice]
    qualification.digitalReadiness = state.conversationPath === 1 ? 90 : 72
    const bantResponses = [...state.bantResponses]
    bantResponses[stage] = choice
    update({
      bantResponses,
      conversationTurn: state.conversationTurn + 1,
      workflowStep: Math.max(state.workflowStep, [13, 14, 15, 16][stage]),
      qualification,
    })
  }
  const chooseContextualResponse = (choice: number) => {
    const qualification = { ...state.qualification }
    if (state.conversationPath === 1 && choice === 1) qualification.budget = 35
    if (state.conversationPath === 1 && choice === 2) qualification.authority = 42
    if (state.conversationPath === 2 && choice === 2) qualification.timing = 38
    if (state.conversationPath === 3) qualification.existingPartner = true
    if (state.conversationPath === 4) qualification.complexity = 94
    update({ conversationChoice: choice, conversationTurn: 3, workflowStep: Math.max(16, state.workflowStep), qualification })
  }
  const resetConversation = () => update({
    conversationTurn: 0,
    conversationChoice: -1,
    bantResponses: [],
    outreachApproved: false,
    handoffApproved: false,
    optedOut: false,
    workflowStep: 8,
    qualification: { ...state.qualification, consent: true, existingPartner: false, complexity: 28 },
  })
  const moveToNextCustomer = () => {
    const currentIndex = prospects.findIndex(p => p.id === selected.id)
    const next = prospects[(currentIndex + 1) % prospects.length]
    update({
      selectedProspectId: next.id,
      workflowStep: 0,
      conversationTurn: 0,
      conversationChoice: -1,
      bantResponses: [],
      outreachApproved: false,
      handoffApproved: false,
      optedOut: false,
      paused: false,
      qualification: { need: 82, authority: 74, budget: 65, timing: 84, digitalReadiness: 88, complexity: 28, consent: true, existingPartner: false },
    })
  }
  return <>
    <PageHeader eyebrow="Human-led, agent-operated" title="Agent Riley Workspace" actions={<div className="button-row"><Button variant="secondary" onClick={() => update({ paused: !state.paused })}>{state.paused ? <Play size={16}/> : <Pause size={16}/>} {state.paused ? 'Resume Riley' : 'Pause Riley'}</Button><Button onClick={advance}>Run next step <ArrowRight size={16}/></Button></div>}>
      <p>Run a transparent, compliant lead-to-order workflow for <b>{selected.company}</b>. Riley exposes operational evidence and policy decisions—not hidden chain-of-thought.</p>
    </PageHeader>
    {state.optedOut && <Notice tone="warning"><b>Consent withdrawn.</b> Outreach and private-offer creation are blocked, future campaign contact is suppressed, and the opportunity will close as no sale.</Notice>}
    <div className="workspace-grid">
      <Card className="timeline-card"><SectionTitle title="Riley activity" copy={`${state.workflowStep+1} of ${workflowSteps.length} operational steps`}/><div className="timeline">{workflowSteps.map(([name, skill], i) => <button key={name} onClick={() => update({ workflowStep: i })} className={i === state.workflowStep ? 'current' : i < state.workflowStep ? 'done' : ''}><span>{i < state.workflowStep ? <Check size={13}/> : i+1}</span><div><b>{name}</b><small>{skill}</small></div></button>)}</div></Card>
      <div className="workspace-main">
        <Card className="activity-detail"><div className="activity-title"><div className="agent-icon"><Bot/></div><div><Badge tone="azure">{step[1]}</Badge><h2>{step[0]}</h2></div><Badge tone={state.paused ? 'warning' : 'success'}>{state.paused ? 'Paused' : state.workflowStep < 10 ? 'Ready' : 'Complete'}</Badge></div>
          <div className="activity-grid"><div><span>Purpose</span><b>Advance the approved agentic sales workflow with minimum necessary synthetic data.</b></div><div><span>Inputs</span><b>{selected.id}, consent record, product footprint</b></div><div><span>Tools invoked</span><b>Synthetic CRM, policy engine, offer catalog</b></div><div><span>Result</span><b>{state.workflowStep >= 4 && selected.consent !== 'Confirmed' ? 'Blocked pending valid consent' : 'Policy-compliant operational result'}</b></div><div><span>Confidence</span><b>{selected.confidence}%</b></div><div><span>Required approval</span><b>{state.workflowStep < 10 ? (state.outreachApproved ? 'Outreach approved' : 'Outreach pending') : privateOfferReady ? (state.handoffApproved ? 'Private offer approved' : 'Private offer pending') : 'Not required for no sale'}</b></div><div><span>Token estimate</span><b>{640 + state.workflowStep*48} tokens</b></div><div><span>Estimated Azure cost</span><b>${(0.09 + state.workflowStep*.018).toFixed(2)}</b></div><div><span>Retry count</span><b>0</b></div><div><span>FinOps status</span><b>Within policy</b></div></div>
          <Notice tone={selected.consent === 'Confirmed' && state.qualification.consent ? 'success' : 'warning'}><b>Policy decision:</b> {selected.consent === 'Confirmed' && state.qualification.consent ? 'Riley may complete qualification and create an approved private marketplace offer. Unsupported journeys close as no sale.' : 'Outreach and private-offer creation are blocked until consent is valid.'}</Notice>
        </Card>
        <Card className="conversation"><SectionTitle title="Simulated email conversation" copy="Riley identifies itself, asks permission, and limits questions." action={<Badge tone="azure"><Mail size={13}/> Audit trail on</Badge>}/>
          <div className="message riley"><div className="avatar">R</div><div><span>Agent Riley · Verizon Business digital sales assistant</span><p>Hi Jordan—I'm Riley, a digital sales assistant for Verizon Business. Based on synthetic account signals, {selected.company} may be approaching a Microsoft renewal and could benefit from a secure productivity review. May I ask two brief questions to see whether this is relevant? I can continue in your preferred language.</p></div></div>
          {visibleMessages.map(([speaker, text], index) => <div className={`message ${speaker}`} key={`${speaker}-${index}`}><div className="avatar">{speaker === 'riley' ? 'R' : 'J'}</div><div><span>{speaker === 'riley' ? 'Agent Riley · Verizon Business digital sales assistant' : `Jordan · ${selected.decisionMaker}`}</span><p>{text}</p></div></div>)}
          <div className="approval-bar"><div><UserCheck/><div><b>Initial outbound approval</b><span>Required before a simulated message can be sent.</span></div></div><div className="button-row"><Button variant="danger" onClick={() => update({ outreachApproved: false })}>Reject</Button><Button disabled={state.optedOut} onClick={() => update({ outreachApproved: true, workflowStep: Math.max(10, state.workflowStep) })}>{state.outreachApproved ? <Check/> : <Send/>}{state.outreachApproved ? 'Approved' : 'Approve outreach'}</Button></div></div>
          {state.outreachApproved && state.conversationTurn === 0 && <div className="response-choices"><div><b>Choose the customer’s initial response</b><span>Each response starts a different compliant workflow branch.</span></div><div className="path-grid">{pathReplies.map((p, i) => <button key={p} onClick={() => applyPath(i+1, 1)}>{i+1}<span>{p}</span></button>)}</div></div>}
          {state.outreachApproved && state.conversationPath <= 2 && [2,4,6,8].includes(state.conversationTurn) && (() => {
            const stageIndex = state.conversationTurn / 2 - 1
            const stage = bantStages[stageIndex]
            return <div className="response-choices"><div><Badge tone="azure">BANT · {stage.name}</Badge><b>Choose the customer’s response to Riley’s latest question</b><span>{stage.helper}</span></div><div className="contextual-options">{stage.options.map((option, i) => <button key={option} onClick={() => chooseBantResponse(stageIndex, i)}><MessageSquare size={16}/><span>{option}</span><ArrowRight size={15}/></button>)}</div></div>
          })()}
          {state.outreachApproved && state.conversationPath > 2 && state.conversationPath < 5 && state.conversationTurn === 2 && <div className="response-choices"><div><b>Choose the customer’s response to Riley’s latest question</b><span>Options reflect the active {pathReplies[state.conversationPath - 1].toLowerCase()} conversation.</span></div><div className="contextual-options">{customerOptions.map((option, i) => <button key={option} onClick={() => chooseContextualResponse(i)}><MessageSquare size={16}/><span>{option}</span><ArrowRight size={15}/></button>)}</div></div>}
          <div className="conversation-actions">
            <div><span>Conversation progress</span><b>{state.conversationTurn} of {sequence.length} turns</b><Progress value={state.conversationTurn / sequence.length * 100} tone={state.optedOut ? 'red' : 'green'}/></div>
            <div className="button-row">
              <Button variant="secondary" onClick={resetConversation}>Reset conversation</Button>
              <Button variant="danger" disabled={!state.outreachApproved || state.optedOut} onClick={() => applyPath(5, 1)}>Mark opted out</Button>
              <Button disabled={!state.outreachApproved || state.paused || state.conversationTurn === 0 || (state.conversationPath <= 2 ? state.conversationTurn % 2 === 0 : state.conversationTurn === 2) || state.conversationTurn >= sequence.length} onClick={progressConversation}>{state.conversationPath === 5 && state.conversationTurn === 1 ? 'Confirm opt-out' : state.conversationPath <= 2 && state.conversationTurn === 9 ? 'Complete BANT qualification' : state.conversationPath <= 2 && state.conversationTurn < sequence.length ? `Continue ${bantStages[Math.min(3, Math.floor(state.conversationTurn / 2))]?.name ?? 'qualification'}` : state.conversationTurn < sequence.length ? 'Continue qualification' : 'Conversation complete'} <ArrowRight size={15}/></Button>
            </div>
          </div>
        </Card>
        <div className="two-col">
          <Card><SectionTitle title="Qualification" copy="BANT-inspired and optimized for autonomous digital conversion."/><div className="score-summary"><div className="score-ring"><strong>{qualificationScore}</strong><span>overall score</span></div><div><b>{determineDisposition(state.qualification)}</b><p>Agentic outcome: {conversationComplete ? (privateOfferReady ? 'Private marketplace offer' : 'No sale') : 'Continue qualification'}</p><Progress value={qualificationScore} tone={qualificationScore >= 70 ? 'green' : 'amber'}/></div></div>{Object.entries(state.qualification).filter(([,v]) => typeof v === 'number').map(([key, value]) => <label className="slider-row" key={key}><span>{key.replace(/([A-Z])/g,' $1')}<b>{value}</b></span><input type="range" min="0" max="100" value={value as number} onChange={e => update({ qualification: { ...state.qualification, [key]: Number(e.target.value) } as Qualification })}/></label>)}</Card>
          <Card><SectionTitle title="Agentic outcome" copy="Riley either publishes a private marketplace offer or records no sale and advances."/><div className="route-decision"><div className="route-icon">{privateOfferReady ? <ShoppingCart/> : noSale ? <XCircle/> : <ArrowRight/>}</div><div><span>Current outcome</span><h3>{privateOfferReady ? 'Verizon Marketplace private offer' : noSale ? 'Close as no sale' : 'Qualification in progress'}</h3><p>{privateOfferReady ? 'The bounded offer fits, consent is valid, and the customer is ready for a digital purchase.' : noSale ? 'The customer declined, retained an existing partner, withdrew consent, or requires terms outside the approved digital catalog.' : 'Riley is gathering the evidence needed to select one of the two permitted outcomes.'}</p></div></div>{privateOfferReady && <Button onClick={() => update({ handoffApproved: true, workflowStep: 23 })}>{state.handoffApproved ? <CheckCircle2/> : <FileCheck2/>}{state.handoffApproved ? 'Private offer published' : 'Approve and publish private offer'}</Button>}{state.handoffApproved && privateOfferReady && <Notice tone="success">Private offer VZ-PO-{selected.id}-26 is now available in the simulated Verizon Business Marketplace. No live order or CRM write occurred.</Notice>}{noSale && <><Notice tone="warning">Opportunity closed as no sale. The reason is recorded for campaign learning and no seller or specialist handoff is created.</Notice><Button onClick={moveToNextCustomer}>Close no sale and move to next customer <ArrowRight/></Button></>}</Card>
        </div>
      </div>
    </div>
  </>
}

export function OfferStudio() {
  const { state } = useDemo()
  const selected = prospects.find(p => p.id === state.selectedProspectId) ?? prospects[0]
  const primary = recommendOffer(selected)
  const alternative = offers[(offers.indexOf(primary)+1)%offers.length]
  const [users, setUsers] = useState(selected.employees)
  const [discount, setDiscount] = useState(0)
  const [term, setTerm] = useState(36)
  const annual = users*primary.monthlyPrice*12*(1-discount/100)+primary.setupCost
  return <>
    <PageHeader eyebrow="Bounded synthetic catalog" title="Offer Studio"><p>Match qualified needs to approved Microsoft and Verizon Business bundles with explainable, editable economics.</p></PageHeader>
    <Notice><b>All prices are illustrative.</b> They are not authorized Verizon or Microsoft quotes and require commercial validation.</Notice>
    <div className="offer-hero">
      <Card className="primary-offer"><Badge tone="success">Primary recommendation</Badge><h2>{primary.name}</h2><p>{primary.description}</p><div className="offer-price"><strong>{formatCurrency(annual, state.currency, false)}</strong><span>illustrative year-one value</span></div><div className="chip-row">{[...primary.products,...primary.verizonServices].map(x => <Badge key={x} tone="azure">{x}</Badge>)}</div><div className="why-grid"><div><span>Why it fits</span><b>Strong product gap, renewal proximity, and secure productivity need.</b></div><div><span>Recommended route</span><b>{primary.route}</b></div><div><span>Estimated seats</span><b>{users}</b></div><div><span>Gross margin assumption</span><b>{Math.round(primary.margin*100)}%</b></div></div></Card>
      <Card className="config-panel"><SectionTitle title="Configure recommendation" copy="Outputs recalculate immediately."/><Input label="Users" type="number" min="1" value={users} onChange={e => setUsers(Number(e.target.value))}/><Input label="Discount assumption (%)" type="number" min="0" max="30" value={discount} onChange={e => setDiscount(Number(e.target.value))}/><Select label="Contract duration" value={term} onChange={e => setTerm(Number(e.target.value))}><option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option></Select><div className="calc-list"><div><span>Monthly recurring value</span><b>{formatCurrency(users*primary.monthlyPrice*(1-discount/100), state.currency, false)}</b></div><div><span>Setup services</span><b>{formatCurrency(primary.setupCost, state.currency, false)}</b></div><div><span>Contract value</span><b>{formatCurrency(annual*(term/12), state.currency, false)}</b></div><div><span>Estimated gross margin</span><b>{formatCurrency(annual*primary.margin, state.currency, false)}</b></div></div></Card>
    </div>
    <Card><SectionTitle title="Alternative recommendation" copy="A credible option, but less aligned to the current qualification evidence."/><div className="alternative"><div><h3>{alternative.name}</h3><p>{alternative.description}</p></div><div><span>Why not selected</span><b>Less precise fit for current user count, complexity, or preferred buying path.</b></div><Badge>{alternative.route}</Badge></div></Card>
    <div className="catalog-grid">{offers.map(o => <Card key={o.id} className={o.id === primary.id ? 'catalog active' : 'catalog'}><div><Badge tone={o.route === 'Marketplace' ? 'azure' : 'neutral'}>{o.route}</Badge><h3>{o.name}</h3><p>{o.description}</p></div><div className="chip-row">{o.products.slice(0,2).map(x => <Badge key={x}>{x}</Badge>)}</div><div className="catalog-bottom"><b>{formatCurrency(o.monthlyPrice, state.currency, false)} / user / month</b><span>Illustrative</span></div></Card>)}</div>
    <Card><SectionTitle title="Approved catalog coverage"/><div className="two-col"><div><h3>Microsoft offers</h3><div className="check-list">{microsoftProducts.map(x => <span key={x}><CheckCircle2/>{x}</span>)}</div></div><div><h3>Verizon Business services</h3><div className="check-list">{verizonProducts.map(x => <span key={x}><CheckCircle2/>{x}</span>)}</div></div></div></Card>
  </>
}

export function QualifiedPipeline() {
  const { state, update } = useDemo()
  const [view, setView] = useState('Funnel')
  const scenario = getScenario(state.scenarioId)
  const funnel = calculateFunnel(scenario)
  const business = calculateBusinessCase(scenario)
  const views = ['Funnel','Kanban','Table','Route performance','Seller productivity','Cost']
  return <>
    <PageHeader eyebrow="Measured lead-to-order outcomes" title="Qualified Pipeline"><p>Track conversion, route performance, bookings, seller capacity, and cost using the same scenario calculations.</p></PageHeader>
    <div className="tabs">{views.map(x => <button key={x} className={view === x ? 'active' : ''} onClick={() => setView(x)}>{x}</button>)}</div>
    <div className="metric-grid six"><Metric label="Qualified opportunities" value={business.qualified.toLocaleString()}/><Metric label="Pipeline value" value={formatCurrency(business.qualified*69000,state.currency)} tone="positive"/><Metric label="Completed sales" value={business.sales.toLocaleString()} tone="positive"/><Metric label="Bookings" value={formatCurrency(business.bookings,state.currency)} tone="positive"/><Metric label="Gross margin" value={formatCurrency(business.grossMargin,state.currency)} tone="positive"/><Metric label="Seller hours returned" value={Math.round(business.qualified*scenario.sellerHours).toLocaleString()}/></div>
    {view === 'Funnel' && <div className="two-col"><Card><SectionTitle title="Lead-to-order funnel"/><FunnelChart data={funnel}/></Card><Card><SectionTitle title="Route mix"/><RouteChart multiplier={scenario.accountMultiplier}/></Card></div>}
    {view === 'Kanban' && <div className="kanban">{['Identified','Contacted','Qualifying','Qualified','Private offer ready','Marketplace offer','Closed / no sale'].map((stage,i) => <div key={stage}><h3>{stage}<Badge>{Math.max(1,12-i*2)}</Badge></h3>{prospects.slice(i,i+3).map(p => <Card key={p.id} className="kanban-card" onClick={() => update({ selectedProspectId: p.id })}><b>{p.company}</b><span>{formatCurrency(p.cspOpportunity+p.verizonOpportunity,state.currency)}</span><small>{p.recommendedOffer}</small></Card>)}</div>)}</div>}
    {view === 'Table' && <Card className="table-card"><div className="table-wrap"><table><thead><tr><th>Opportunity</th><th>Stage</th><th>Outcome</th><th>Qualification</th><th>Value</th><th>Azure cost</th></tr></thead><tbody>{prospects.map((p,i) => <tr key={p.id} onClick={() => update({ selectedProspectId:p.id })}><td><b>{p.company}</b><small>D365-{p.id}-26</small></td><td>{['Qualified','Private offer ready','Marketplace offer','Qualifying'][i%4]}</td><td>{p.route}</td><td>{64+(i%6)*5}</td><td>{formatCurrency(p.cspOpportunity+p.verizonOpportunity,state.currency)}</td><td>{formatCurrency(86+i*14,state.currency,false)}</td></tr>)}</tbody></table></div></Card>}
    {view === 'Route performance' && <div className="two-col"><Card><SectionTitle title="Agentic outcome mix"/><RouteChart multiplier={scenario.accountMultiplier}/></Card><Card><SectionTitle title="Digital conversion"/>{[['Private marketplace offer',scenario.closeRate*1.18*100],['No sale',100-scenario.closeRate*1.18*100]].map(([name,value]) => <div className="bar-row" key={name as string}><span>{name}<b>{Number(value).toFixed(1)}%</b></span><Progress value={Number(value)} tone={name === 'Private marketplace offer' ? 'green' : 'amber'}/></div>)}</Card></div>}
    {view === 'Seller productivity' && <div className="two-col"><Card><SectionTitle title="Seller capacity returned"/><TrendChart scaled={scenario.accountMultiplier}/></Card><Card><SectionTitle title="Productivity indicators"/><div className="big-list"><div><Users/><span>Hours returned per qualified opportunity</span><b>{scenario.sellerHours}</b></div><div><Clock3/><span>Average qualification cycle</span><b>2.4 days</b></div><div><UserCheck/><span>Seller acceptance</span><b>78%</b></div></div></Card></div>}
    {view === 'Cost' && <div className="two-col"><Card><SectionTitle title="Azure cost by service"/><CostChart data={azureCosts.map(x => ({name:x.name,value:Math.round(scenario.monthlyAzure*x.share)}))}/></Card><Card><SectionTitle title="Unit economics"/><div className="calc-list"><div><span>Cost per account evaluated</span><b>{formatCurrency(scenario.monthlyAzure/funnel[0].value,state.currency,false)}</b></div><div><span>Cost per response</span><b>{formatCurrency(scenario.monthlyAzure/Math.max(1,funnel[5].value),state.currency,false)}</b></div><div><span>Cost per qualified opportunity</span><b>{formatCurrency(business.costPerQualified,state.currency,false)}</b></div><div><span>Cost per completed sale</span><b>{formatCurrency(business.costPerSale,state.currency,false)}</b></div></div></Card></div>}
  </>
}

export function MarketplaceJourney() {
  const { state, update } = useDemo()
  const selected = prospects.find(p => p.id === state.selectedProspectId) ?? prospects[0]
  const offer = recommendOffer(selected)
  const [stage, setStage] = useState(0)
  const stages = ['Review offer','Save quote','Add to cart','Complete simulated purchase']
  const eligible = selected.consent === 'Confirmed' && state.qualification.consent && !state.optedOut
  return <>
    <PageHeader eyebrow="Entirely simulated destination" title="Verizon Business Marketplace Journey"><p>Demonstrate Riley completing a qualified journey with a customer-specific private offer—without a live external checkout, order, or marketplace connection.</p></PageHeader>
    {!eligible && <Notice tone="warning">Marketplace routing is blocked until consent and eligibility requirements are satisfied.</Notice>}
    <div className="marketplace-grid">
      <Card className="marketplace-summary"><div className="marketplace-brand"><Store/><b>Verizon Business Marketplace</b><Badge tone="warning">SIMULATION</Badge></div><p>Prepared for</p><h2>{selected.company}</h2><div className="detail-grid"><div><span>Qualification score</span><b>{calculateQualificationScore(state.qualification)}/100</b></div><div><span>Consent</span><b>{eligible ? 'Validated' : 'Blocked'}</b></div><div><span>Referral ID</span><b>VZ-RLY-{selected.id}-26</b></div><div><span>Offer expires</span><b>October 28, 2026</b></div></div><div className="offer-ticket"><Badge tone="success">Riley recommended</Badge><h3>{offer.name}</h3><p>{offer.description}</p><div className="chip-row">{[...offer.products,...offer.verizonServices].map(x => <Badge key={x}>{x}</Badge>)}</div><div className="ticket-total"><span>Illustrative monthly price</span><strong>{formatCurrency(offer.monthlyPrice*selected.employees,state.currency,false)}</strong></div></div><div className="checkout-progress">{stages.map((x,i) => <div className={i <= stage ? 'active' : ''} key={x}><span>{i < stage ? <Check/> : i+1}</span><b>{x}</b></div>)}</div><div className="button-row"><Button variant="secondary" onClick={() => setStage(Math.max(0,stage-1))}>Back</Button><Button disabled={!eligible || stage === stages.length-1} onClick={() => setStage(Math.min(stages.length-1,stage+1))}>{stage === 2 ? <ShoppingCart/> : <ArrowRight/>}{stages[Math.min(stages.length-1,stage+1)]}</Button></div>{stage === 3 && <Notice tone="success">Simulated purchase completed and attributed to Agent Riley. No live order was placed.</Notice>}</Card>
      <div className="detail-stack">
        <Card><SectionTitle title="Beyond Now integration pattern" copy="Conceptual sequence only; no live connection."/><ol className="number-list">{['Riley prepares a qualified recommendation.','Verizon business rules validate eligibility.','Approved offer and context pass through an API layer.','Marketplace catalog resolves the configured offer.','Customer enters a simulated Verizon-owned purchase journey.','Order status and attribution return to Riley telemetry.'].map(x => <li key={x}>{x}</li>)}</ol></Card>
        <Card><SectionTitle title="Private offer versus no sale"/><div className="compare"><div><h3><Store/> Publish a private offer</h3><p>Use when the approved digital catalog fits, consent is valid, qualification is complete, and the customer is ready to buy digitally.</p></div><div><h3><XCircle/> Close as no sale</h3><p>Use when the customer declines, retains an existing partner, withdraws consent, or needs unsupported pricing, contract, security, or migration terms.</p></div></div><Button variant="secondary" onClick={() => update({ handoffApproved: false })}>Return offer to Riley</Button></Card>
      </div>
    </div>
  </>
}

export function CustomerZero() {
  const { state } = useDemo()
  const scenario = getScenario(state.scenarioId)
  const business = calculateBusinessCase(scenario)
  const [target, setTarget] = useState({ response: scenario.responseRate*100, qualification: scenario.qualificationRate*100, acceptance: 78, marketplace: 23, seats: 74, copilot: 35 })
  return <>
    <PageHeader eyebrow="Evidence separated from assumptions" title="Built from Microsoft Customer Zero experience"><p>Microsoft has used autonomous sales-agent patterns within its own SMB sales organization to research prospects, conduct digital outreach, and help turn customer contacts into qualified sales opportunities. The Verizon concept adapts that human-led, agent-operated pattern.</p></PageHeader>
    <div className="evidence-grid">
      <Card className="evidence verified"><Badge tone="azure">Verified Customer Zero</Badge><h2>Microsoft internal experience</h2><div className="metric-grid">{customerZero.map(x => <Metric key={x.label} label={x.label} value={x.value}/>)}</div><Notice>These figures represent Microsoft internal Customer Zero experience and do not represent a Verizon forecast or commitment. Microsoft does not guarantee equivalent outcomes.</Notice></Card>
      <Card className="evidence target"><Badge tone="warning">Synthetic pilot target</Badge><h2>Editable Verizon targets</h2><div className="form-grid">{Object.entries(target).map(([key,value]) => <Input key={key} label={`${key.replace(/^\w/,c=>c.toUpperCase())} ${key === 'seats' ? '' : '(%)'}`} type="number" value={value} onChange={e => setTarget({...target,[key]:Number(e.target.value)})}/>)}</div><p className="muted">Targets are presenter-controlled synthetic assumptions, not commitments.</p></Card>
      <Card className="evidence calculated"><Badge tone="success">Calculated scenario result</Badge><h2>{scenario.name} outcomes</h2><div className="calc-list"><div><span>Qualified opportunities</span><b>{business.qualified}</b></div><div><span>Completed sales</span><b>{business.sales}</b></div><div><span>Annual bookings</span><b>{formatCurrency(business.bookings,state.currency)}</b></div><div><span>Cost per qualified opportunity</span><b>{formatCurrency(business.costPerQualified,state.currency)}</b></div><div><span>Seller hours returned</span><b>{Math.round(business.qualified*scenario.sellerHours)}</b></div></div></Card>
    </div>
    <Disclaimer/>
  </>
}

export function TcoBusinessCase() {
  const { state, update } = useDemo()
  const scenario = getScenario(state.scenarioId)
  const business = calculateBusinessCase(scenario,state.implementationInvestment,state.funding)
  const alerts = calculateFinOpsAlerts(scenario.monthlyAzure,state.monthlyBudget)
  const costData = azureCosts.map(x => ({name:x.name,value:Math.round(scenario.monthlyAzure*x.share)}))
  return <>
    <PageHeader eyebrow="Economics of an AI-powered inside-sales channel" title="TCO & Business Case" actions={<Button variant="secondary" onClick={() => update({currency:state.currency === 'USD' ? 'CAD' : 'USD'})}>{state.currency} <ArrowRight/> {state.currency === 'USD' ? 'CAD' : 'USD'}</Button>}>
      <p>Agent Riley combines implementation investment, Azure consumption, Verizon operational ownership, and human-controlled sales workflows to create qualified Microsoft CSP pipeline and recurring Verizon Business revenue.</p>
    </PageHeader>
    <div className="metric-grid">
      <Metric label="Implementation model" value="Microsoft FDE" note="3-month outcome-oriented co-engineering"/>
      <Metric label="Gross implementation investment" value={state.implementationInvestment ? formatCurrency(state.implementationInvestment,state.currency) : 'Pending formal proposal'} tone="warning"/>
      <Metric label="Net Verizon investment" value={state.implementationInvestment ? formatCurrency(business.netVerizonInvestment,state.currency) : 'Pending scope'}/>
      <Metric label="Monthly Azure run rate" value={formatCurrency(scenario.monthlyAzure,state.currency)} tone="azure"/>
      <Metric label="Annual Azure run rate" value={formatCurrency(business.annualAzure,state.currency)} tone="azure"/>
      <Metric label="Azure cost / qualified opportunity" value={formatCurrency(business.costPerQualified,state.currency)} tone="azure"/>
      <Metric label="3-year gross TCO" value={state.implementationInvestment ? formatCurrency(business.grossTco,state.currency) : 'Pending scope'}/>
      <Metric label="3-year gross-margin contribution" value={formatCurrency(business.benefit,state.currency)} tone="positive"/>
      <Metric label="Break-even completed sales" value={business.breakEvenSales ?? 'Pending scope'}/>
      <Metric label="Projected ROI" value={business.roi === null ? 'Pending scope' : `${(business.roi*100).toFixed(0)}%`} tone={business.roi && business.roi > 0 ? 'positive' : 'warning'}/>
    </div>
    <div className="two-col">
      <Card><SectionTitle title="Implementation investment" copy="No value is prepopulated. Funding changes who pays, not gross economic cost."/><Input label="Gross implementation investment" type="number" min="0" placeholder="Enter presenter-supplied amount" value={state.implementationInvestment || ''} onChange={e => update({implementationInvestment:Number(e.target.value)})}/><Input label="Microsoft / partner / other approved funding" type="number" min="0" value={state.funding || ''} onChange={e => update({funding:Number(e.target.value)})}/><div className="calc-list"><div><span>Gross economic cost</span><b>{state.implementationInvestment ? formatCurrency(state.implementationInvestment,state.currency,false) : 'Pending'}</b></div><div><span>Net Verizon implementation investment</span><b>{state.implementationInvestment ? formatCurrency(business.netVerizonInvestment,state.currency,false) : 'Pending'}</b></div></div><Notice>Implementation investment is pending formal scoping. No value shown in this demo represents an authorized Microsoft FDE, Microsoft Industry Solutions Delivery, partner, or Verizon estimate.</Notice></Card>
      <Card><SectionTitle title="Implementation model" copy="Microsoft Forward Deployed Engineering"/><p>Microsoft FDE would work with Verizon as an outcome-oriented co-engineering team for a fixed engagement period to create a production-oriented vertical slice, integrate agreed workflow components, establish governance and observability, run a controlled pilot, and transfer the pattern to Verizon.</p><div className="phase-list">{implementationPhases.map((phase,i) => <div key={phase.name}><span>{i+1}</span><div><h3>{phase.name}</h3>{phase.items.map(x => <p key={x}><Check/>{x}</p>)}</div></div>)}</div></Card>
    </div>
    <div className="two-col">
      <Card><SectionTitle title="Azure operating cost" copy="Illustrative demo rates—validate with Azure Pricing Calculator and Verizon's agreement."/><CostChart data={costData}/><div className="calc-list"><div><span>Monthly fixed + variable run rate</span><b>{formatCurrency(scenario.monthlyAzure,state.currency,false)}</b></div><div><span>Annual run rate</span><b>{formatCurrency(business.annualAzure,state.currency,false)}</b></div></div></Card>
      <Card><SectionTitle title="Funnel and unit economics"/><FunnelChart data={calculateFunnel(scenario).slice(0,8)}/><div className="calc-list"><div><span>Cost per qualified opportunity</span><b>{formatCurrency(business.costPerQualified,state.currency,false)}</b></div><div><span>Cost per completed sale</span><b>{formatCurrency(business.costPerSale,state.currency,false)}</b></div><div><span>Azure cost as % of gross margin</span><b>{business.grossMargin ? `${(business.annualAzure/business.grossMargin*100).toFixed(1)}%` : 'Not available'}</b></div></div></Card>
    </div>
    <Card><SectionTitle title="Three-year TCO and business value" copy={state.implementationInvestment ? 'Full economics activated by presenter-supplied implementation value.' : 'Enter a scoped implementation investment to complete ROI, payback, and break-even analysis.'}/><div className="year-grid">{[1,2,3].map(year => <div key={year}><Badge>Year {year}</Badge><div><span>Azure operations</span><b>{formatCurrency(business.annualAzure,state.currency)}</b></div><div><span>Business operations</span><b>{formatCurrency(96000*scenario.accountMultiplier,state.currency)}</b></div><div><span>Bookings</span><b>{formatCurrency(business.bookings*(1+(year-1)*.12),state.currency)}</b></div><div><span>Gross margin</span><b>{formatCurrency(business.grossMargin*(1+(year-1)*.12),state.currency)}</b></div></div>)}</div>{state.implementationInvestment > 0 && <div className="metric-grid six"><Metric label="Net economic value" value={formatCurrency(business.netValue,state.currency)} tone={business.netValue>0?'positive':'warning'}/><Metric label="ROI" value={`${((business.roi??0)*100).toFixed(0)}%`}/><Metric label="Payback" value={`${business.paybackMonths} months`}/><Metric label="Benefit-cost ratio" value={`${(business.benefit/business.grossTco).toFixed(2)}x`}/><Metric label="Break-even sales" value={business.breakEvenSales}/><Metric label="Break-even opportunities" value={Math.ceil((business.breakEvenSales??0)/scenario.closeRate)}/></div>}</Card>
    <div className="two-col">
      <Card><SectionTitle title="Scenario sensitivity" copy="Directional effect on three-year net value—not statistical significance."/><SensitivityChart/></Card>
      <Card><SectionTitle title="How Agent Riley’s cost stays controlled"/><Input label="Monthly Azure budget" type="number" min="1" value={state.monthlyBudget} onChange={e=>update({monthlyBudget:Number(e.target.value)})}/><div className="budget-gauge"><span><b>{formatCurrency(scenario.monthlyAzure,state.currency,false)}</b> of {formatCurrency(state.monthlyBudget,state.currency,false)}</span><Progress value={scenario.monthlyAzure/state.monthlyBudget*100} tone={scenario.monthlyAzure>state.monthlyBudget?'red':'blue'}/></div>{alerts.length ? alerts.map(a => <Notice key={a.threshold} tone={a.severity === 'breach' ? 'warning' : 'info'}>{a.label}: {a.threshold >= 1 ? 'Pause campaign and require review.' : 'Monitor consumption and unit economics.'}</Notice>) : <Notice tone="success">No FinOps thresholds reached.</Notice>}<div className="check-list">{['Token budget','Maximum cost per qualified opportunity','Maximum conversation turns','Model-routing policy','Prompt-cache target','Campaign-pause policy'].map(x=><span key={x}><CheckCircle2/>{x}</span>)}</div></Card>
    </div>
    <Card className="executive-conclusion"><DollarSign/><div><h2>Business case conclusion</h2><p>{conclusion}</p></div></Card>
    <Disclaimer/>
  </>
}

export function ArchitectureGovernance() {
  const layers = [
    ['Experience layer',['Riley workspace','Seller workspace','Marketplace experience','Executive dashboard','TCO & FinOps dashboard']],
    ['Signal layer',['Synthetic CRM pattern','Customer hierarchy','Verizon product ownership','Consent evidence','Microsoft licensing footprint','CloudAscent-style propensity']],
    ['Agent layer',['Agent Riley','Prospect Intelligence Skill','Consent and Policy Skill','Qualification Skill','Offer Recommendation Skill','CRM Handoff Skill','Telemetry and FinOps Skill']],
    ['Orchestration layer',['Microsoft Foundry patterns','Copilot Studio patterns','API Management','Workflow service','Model routing','Prompt management','Evaluation and guardrails']],
    ['Data layer',['Customer graph','Conversation records','Qualification evidence','Offer catalog','Opportunity data','Consent records','Cost telemetry']],
    ['Integration layer',['Dynamics 365 pattern','Email service pattern','Marketplace APIs','Beyond Now pattern','Partner Center pattern','Analytics']],
    ['Security & governance',['Microsoft Entra ID','Managed identity','Key Vault','Private networking','Purview pattern','DLP pattern','Human approvals','Consent controls','Azure Monitor','FinOps policies']],
  ]
  return <>
    <PageHeader eyebrow="Microsoft platform patterns in Verizon-governed environments" title="Architecture & Governance"><p>Core design principle: Verizon customer data, consent policies, offer rules, and routing controls stay within Verizon-governed environments. This demo is conceptual and has no live integrations.</p></PageHeader>
    <Card className="architecture"><SectionTitle title="Layered reference architecture" copy="Responsive conceptual view—not a deployed topology."/><div className="architecture-layers">{layers.map(([name,items],i)=><div key={name as string} className={`layer layer-${i}`}><h3>{name as string}</h3><div>{(items as string[]).map(x=><span key={x}>{x}</span>)}</div></div>)}</div></Card>
    <div className="two-col">
      <Card><SectionTitle title="Governance profile" copy="Bounded purpose, actions, data, and cost."/><div className="governance-list">{governanceControls.map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div></Card>
      <Card><SectionTitle title="Audit log" copy="Every consequential event includes evidence and correlation."/><div className="audit-list">{['Prospect selected','Consent checked','Outreach approved','Message sent','Qualification updated','Recommendation created','Handoff approved','Opportunity created','Route selected','Cost threshold evaluated'].map((x,i)=><div key={x}><span className={i<7?'complete':''}>{i<7?<Check/>:<Circle/>}</span><div><b>{x}</b><small>RLY-2026-{String(4102+i).padStart(5,'0')} · {i<7?'Result recorded':'Awaiting workflow'}</small></div><time>11:{String(8+i*2).padStart(2,'0')}</time></div>)}</div></Card>
    </div>
    <Card><SectionTitle title="Responsible AI safety tests" copy="Safe outcomes for common policy and reliability risks."/><div className="rai-grid">{raiTests.map(([test,outcome])=><div key={test}><ShieldCheck/><div><b>{test}</b><p>{outcome}</p></div><Badge tone="success">Safe outcome</Badge></div>)}</div></Card>
    <div className="principles-grid">{['AI assistant disclosure','Human control','Consent validation','Immediate opt-out','Bounded catalog','Explainable recommendations','No demographic targeting','No autonomous pricing','No legal conclusions','Minimum necessary data','Auditability','Cost controls'].map(x=><Card key={x} className="principle"><CheckCircle2/><b>{x}</b></Card>)}</div>
    <Disclaimer/>
  </>
}

const tour = [
  ['Frame the opportunity','/','Verizon already has the customer relationships, marketplace, billing relationship, and trusted business channel. Riley adds a proactive digital sales layer.'],
  ['Identify the right customer','/prospects','Select a high-propensity fictional account and explain why propensity alone is not qualification.'],
  ['Launch Riley','/workspace','Run signal retrieval, contactability, consent, research, and outreach draft. Approve the initial message.'],
  ['Conduct qualification','/workspace','Choose “Interested and ready now” and capture need, users, authority, timing, security, partner status, and channel preference.'],
  ['Recommend an offer','/offers','Show the primary bundle, alternative, Verizon attach opportunity, Microsoft CSP value, and approvals.'],
  ['Route the customer','/marketplace','Approve a standardized marketplace path and show simulated checkout and attribution.'],
  ['Measure performance','/pipeline','Review funnel, conversion, route performance, cost, and seller capacity returned.'],
  ['Establish credibility','/customer-zero','Keep verified Microsoft experience separate from synthetic Verizon targets.'],
  ['Explain economics','/tco','Show Azure run rate, cost per outcome, and enter a presenter-supplied implementation value.'],
  ['Close with governance','/architecture','Explain consent, security, approvals, auditability, and cost controls.'],
]

export function DemoGuide() {
  const { state, update, reset } = useDemo()
  const navigate = useNavigate()
  const current = tour[state.tourStep] ?? tour[0]
  const go = (index:number) => { update({tourStep:index}); navigate(tour[index][1]) }
  return <>
    <PageHeader eyebrow="8–10 minute executive walkthrough" title="Demo Guide"><p>A structured story from growth opportunity to governed unit economics.</p></PageHeader>
    <div className="guide-layout">
      <Card className="guide-steps">{tour.map(([title],i)=><button key={title} className={i===state.tourStep?'active':''} onClick={()=>update({tourStep:i})}><span>{i+1}</span><div><b>{title}</b><small>{i===state.tourStep?'Current step':i<state.tourStep?'Completed':'Upcoming'}</small></div>{i<state.tourStep?<CheckCircle2/>:<ArrowRight/>}</button>)}</Card>
      <Card className="talk-track"><Badge tone="azure">Step {state.tourStep+1} of {tour.length}</Badge><h2>{current[0]}</h2><p className="quote">“{current[2]}”</p><div className="talk-points"><h3>Presenter action</h3><p>Open <b>{current[0]}</b>, use the visible controls, and connect the page evidence to Verizon’s proactive SMB growth motion.</p><h3>Executive emphasis</h3><p>Keep customer consent, human control, transparent recommendations, and cost per business outcome central to the narrative.</p></div><div className="button-row"><Button variant="secondary" disabled={state.tourStep===0} onClick={()=>go(state.tourStep-1)}>Previous</Button><Button onClick={()=>go(state.tourStep)}><ExternalLink/> Open step</Button><Button variant="secondary" disabled={state.tourStep===tour.length-1} onClick={()=>go(state.tourStep+1)}>Next</Button></div></Card>
    </div>
    <Card><SectionTitle title="Presenter controls"/><div className="button-row"><Button variant="secondary" onClick={()=>update({tourStep:0})}>Restart tour</Button><Button variant="danger" onClick={()=>{reset();navigate('/')}}>Reset scenario</Button><Button variant="ghost" onClick={()=>navigate('/')}>Exit tour</Button></div></Card>
    <Disclaimer/>
  </>
}
