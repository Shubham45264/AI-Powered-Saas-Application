import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
// import prisma from '../../../lib/prisma'; // Removed static import

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number
    eager?: Array<{ bytes: number }>;
    [key: string]: any
}

export async function GET() {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

        // Check if user exists in our DB, if not, create them
        const { default: prisma } = await import('../../../lib/prisma');
        let user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            console.log("User not found in DB, creating on the fly:", userId)
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: `user_${userId}@placeholder.com`,
                }
            })
        }

        console.log("Starting Cloudinary upload for file:", file.name)
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Dynamic import to prevent build-time issues
        const { v2: cloudinary } = await import('cloudinary');

        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        eager: [
                            {
                                fetch_format: "mp4",
                                quality: 40,
                                width: 854,
                                crop: "limit"
                            },
                        ],
                        // Note: eager_async means attributes might not be available immediately in response
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

        const compressedSize = result.eager && result.eager.length > 0 && result.eager[0].bytes
            ? String(result.eager[0].bytes)
            : String(Math.round(result.bytes * 0.1));

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
    }
}
