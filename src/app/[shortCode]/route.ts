import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import * as storage from "@/lib/storage";

export const dynamic = "force-dynamic";

// Handle short URL redirects
export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  try {
    // Get the link by short code
    const link = await storage.getLinkByShortCode(shortCode);

    if (!link) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // Check if link is disabled or banned
    if (link.isDisabled || link.isBanned) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // Check if link is expired
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // Record analytics (click tracking)
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || request.headers.get("referrer") || null;

    // Track the click asynchronously (don't wait for it)
    storage.recordLinkClick(link.id, clientIp, userAgent, referer).catch((err) => {
      console.error("Failed to record click:", err);
    });

    // Redirect to the original URL
    return NextResponse.redirect(link.originalUrl, { status: 302 });
  } catch (error) {
    console.error("Error handling short URL redirect:", error);
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
}

// Helper function to get client IP
function getClientIp(req: Request): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  return "unknown";
}
