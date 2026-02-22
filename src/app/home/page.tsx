"use client";

import { UrlShortener } from "@/components/url-shortener";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdDisplay } from "@/components/ad-display";
import { SEO } from "@/components/seo";
import {
  Link2,
  BarChart3,
  QrCode,
  Shield,
  Globe,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  Wallet,
  Users,
  Layers,
  DollarSign,
  Star,
  Zap,
  Crown,
  TrendingUp,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Link as LinkType } from "@shared/schema";
import { SiBitcoin, SiEthereum, SiDogecoin, SiLitecoin } from "react-icons/si";

interface PaymentProof {
  id: string;
  date: string;
  username: string;
  amount: string;
  paymentMethod: string;
}

interface PublicStats {
  totalUsers: number;
  totalLinks: number;
  totalPaidOut: string;
}

/** Masks a username: first 2 chars + asterisks + last 2 chars
 *  e.g. "falikiwu" → "Fa****wu"
 */
function maskUsername(name: string): string {
  if (!name) return "***";
  if (name.length <= 4) {
    return name[0].toUpperCase() + "*".repeat(Math.max(name.length - 1, 1));
  }
  const first = name.slice(0, 2);
  const last = name.slice(-2);
  const stars = "*".repeat(Math.max(name.length - 4, 2));
  return first.charAt(0).toUpperCase() + first.charAt(1) + stars + last;
}

function formatStatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M+";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K+";
  return n.toString() + "+";
}

function getCryptoIcon(coin: string) {
  const upperCoin = coin?.toUpperCase() || "";
  switch (upperCoin) {
    case "BTC":
    case "BITCOIN":
      return <SiBitcoin className="w-4 h-4 text-orange-500" />;
    case "ETH":
    case "ETHEREUM":
      return <SiEthereum className="w-4 h-4 text-blue-500" />;
    case "DOGE":
    case "DOGECOIN":
      return <SiDogecoin className="w-4 h-4 text-yellow-500" />;
    case "LTC":
    case "LITECOIN":
      return <SiLitecoin className="w-4 h-4 text-gray-500" />;
    default:
      return <Wallet className="w-4 h-4 text-green-500" />;
  }
}

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: recentLinks, isLoading } = useQuery<LinkType[]>({
    queryKey: ["/api/links"],
    enabled: !!user,
  });

  const { data: paymentProofs = [] } = useQuery<PaymentProof[]>({
    queryKey: ["/api/public/payment-proofs"],
    refetchInterval: 60000,
  });

  const { data: publicStats } = useQuery<PublicStats>({
    queryKey: ["/api/public/stats"],
    refetchInterval: 120000,
  });

  const totalPaidOut = parseFloat(publicStats?.totalPaidOut || "0");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyToClipboard = async (shortCode: string, id: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    });
  };

  const testimonials = [
    {
      name: "Marcus T.",
      role: "Affiliate Marketer",
      avatar: "MT",
      rating: 5,
      text: "AdShrtPro completely changed how I manage affiliate links. The analytics are insightful and I've already earned back more than I expected through the offerwall rewards.",
    },
    {
      name: "Priya S.",
      role: "Content Creator",
      avatar: "PS",
      rating: 5,
      text: "I use it daily for my social media links. The QR codes are super handy and the dashboard is clean. Got my first crypto withdrawal within two weeks!",
    },
    {
      name: "James O.",
      role: "Digital Entrepreneur",
      avatar: "JO",
      rating: 5,
      text: "Fantastic platform. The referral program alone has been worth it — I've referred 8 friends and the passive earnings add up. Highly recommended.",
    },
    {
      name: "Aisha M.",
      role: "Blogger",
      avatar: "AM",
      rating: 5,
      text: "Simple to use, fast to set up, and the links never break. The bulk import feature saved me hours of manual work migrating my old links.",
    },
    {
      name: "Carlos R.",
      role: "Social Media Manager",
      avatar: "CR",
      rating: 4,
      text: "Great tool for tracking which posts drive real traffic. The geo and device breakdowns in analytics help me target my campaigns much more effectively.",
    },
    {
      name: "Linda K.",
      role: "Freelance Designer",
      avatar: "LK",
      rating: 5,
      text: "I was skeptical at first, but after my first payout I was convinced. The platform is transparent, payouts are real, and support has been quick.",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      badge: null as string | null,
      highlight: false,
      features: [
        "Unlimited link shortening",
        "Basic click analytics",
        "QR code generation",
        "Earn via offerwalls & tasks",
        "Referral program access",
        "Crypto withdrawals via FaucetPay",
        "Custom aliases",
      ],
      cta: user ? "Go to Dashboard" : "Get Started Free",
      ctaHref: user ? "/dashboard" : "/sign-up",
    },
    {
      name: "Premium",
      price: "Coming Soon",
      period: "",
      badge: "Launching Soon" as string | null,
      highlight: true,
      features: [
        "Everything in Free",
        "Advanced analytics & heatmaps",
        "Branded custom domains",
        "Password-protected links",
        "Link expiry scheduling",
        "Team collaboration tools",
        "Priority support",
        "Higher earning rates",
      ],
      cta: "Coming Soon",
      ctaHref: "/sign-up",
    },
  ];

  const features = [
    {
      icon: Link2,
      title: "URL Shortening",
      description: "Create short, memorable links with custom aliases. Supports bulk shortening up to 50 URLs at once.",
    },
    {
      icon: BarChart3,
      title: "Click Analytics",
      description: "Track clicks, countries, devices, browsers, and referrers with detailed insights",
    },
    {
      icon: QrCode,
      title: "QR Code Generator",
      description: "Generate customizable QR codes with colors for any of your shortened links.",
    },
    {
      icon: DollarSign,
      title: "Earn Rewards",
      description: "Complete offerwalls, tasks, and surveys to earn real money you can withdraw.",
    },
    {
      icon: Users,
      title: "Referral Program",
      description: "Invite friends and earn bonus rewards when they sign up and participate.",
    },
    {
      icon: Wallet,
      title: "Crypto Withdrawals",
      description: "Withdraw your earnings via FaucetPay to Bitcoin, Ethereum, Litecoin, and more.",
    },
    {
      icon: Layers,
      title: "Bulk Import",
      description: "Import and shorten multiple URLs at once to save time on large campaigns.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with password reset, email verification, and 2FA support.",
    },
    {
      icon: Globe,
      title: "No Expiration",
      description: "Your links stay active forever with no time limits or restrictions.",
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        description="Shorten, track, and optimize your links with powerful analytics, QR code generation, and earn rewards. Free URL shortener with advanced features."
        keywords="URL shortener, link shortener, analytics, QR codes, link management, earn money, referral program"
      />
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4" data-testid="badge-hero">
            Free URL Shortener
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Shorten Links,{" "}
            <span className="text-primary">Amplify Results</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create short, powerful links with advanced analytics. Track every click
            and optimize your marketing with data-driven insights.
          </p>

          <UrlShortener />

          {!user && (
            <p className="text-sm text-muted-foreground mt-6">
              <Link href="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>{" "}
              to manage your links and access full analytics.
            </p>
          )}
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="relative overflow-hidden py-14 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-10">
            Trusted by thousands worldwide
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Users */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card/70 backdrop-blur-sm px-6 py-8 shadow-sm text-center transition-shadow hover:shadow-md">
              <div className="w-13 h-13 rounded-full bg-primary/10 flex items-center justify-center p-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-primary leading-none">
                {publicStats
                  ? formatStatNumber(publicStats.totalUsers)
                  : <span className="text-2xl text-muted-foreground/40 animate-pulse">…</span>}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Registered Users</p>
            </div>
            {/* Links */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card/70 backdrop-blur-sm px-6 py-8 shadow-sm text-center transition-shadow hover:shadow-md">
              <div className="w-13 h-13 rounded-full bg-primary/10 flex items-center justify-center p-3">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-primary leading-none">
                {publicStats
                  ? formatStatNumber(publicStats.totalLinks)
                  : <span className="text-2xl text-muted-foreground/40 animate-pulse">…</span>}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Links Shortened</p>
            </div>
            {/* Paid Out */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card/70 backdrop-blur-sm px-6 py-8 shadow-sm text-center transition-shadow hover:shadow-md">
              <div className="w-13 h-13 rounded-full bg-green-500/10 flex items-center justify-center p-3">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-green-600 dark:text-green-400 leading-none">
                {publicStats
                  ? `$${totalPaidOut >= 1000 ? (totalPaidOut / 1000).toFixed(1) + "K+" : totalPaidOut.toFixed(2)}`
                  : <span className="text-2xl text-muted-foreground/40 animate-pulse">…</span>}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Total Paid Out</p>
            </div>
          </div>
        </div>
      </section>

      <AdDisplay placement="header" className="py-4 px-4" />

      {user && recentLinks && recentLinks.length > 0 && (
        <section className="py-12 px-4 bg-card border-y">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-semibold">Recent Links</h2>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" data-testid="link-view-all">
                  View all
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : (
                recentLinks.slice(0, 5).map((link) => (
                  <Card key={link.id} className="hover-elevate">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <a
                            href={`/${link.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center gap-1"
                            data-testid={`link-short-${link.id}`}
                          >
                            {window.location.host}/{link.shortCode}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {link.isDisabled && (
                            <Badge variant="secondary" className="text-xs">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {link.originalUrl}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(link.shortCode, link.id)}
                        data-testid={`button-copy-${link.id}`}
                      >
                        {copiedId === link.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage and track your links effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-medium tracking-wide uppercase">
              Pricing
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Start free — no credit card required. Premium features are on their way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.highlight
                    ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                    : ""
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1 bg-primary text-primary-foreground flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                      <Crown className="w-3 h-3" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4 pt-8">
                  <div className="flex items-center gap-2 mb-1">
                    {plan.highlight ? (
                      <Crown className="w-5 h-5 text-primary" />
                    ) : (
                      <Zap className="w-5 h-5 text-primary" />
                    )}
                    <CardTitle className="font-heading text-xl">{plan.name}</CardTitle>
                  </div>
                  <div className="mt-3">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-1 text-sm">/ {plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-6">
                  <ul className="space-y-3">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className={plan.highlight && i >= 1 ? "text-muted-foreground" : ""}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    {plan.highlight ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled
                        data-testid={`button-pricing-${plan.name.toLowerCase()}`}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {plan.cta}
                      </Button>
                    ) : (
                      <Link href={plan.ctaHref} className="block">
                        <Button
                          className="w-full"
                          data-testid={`button-pricing-${plan.name.toLowerCase()}`}
                        >
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-medium tracking-wide uppercase">
              Testimonials
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Loved by Creators &amp; Marketers
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Here&apos;s what real users are saying about AdShrtPro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="hover-elevate flex flex-col">
                <CardContent className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s < t.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground/25"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{t.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AdDisplay placement="footer" className="py-6 px-4" />

      {paymentProofs.length > 0 && (
        <section className="py-12 px-4 bg-card border-y">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="font-heading text-2xl font-semibold">Recent Payments</h2>
              </div>
              <p className="text-muted-foreground">Real withdrawals from our verified users</p>

              {publicStats && totalPaidOut > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-4 py-1.5">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    ${parseFloat(publicStats.totalPaidOut).toLocaleString("en-US", { minimumFractionDigits: 2 })} total paid to users
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paymentProofs.slice(0, 12).map((proof) => {
                const amount = parseFloat(proof.amount);
                if (isNaN(amount) || amount <= 0 || !proof.date) return null;
                return (
                  <Card key={proof.id} className="bg-background">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            {getCryptoIcon(proof.paymentMethod)}
                          </div>
                          <div>
                            <p className="font-medium text-sm font-mono tracking-wide">{maskUsername(proof.username)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(proof.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            ${amount.toFixed(6)}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {proof.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Payments shown are real user withdrawals. Usernames are partially masked for privacy.
            </p>
          </div>
        </section>
      )}

      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join thousands of users who trust AdShrtPro for their link management needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-semibold"
                  data-testid="button-cta-dashboard"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-semibold"
                  data-testid="button-cta-signup"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            <Link href="/blog">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="button-cta-blog"
              >
                Read Our Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
