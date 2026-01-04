
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, User, Building2, CheckCircle, Clock } from "lucide-react";
import { approvePayoutAction } from "@/actions/payouts";
import { ApprovePayoutButton } from "@/components/admin/payouts/ApprovePayoutButton";

export default async function PayoutsPage() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        redirect("/login");
    }

    // 1. Fetch Landlords with their properties and payments
    const landlords = await prisma.user.findMany({
        where: { role: 'LANDLORD' },
        include: {
            ownedProperties: {
                include: {
                    payments: {
                        where: { status: 'SUCCESS', category: 'RENT' },
                        include: { user: { select: { name: true } } }
                    },
                    expenses: {
                        where: { status: 'APPROVED' }
                    }
                }
            },
            payouts: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    // 2. Process data to find "Pending Payouts" (Payments after last payout)
    const pendingPayouts = landlords.map(landlord => {
        const lastPayout = landlord.payouts[0];
        const lastPayoutDate = lastPayout ? lastPayout.periodEnd : new Date(0);

        // Grouping by Property (Building or Single)
        const propertyGroups: Record<string, {
            title: string;
            managementFee: number;
            totalCollected: number;
            totalExpenses: number;
            units: string[];
            paymentsCount: number;
            expensesCount: number;
        }> = {};

        landlord.ownedProperties.forEach(property => {
            // Determine the "Header" property for grouping (either itself or its parent)
            const groupId = property.parentId || property.id;

            // Find the parent fee if it's a unit, otherwise use its own fee
            // Note: In this fetch, we might need parent details if it's a unit.
            // For now, assume siblings share the same landlord and we can find the fee.
            // If parentId exists, we should have fetched the parent too, or we can use the current property's fee if we assume they match.
            // Ideally, we fetch the parent's fee.

            if (!propertyGroups[groupId]) {
                propertyGroups[groupId] = {
                    title: property.parentId ? "Multi-Unit Property" : (property as any).title,
                    managementFee: Number((property as any).managementFee) || 10, // Fallback
                    totalCollected: 0,
                    totalExpenses: 0,
                    units: [],
                    paymentsCount: 0,
                    expensesCount: 0
                };
            }

            // If we found the "Parent" (building) record, use its title and fee
            if (!property.parentId) { // Use parent's title and fee
                propertyGroups[groupId].title = (property as any).title;
                propertyGroups[groupId].managementFee = Number((property as any).managementFee) || 10;
            }

            property.payments.forEach(payment => {
                if (new Date(payment.createdAt) > lastPayoutDate) {
                    propertyGroups[groupId].totalCollected += payment.amount;
                    propertyGroups[groupId].paymentsCount++;
                }
            });

            property.expenses.forEach(expense => {
                if (new Date(expense.createdAt) > lastPayoutDate && !expense.payoutId) {
                    propertyGroups[groupId].totalExpenses += expense.amount;
                    propertyGroups[groupId].expensesCount++;
                }
            });

            if (property.unitNumber) propertyGroups[groupId].units.push(property.unitNumber);
        });

        return Object.entries(propertyGroups).map(([groupId, group]) => {
            const safeCol = Number(group.totalCollected) || 0;
            const safeFee = Number(group.managementFee) || 10;
            const safeExp = Number(group.totalExpenses) || 0;

            const commission = safeCol * (safeFee / 100);
            const netPayable = safeCol - commission - safeExp;

            return {
                landlord,
                groupId,
                propertyTitle: group.title,
                managementFee: safeFee,
                totalCollected: safeCol,
                totalExpenses: safeExp,
                commission: Number(commission.toFixed(2)),
                netPayable: Number(netPayable.toFixed(2)),
                paymentsCount: group.paymentsCount,
                expensesCount: group.expensesCount,
                units: group.units,
                hasPending: group.paymentsCount > 0 || group.expensesCount > 0
            };
        });
    }).flat().filter(p => p.hasPending);

    return (
        <div className="space-y-8 p-6 sm:p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Payouts Management</h1>
                    <p className="text-muted-foreground mt-1">Review and approve net payments to landlords.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Pending Payouts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{pendingPayouts.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Landlords awaiting settlement</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Net Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">
                            ₦{pendingPayouts.reduce((sum, p) => sum + (Number(p.netPayable) || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">After commission & expenses</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Landlord Payout Queue</CardTitle>
                    <CardDescription>Grouped by Landlord. Review net calculations before processing.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Gross Income</TableHead>
                                <TableHead>Commission Rate</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead className="font-bold">Net Payout</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingPayouts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        No pending payouts to process.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingPayouts.map((p, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div className="font-medium text-foreground">{p.propertyTitle}</div>
                                            <div className="text-xs text-muted-foreground">Owner: {p.landlord.name}</div>
                                        </TableCell>
                                        <TableCell>₦{p.totalCollected.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                                {p.managementFee}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-amber-600 text-xs">Mgt: -₦{p.commission.toLocaleString()}</div>
                                            <div className="text-red-500 text-xs text-nowrap">Exp: -₦{p.totalExpenses.toLocaleString()}</div>
                                        </TableCell>
                                        <TableCell className="font-bold text-emerald-600">₦{p.netPayable.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-xs font-semibold">{p.paymentsCount} payments</div>
                                                {p.units.length > 0 && (
                                                    <div className="text-[10px] text-muted-foreground max-w-[150px] truncate">
                                                        Units: {p.units.join(", ")}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ApprovePayoutButton
                                                landlordId={p.landlord.id}
                                                propertyId={p.groupId}
                                                amount={p.netPayable}
                                                totalCollected={p.totalCollected}
                                                commission={p.commission}
                                                managementFee={p.managementFee}
                                                totalExpenses={p.totalExpenses}
                                                propertyTitle={p.propertyTitle}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
