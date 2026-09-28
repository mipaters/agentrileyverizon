import type { DemoScenario } from '../types'

export function calculateFunnel(s: DemoScenario) {
  const accounts = 12000 * s.accountMultiplier
  const stages = [
    ['Accounts evaluated', accounts],
    ['High propensity', accounts*.18],
    ['Contactable', accounts*.15],
    ['Consent validated', accounts*.13],
    ['Contacted', accounts*.11],
    ['Responded', accounts*.11*s.responseRate],
    ['Qualification complete', accounts*.11*s.responseRate*s.qualificationRate],
    ['Qualified', accounts*.11*s.responseRate*s.qualificationRate*.68],
    ['Human approved', accounts*.11*s.responseRate*s.qualificationRate*.61],
    ['Closed', accounts*.11*s.responseRate*s.qualificationRate*.61*s.closeRate],
  ] as [string, number][]
  return stages.map(([name, value], i) => ({ name, value: Math.round(value), conversion: i ? value/stages[i-1][1] : 1 }))
}
