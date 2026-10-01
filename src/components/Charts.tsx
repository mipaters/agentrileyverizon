import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const RED = '#e4002b'
const BLUE = '#246bfd'
const GREEN = '#14804a'
const AMBER = '#d97706'
const GREY = '#a1a1aa'

export function FunnelChart({ data }: { data: { name: string; value: number }[] }) {
  return <div className="chart" role="img" aria-label="Lead-to-order funnel"><ResponsiveContainer width="100%" height={280}><BarChart data={data} layout="vertical" margin={{ left: 28 }}><CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number"/><YAxis type="category" dataKey="name" width={118} tick={{ fontSize: 11 }}/><Tooltip/><Bar dataKey="value" fill={RED} radius={[0,5,5,0]}/></BarChart></ResponsiveContainer></div>
}

export function RouteChart({ multiplier = 1 }: { multiplier?: number }) {
  const data = [{ name: 'Private offer', value: 68*multiplier, color: BLUE }, { name: 'No sale', value: 32*multiplier, color: GREY }]
  return <div className="chart" role="img" aria-label="Opportunity route mix"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>{data.map(x => <Cell key={x.name} fill={x.color}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div>
}

export function TrendChart({ scaled = 1 }: { scaled?: number }) {
  const data = ['Jan','Feb','Mar','Apr','May','Jun'].map((month, i) => ({ month, pipeline: Math.round((220000+i*94000)*scaled), azure: Math.round((6800+i*540)*scaled) }))
  return <div className="chart" role="img" aria-label="Pipeline and Azure cost trend"><ResponsiveContainer width="100%" height={280}><LineChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis yAxisId="left"/><YAxis yAxisId="right" orientation="right"/><Tooltip/><Legend/><Line yAxisId="left" type="monotone" dataKey="pipeline" stroke={GREEN} strokeWidth={3}/><Line yAxisId="right" type="monotone" dataKey="azure" stroke={BLUE} strokeWidth={3}/></LineChart></ResponsiveContainer></div>
}

export function CostChart({ data }: { data: { name: string; value: number }[] }) {
  return <div className="chart" role="img" aria-label="Azure cost by service"><ResponsiveContainer width="100%" height={280}><BarChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{ fontSize: 11 }}/><YAxis/><Tooltip/><Bar dataKey="value" fill={BLUE} radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div>
}

export const chartColors = { RED, BLUE, GREEN, AMBER, GREY }
