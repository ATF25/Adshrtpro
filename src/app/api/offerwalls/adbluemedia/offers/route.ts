import { NextResponse } from "next/server";
import * as storage from "@/lib/storage";
import { requireAuth, getClientIp } from "@/lib/server/auth";

// Get AdBlueMedia offers (proxy to avoid CORS) - with geo-location targeting
export async function GET(req: Request) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ message: "userId required" }, { status: 400 });
    }

    const setting = await storage.getOfferwallSetting("adbluemedia");
    if (!setting?.isEnabled) {
      console.log("AdBlueMedia is not enabled");
      return NextResponse.json([]);
    }

    // Get user's IP for geo-targeting (use a default for localhost)
    let clientIp = getClientIp(req);
    if (clientIp === "unknown" || clientIp === "::1" || clientIp === "127.0.0.1") {
      clientIp = "8.8.8.8"; // Use Google DNS as fallback for localhost testing
    }

    // AdBlueMedia API with IP parameter for geo-targeting
    const feedUrl = `https://d2xohqmdyl2cj3.cloudfront.net/public/offers/feed.php?user_id=518705&api_key=f24063d0d801e4daa846e9da4454c467&s1=${userId}&s2=&ip=${encodeURIComponent(clientIp)}`;
    
    console.log("Fetching AdBlueMedia offers from:", feedUrl);
    
    // Fetch with 30 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    let response;
    try {
      response = await fetch(feedUrl, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
        console.warn("AdBlueMedia API timeout - returning empty offers");
        return NextResponse.json([]);
      }
      throw fetchError;
    }
    
    if (!response.ok) {
      console.error("AdBlueMedia API error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("AdBlueMedia error response:", errorText);
      return NextResponse.json([]);
    }
    
    const offers = await response.json();
    console.log("AdBlueMedia raw response:", JSON.stringify(offers).substring(0, 200));
    console.log("AdBlueMedia offers count:", Array.isArray(offers) ? offers.length : 0);
    
    // Apply 50% revenue split - show users their actual earnings
    const adjustedOffers = (Array.isArray(offers) ? offers : []).map((offer: any) => ({
      ...offer,
      payout: (parseFloat(offer.payout || "0") * 0.5).toFixed(6), // User sees 50% of payout
      original_payout: offer.payout, // Keep original for reference
    }));
    
    return NextResponse.json(adjustedOffers);
  } catch (error) {
    console.error("AdBlueMedia offers fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch offers" }, { status: 500 });
  }
}
