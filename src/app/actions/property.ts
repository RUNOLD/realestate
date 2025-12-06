'use server'

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProperty(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const status = formData.get("status") as "AVAILABLE" | "RENTED" | "SOLD" | "MAINTENANCE";
    const images = formData.get("images") as string;

    // Basic validation
    if (!title || !description || isNaN(price) || !location || !type) {
        throw new Error("Missing required fields");
    }

    try {
        await prisma.property.create({
            data: {
                title,
                description,
                price,
                location,
                type,
                status: status || "AVAILABLE",
                images: images || "[]", // Default to empty JSON array string if empty
                features: "[]"
            }
        });
    } catch (error) {
        console.error("Failed to create property:", error);
        throw new Error("Failed to create property");
    }

    revalidatePath("/admin/properties");
    redirect("/admin/properties");
}
