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

    // Specifications
    const bedrooms = formData.get("bedrooms") ? parseInt(formData.get("bedrooms") as string) : null;
    const bathrooms = formData.get("bathrooms") ? parseInt(formData.get("bathrooms") as string) : null;
    const sqft = formData.get("sqft") ? parseInt(formData.get("sqft") as string) : null;

    // Basic validation
    if (!title || !description || isNaN(price) || !location || !type) {
        throw new Error("Missing required fields");
    }

    // Safe image handling
    let imageArray: string[] = [];
    if (images) {
        try {
            // Try parsing if it's a JSON array string
            const parsed = JSON.parse(images);
            imageArray = Array.isArray(parsed) ? parsed : [images];
        } catch {
            // If not JSON, treat it as a single URL string
            imageArray = [images];
        }
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
                images: imageArray,
                bedrooms,
                bathrooms,
                sqft,
            }
        });
    } catch (error) {
        console.error("Failed to create property:", error);
        throw new Error("Failed to create property");
    }

    revalidatePath("/admin/properties");
    redirect("/admin/properties");
}

export async function updateProperty(propertyId: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const status = formData.get("status") as "AVAILABLE" | "RENTED" | "SOLD" | "MAINTENANCE";
    const images = formData.get("images") as string;

    // Specifications
    const bedrooms = formData.get("bedrooms") ? parseInt(formData.get("bedrooms") as string) : null;
    const bathrooms = formData.get("bathrooms") ? parseInt(formData.get("bathrooms") as string) : null;
    const sqft = formData.get("sqft") ? parseInt(formData.get("sqft") as string) : null;

    if (!propertyId || !title || !description || isNaN(price) || !location || !type) {
        throw new Error("Missing required fields");
    }

    // Safe image handling
    let imageArray: string[] = [];
    if (images) {
        try {
            const parsed = JSON.parse(images);
            imageArray = Array.isArray(parsed) ? parsed : [images];
        } catch {
            imageArray = [images];
        }
    }

    try {
        await prisma.property.update({
            where: { id: propertyId },
            data: {
                title,
                description,
                price,
                location,
                type,
                status: status || "AVAILABLE",
                images: imageArray,
                bedrooms,
                bathrooms,
                sqft,
            }
        });
    } catch (error) {
        console.error("Failed to update property:", error);
        throw new Error("Failed to update property");
    }

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}`);
    redirect("/admin/properties");
}
