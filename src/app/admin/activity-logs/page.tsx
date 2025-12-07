
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";


export default async function ActivityLogsPage() {
    // Fetch logs with user details
    const logs = await prisma.activityLog.findMany({
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
            <h1 className="text-3xl font-serif font-bold text-foreground">Activity Log</h1>
            <p className="text-muted-foreground">TRACKING SYSTEM EVENTS AND USER ACTIONS</p>

            <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Entity</th>
                                <th className="px-6 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="bg-card border-b border-border hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {format(new Date(log.createdAt), "PPpp")}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.user ? (
                                            <div>
                                                <div className="font-medium text-foreground">{log.user.name || 'Unknown'}</div>
                                                <div className="text-xs text-muted-foreground">{log.user.email}</div>
                                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">
                                                    {log.user.role}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">System</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800' :
                                                log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                                                    log.action === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                                                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                            log.action === 'APPROVE' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {log.entity} <br />
                                        <span className="text-muted-foreground">{log.entityId}</span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-xs text-muted-foreground" title={log.details || ''}>
                                        {log.details || '-'}
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
