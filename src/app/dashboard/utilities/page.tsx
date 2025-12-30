import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Zap, History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default async function TenantUtilitiesPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const transactions = await prisma.utilityTransaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">My Utilities</h1>
                    <p className="text-muted-foreground">Manage electricity tokens and payments.</p>
                </div>
                <Button className="bg-primary text-primary-foreground gap-2">
                    <Zap size={16} /> Buy Electricity
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <History size={18} /> Transaction History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Meter</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Token</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No purchase history found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {transactions.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell className="text-xs">
                                        {format(new Date(txn.createdAt), "PP")}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{txn.meterNumber}</TableCell>
                                    <TableCell className="font-bold">₦{txn.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        {txn.token ? (
                                            <span className="font-mono bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs select-all">
                                                {txn.token}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">-</span>
                                        )}
                                    </TableCell>
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
                </CardContent>
            </Card>
        </div>
    );
}
