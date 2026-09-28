import type { OfferBundle } from '../types'

export const offers: OfferBundle[] = [
  ['secure', 'Verizon Secure Productivity Starter', 'A secure productivity foundation for growing teams.', ['Microsoft 365 Business Premium', 'Defender for Business'], ['Business wireless'], '25-100 employees', 'Marketplace', 42, 750, 25800, 8400, .41],
  ['growth', 'Verizon Modern Work Growth', 'Modern collaboration and managed connectivity for distributed growth.', ['Microsoft 365 Business Standard', 'Teams Phone'], ['Business Internet', 'Teams Phone connectivity'], '50-250 employees', 'Marketplace', 58, 1400, 38400, 15600, .38],
  ['ai', 'Verizon AI-Ready Business', 'Copilot readiness, security, and adoption services.', ['Microsoft 365 Business Premium', 'Microsoft 365 Copilot'], ['Professional services'], '75-300 employees', 'Marketplace', 84, 3200, 72600, 22800, .44],
  ['phone', 'Verizon Teams Phone and Connectivity', 'Cloud calling with resilient Verizon connectivity.', ['Microsoft Teams Phone'], ['Teams Phone connectivity', 'Business Internet'], '25-200 employees', 'Marketplace', 49, 950, 29400, 18200, .40],
  ['hybrid', 'Verizon Secure Hybrid Workforce', 'Secure work from anywhere with managed endpoints.', ['Microsoft 365 Business Premium', 'Defender for Business'], ['Mobile device management', 'Business security services'], '50-300 employees', 'Marketplace', 72, 2400, 51600, 26400, .43],
  ['connected', 'Verizon Connected Copilot Business', 'AI productivity paired with mobile-first business connectivity.', ['Microsoft 365 Copilot', 'Surface Copilot+ PC'], ['Business wireless plan', 'Connected-device plan'], '50-250 employees', 'Marketplace', 105, 4100, 84600, 31800, .46],
  ['digital', 'Verizon Marketplace Digital Starter', 'A simple, self-service Microsoft 365 starting point.', ['Microsoft 365 Business Basic'], ['Business support services'], '10-75 employees', 'Marketplace', 24, 250, 12600, 4200, .35],
  ['complete', 'Verizon Business Complete', 'A full productivity, security, calling, and connectivity package.', ['Microsoft 365 Business Premium', 'Microsoft 365 Copilot', 'Teams Phone'], ['Managed connectivity', 'Business security services', 'Professional services'], '100-500 employees', 'Marketplace', 139, 6500, 118000, 49600, .48],
].map(([id, name, description, products, verizonServices, target, route, monthlyPrice, setupCost, microsoftAcv, verizonAcv, margin]) => ({
  id, name, description, products, verizonServices, target, route, monthlyPrice, setupCost, microsoftAcv, verizonAcv, margin,
})) as OfferBundle[]

export const microsoftProducts = ['Microsoft 365 Business Basic', 'Microsoft 365 Business Standard', 'Microsoft 365 Business Premium', 'Microsoft 365 Copilot', 'Microsoft Teams Phone', 'Microsoft Defender for Business', 'Microsoft security bundle', 'Surface Copilot+ PC', 'Azure starter services', 'Power Platform starter package']
export const verizonProducts = ['Verizon Business Internet', 'Verizon Business wireless plan', 'Verizon 5G Business Internet', 'Managed connectivity', 'Mobile device management', 'Business security services', 'Teams Phone connectivity', 'Business support services', 'Connected-device plan', 'Professional services']
