"use client";

import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingUp, Users, Zap, MessageSquare, ArrowUpRight, BarChart3, Activity } from "lucide-react";

const data = [
  { name: 'Mar 24', sent: 4, received: 12 },
  { name: 'Mar 25', sent: 7, received: 18 },
  { name: 'Mar 26', sent: 12, received: 25 },
  { name: 'Mar 27', sent: 22, received: 42 },
  { name: 'Mar 28', sent: 18, received: 35 },
  { name: 'Mar 29', sent: 35, received: 64 },
  { name: 'Mar 30', sent: 45, received: 78 },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-page-enter p-8 overflow-x-hidden">
      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 stagger-children">
        {[
          { label: 'Total Engagement', val: '1,284', icon: MessageSquare, sub: '+12%', color: 'text-success' },
          { label: 'AI Replies', val: '452', icon: Zap, sub: '35% rate', color: 'text-foreground' },
          { label: 'Unique Accounts', val: '89', icon: Users, sub: 'Active now', color: 'text-foreground' },
          { label: 'Time Saved', val: '14.2h', icon: Activity, sub: 'Est. month', color: 'text-foreground' },
        ].map((m, i) => (
          <div key={i} className="bento-card group">
            <div className="flex items-center justify-between space-y-0 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.label}</h3>
              <m.icon className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
            </div>
            <div className="text-3xl font-bold tracking-tight">{m.val}</div>
            <p className={`text-xs font-medium mt-2 ${m.sub.includes('+') ? m.color : 'text-muted-foreground'}`}>
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 stagger-children">
        {/* Main Chart */}
        <div className="lg:col-span-4 bento-card p-8 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <BarChart3 className="size-32" />
          </div>
          
          <div className="mb-10 flex items-center justify-between relative z-10">
             <div>
              <h3 className="font-bold text-xl text-foreground tracking-tight">Engagement Velocity</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Growth trajectory of AI-handled conversations.</p>
             </div>
             <div className="size-10 rounded-lg bg-success/15 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
             </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  fontWeight="500"
                  dy={10}
                />
                <YAxis 
                   stroke="hsl(var(--muted-foreground))" 
                   fontSize={12} 
                   tickLine={false} 
                   axisLine={false} 
                   fontWeight="500"
                   width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: '500', color: 'hsl(var(--foreground))' }}
                  cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="received" stroke="hsl(var(--muted-foreground) / 0.2)" fillOpacity={0.05} fill="hsl(var(--muted-foreground))" strokeWidth={2} />
                <Area type="monotone" dataKey="sent" stroke="hsl(var(--foreground))" fillOpacity={1} fill="url(#colorSent)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trigger Performance */}
        <div className="lg:col-span-3 bento-card p-8 group">
           <div className="mb-10 flex items-center justify-between">
             <div>
              <h3 className="font-bold text-xl text-foreground tracking-tight">Conversion Triggers</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Highest performing keyword clusters.</p>
             </div>
             <div className="size-10 rounded-lg bg-accent flex items-center justify-center">
                <Zap className="h-5 w-5 text-foreground" />
             </div>
          </div>
          
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'PRICING', hits: 145 },
                { name: 'DEMO', hits: 98 },
                { name: 'SUPPORT', hits: 76 },
                { name: 'JOIN', hits: 42 },
              ]} layout="vertical" barCategoryGap="30%">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={11} 
                  width={70} 
                  fontWeight="600"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--accent) / 0.5)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                />
                <Bar dataKey="hits" radius={[0, 4, 4, 0]} barSize={24}>
                   {[...Array(4)].map((_, index) => (
                     <Cell key={`cell-${index}`} fill={`hsl(var(--foreground) / ${1 - index * 0.2})`} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
