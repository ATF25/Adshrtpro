import {
  type User,
  type InsertUser,
  type Link,
  type InsertLink,
  type Click,
  type InsertClick,
  type BlogPost,
  type InsertBlogPost,
  type RateLimit,
  type BannedIp,
  type SiteSetting,
  type LinkAnalytics,
  type PlatformStats,
  type SponsoredPost,
  type InsertSponsoredPost,
  type SponsoredPostReaction,
  type Notification,
  type InsertNotification,
  type CustomAd,
  type InsertCustomAd,
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Links
  getLink(id: string): Promise<Link | undefined>;
  getLinkByShortCode(shortCode: string): Promise<Link | undefined>;
  getLinksByUserId(userId: string): Promise<Link[]>;
  getAllLinks(): Promise<Link[]>;
  createLink(link: InsertLink, userId?: string, ip?: string): Promise<Link>;
  updateLink(id: string, data: Partial<Link>): Promise<Link | undefined>;
  deleteLink(id: string): Promise<boolean>;

  // Clicks
  recordClick(click: InsertClick): Promise<Click>;
  getClicksByLinkId(linkId: string): Promise<Click[]>;
  getAnalyticsByLinkId(linkId: string): Promise<LinkAnalytics>;
  getTotalClicks(): Promise<number>;
  getClicksToday(): Promise<number>;

  // Blog Posts
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Rate Limits
  getRateLimit(ip: string, month: string): Promise<RateLimit | undefined>;
  incrementRateLimit(ip: string, month: string): Promise<RateLimit>;
  
  // Banned IPs
  getBannedIp(ip: string): Promise<BannedIp | undefined>;
  getAllBannedIps(): Promise<BannedIp[]>;
  banIp(ip: string, reason?: string): Promise<BannedIp>;
  unbanIp(ip: string): Promise<boolean>;

  // Settings
  getSetting(key: string): Promise<string | undefined>;
  setSetting(key: string, value: string): Promise<void>;
  getAllSettings(): Promise<Record<string, string>>;

  // Stats
  getPlatformStats(): Promise<PlatformStats>;

  // Sponsored Posts
  getSponsoredPost(id: string): Promise<SponsoredPost | undefined>;
  getActiveSponsoredPosts(): Promise<SponsoredPost[]>;
  getAllSponsoredPosts(): Promise<SponsoredPost[]>;
  createSponsoredPost(post: InsertSponsoredPost): Promise<SponsoredPost>;
  updateSponsoredPost(id: string, data: Partial<InsertSponsoredPost>): Promise<SponsoredPost | undefined>;
  deleteSponsoredPost(id: string): Promise<boolean>;
  incrementSponsoredPostView(id: string): Promise<void>;
  incrementSponsoredPostClick(id: string): Promise<void>;

  // Sponsored Post Reactions
  getReaction(postId: string, visitorId: string): Promise<SponsoredPostReaction | undefined>;
  setReaction(postId: string, visitorId: string, reaction: string): Promise<void>;
  
  // Notifications
  getNotification(id: string): Promise<Notification | undefined>;
  getNotificationsForUser(userId: string): Promise<Notification[]>;
  getUnreadCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  deleteNotification(id: string): Promise<boolean>;
  getAllNotifications(): Promise<Notification[]>;

  // Per-Link Analytics Unlock
  setLinkUnlock(userId: string, linkId: string, expiry: Date): Promise<void>;
  getLinkUnlock(userId: string, linkId: string): Promise<Date | undefined>;
  isLinkUnlocked(userId: string, linkId: string): Promise<boolean>;

  // Custom Ads
  getCustomAd(id: string): Promise<CustomAd | undefined>;
  getAllCustomAds(): Promise<CustomAd[]>;
  getEnabledCustomAds(): Promise<CustomAd[]>;
  getCustomAdsByPlacement(placement: string): Promise<CustomAd[]>;
  createCustomAd(ad: InsertCustomAd): Promise<CustomAd>;
  updateCustomAd(id: string, data: Partial<InsertCustomAd>): Promise<CustomAd | undefined>;
  deleteCustomAd(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private links: Map<string, Link>;
  private clicks: Map<string, Click>;
  private blogPosts: Map<string, BlogPost>;
  private rateLimits: Map<string, RateLimit>;
  private bannedIps: Map<string, BannedIp>;
  private settings: Map<string, string>;
  private sponsoredPosts: Map<string, SponsoredPost>;
  private sponsoredPostReactions: Map<string, SponsoredPostReaction>;
  private notifications: Map<string, Notification>;
  private linkUnlocks: Map<string, Date>;
  private customAds: Map<string, CustomAd>;

  constructor() {
    this.users = new Map();
    this.links = new Map();
    this.clicks = new Map();
    this.blogPosts = new Map();
    this.rateLimits = new Map();
    this.bannedIps = new Map();
    this.settings = new Map();
    this.sponsoredPosts = new Map();
    this.sponsoredPostReactions = new Map();
    this.notifications = new Map();
    this.linkUnlocks = new Map();
    this.customAds = new Map();

    // Initialize default settings
    this.settings.set("unlockDuration", "60");
    this.settings.set("adsEnabled", "true");
    this.settings.set("rewardedAdCode", "");
    this.settings.set("adsenseCode", "");

    // Create sample blog posts
    this.createSampleBlogPosts();
  }

  private async createSampleBlogPosts() {
    const samplePosts: InsertBlogPost[] = [
      {
        title: "Getting Started with URL Shortening",
        slug: "getting-started-with-url-shortening",
        content: `<p>URL shortening is a powerful tool for marketers, businesses, and anyone looking to share links more effectively. In this guide, we'll explore the basics of URL shortening and how you can leverage it for your needs.</p>
<h2>What is URL Shortening?</h2>
<p>URL shortening is the process of converting a long URL into a shorter, more manageable link. This makes links easier to share, especially on platforms with character limits like Twitter.</p>
<h2>Benefits of URL Shortening</h2>
<ul>
<li><strong>Cleaner appearance:</strong> Short links look more professional and are easier to remember.</li>
<li><strong>Better tracking:</strong> Most URL shorteners provide analytics to track clicks and engagement.</li>
<li><strong>Custom branding:</strong> Create memorable, branded short links.</li>
</ul>`,
        excerpt: "Learn the fundamentals of URL shortening and how it can benefit your marketing strategy.",
        isPublished: true,
      },
      {
        title: "How to Track Link Performance with Analytics",
        slug: "track-link-performance-analytics",
        content: `<p>Understanding how your links perform is crucial for optimizing your marketing efforts. Analytics provide valuable insights into who's clicking your links and where they're coming from.</p>
<h2>Key Metrics to Track</h2>
<ul>
<li><strong>Total clicks:</strong> The overall number of times your link was clicked.</li>
<li><strong>Geographic data:</strong> See which countries your clicks are coming from.</li>
<li><strong>Device types:</strong> Understand whether users are on mobile or desktop.</li>
<li><strong>Referrers:</strong> Know which platforms are driving traffic to your links.</li>
</ul>
<h2>Using Analytics to Improve</h2>
<p>By analyzing this data, you can make informed decisions about where to focus your marketing efforts and how to optimize your content for better engagement.</p>`,
        excerpt: "Discover how to use link analytics to optimize your marketing campaigns and understand your audience.",
        isPublished: true,
      },
      {
        title: "QR Codes: The Modern Marketing Tool",
        slug: "qr-codes-modern-marketing-tool",
        content: `<p>QR codes have seen a massive resurgence in recent years, becoming an essential tool for modern marketing and customer engagement.</p>
<h2>Why QR Codes?</h2>
<p>QR codes bridge the gap between physical and digital marketing. They can be printed on any material and scanned with any smartphone camera.</p>
<h2>Best Practices for QR Codes</h2>
<ul>
<li><strong>Use high contrast:</strong> Ensure your QR code is easily scannable with dark colors on light backgrounds.</li>
<li><strong>Test before printing:</strong> Always verify your QR code works on multiple devices.</li>
<li><strong>Provide context:</strong> Tell users what they'll get when they scan the code.</li>
<li><strong>Track performance:</strong> Use shortened URLs in your QR codes to track scans.</li>
</ul>`,
        excerpt: "Learn how to effectively use QR codes in your marketing strategy to engage customers.",
        isPublished: true,
      },
    ];

    for (const post of samplePosts) {
      await this.createBlogPost(post);
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.verificationToken === token
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = Boolean(adminEmail && insertUser.email.toLowerCase() === adminEmail.toLowerCase());

    const user: User = {
      id,
      email: insertUser.email,
      password: hashedPassword,
      emailVerified: true, // Auto-verify for MVP (no email service configured)
      verificationToken: null,
      analyticsUnlockExpiry: null,
      isAdmin: isAdmin ?? false,
      isBanned: false,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Links
  async getLink(id: string): Promise<Link | undefined> {
    return this.links.get(id);
  }

  async getLinkByShortCode(shortCode: string): Promise<Link | undefined> {
    return Array.from(this.links.values()).find(
      (link) => link.shortCode === shortCode
    );
  }

  async getLinksByUserId(userId: string): Promise<Link[]> {
    return Array.from(this.links.values())
      .filter((link) => link.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getAllLinks(): Promise<Link[]> {
    return Array.from(this.links.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async createLink(insertLink: InsertLink, userId?: string, ip?: string): Promise<Link> {
    const id = randomUUID();
    const shortCode = insertLink.shortCode || this.generateShortCode();

    const link: Link = {
      id,
      originalUrl: insertLink.originalUrl,
      shortCode,
      userId: userId ?? null,
      creatorIp: ip ?? null,
      isDisabled: false,
      isBanned: false,
      createdAt: new Date(),
    };
    this.links.set(id, link);
    return link;
  }

  private generateShortCode(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async updateLink(id: string, data: Partial<Link>): Promise<Link | undefined> {
    const link = this.links.get(id);
    if (!link) return undefined;
    const updatedLink = { ...link, ...data };
    this.links.set(id, updatedLink);
    return updatedLink;
  }

  async deleteLink(id: string): Promise<boolean> {
    return this.links.delete(id);
  }

  // Clicks
  async recordClick(insertClick: InsertClick): Promise<Click> {
    const id = randomUUID();
    const click: Click = {
      id,
      linkId: insertClick.linkId,
      country: insertClick.country ?? null,
      device: insertClick.device ?? null,
      browser: insertClick.browser ?? null,
      referrer: insertClick.referrer ?? null,
      clickedAt: new Date(),
    };
    this.clicks.set(id, click);
    return click;
  }

  async getClicksByLinkId(linkId: string): Promise<Click[]> {
    return Array.from(this.clicks.values())
      .filter((click) => click.linkId === linkId)
      .sort((a, b) => {
        const dateA = a.clickedAt ? new Date(a.clickedAt).getTime() : 0;
        const dateB = b.clickedAt ? new Date(b.clickedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getAnalyticsByLinkId(linkId: string): Promise<LinkAnalytics> {
    const clicks = await this.getClicksByLinkId(linkId);

    const countBy = <T extends string | null>(items: T[]): { [key: string]: number } => {
      return items.reduce((acc, item) => {
        const key = item || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
    };

    const countryCounts = countBy(clicks.map((c) => c.country));
    const deviceCounts = countBy(clicks.map((c) => c.device));
    const browserCounts = countBy(clicks.map((c) => c.browser));
    const referrerCounts = countBy(clicks.map((c) => c.referrer));

    return {
      totalClicks: clicks.length,
      clicksByCountry: Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count),
      clicksByDevice: Object.entries(deviceCounts)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count),
      clicksByBrowser: Object.entries(browserCounts)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count),
      clicksByReferrer: Object.entries(referrerCounts)
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count),
      recentClicks: clicks.slice(0, 20),
    };
  }

  async getTotalClicks(): Promise<number> {
    return this.clicks.size;
  }

  async getClicksToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(this.clicks.values()).filter((click) => {
      if (!click.clickedAt) return false;
      return new Date(click.clickedAt) >= today;
    }).length;
  }

  // Blog Posts
  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      id,
      title: insertPost.title,
      slug: insertPost.slug,
      content: insertPost.content,
      excerpt: insertPost.excerpt ?? null,
      featuredImage: insertPost.featuredImage ?? null,
      isPublished: insertPost.isPublished ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    const updatedPost = { ...post, ...data, updatedAt: new Date() };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Rate Limits
  async getRateLimit(ip: string, month: string): Promise<RateLimit | undefined> {
    const key = `${ip}-${month}`;
    return this.rateLimits.get(key);
  }

  async incrementRateLimit(ip: string, month: string): Promise<RateLimit> {
    const key = `${ip}-${month}`;
    const existing = this.rateLimits.get(key);
    if (existing) {
      existing.count = (existing.count ?? 0) + 1;
      this.rateLimits.set(key, existing);
      return existing;
    }
    const newLimit: RateLimit = {
      id: randomUUID(),
      ip,
      month,
      count: 1,
    };
    this.rateLimits.set(key, newLimit);
    return newLimit;
  }

  // Banned IPs
  async getBannedIp(ip: string): Promise<BannedIp | undefined> {
    return this.bannedIps.get(ip);
  }

  async getAllBannedIps(): Promise<BannedIp[]> {
    return Array.from(this.bannedIps.values());
  }

  async banIp(ip: string, reason?: string): Promise<BannedIp> {
    const bannedIp: BannedIp = {
      id: randomUUID(),
      ip,
      reason: reason ?? null,
      bannedAt: new Date(),
    };
    this.bannedIps.set(ip, bannedIp);
    return bannedIp;
  }

  async unbanIp(ip: string): Promise<boolean> {
    return this.bannedIps.delete(ip);
  }

  // Settings
  async getSetting(key: string): Promise<string | undefined> {
    return this.settings.get(key);
  }

  async setSetting(key: string, value: string): Promise<void> {
    this.settings.set(key, value);
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    this.settings.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // Stats
  async getPlatformStats(): Promise<PlatformStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const linksToday = Array.from(this.links.values()).filter((link) => {
      if (!link.createdAt) return false;
      return new Date(link.createdAt) >= today;
    }).length;

    return {
      totalUsers: this.users.size,
      totalLinks: this.links.size,
      totalClicks: this.clicks.size,
      linksToday,
      clicksToday: await this.getClicksToday(),
    };
  }

  // Sponsored Posts
  async getSponsoredPost(id: string): Promise<SponsoredPost | undefined> {
    return this.sponsoredPosts.get(id);
  }

  async getActiveSponsoredPosts(): Promise<SponsoredPost[]> {
    const now = new Date();
    return Array.from(this.sponsoredPosts.values())
      .filter((post) => {
        if (!post.isActive || !post.isApproved) return false;
        if (post.startDate && new Date(post.startDate) > now) return false;
        if (post.endDate && new Date(post.endDate) < now) return false;
        return true;
      })
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  async getAllSponsoredPosts(): Promise<SponsoredPost[]> {
    return Array.from(this.sponsoredPosts.values())
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createSponsoredPost(post: InsertSponsoredPost): Promise<SponsoredPost> {
    const id = randomUUID();
    const sponsoredPost: SponsoredPost = {
      id,
      title: post.title,
      description: post.description,
      content: post.content ?? null,
      logoUrl: post.logoUrl ?? null,
      bannerUrl: post.bannerUrl ?? null,
      websiteUrl: post.websiteUrl ?? null,
      socialLinks: post.socialLinks ?? null,
      isActive: post.isActive ?? false,
      isApproved: post.isApproved ?? false,
      priority: post.priority ?? 0,
      viewCount: 0,
      clickCount: 0,
      likes: 0,
      dislikes: 0,
      startDate: post.startDate ?? null,
      endDate: post.endDate ?? null,
      createdAt: new Date(),
    };
    this.sponsoredPosts.set(id, sponsoredPost);
    return sponsoredPost;
  }

  async updateSponsoredPost(id: string, data: Partial<InsertSponsoredPost>): Promise<SponsoredPost | undefined> {
    const post = this.sponsoredPosts.get(id);
    if (!post) return undefined;
    const updatedPost = { ...post, ...data };
    this.sponsoredPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteSponsoredPost(id: string): Promise<boolean> {
    return this.sponsoredPosts.delete(id);
  }

  async incrementSponsoredPostView(id: string): Promise<void> {
    const post = this.sponsoredPosts.get(id);
    if (post) {
      post.viewCount = (post.viewCount ?? 0) + 1;
      this.sponsoredPosts.set(id, post);
    }
  }

  async incrementSponsoredPostClick(id: string): Promise<void> {
    const post = this.sponsoredPosts.get(id);
    if (post) {
      post.clickCount = (post.clickCount ?? 0) + 1;
      this.sponsoredPosts.set(id, post);
    }
  }

  // Sponsored Post Reactions
  async getReaction(postId: string, visitorId: string): Promise<SponsoredPostReaction | undefined> {
    const key = `${postId}-${visitorId}`;
    return this.sponsoredPostReactions.get(key);
  }

  async setReaction(postId: string, visitorId: string, reaction: string): Promise<void> {
    const key = `${postId}-${visitorId}`;
    const post = this.sponsoredPosts.get(postId);
    if (!post) return;

    const existingReaction = this.sponsoredPostReactions.get(key);
    
    if (existingReaction) {
      if (existingReaction.reaction === "like") {
        post.likes = Math.max(0, (post.likes ?? 0) - 1);
      } else if (existingReaction.reaction === "dislike") {
        post.dislikes = Math.max(0, (post.dislikes ?? 0) - 1);
      }
    }

    if (reaction === "like") {
      post.likes = (post.likes ?? 0) + 1;
    } else if (reaction === "dislike") {
      post.dislikes = (post.dislikes ?? 0) + 1;
    }

    this.sponsoredPosts.set(postId, post);

    const newReaction: SponsoredPostReaction = {
      id: randomUUID(),
      postId,
      visitorId,
      reaction,
      createdAt: new Date(),
    };
    this.sponsoredPostReactions.set(key, newReaction);
  }

  // Notifications
  async getNotification(id: string): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId || n.isGlobal)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Array.from(this.notifications.values())
      .filter((n) => (n.userId === userId || n.isGlobal) && !n.isRead)
      .length;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const newNotification: Notification = {
      id,
      userId: notification.userId ?? null,
      title: notification.title,
      message: notification.message,
      type: notification.type ?? "info",
      isRead: false,
      isGlobal: notification.isGlobal ?? false,
      createdAt: new Date(),
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    this.notifications.forEach((notification, id) => {
      if (notification.userId === userId || notification.isGlobal) {
        notification.isRead = true;
        this.notifications.set(id, notification);
      }
    });
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this.notifications.delete(id);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  // Per-Link Analytics Unlock
  async setLinkUnlock(userId: string, linkId: string, expiry: Date): Promise<void> {
    const key = `${userId}:${linkId}`;
    this.linkUnlocks.set(key, expiry);
  }

  async getLinkUnlock(userId: string, linkId: string): Promise<Date | undefined> {
    const key = `${userId}:${linkId}`;
    const expiry = this.linkUnlocks.get(key);
    if (expiry && new Date(expiry) > new Date()) {
      return expiry;
    }
    return undefined;
  }

  async isLinkUnlocked(userId: string, linkId: string): Promise<boolean> {
    const expiry = await this.getLinkUnlock(userId, linkId);
    return expiry !== undefined;
  }

  // Custom Ads
  async getCustomAd(id: string): Promise<CustomAd | undefined> {
    return this.customAds.get(id);
  }

  async getAllCustomAds(): Promise<CustomAd[]> {
    return Array.from(this.customAds.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getEnabledCustomAds(): Promise<CustomAd[]> {
    return Array.from(this.customAds.values())
      .filter((ad) => ad.isEnabled)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getCustomAdsByPlacement(placement: string): Promise<CustomAd[]> {
    return Array.from(this.customAds.values())
      .filter((ad) => ad.isEnabled && ad.placement === placement)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createCustomAd(ad: InsertCustomAd): Promise<CustomAd> {
    const id = randomUUID();
    const customAd: CustomAd = {
      id,
      name: ad.name,
      adCode: ad.adCode,
      placement: ad.placement,
      deviceType: ad.deviceType,
      adSize: ad.adSize,
      isEnabled: ad.isEnabled ?? true,
      createdAt: new Date(),
    };
    this.customAds.set(id, customAd);
    return customAd;
  }

  async updateCustomAd(id: string, data: Partial<InsertCustomAd>): Promise<CustomAd | undefined> {
    const ad = this.customAds.get(id);
    if (!ad) return undefined;
    const updatedAd = { ...ad, ...data };
    this.customAds.set(id, updatedAd);
    return updatedAd;
  }

  async deleteCustomAd(id: string): Promise<boolean> {
    return this.customAds.delete(id);
  }
}

export const storage = new MemStorage();
