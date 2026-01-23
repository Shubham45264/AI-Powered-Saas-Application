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
        const { title, description, publicId, originalSize, duration, url } = body;

        if (!publicId || !title) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

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

        console.log("Saving video metadata to Prisma...", { title, publicId })

        const video = await prisma.video.create({
            data: {
                title,
                description: description || "",
                publicId: publicId,
                originalSize: originalSize || "0",
                compressedSize: originalSize || "0", // Assume optimized if client-side uploaded? Or we can't get this easily yet.
                duration: duration || 0,
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
