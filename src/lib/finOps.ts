export function calculateFinOpsAlerts(spend: number, budget: number) {
  const utilization = budget ? spend / budget : 0
  return [0.5, .75, .9, 1].filter(t => utilization >= t).map(t => ({ threshold: t, label: `${t*100}% budget threshold reached`, severity: t >= 1 ? 'breach' : t >= .9 ? 'warning' : 'notice' }))
}
