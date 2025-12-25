
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");
    const fileName = searchParams.get("name") || "document";

    if (!fileUrl) {
        return new NextResponse("Missing file URL", { status: 400 });
    }

    // Security Check: Ensure URL is from Cloudinary
    if (!fileUrl.includes("res.cloudinary.com")) {
        console.error("Invalid file source blocked:", fileUrl);
        return new NextResponse(`Invalid file source: ${fileUrl}`, { status: 403 });
    }

    try {
        const response = await fetch(fileUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const secureFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${secureFileName}"`,
            },
        });
    } catch (error: any) {
        console.error("Download Proxy Error:", error);
        console.error("Failed URL:", fileUrl);
        return new NextResponse(`Failed to download file: ${error.message}`, { status: 500 });
    }
}
