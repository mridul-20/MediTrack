import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/api/webhook",
  "/terms",
  "/privacy",
]);

export default clerkMiddleware(async(auth, req) => {
  const reqHeaders = headers();
  if (isPublicRoute(req)) return NextResponse.next(); // Allow public routes

  // Redirect to sign-in if user is not authenticated
  const authState = await auth();
  if (!authState.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  return NextResponse.next();
});

// Apply middleware to selected routes
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Matches all routes except static files
    "/",
    "/(api|trpc)(.*)",
    "/inventory/:path*",
    "/expiry/:path*",
    "/recommendations/:path*",
    "/scan/:path*",
    "/nearby/:path*",
    "/profile/:path*",
  ],
};
