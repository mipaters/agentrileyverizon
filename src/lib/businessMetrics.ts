import type { DemoScenario } from '../types'
import { calculateFunnel } from './funnelCalculations'

export function calculateBusinessMetrics(s: DemoScenario) {
  const funnel = calculateFunnel(s)
  const qualified = funnel.find(x => x.name === 'Qualified')?.value ?? 0
  const sales = funnel.find(x => x.name === 'Closed')?.value ?? 0
  const annualAzure = s.monthlyAzure * 12
  const bookings = sales * 48500
  const grossMargin = bookings * .42
  return {
    qualified,
    sales,
    annualAzure,
    bookings,
    grossMargin,
    costPerQualified: qualified ? annualAzure / qualified : null,
    costPerSale: sales ? annualAzure / sales : null,
  }
}
