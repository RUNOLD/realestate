import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

async function testCloudinary() {
    try {
        console.log("Testing Cloudinary Config...");
        console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
        console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "PRESENT" : "MISSING");
        console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING");

        const result = await cloudinary.api.ping();
        console.log("Cloudinary Ping Result:", result);
    } catch (error) {
        console.error("Cloudinary Test Failed:", error);
    }
}

testCloudinary();
