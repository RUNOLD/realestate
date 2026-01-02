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
    const ownerId = formData.get("ownerId") as string;
    const isMultiUnit = formData.get("isMultiUnit") === "true" || formData.get("isMultiUnit") === "on";
    const unitCount = formData.get("unitCount") ? parseInt(formData.get("unitCount") as string) : 0;
    const serviceCharge = formData.get("serviceCharge") ? parseFloat(formData.get("serviceCharge") as string) : 0;
    const cautionDeposit = formData.get("cautionDeposit") ? parseFloat(formData.get("cautionDeposit") as string) : 0;

    // Specifications
    const bedrooms = formData.get("bedrooms") ? parseInt(formData.get("bedrooms") as string) : null;
    const bathrooms = formData.get("bathrooms") ? parseInt(formData.get("bathrooms") as string) : null;
    const sqft = formData.get("sqft") ? parseInt(formData.get("sqft") as string) : null;

    // Basic validation
    if (!title || !description || isNaN(price) || !location || !type) {
        throw new Error("Missing required fields");
    }

    if (!ownerId) {
        throw new Error("Landlord Owner is required");
    }

    // Verify Landlord
    const landlord = await prisma.user.findUnique({
        where: { id: ownerId }
    });

    if (!landlord || landlord.role !== 'LANDLORD') {
        // Ideally redirect to user creation, but throwing error for now as UI should handle fallback
        throw new Error("Invalid Landlord or User is not a Landlord");
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

    const { generateUniqueId } = await import("@/lib/utils");
    // City Mapping: Ibadan -> IB, Lagos -> LG, Abuja -> ABJ
    let cityCode = 'XX'; // Default
    const locLower = location.toLowerCase();

    if (locLower.includes('ibadan')) cityCode = 'IB';
    else if (locLower.includes('lagos')) cityCode = 'LG';
    else if (locLower.includes('abuja')) cityCode = 'ABJ';

    // Fallback logic if needed, or stricter checks. 
    // APMS + City + 4 digits
    const commonData = {
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
        ownerId,
        serviceCharge,
        cautionDeposit
    };

    try {
        if (isMultiUnit && unitCount > 0) {
            // Generate ID for parent
            const parentUniqueId = await generateUniqueId(`APMS${cityCode}`, 'property');

            // Create Parent Property
            const parent = await prisma.property.create({
                data: {
                    ...commonData,
                    uniqueId: parentUniqueId,
                    isMultiUnit: true,
                }
            });

            // Create Units
            for (let i = 1; i <= unitCount; i++) {
                // Generate FRESH unique ID for EACH unit
                const unitUniqueId = await generateUniqueId(`APMS${cityCode}`, 'property');

                await prisma.property.create({
                    data: {
                        ...commonData,
                        uniqueId: unitUniqueId,
                        title: `${title} - Unit ${i}`,
                        unitNumber: `Unit ${i}`,
                        parentId: parent.id,
                        status: 'AVAILABLE'
                    }
                });
            }
        } else {
            // Single Property
            const uniqueId = await generateUniqueId(`APMS${cityCode}`, 'property');

            await prisma.property.create({
                data: {
                    ...commonData,
                    uniqueId: uniqueId,
                    isMultiUnit: false
                }
            });
        }

    } catch (error) {
        console.error("Failed to create property - Detailed Error:", error);
        // Throwing the original error to see it in Next.js error overlay if in dev mode
        if (error instanceof Error) {
            throw new Error(`Failed to create property: ${error.message}`);
        }
        throw new Error("Failed to create property: Unknown error");
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
    const serviceCharge = formData.get("serviceCharge") ? parseFloat(formData.get("serviceCharge") as string) : 0;
    const cautionDeposit = formData.get("cautionDeposit") ? parseFloat(formData.get("cautionDeposit") as string) : 0;

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
                serviceCharge,
                cautionDeposit
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
