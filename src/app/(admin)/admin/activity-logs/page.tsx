import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
    Search,
    Filter,
    Calendar as CalendarIcon,
    Shield,
    Smartphone,
    Globe,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";

export default async function ActivityLogsPage({ searchParams }: { searchParams: Promise<{ entity?: string; action?: string; user?: string }> }) {
    const { entity, action: actionFilter, user: userQuery } = await searchParams;

    // Build Where Clause
    const where: any = {};
    if (entity && entity !== 'ALL') where.entity = entity;
    if (actionFilter && actionFilter !== 'ALL') where.action = actionFilter;
    if (userQuery) {
        where.user = {
            OR: [
                { email: { contains: userQuery, mode: 'insensitive' } },
                { name: { contains: userQuery, mode: 'insensitive' } }
            ]
        };
    }

    // Fetch logs with user details
    const logs = await prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true, role: true }
            }
        },
        take: 100 // Limit for performance
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Activity Log</h1>
                    <p className="text-muted-foreground mt-1">Audit trail of system events, user actions, and security alerts.</p>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-card p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {/* Entity Filter */}
                    <Link href={`/admin/activity-logs?entity=ALL`} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${!entity || entity === 'ALL' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}>
                        ALL
                    </Link>
                    {['TICKET', 'USER', 'PAYMENT', 'PROPERTY'].map(e => (
                        <Link key={e} href={`/admin/activity-logs?entity=${e}`} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${entity === e ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}>
                            {e}
                        </Link>
                    ))}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    {/* Action Filter (Simple links for now, could be dropdown) */}
                    {['LOGIN', 'APPROVE', 'DELETE'].map(a => (
                        <Link key={a} href={`/admin/activity-logs?action=${a}`} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${actionFilter === a ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}>
                            {a}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Timestamp & Source</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4">State Change / Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {logs.map((log) => (
                                <tr key={log.id} className="bg-card hover:bg-muted/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-mono font-medium text-xs">
                                                {format(new Date(log.createdAt), "PP pp")}
                                            </span>
                                            {/* Security Meta */}
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
                                                {log.ipAddress && (
                                                    <span className="flex items-center gap-1" title="IP Address">
                                                        <Globe size={10} /> {log.ipAddress}
                                                    </span>
                                                )}
                                                {log.userAgent && (
                                                    <span className="flex items-center gap-1 max-w-[100px] truncate" title={log.userAgent}>
                                                        <Smartphone size={10} /> {log.userAgent}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.user ? (
                                            <div>
                                                <div className="font-bold text-sm text-foreground">{log.user.name || 'Unknown'}</div>
                                                <div className="text-xs text-muted-foreground">{log.user.email}</div>
                                                <span className="inline-block mt-1 text-[9px] font-black tracking-widest bg-primary/5 text-primary px-1.5 py-0.5 rounded uppercase">
                                                    {log.user.role}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-muted-foreground font-medium italic text-xs">
                                                <Shield size={12} /> System Action
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider
                                            ${log.action === 'LOGIN' ? 'bg-blue-500/10 text-blue-600 border border-blue-200/50' :
                                                log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/50' :
                                                    log.action === 'UPDATE' ? 'bg-amber-500/10 text-amber-600 border border-amber-200/50' :
                                                        log.action === 'DELETE' ? 'bg-red-500/10 text-red-600 border border-red-200/50' :
                                                            log.action === 'APPROVE' ? 'bg-purple-500/10 text-purple-600 border border-purple-200/50' :
                                                                'bg-gray-100 text-gray-600'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs uppercase text-foreground">{log.entity}</span>
                                            <span className="font-mono text-[10px] text-muted-foreground">{log.entityId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {log.previousState && log.newState ? (
                                            <div className="bg-muted/30 p-2 rounded-lg border border-border/50 space-y-1 max-w-md">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <span className="line-through decoration-red-400 decoration-2">{log.previousState}</span>
                                                    <ArrowRight size={12} />
                                                    <span className="text-foreground font-bold">{log.newState}</span>
                                                </div>
                                                {log.details && (
                                                    <div className="border-t border-border/50 pt-1 mt-1 text-[10px] text-muted-foreground line-clamp-2">
                                                        {log.details}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="max-w-xs text-muted-foreground break-words">
                                                {log.details ? (
                                                    <span className="line-clamp-3" title={log.details}>{log.details}</span>
                                                ) : (
                                                    <span className="opacity-50">-</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
