import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
// import prisma from '../../../lib/prisma'; // Removed static import

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json();
        console.log("API received video metadata:", body);

        const { title, description, publicId, originalSize, duration, url } = body;

        if (!publicId) {
            console.warn("Validation failed: Missing publicId");
            return NextResponse.json({ error: "Missing publicId" }, { status: 400 })
        }

        const finalTitle = title || "Untitled Video";

        // Check if user exists in our DB, if not, create them
        const { default: prisma } = await import('@/lib/prisma');
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

        console.log("Saving video metadata to Prisma...", { title: finalTitle, publicId, userId });

        const video = await prisma.video.create({
            data: {
                title: finalTitle,
                description: description || "",
                publicId: publicId,
                originalSize: String(originalSize || "0"),
                compressedSize: String(originalSize || "0"),
                duration: parseFloat(String(duration || 0)),
                userId: userId,
            }
        })
        console.log("Video saved to DB successfully")
        return NextResponse.json(video)

    } catch (error) {
        console.error("Save video metadata failed with error:", error)
        return NextResponse.json({ error: "Save video metadata failed" }, { status: 500 })
    }
}
