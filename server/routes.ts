import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertLinkSchema,
  insertBlogPostSchema,
  insertCustomAdSchema,
  loginSchema,
  type AuthUser,
} from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Middleware to check if user is admin
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

// Get client IP with proper header priority for proxied environments
function getClientIp(req: Request): string {
  // Priority: CF-Connecting-IP > X-Forwarded-For (first IP) > X-Real-IP > remote address
  const cfIp = req.headers["cf-connecting-ip"] as string;
  if (cfIp) return cfIp.trim();
  
  const xForwardedFor = req.headers["x-forwarded-for"] as string;
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp && isValidIp(firstIp)) return firstIp;
  }
  
  const xRealIp = req.headers["x-real-ip"] as string;
  if (xRealIp) return xRealIp.trim();
  
  return req.socket.remoteAddress || "unknown";
}

// Validate IP address format
function isValidIp(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip.includes(":");
}

// Parse user agent for device/browser info
function parseUserAgent(ua: string): { device: string; browser: string } {
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

// Get current month as YYYY-MM
function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// 24-hour IP-to-country cache
const geoCache: Map<string, { country: string; expires: number }> = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Lookup country from IP using IPinfo Lite API with caching
async function lookupCountry(ip: string): Promise<string> {
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
    console.log(`GeoIP: Result for ${ip}:`, JSON.stringify(data));
    const country = data.country_code || "Unknown";
    
    // Cache the result
    geoCache.set(ip, { country, expires: Date.now() + CACHE_TTL });
    
    return country;
  } catch (error) {
    console.error("GeoIP lookup failed:", error);
    return "Unknown";
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "adshrtpro-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // ============ AUTH ROUTES ============

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.json(null);
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.json(null);
    }
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      isAdmin: user.isAdmin ?? false,
      analyticsUnlockExpiry: user.analyticsUnlockExpiry,
    };
    res.json(authUser);
  });

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);

      // Check if email already exists
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await storage.createUser(data);
      req.session.userId = user.id;

      // In production, send verification email here
      console.log(`Verification token for ${user.email}: ${user.verificationToken}`);

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified ?? false,
        isAdmin: user.isAdmin ?? false,
        analyticsUnlockExpiry: user.analyticsUnlockExpiry,
      };
      
      // Explicitly save session before responding
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }
        res.status(201).json(authUser);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.isBanned) {
        return res.status(403).json({ message: "Account has been suspended" });
      }

      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified ?? false,
        isAdmin: user.isAdmin ?? false,
        analyticsUnlockExpiry: user.analyticsUnlockExpiry,
      };
      
      // Explicitly save session before responding
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Session error" });
        }
        res.json(authUser);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out" });
    });
  });

  // Verify email
  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Token required" });
      }

      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      await storage.updateUser(user.id, {
        emailVerified: true,
        verificationToken: null,
      });

      res.json({ message: "Email verified" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Resend verification email
  app.post("/api/auth/resend-verification", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Generate new token
      const newToken = require("crypto").randomUUID();
      await storage.updateUser(user.id, { verificationToken: newToken });

      // In production, send email here
      console.log(`New verification token for ${user.email}: ${newToken}`);

      res.json({ message: "Verification email sent" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // ============ LINK ROUTES ============

  // Get user's links
  app.get("/api/links", requireAuth, async (req, res) => {
    const links = await storage.getLinksByUserId(req.session.userId!);
    res.json(links);
  });

  // Create link
  app.post("/api/links", async (req, res) => {
    try {
      const ip = getClientIp(req);

      // Check if IP is banned
      const bannedIp = await storage.getBannedIp(ip);
      if (bannedIp) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Rate limiting
      const month = getCurrentMonth();
      const rateLimit = await storage.getRateLimit(ip, month);
      if (rateLimit && (rateLimit.count ?? 0) >= 250) {
        return res.status(429).json({ message: "Rate limit exceeded. Max 250 links per month." });
      }

      const data = insertLinkSchema.parse(req.body);

      // Check for duplicate short code
      if (data.shortCode) {
        const existing = await storage.getLinkByShortCode(data.shortCode);
        if (existing) {
          return res.status(400).json({ message: "This alias is already taken" });
        }
      }

      const link = await storage.createLink(
        data,
        req.session.userId,
        ip
      );

      // Increment rate limit
      await storage.incrementRateLimit(ip, month);

      const shortUrl = `${req.protocol}://${req.get("host")}/${link.shortCode}`;
      
      // Sanitize response - don't expose internal fields to clients
      const sanitizedLink = {
        id: link.id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        createdAt: link.createdAt,
      };
      
      res.status(201).json({ link: sanitizedLink, shortUrl });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Bulk create links
  app.post("/api/links/bulk", requireAuth, async (req, res) => {
    try {
      const ip = getClientIp(req);

      // Check if IP is banned
      const bannedIp = await storage.getBannedIp(ip);
      if (bannedIp) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { urls } = req.body;
      if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ message: "Please provide an array of URLs" });
      }

      if (urls.length > 50) {
        return res.status(400).json({ message: "Maximum 50 URLs allowed per bulk request" });
      }

      // Check rate limit for all URLs
      const month = getCurrentMonth();
      const rateLimit = await storage.getRateLimit(ip, month);
      const currentCount = rateLimit?.count ?? 0;
      const remainingQuota = 250 - currentCount;

      if (urls.length > remainingQuota) {
        return res.status(429).json({ 
          message: `Rate limit: You can only create ${remainingQuota} more links this month.` 
        });
      }

      const results: Array<{
        originalUrl: string;
        shortUrl?: string;
        shortCode?: string;
        error?: string;
        success: boolean;
      }> = [];
      
      let successCount = 0;

      for (const url of urls) {
        try {
          // Validate URL using the same schema as single link creation
          const urlString = typeof url === 'string' ? url.trim() : '';
          if (!urlString) {
            results.push({ originalUrl: urlString, error: "Empty URL", success: false });
            continue;
          }

          // Use insertLinkSchema for consistent validation
          const validatedData = insertLinkSchema.parse({ originalUrl: urlString });

          const link = await storage.createLink(
            validatedData,
            req.session.userId,
            ip
          );

          successCount++;
          const shortUrl = `${req.protocol}://${req.get("host")}/${link.shortCode}`;
          results.push({
            originalUrl: urlString,
            shortUrl,
            shortCode: link.shortCode,
            success: true,
          });
        } catch (error) {
          const errorMessage = error instanceof z.ZodError 
            ? error.errors[0]?.message || "Invalid URL" 
            : "Failed to create link";
          results.push({
            originalUrl: typeof url === 'string' ? url : String(url),
            error: errorMessage,
            success: false,
          });
        }
      }

      // Increment rate limit only once for all successful creations
      if (successCount > 0) {
        for (let i = 0; i < successCount; i++) {
          await storage.incrementRateLimit(ip, month);
        }
      }

      const failCount = results.filter(r => !r.success).length;

      res.status(201).json({
        message: `Created ${successCount} links${failCount > 0 ? `, ${failCount} failed` : ''}`,
        results,
        successCount,
        failCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Delete link
  app.delete("/api/links/:id", requireAuth, async (req, res) => {
    const link = await storage.getLink(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (link.userId !== req.session.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await storage.deleteLink(req.params.id);
    res.json({ message: "Link deleted" });
  });

  // ============ REDIRECT ROUTE ============

  // This should be registered last to avoid conflicts
  app.get("/:shortCode", async (req, res, next) => {
    // Skip API routes and static files
    if (req.params.shortCode.startsWith("api") || 
        req.params.shortCode.includes(".")) {
      return next();
    }

    const link = await storage.getLinkByShortCode(req.params.shortCode);
    if (!link) {
      return next();
    }

    if (link.isDisabled || link.isBanned) {
      return res.status(410).send("This link has been disabled");
    }

    // Record click analytics
    const ua = req.headers["user-agent"] || "";
    const { device, browser } = parseUserAgent(ua);
    const referrer = req.headers["referer"] || null;
    const clientIp = getClientIp(req);
    const country = await lookupCountry(clientIp);

    await storage.recordClick({
      linkId: link.id,
      country,
      device,
      browser,
      referrer,
    });

    res.redirect(301, link.originalUrl);
  });

  // ============ ANALYTICS ROUTES ============

  // Get analytics for a link - requires per-link unlock
  app.get("/api/analytics/:linkId", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const link = await storage.getLink(req.params.linkId);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (link.userId !== user.id && !user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if this specific link is unlocked for this user
    const isUnlocked = await storage.isLinkUnlocked(user.id, req.params.linkId);
    if (!isUnlocked && !user.isAdmin) {
      return res.status(403).json({ message: "Analytics locked for this link" });
    }

    const analytics = await storage.getAnalyticsByLinkId(req.params.linkId);
    res.json(analytics);
  });

  // Unlock analytics for a specific link (simulates rewarded ad)
  app.post("/api/analytics/unlock", requireAuth, async (req, res) => {
    const { linkId } = req.body;
    
    if (!linkId) {
      return res.status(400).json({ message: "Link ID is required" });
    }

    // Verify the link belongs to the user
    const link = await storage.getLink(linkId);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (link.userId !== user.id && !user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to unlock analytics for this link" });
    }

    // Calculate expiry: 1 hour (60 minutes) from now
    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    
    // Store the unlock on the server
    await storage.setLinkUnlock(user.id, linkId, expiry);

    res.json({ message: "Analytics unlocked", linkId, expiry: expiry.toISOString() });
  });

  // Check unlock status for a link
  app.get("/api/analytics/:linkId/unlock-status", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expiry = await storage.getLinkUnlock(user.id, req.params.linkId);
    if (expiry) {
      res.json({ unlocked: true, expiry: expiry.toISOString() });
    } else {
      res.json({ unlocked: false, expiry: null });
    }
  });

  // ============ BLOG ROUTES ============

  // Get all published blog posts
  app.get("/api/blog", async (req, res) => {
    const posts = await storage.getAllBlogPosts();
    res.json(posts);
  });

  // Get blog post by slug
  app.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.isPublished) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // ============ PUBLIC SETTINGS ============

  // Get public ad settings (for unlock flow and general ads)
  app.get("/api/settings/ads", async (req, res) => {
    const adsEnabled = await storage.getSetting("adsEnabled");
    const rewardedAdCode = await storage.getSetting("rewardedAdCode");
    const adsenseCode = await storage.getSetting("adsenseCode");
    res.json({
      adsEnabled: adsEnabled === "true",
      rewardedAdCode: rewardedAdCode || "",
      adsenseCode: adsenseCode || "",
    });
  });

  // ============ ADMIN ROUTES ============

  // Get platform stats
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    const stats = await storage.getPlatformStats();
    res.json(stats);
  });

  // Get all users
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users.map((u) => ({ ...u, password: undefined })));
  });

  // Update user
  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    const { isBanned } = req.body;
    const user = await storage.updateUser(req.params.id, { isBanned });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ ...user, password: undefined });
  });

  // Get all links
  app.get("/api/admin/links", requireAdmin, async (req, res) => {
    const links = await storage.getAllLinks();
    res.json(links);
  });

  // Update link
  app.patch("/api/admin/links/:id", requireAdmin, async (req, res) => {
    const { isDisabled } = req.body;
    const link = await storage.updateLink(req.params.id, { isDisabled });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.json(link);
  });

  // Get blog post by id (admin)
  app.get("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    const post = await storage.getBlogPost(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // Create blog post
  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);

      // Check for duplicate slug
      const existing = await storage.getBlogPostBySlug(data.slug);
      if (existing) {
        return res.status(400).json({ message: "Slug already exists" });
      }

      const post = await storage.createBlogPost(data);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Update blog post
  app.patch("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, data);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Delete blog post
  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    const deleted = await storage.deleteBlogPost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted" });
  });

  // Get all settings
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    const settings = await storage.getAllSettings();
    res.json(settings);
  });

  // Update settings
  app.patch("/api/admin/settings", requireAdmin, async (req, res) => {
    const updates = req.body as Record<string, string>;
    for (const [key, value] of Object.entries(updates)) {
      await storage.setSetting(key, value);
    }
    res.json({ message: "Settings updated" });
  });

  // Get banned IPs
  app.get("/api/admin/banned-ips", requireAdmin, async (req, res) => {
    const bannedIps = await storage.getAllBannedIps();
    res.json(bannedIps);
  });

  // Ban IP
  app.post("/api/admin/banned-ips", requireAdmin, async (req, res) => {
    const { ip, reason } = req.body;
    if (!ip) {
      return res.status(400).json({ message: "IP required" });
    }
    const bannedIp = await storage.banIp(ip, reason);
    res.status(201).json(bannedIp);
  });

  // Unban IP
  app.delete("/api/admin/banned-ips/:ip", requireAdmin, async (req, res) => {
    const deleted = await storage.unbanIp(req.params.ip);
    if (!deleted) {
      return res.status(404).json({ message: "IP not found" });
    }
    res.json({ message: "IP unbanned" });
  });

  // ==================== CUSTOM ADS ====================

  // Get public custom ads by placement (for fallback when AdSense disabled)
  app.get("/api/custom-ads", async (req, res) => {
    const placement = req.query.placement as string | undefined;
    if (placement) {
      const ads = await storage.getCustomAdsByPlacement(placement);
      res.json(ads);
    } else {
      const ads = await storage.getEnabledCustomAds();
      res.json(ads);
    }
  });

  // Admin: Get all custom ads
  app.get("/api/admin/custom-ads", requireAdmin, async (req, res) => {
    const ads = await storage.getAllCustomAds();
    res.json(ads);
  });

  // Admin: Create custom ad
  app.post("/api/admin/custom-ads", requireAdmin, async (req, res) => {
    try {
      const data = insertCustomAdSchema.parse(req.body);
      const ad = await storage.createCustomAd(data);
      res.status(201).json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin: Update custom ad
  app.patch("/api/admin/custom-ads/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertCustomAdSchema.partial().parse(req.body);
      const ad = await storage.updateCustomAd(req.params.id, data);
      if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
      }
      res.json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin: Delete custom ad
  app.delete("/api/admin/custom-ads/:id", requireAdmin, async (req, res) => {
    const deleted = await storage.deleteCustomAd(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.json({ message: "Ad deleted" });
  });

  // ==================== SPONSORED POSTS ====================

  // Get active sponsored posts (public)
  app.get("/api/sponsored-posts", async (req, res) => {
    const posts = await storage.getActiveSponsoredPosts();
    res.json(posts);
  });

  // Get single sponsored post (public)
  app.get("/api/sponsored-posts/:id", async (req, res) => {
    const post = await storage.getSponsoredPost(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await storage.incrementSponsoredPostView(req.params.id);
    res.json(post);
  });

  // Track sponsored post click (public)
  app.post("/api/sponsored-posts/:id/click", async (req, res) => {
    await storage.incrementSponsoredPostClick(req.params.id);
    res.json({ message: "Click tracked" });
  });

  // React to sponsored post (public)
  app.post("/api/sponsored-posts/:id/react", async (req, res) => {
    const { reaction, visitorId } = req.body;
    if (!reaction || !visitorId) {
      return res.status(400).json({ message: "Reaction and visitorId required" });
    }
    if (!["like", "dislike"].includes(reaction)) {
      return res.status(400).json({ message: "Invalid reaction" });
    }
    await storage.setReaction(req.params.id, visitorId, reaction);
    const post = await storage.getSponsoredPost(req.params.id);
    res.json({ likes: post?.likes ?? 0, dislikes: post?.dislikes ?? 0 });
  });

  // Get user's reaction to a post
  app.get("/api/sponsored-posts/:id/reaction", async (req, res) => {
    const visitorId = req.query.visitorId as string;
    if (!visitorId) {
      return res.json({ reaction: null });
    }
    const reaction = await storage.getReaction(req.params.id, visitorId);
    res.json({ reaction: reaction?.reaction ?? null });
  });

  // Admin: Get all sponsored posts
  app.get("/api/admin/sponsored-posts", requireAdmin, async (req, res) => {
    const posts = await storage.getAllSponsoredPosts();
    res.json(posts);
  });

  // Admin: Create sponsored post
  app.post("/api/admin/sponsored-posts", requireAdmin, async (req, res) => {
    try {
      const post = await storage.createSponsoredPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin: Update sponsored post
  app.patch("/api/admin/sponsored-posts/:id", requireAdmin, async (req, res) => {
    const post = await storage.updateSponsoredPost(req.params.id, req.body);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // Admin: Delete sponsored post
  app.delete("/api/admin/sponsored-posts/:id", requireAdmin, async (req, res) => {
    const deleted = await storage.deleteSponsoredPost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted" });
  });

  // ==================== NOTIFICATIONS ====================

  // Get notifications for current user
  app.get("/api/notifications", requireAuth, async (req, res) => {
    const userId = req.session.userId!;
    const notifications = await storage.getNotificationsForUser(userId);
    res.json(notifications);
  });

  // Get unread count
  app.get("/api/notifications/unread-count", requireAuth, async (req, res) => {
    const userId = req.session.userId!;
    const count = await storage.getUnreadCount(userId);
    res.json({ count });
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    await storage.markAsRead(req.params.id);
    res.json({ message: "Marked as read" });
  });

  // Mark all as read
  app.post("/api/notifications/mark-all-read", requireAuth, async (req, res) => {
    const userId = req.session.userId!;
    await storage.markAllAsRead(userId);
    res.json({ message: "All marked as read" });
  });

  // Admin: Get all notifications
  app.get("/api/admin/notifications", requireAdmin, async (req, res) => {
    const notifications = await storage.getAllNotifications();
    res.json(notifications);
  });

  // Admin: Create notification
  app.post("/api/admin/notifications", requireAdmin, async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin: Delete notification
  app.delete("/api/admin/notifications/:id", requireAdmin, async (req, res) => {
    const deleted = await storage.deleteNotification(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  });

  return httpServer;
}
