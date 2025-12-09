'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../auth";
import bcrypt from 'bcryptjs';

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name, phone }
        });
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (e) {
        console.error("Update Profile Error:", e);
        return { error: "Failed to update profile" };
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (newPassword.length < 6) return { error: "New password must be at least 6 characters long." };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return { error: "User not found" };

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) return { error: "Incorrect current password" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
    });

    return { success: true };
}
