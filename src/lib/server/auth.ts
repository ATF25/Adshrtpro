import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import * as storage from "@/lib/storage";

// Helper to get current user from Clerk auth + database
export async function getCurrentUser(req: Request): Promise<{ user: any; clerkUserId: string } | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // Look up user in our database by Clerk ID
  let user = await storage.getUser(userId);

  // If not found by Clerk ID, try email lookup (legacy user not yet migrated)
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    const legacyUser = await storage.getUserByEmail(email);
    if (legacyUser) {
      // Return the legacy user — migration will happen via /api/auth/me
      return { user: legacyUser, clerkUserId: userId };
    }

    // No user at all — they need to hit /api/auth/me first to create their account
    return null;
  }

  return { user, clerkUserId: userId };
}

// Middleware to require authentication
export async function requireAuth(req: Request): Promise<{ user: any; clerkUserId: string } | NextResponse> {
  const result = await getCurrentUser(req);
  if (!result) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return result;
}

// Middleware to require admin
export async function requireAdmin(req: Request): Promise<{ user: any; clerkUserId: string } | NextResponse> {
  const result = await getCurrentUser(req);
  if (!result) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!result.user.isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return result;
}

// Get client IP with proper header priority for proxied environments
export function getClientIp(req: Request): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp && isValidIp(firstIp)) return firstIp;
  }
  
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();
  
  return "unknown";
}

// Validate IP address format
function isValidIp(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip.includes(":");
}

// Get current month as YYYY-MM
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Parse user agent for device/browser info
export function parseUserAgent(ua: string): { device: string; browser: string } {
  let device = "Desktop";
  let browser = "Unknown";

  if (/mobile/i.test(ua)) device = "Mobile";
  else if (/tablet/i.test(ua)) device = "Tablet";

  if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/msie|trident/i.test(ua)) browser = "IE";

  return { device, browser };
}

// 24-hour IP-to-country cache
const geoCache: Map<string, { country: string; expires: number }> = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Lookup country from IP using IPinfo Lite API with caching
export async function lookupCountry(ip: string): Promise<string> {
  // Skip private/local IPs
  if (ip === "unknown" || ip === "::1" || ip === "127.0.0.1" || 
      ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.")) {
    return "Unknown";
  }
  
  // Check cache first
  const cached = geoCache.get(ip);
  if (cached && cached.expires > Date.now()) {
    return cached.country;
  }
  
  const token = process.env.IPINFO_TOKEN;
  if (!token) {
    console.error("GeoIP: IPINFO_TOKEN not set");
    return "Unknown";
  }
  
  try {
    const trimmedToken = token.trim();
    const url = `https://api.ipinfo.io/lite/${ip}?token=${trimmedToken}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const body = await response.text();
      console.error(`GeoIP: API returned ${response.status} for IP ${ip}, body: ${body}`);
      return "Unknown";
    }
    
    const data = await response.json();
    const country = data.country_code || "Unknown";
    
    // Cache the result
    geoCache.set(ip, { country, expires: Date.now() + CACHE_TTL });
    
    return country;
  } catch (error) {
    console.error("GeoIP lookup failed:", error);
    return "Unknown";
  }
}
