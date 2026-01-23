// import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized - Route Handler" }, { status: 401 });
  }

  const body = await request.json();
  const { paramsToSign } = body;

  console.log("Signing params:", paramsToSign);
  console.log("Checking env vars:", {
    hasSecret: !!process.env.CLOUDINARY_API_SECRET,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasCloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  });
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error("Missing CLOUDINARY_API_SECRET");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const { v2: cloudinary } = await import('cloudinary');
  // Config shouldn't be needed for utils.api_sign_request if we pass secret, but good to have
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  return NextResponse.json({ signature });
}
