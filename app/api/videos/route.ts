import { NextRequest, NextResponse } from "next/server"
import { auth } from '@clerk/nextjs/server';
// import prisma from "../../../lib/prisma"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Fetching videos for user:", userId);

        const { default: prisma } = await import("@/lib/prisma")
        const videos = await prisma.video.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        })

        console.log("Videos fetched successfully, count:", videos.length);
        return NextResponse.json(videos)
    } catch (error: any) {
        console.error("DEBUG: Error fetching videos from Prisma:", error);
        return NextResponse.json({
            error: "Internal Server Error during fetch",
            details: error?.message || "Unknown error",
            stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
        }, { status: 500 })
    }
}

