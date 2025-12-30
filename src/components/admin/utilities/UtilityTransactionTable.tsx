"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export function UtilityTransactionTable({ initialData }: { initialData: any[] }) {
    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="border-b border-border p-4 flex justify-between items-center bg-muted/30">
                <h3 className="font-bold text-sm uppercase text-muted-foreground">Recent Transactions</h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Meter / Token</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    )}
                    {initialData.map((txn) => (
                        <TableRow key={txn.id}>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                                {format(new Date(txn.createdAt), "PP pp")}
                            </TableCell>
                            <TableCell className="font-mono text-xs font-bold">{txn.reference}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">{txn.user.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{txn.user.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono">{txn.meterNumber}</span>
                                    {txn.token && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded w-fit select-all">{txn.token}</span>}
                                </div>
                            </TableCell>
                            <TableCell className="font-bold">₦{txn.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-green-600 font-mono text-xs">+₦{txn.commission}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`
                                    ${txn.status === 'SUCCESS' ? 'bg-green-50 text-green-700 border-green-200' :
                                        txn.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-200'}
                                `}>
                                    {txn.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
