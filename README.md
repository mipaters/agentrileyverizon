# Agent Riley for Verizon Business

An executive demonstration of an AI-powered digital inside-sales engine for Verizon Business Marketplace. The application uses synthetic data to demonstrate prospect prioritization, compliant outreach, qualification, offer recommendation, human-controlled routing, pipeline measurement, Azure operating costs, TCO, FinOps, and Responsible AI controls.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The demo has no database, authentication, external APIs, API keys, live customer data, or live Verizon or Microsoft service connections. Demo state is persisted in `localStorage` and can be restored with the global **Reset Demo** action.
