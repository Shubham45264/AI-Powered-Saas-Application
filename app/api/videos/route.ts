import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({ error: "Error fetching videos" }, { status: 500 })
    }
}

