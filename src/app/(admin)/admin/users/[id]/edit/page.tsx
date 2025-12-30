import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditUserForm } from "@/components/admin/users/EditUserForm";

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            landlordProfile: true,
        }
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <EditUserForm user={user as any} />
        </div>
    );
}
