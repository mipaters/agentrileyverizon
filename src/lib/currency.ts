export const CAD_RATE = 1.36
export function convertCurrency(value: number, currency: 'USD' | 'CAD') {
  return currency === 'CAD' ? value * CAD_RATE : value
}
export function formatCurrency(value: number | null, currency: 'USD' | 'CAD', compact = true) {
  if (value === null || !Number.isFinite(value)) return 'Not available'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: compact ? 'compact' : 'standard', maximumFractionDigits: compact ? 1 : 0 }).format(convertCurrency(value, currency))
}
