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
    // Specifications
    const bedroomsStr = formData.get("bedrooms") as string;
    const bathroomsStr = formData.get("bathrooms") as string;
    const sqftStr = formData.get("sqft") as string;
    const serviceChargeStr = formData.get("serviceCharge") as string;
    const cautionDepositStr = formData.get("cautionDeposit") as string;
    const managementFeeStr = formData.get("managementFee") as string;

    const bedrooms = (bedroomsStr && !isNaN(parseInt(bedroomsStr))) ? parseInt(bedroomsStr) : null;
    const bathrooms = (bathroomsStr && !isNaN(parseInt(bathroomsStr))) ? parseInt(bathroomsStr) : null;
    const sqft = (sqftStr && !isNaN(parseInt(sqftStr))) ? parseInt(sqftStr) : null;
    const serviceCharge = (serviceChargeStr && !isNaN(parseFloat(serviceChargeStr))) ? parseFloat(serviceChargeStr) : 0;
    const cautionDeposit = (cautionDepositStr && !isNaN(parseFloat(cautionDepositStr))) ? parseFloat(cautionDepositStr) : 0;
    const managementFee = (managementFeeStr && !isNaN(parseFloat(managementFeeStr))) ? parseFloat(managementFeeStr) : 10;

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
    const commonDataMinimal = {
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
        ownerId
    };

    try {
        let createdProperty;
        if (isMultiUnit && unitCount > 0) {
            const parentUniqueId = await generateUniqueId(`APMS${cityCode}`, 'property');

            const parent = await prisma.property.create({
                data: {
                    ...commonDataMinimal,
                    uniqueId: parentUniqueId,
                    isMultiUnit: true,
                } as any
            });
            createdProperty = parent;

            for (let i = 1; i <= unitCount; i++) {
                const unitUniqueId = await generateUniqueId(`APMS${cityCode}`, 'property');
                const unit = await prisma.property.create({
                    data: {
                        ...commonDataMinimal,
                        uniqueId: unitUniqueId,
                        title: `${title} - Unit ${i}`,
                        unitNumber: `Unit ${i}`,
                        parentId: parent.id,
                        status: 'AVAILABLE'
                    } as any
                });

                await prisma.$executeRawUnsafe(
                    `UPDATE "Property" SET "serviceCharge" = $1, "cautionDeposit" = $2, "managementFee" = $3 WHERE "id" = $4`,
                    serviceCharge, cautionDeposit, managementFee, unit.id
                );
            }
        } else {
            const uniqueId = await generateUniqueId(`APMS${cityCode}`, 'property');
            createdProperty = await prisma.property.create({
                data: {
                    ...commonDataMinimal,
                    uniqueId: uniqueId,
                    isMultiUnit: false
                } as any
            });
        }

        // Finalize financial fields via Raw SQL to bypass client sync issues
        await prisma.$executeRawUnsafe(
            `UPDATE "Property" SET "serviceCharge" = $1, "cautionDeposit" = $2, "managementFee" = $3 WHERE "id" = $4`,
            serviceCharge,
            cautionDeposit,
            managementFee,
            createdProperty.id
        );

    } catch (error) {
        console.error("Failed to create property:", error);
        throw error;
    }

    revalidatePath("/admin/properties");
    redirect("/admin/properties");
}

export async function updateProperty(propertyId: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = priceStr ? parseFloat(priceStr) : NaN;
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const status = formData.get("status") as "AVAILABLE" | "RENTED" | "SOLD" | "MAINTENANCE";
    const images = formData.get("images") as string;

    // Specifications
    const bedroomsStr = formData.get("bedrooms") as string;
    const bathroomsStr = formData.get("bathrooms") as string;
    const sqftStr = formData.get("sqft") as string;
    const serviceChargeStr = formData.get("serviceCharge") as string;
    const cautionDepositStr = formData.get("cautionDeposit") as string;
    const managementFeeStr = formData.get("managementFee") as string;

    const bedrooms = (bedroomsStr && !isNaN(parseInt(bedroomsStr))) ? parseInt(bedroomsStr) : null;
    const bathrooms = (bathroomsStr && !isNaN(parseInt(bathroomsStr))) ? parseInt(bathroomsStr) : null;
    const sqft = (sqftStr && !isNaN(parseInt(sqftStr))) ? parseInt(sqftStr) : null;
    const serviceCharge = (serviceChargeStr && !isNaN(parseFloat(serviceChargeStr))) ? parseFloat(serviceChargeStr) : 0;
    const cautionDeposit = (cautionDepositStr && !isNaN(parseFloat(cautionDepositStr))) ? parseFloat(cautionDepositStr) : 0;
    const managementFee = (managementFeeStr && !isNaN(parseFloat(managementFeeStr))) ? parseFloat(managementFeeStr) : 10;

    if (!propertyId || !title || !description || isNaN(price) || !location || !type) {
        throw new Error("Missing required fields or invalid price");
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
        // Update core fields
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
            } as any
        });

        // Update financial fields via Raw SQL to bypass possible client validation issues
        await prisma.$executeRawUnsafe(
            `UPDATE "Property" SET "serviceCharge" = $1, "cautionDeposit" = $2, "managementFee" = $3 WHERE "id" = $4`,
            serviceCharge,
            cautionDeposit,
            managementFee,
            propertyId
        );
    } catch (error) {
        console.error("Failed to update property:", error);
        throw error;
    }

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}`);
    redirect("/admin/properties");
}
