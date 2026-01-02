import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ayoolarealestate.com";

    // Fetch all active properties
    const properties = await prisma.property.findMany({
        where: { status: "AVAILABLE" },
        select: { id: true, updatedAt: true },
    });

    const propertyUrls = properties.map((property) => ({
        url: `${baseUrl}/properties/${property.id}`,
        lastModified: property.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    const staticUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/properties`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
    ];

    return [...staticUrls, ...propertyUrls];
}
