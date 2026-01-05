import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
});

export async function uploadToCloudinary(file: File, folder: string = 'realestate_uploads'): Promise<string> {
    if (!cloudName || !apiKey || !apiSecret) {
        console.error("Cloudinary config missing:", { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
        throw new Error("Missing Cloudinary configuration. Please check your server environment variables.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                quality: 'auto',
                fetch_format: 'auto'
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary Upload Stream Error:', {
                        message: error.message,
                        http_code: error.http_code,
                        name: error.name
                    });
                    reject(new Error(`Cloudinary upload failed: ${error.message} (Code: ${error.http_code})`));
                    return;
                }

                if (!result?.secure_url) {
                    console.error('❌ Cloudinary Upload failed to return a secure_url. Result:', result);
                    reject(new Error('Cloudinary upload succeeded but no URL was returned.'));
                    return;
                }

                console.log(`✅ Cloudinary Upload Success: ${result.secure_url}`);
                resolve(result.secure_url);
            }
        );

        uploadStream.end(buffer);
    });
}
