'use server'

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createMaterial(formData: FormData) {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const priceString = formData.get("price") as string;
    const images = formData.get("images") as string;

    // Basic validation
    if (!name || !category || !description) {
        throw new Error("Missing required fields");
    }

    const price = priceString ? parseFloat(priceString) : null;

    try {
        await prisma.material.create({
            data: {
                name,
                category,
                description,
                price: price,
                images: images || "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=2000&auto=format&fit=crop", // Default placeholder
                inStock: true
            }
        });
    } catch (error) {
        console.error("Failed to create material:", error);
        throw new Error("Failed to create material");
    }

    revalidatePath("/admin/materials");
    revalidatePath("/materials");
    redirect("/admin/materials");
}

export async function updateMaterial(materialId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const priceString = formData.get("price") as string;
    const images = formData.get("images") as string;

    if (!materialId || !name || !category || !description) {
        throw new Error("Missing required fields");
    }

    const price = priceString ? parseFloat(priceString) : null;

    try {
        await prisma.material.update({
            where: { id: materialId },
            data: {
                name,
                category,
                description,
                price: price,
                images: images,
            }
        });
    } catch (error) {
        console.error("Failed to update material:", error);
        throw new Error("Failed to update material");
    }

    revalidatePath("/admin/materials");
    revalidatePath("/materials");
    redirect("/admin/materials");
}
