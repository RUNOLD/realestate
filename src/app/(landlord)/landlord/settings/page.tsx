
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsContent } from "@/components/admin/SettingsContent";
import { redirect } from "next/navigation";

export default async function LandlordSettingsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch fresh user data
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            activityLogs: {
                where: { action: 'LOGIN' },
                take: 5,
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) return null;

    return (
        <div className="container max-w-5xl py-8">
            <SettingsContent
                user={{
                    ...user,
                    // Ensure nulls are handled for optional fields
                    name: user.name,
                    image: user.image,
                    phone: user.phone,
                    password: user.password,
                    notificationPreferences: user.notificationPreferences as any,
                    loginHistory: user.activityLogs
                }}
            />
        </div>
    );
}
