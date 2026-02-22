/**
 * URL content filtering for link shortening.
 * Blocks adult, illegal, malware, and other harmful content.
 *
 * Three layers of protection:
 *  1. Hardcoded adult/harm domain blocklist (canonical TLDs/subdomains)
 *  2. Keyword pattern matching against hostname + path
 *  3. Admin-managed dynamic blocklist (stored in siteSettings as comma-separated values)
 */

import * as storage from "@/lib/storage";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Hardcoded blocked domains (lowercase, no protocol, no trailing slash)
// ─────────────────────────────────────────────────────────────────────────────
const BLOCKED_DOMAINS: ReadonlySet<string> = new Set([
  // Adult
  "pornhub.com",
  "xvideos.com",
  "xnxx.com",
  "xhamster.com",
  "redtube.com",
  "youporn.com",
  "tube8.com",
  "spankbang.com",
  "thisvid.com",
  "chaturbate.com",
  "livejasmin.com",
  "onlyfans.com",
  "fansly.com",
  "brazzers.com",
  "naughtyamerica.com",
  "bangbros.com",
  "reality-kings.com",
  "mofos.com",
  "kink.com",
  "adultfriendfinder.com",
  "ashley-madison.com",
  "ashleymadison.com",
  "stripchat.com",
  "cam4.com",
  "myfreecams.com",
  "bongacams.com",
  "camsoda.com",
  "flirt4free.com",
  "streamate.com",
  "xxxbunker.com",
  "drtuber.com",
  "tnaflix.com",
  "eporner.com",
  "ixxx.com",
  "4tube.com",
  "hardsextube.com",
  "txxx.com",
  "beeg.com",
  "faphouse.com",
  "hentaihaven.xxx",
  // Illegal / Dark web gateways
  "thepiratebay.org",
  "rarbg.to",
  "1337x.to",
  "kickasstorrents.cr",
  "silkroad.onion",
  // Malware / Phishing known hosts
  "malware.com",
  "phishing.com",
  // Gambling (commonly policy-restricted)
  "pokerstars.com",
  "fulltilt.com",
  "888casino.com",
  "bet365.com",
  "bovada.lv",
  "draftkings.com",
  "fanduel.com",
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Keyword patterns checked against the full URL (hostname + path)
//    Uses simple string matching — fast and predictable
// ─────────────────────────────────────────────────────────────────────────────
const BLOCKED_URL_KEYWORDS: readonly string[] = [
  "porn",
  "xxx",
  "sex",
  "nude",
  "naked",
  "hentai",
  "escort",
  "camgirl",
  "camboy",
  "onlyfan",    // catches onlyfans, onlyfan.
  "nsfw",
  "adult-",
  "-adult",
  "erotic",
  "stripper",
  "prostitut",
  "hookup",
  "sexchat",
  "sexvideo",
  "adultfilm",
  "camsex",
  "livestrip",
  "webcamgirl",
  "malware",
  "phish",
  "ransomware",
  "darkweb",
  "dark-web",
];

// ─────────────────────────────────────────────────────────────────────────────
// Main export: check a URL against all layers
// ─────────────────────────────────────────────────────────────────────────────
export interface FilterResult {
  blocked: boolean;
  reason?: string;
}

/**
 * Returns { blocked: true, reason } if the URL should be rejected,
 * or { blocked: false } if it is acceptable.
 *
 * @param rawUrl  - The original URL string submitted by the user
 * @param skipDb  - Optional: skip the DB lookup (for lightweight in-process checks)
 */
export async function checkUrl(rawUrl: string, skipDb = false): Promise<FilterResult> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    // Invalid URL — let the Zod schema handle the user-facing error
    return { blocked: false };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const fullPath = (parsed.pathname + parsed.search).toLowerCase();
  const combined = hostname + fullPath;

  // ── Layer 1: hardcoded domain blocklist ──────────────────────────────────
  // Check exact hostname and all parent domains
  // e.g. "video.pornhub.com" should match "pornhub.com"
  const domainParts = hostname.split(".");
  for (let i = 0; i < domainParts.length - 1; i++) {
    const candidate = domainParts.slice(i).join(".");
    if (BLOCKED_DOMAINS.has(candidate)) {
      return { blocked: true, reason: "This website is not permitted on our platform." };
    }
  }

  // ── Layer 2: keyword matching ─────────────────────────────────────────────
  for (const keyword of BLOCKED_URL_KEYWORDS) {
    if (combined.includes(keyword)) {
      return { blocked: true, reason: "This URL contains prohibited content." };
    }
  }

  // ── Layer 3: admin-managed dynamic blocklist ─────────────────────────────
  if (!skipDb) {
    try {
      const [domainsRaw, keywordsRaw] = await Promise.all([
        storage.getSetting("blockedDomains"),
        storage.getSetting("blockedKeywords"),
      ]);

      if (domainsRaw) {
        const customDomains = domainsRaw
          .split(/[\n,]+/)
          .map((d) => d.trim().toLowerCase().replace(/^www\./, "").replace(/^https?:\/\//, ""))
          .filter(Boolean);

        for (const d of customDomains) {
          if (hostname === d || hostname.endsWith("." + d)) {
            return { blocked: true, reason: "This website is not permitted on our platform." };
          }
        }
      }

      if (keywordsRaw) {
        const customKeywords = keywordsRaw
          .split(/[\n,]+/)
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean);

        for (const kw of customKeywords) {
          if (combined.includes(kw)) {
            return { blocked: true, reason: "This URL contains prohibited content." };
          }
        }
      }
    } catch {
      // DB unavailable — fail open (don't block legitimate traffic)
    }
  }

  return { blocked: false };
}
