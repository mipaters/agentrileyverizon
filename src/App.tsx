import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DemoProvider } from './state/DemoContext'
import { AgentWorkspace, ArchitectureGovernance, CustomerZero, DemoGuide, ExecutiveOverview, MarketplaceJourney, OfferStudio, ProspectIntelligence, QualifiedPipeline, TcoBusinessCase } from './pages/Pages'

export default function App() {
  return <BrowserRouter><DemoProvider><Layout><Routes>
    <Route path="/" element={<ExecutiveOverview/>}/>
    <Route path="/prospects" element={<ProspectIntelligence/>}/>
    <Route path="/workspace" element={<AgentWorkspace/>}/>
    <Route path="/offers" element={<OfferStudio/>}/>
    <Route path="/pipeline" element={<QualifiedPipeline/>}/>
    <Route path="/marketplace" element={<MarketplaceJourney/>}/>
    <Route path="/customer-zero" element={<CustomerZero/>}/>
    <Route path="/tco" element={<TcoBusinessCase/>}/>
    <Route path="/architecture" element={<ArchitectureGovernance/>}/>
    <Route path="/guide" element={<DemoGuide/>}/>
    <Route path="*" element={<ExecutiveOverview/>}/>
  </Routes></Layout></DemoProvider></BrowserRouter>
}
