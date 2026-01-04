
import { prisma } from "@/lib/prisma";

export class AnalyticsService {

    /**
     * Aggregates metrics for a specific month
     * Can be run as a cron job or on-demand
     */
    static async aggregateMetrics(date: Date = new Date()) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // 1. Global Metrics
        const totalRent = await prisma.payment.aggregate({
            where: {
                status: 'SUCCESS',
                createdAt: { gte: firstDay, lte: lastDay }
            },
            _sum: { amount: true }
        });

        const activeLeases = await prisma.lease.count({ where: { isActive: true } });
        const totalProperties = await prisma.property.count();
        const occupancyRate = totalProperties > 0 ? (activeLeases / totalProperties) * 100 : 0;

        const activeTickets = await prisma.ticket.count({
            where: {
                createdAt: { gte: firstDay, lte: lastDay }
            }
        });

        // 2. Upsert Global Metric
        // 2. Upsert Global Metric
        // Use findFirst/Create pattern to handle nulls in unique constraints safely (Postgres null distinct behavior)
        const existingGlobal = await prisma.monthlyMetric.findFirst({
            where: {
                month: firstDay,
                landlordId: null,
                propertyId: null
            }
        });

        if (existingGlobal) {
            await prisma.monthlyMetric.update({
                where: { id: existingGlobal.id },
                data: {
                    totalRentCollected: totalRent._sum.amount || 0,
                    occupancyRate,
                    activeTickets
                }
            });
        } else {
            await prisma.monthlyMetric.create({
                data: {
                    month: firstDay,
                    landlordId: undefined, // Prisma handles optional as null
                    propertyId: undefined,
                    totalRentCollected: totalRent._sum.amount || 0,
                    occupancyRate,
                    activeTickets
                }
            });
        }

        // 3. Per Landlord Metrics (Simplified loop)
        const landlords = await prisma.user.findMany({ where: { role: 'LANDLORD' } });

        for (const landlord of landlords) {
            await this.aggregateLandlordMetrics(landlord.id, firstDay, lastDay);
        }
    }

    private static async aggregateLandlordMetrics(landlordId: string, start: Date, end: Date) {
        // Rent Inflow
        // We need payment -> property -> landlord link. 
        // Existing schema: Payment -> Model Property -> Owner

        const payments = await prisma.payment.findMany({
            where: {
                status: 'SUCCESS',
                createdAt: { gte: start, lte: end },
                property: { ownerId: landlordId }
            },
            select: { amount: true }
        });
        const rentCollected = payments.reduce((sum, p) => sum + p.amount, 0);

        // Occupancy
        const props = await prisma.property.count({ where: { ownerId: landlordId } });
        const leases = await prisma.lease.count({
            where: {
                isActive: true,
                property: { ownerId: landlordId }
            }
        });
        const occupancy = props > 0 ? (leases / props) * 100 : 0;

        const tickets = await prisma.ticket.count({
            where: {
                landlordId,
                createdAt: { gte: start, lte: end }
            }
        });

        // Upsert
        // We use "null" for propertyId to signify Landlord Aggregate
        // Schema constraint: @@unique([month, landlordId, propertyId])
        // If propertyId is optional strings, we can use distinct value or null if unique allows nulls (Postgres implementation specific for unique index with nulls)
        // Prisma treats nulls as distinct often unless NULLS NOT DISTINCT capability.
        // Safer to use specific ID or handle property breakdown differently.

        // Let's assume we store Landlord aggregate with propertyId = "ALL" or similar if needed, 
        // or just rely on finding one with landlordId defined and propertyId null.

        // BUT unique constraint with NULLs can be tricky. Let's try finding existing.

        const existing = await prisma.monthlyMetric.findFirst({
            where: {
                month: start,
                landlordId,
                propertyId: null
            }
        });

        if (existing) {
            await prisma.monthlyMetric.update({
                where: { id: existing.id },
                data: { totalRentCollected: rentCollected, occupancyRate: occupancy, activeTickets: tickets }
            });
        } else {
            await prisma.monthlyMetric.create({
                data: {
                    month: start,
                    landlordId,
                    totalRentCollected: rentCollected,
                    occupancyRate: occupancy,
                    activeTickets: tickets
                }
            });
        }
    }

    static async getDashboardMetrics(userId: string, role: string) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

        // Always refresh current month metric for real-time accuracy during dashboard load
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        if (role === 'LANDLORD') {
            await this.aggregateLandlordMetrics(userId, firstDay, endOfCurrentMonth);
        } else if (role === 'ADMIN') {
            await this.aggregateMetrics(now);
        }
        let currentMetric = await this.fetchMetric(userId, role, firstDay);

        // Get Previous Month Metric for Trends
        const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMetric = await this.fetchMetric(userId, role, prevDate);

        // Calculate Trends
        const trends = {
            rent: this.calcTrend(currentMetric?.totalRentCollected, prevMetric?.totalRentCollected),
            occupancy: this.calcTrend(currentMetric?.occupancyRate, prevMetric?.occupancyRate),
            tickets: this.calcTrend(currentMetric?.activeTickets, prevMetric?.activeTickets),
        };

        return { current: currentMetric, trends };
    }

    private static async fetchMetric(userId: string, role: string, date: Date) {
        if (role === 'ADMIN') {
            return prisma.monthlyMetric.findFirst({
                where: { month: date, landlordId: null, propertyId: null }
            });
        }
        else if (role === 'LANDLORD') {
            return prisma.monthlyMetric.findFirst({
                where: { month: date, landlordId: userId, propertyId: null }
            });
        }
        return null;
    }

    private static calcTrend(current: number = 0, prev: number = 0): string {
        if (prev === 0) {
            return current > 0 ? "New Data" : "Stable";
        }
        const diff = current - prev;
        const percent = (diff / prev) * 100;

        // Cap extreme trends for UI readability
        if (percent > 999) return "+999%";
        if (percent < -99) return "-99%";

        return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
    }
}
