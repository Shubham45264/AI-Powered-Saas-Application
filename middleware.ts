import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/",
])
const isPublicApiRoute = createRouteMatcher([
    "/api/videos(.*)",
    "/api/sign-cloudinary-params"
])


export default clerkMiddleware((auth, req) => {
    try {
        const { userId } = auth();
        const currentUrl = new URL(req.url);
        const isAccessingDashboard = currentUrl.pathname === "/home";
        const isApiRequest = currentUrl.pathname.startsWith("/api");

        // If user is logged in and accessing a public route but not the dashboard, redirect to home
        if (userId && isPublicRoute(req) && !isAccessingDashboard) {
            return NextResponse.redirect(new URL("/home", req.url));
        }

        // If user is NOT logged in
        if (!userId) {
            // If accessing protected UI routes
            if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
                return NextResponse.redirect(new URL("/sign-in", req.url));
            }

            // If accessing protected API routes
            if (isApiRequest && !isPublicApiRoute(req)) {
                return NextResponse.json({ error: "Unauthorized - Middleware" }, { status: 401 });
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Error:", error);
        return NextResponse.next(); // Fail-safe: allow request if middleware crashes
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
