import { AnalyticsService } from "@/lib/analytics";
import { AnalyticsClient } from "@/components/admin/analytics/AnalyticsClient";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const data = await AnalyticsService.getAnalyticsData();

    return (
        <AnalyticsClient data={data} />
    );
}
