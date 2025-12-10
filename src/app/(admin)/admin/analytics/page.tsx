'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, TrendingDown, Users, Wallet, Ticket, Building2 } from "lucide-react";

// Mock Data (In a real app, this would be passed as props from a server component)
const financialData = [
    { name: 'Jan', revenue: 4000000 },
    { name: 'Feb', revenue: 3000000 },
    { name: 'Mar', revenue: 2000000 },
    { name: 'Apr', revenue: 2780000 },
    { name: 'May', revenue: 1890000 },
    { name: 'Jun', revenue: 2390000 },
];

const occupancyData = [
    { name: 'Occupied', value: 85 },
    { name: 'Vacant', value: 15 },
];

const COLORS = ['#0f172a', '#e2e8f0']; // Dark Blue (Primary) & Slate 200

const ticketTrendData = [
    { name: 'Mon', tickets: 4 },
    { name: 'Tue', tickets: 3 },
    { name: 'Wed', tickets: 7 },
    { name: 'Thu', tickets: 2 },
    { name: 'Fri', tickets: 5 },
    { name: 'Sat', tickets: 1 },
    { name: 'Sun', tickets: 0 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Analytics & Reports</h1>
                <p className="text-slate-500">Deep dive into your portfolio's performance.</p>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Revenue (YTD)</CardTitle>
                        <Wallet className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₦16.8M</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +12.5% from last year
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Vacancy Rate</CardTitle>
                        <Building2 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">15%</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Target: &lt; 10%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Maintenance Cost</CardTitle>
                        <Ticket className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₦1.2M</div>
                        <p className="text-xs text-red-500 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +4.3% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Financial Performance Chart */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Financial Performance</CardTitle>
                        <CardDescription>Monthly revenue overview for the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financialData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Occupancy Rate */}
                <Card>
                    <CardHeader>
                        <CardTitle>Occupancy Distribution</CardTitle>
                        <CardDescription>Current snapshot of property usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={occupancyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {occupancyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 font-bold text-xl">
                                    85%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                                <span className="text-sm text-slate-600">Occupied (85%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                <span className="text-sm text-slate-600">Vacant (15%)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Ticket Volume */}
                <Card>
                    <CardHeader>
                        <CardTitle>Support Ticket Volume</CardTitle>
                        <CardDescription>Number of new tickets reported this week.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ticketTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="tickets" stroke="#d97706" strokeWidth={3} dot={{ fill: '#d97706', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
