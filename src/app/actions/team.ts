'use server'

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createStaffMember(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    try {
        const { generateUniqueId } = await import("@/lib/utils");
        const uniqueId = await generateUniqueId('APM', 'user');

        await prisma.user.create({
            data: {
                uniqueId,
                name,
                email,
                password, // Note: In a real app, hash this password!
                role: "STAFF"
            }
        });
    } catch (error) {
        console.error("Failed to create staff:", error);
        throw new Error("Failed to create staff member");
    }

    revalidatePath("/admin/team");
    redirect("/admin/team");
}
