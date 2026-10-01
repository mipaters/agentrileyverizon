import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { defaultWeights } from '../lib/prospectScoring'
import type { DemoState, ScenarioId } from '../types'

const defaultState: DemoState = {
  scenarioId: 'pilot',
  selectedProspectId: 'VB-0001',
  currency: 'USD',
  workflowStep: 0,
  outreachStarted: false,
  privateOfferPublished: false,
  paused: false,
  optedOut: false,
  conversationPath: 1,
  conversationTurn: 0,
  conversationChoice: -1,
  bantResponses: [],
  tourStep: 0,
  scoreWeights: defaultWeights,
  qualification: { need: 82, authority: 74, budget: 65, timing: 84, digitalReadiness: 88, complexity: 28, consent: true, existingPartner: false },
}

type DemoContextValue = {
  state: DemoState
  update: (patch: Partial<DemoState>) => void
  selectScenario: (id: ScenarioId) => void
  reset: () => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => {
    try {
      const saved = localStorage.getItem('agent-riley-demo')
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState
    } catch {
      return defaultState
    }
  })
  useEffect(() => localStorage.setItem('agent-riley-demo', JSON.stringify(state)), [state])
  const value = useMemo(() => ({
    state,
    update: (patch: Partial<DemoState>) => setState(s => ({ ...s, ...patch })),
    selectScenario: (scenarioId: ScenarioId) => setState(s => ({ ...s, scenarioId })),
    reset: () => {
      localStorage.removeItem('agent-riley-demo')
      setState(defaultState)
    },
  }), [state])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const value = useContext(DemoContext)
  if (!value) throw new Error('useDemo must be used within DemoProvider')
  return value
}
