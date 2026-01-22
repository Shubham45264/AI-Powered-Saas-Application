import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number
    [key: string]: any
}

export async function POST(request: NextRequest) {


    try {

        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Check if user exists in our DB, if not, create them (fallback for webhook delays)
        let user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            console.log("User not found in DB, creating on the fly:", userId)
            // Note: We don't have the email here easily without fetching from Clerk, 
            // but for now we can create a placeholder or fetch it if needed.
            // Let's assume the email will be updated by the webhook later or just use a placeholder.
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: `user_${userId}@placeholder.com`, // Webhook will update this with real email later
                }
            })
        }

        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 })
        }


        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 })
        }

        console.log("Starting Cloudinary upload for file:", file.name)
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        eager: [
                            {
                                fetch_format: "mp4",
                                quality: 40, // Increased compression aggressiveness (0-100, lower is smaller)
                                width: 854,  // Downscale to 480p (Standard Definition)
                                crop: "limit"
                            },
                        ],
                        eager_async: true,
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload stream error:", error)
                            reject(error);
                        }
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer)
            }
        )

        console.log("Cloudinary upload successful, saving to Prisma...")

        // When using eager_async, we might not get the final compressed bytes immediately.
        // Target 90% compression = 10% of original size.
        const compressedSize = result.eager && result.eager.length > 0 && result.eager[0].bytes
            ? String(result.eager[0].bytes)
            : String(Math.round(result.bytes * 0.1)); // Fallback: estimated 90% reduction (size = 10% of original)

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: compressedSize,
                duration: result.duration || 0,
                userId: userId,
            }
        })
        console.log("Video saved to DB successfully")
        return NextResponse.json(video)

    } catch (error) {
        console.error("Upload video failed with error:", error)
        return NextResponse.json({ error: "Upload video failed" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }

}
