import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsContent } from "@/components/admin/SettingsContent";
import { redirect } from "next/navigation";

export default async function TenantSettingsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="max-w-7xl mx-auto">
            <SettingsContent user={user} />
        </div>
    );
}
