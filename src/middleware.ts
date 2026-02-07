import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that DO require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/analytics(.*)",
  "/qr-codes(.*)",
  "/profile(.*)",
  "/earn(.*)",
  "/socials(.*)",
  "/admin(.*)",
  "/api/links(.*)",
  "/api/analytics(.*)",
  "/api/notifications(.*)",
  "/api/earning(.*)",
  "/api/withdrawals(.*)",
  "/api/referrals(.*)",
  "/api/settings(.*)",
  "/api/tasks(.*)",
  "/api/social-verification(.*)",
  "/api/offerwalls(.*)",
  "/api/auth/me",
  "/api/auth/profile",
  "/api/auth/logout",
  "/api/auth/resend-verification",
  "/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
