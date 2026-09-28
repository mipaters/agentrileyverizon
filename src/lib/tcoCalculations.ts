import type { DemoScenario } from '../types'
import { calculateFunnel } from './funnelCalculations'

export function calculateBusinessCase(s: DemoScenario, implementation = 0, funding = 0) {
  const funnel = calculateFunnel(s)
  const qualified = funnel.find(x => x.name === 'Qualified')?.value ?? 0
  const sales = funnel.find(x => x.name === 'Closed')?.value ?? 0
  const annualAzure = s.monthlyAzure * 12
  const bookings = sales * 48500
  const grossMargin = bookings * .42
  const threeYearOperating = annualAzure * 3
  const grossTco = implementation + threeYearOperating
  const benefit = grossMargin * 3
  const netValue = benefit - grossTco
  return {
    qualified, sales, annualAzure, bookings, grossMargin, threeYearOperating, grossTco, benefit, netValue,
    netVerizonInvestment: Math.max(0, implementation - funding),
    costPerQualified: qualified ? annualAzure/qualified : null,
    costPerSale: sales ? annualAzure/sales : null,
    roi: implementation ? netValue/grossTco : null,
    breakEvenSales: implementation ? Math.ceil(grossTco/(48500*.42)) : null,
    paybackMonths: implementation && grossMargin ? Math.ceil(grossTco/(grossMargin/12)) : null,
  }
}
