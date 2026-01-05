'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, Wallet, Ticket, Building2, Users } from "lucide-react";

interface AnalyticsClientProps {
    data: {
        financialData: any[];
        occupancyData: any[];
        occupancyRate: number;
        ticketTrendData: any[];
        userGrowthData: any[];
        kpis: {
            totalRevenueYTD: number;
            vacancyRate: number;
            maintenanceCost: number;
        }
    }
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

export function AnalyticsClient({ data }: AnalyticsClientProps) {
    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold text-foreground">Analytics & Reports</h1>
                <p className="text-muted-foreground font-medium">Deep dive into your portfolio's performance with real-time data.</p>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="shadow-lg border-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Total Revenue (YTD)</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-foreground">₦{data.kpis.totalRevenueYTD.toLocaleString()}</div>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1 font-medium">
                            Aggregated successful payments
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg border-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Vacancy Rate</CardTitle>
                        <Building2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-foreground">{data.kpis.vacancyRate}%</div>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                            Units without active lease
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg border-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Maintenance Cost</CardTitle>
                        <Ticket className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-foreground">₦{data.kpis.maintenanceCost.toLocaleString()}</div>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                            Approved (Current Month)
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg border-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Active Ecosystem</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-foreground">
                            {data.userGrowthData.reduce((acc, curr) => acc + curr.tenants + curr.landlords, 0)}
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                            New users (Last 6 Months)
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Financial Performance Chart */}
                <Card className="col-span-1 lg:col-span-2 shadow-xl border-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold font-serif text-primary">Financial Performance</CardTitle>
                        <CardDescription className="font-medium text-muted-foreground">Monthly revenue overview for the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.financialData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    formatter={(value: any) => [`₦${value.toLocaleString()}`, "Revenue"]}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* User Growth Chart - NEW FEATURE */}
                <Card className="shadow-xl border-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold font-serif text-primary">Stakeholder Growth</CardTitle>
                        <CardDescription className="font-medium text-muted-foreground">Analysis of new Tenants and Landlords monthly.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.userGrowthData}>
                                <defs>
                                    <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLandlords" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))' }} />
                                <Area type="monotone" dataKey="tenants" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorTenants)" />
                                <Area type="monotone" dataKey="landlords" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLandlords)" />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/20"></div> New Tenants
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20"></div> New Landlords
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Ticket Volume */}
                <Card className="shadow-xl border-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold font-serif text-primary">Support Ticket Volume</CardTitle>
                        <CardDescription className="font-medium text-muted-foreground">Number of new tickets reported this week.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.ticketTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))' }} />
                                <Line type="monotone" dataKey="tickets" stroke="#d97706" strokeWidth={4} dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Occupancy Distribution */}
                <Card className="shadow-xl border-primary/5 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold font-serif text-primary">Occupancy Distribution</CardTitle>
                        <CardDescription className="font-medium text-muted-foreground">Current snapshot of property usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.occupancyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={95}
                                    paddingAngle={10}
                                    dataKey="value"
                                >
                                    {data.occupancyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-black text-3xl">
                                    {data.occupancyRate}%
                                </text>
                                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                                    Occupancy
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground uppercase">Occupied ({data.occupancyData[0].value})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-muted"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground uppercase">Vacant ({data.occupancyData[1].value})</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
