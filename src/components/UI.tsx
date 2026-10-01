import type { HTMLAttributes, ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, ChevronRight, Info, ShieldCheck } from 'lucide-react'

export const DISCLAIMER = 'Concept demonstration using synthetic customer, offer, marketplace, operational, and financial data. All customer records, product recommendations, prices, qualification outcomes, Azure consumption estimates, bookings, margins, and unit-economics calculations are illustrative. The demo does not connect to live Verizon, Beyond Now, or Microsoft systems. Final architecture, commercial terms, pricing, compliance requirements, and operating costs require Verizon and Microsoft review.'

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow?: string; title: string; children?: ReactNode; actions?: ReactNode }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children && <div className="page-copy">{children}</div>}</div>{actions && <div className="page-actions">{actions}</div>}</div>
}

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`card ${className}`} {...props}>{children}</section>
}

export function Metric({ label, value, note, tone = 'default' }: { label: string; value: ReactNode; note?: string; tone?: 'default' | 'positive' | 'warning' | 'azure' }) {
  return <Card className={`metric ${tone}`}><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</Card>
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'azure' }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

export function SectionTitle({ title, copy, action }: { title: string; copy?: string; action?: ReactNode }) {
  return <div className="section-title"><div><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{action}</div>
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warning' | 'success' }) {
  const Icon = tone === 'warning' ? AlertTriangle : tone === 'success' ? CheckCircle2 : Info
  return <div className={`notice ${tone}`}><Icon size={18}/><div>{children}</div></div>
}

export function Progress({ value, tone = 'red' }: { value: number; tone?: 'red' | 'green' | 'blue' | 'amber' }) {
  return <div className="progress" aria-label={`${Math.round(value)} percent`}><span className={tone} style={{ width: `${Math.min(100, Math.max(0, value))}%` }}/></div>
}

export function Button({ children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <button className={`button ${variant}`} type="button" {...props}>{children}</button>
}

export function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="field"><span>{label}</span><input {...props}/></label>
}

export function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span><select {...props}>{children}</select></label>
}

export function Disclaimer() {
  return <div className="disclaimer"><ShieldCheck size={18}/><p>{DISCLAIMER}</p></div>
}

export function Journey({ active = 8 }: { active?: number }) {
  const items = ['Target','Validate','Engage','Qualify','Recommend','Approve','Route','Convert','Measure']
  return <div className="journey">{items.map((item, i) => <div className={i <= active ? 'active' : ''} key={item}><span>{i + 1}</span><b>{item}</b>{i < items.length - 1 && <ChevronRight size={16}/>}</div>)}</div>
}
