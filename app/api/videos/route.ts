import { NextRequest, NextResponse } from "next/server"
import { auth } from '@clerk/nextjs/server';
// import prisma from "../../../lib/prisma"

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { default: prisma } = await import("../../../lib/prisma")
        const videos = await prisma.video.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({ error: "Error fetching videos" }, { status: 500 })
    }
}

