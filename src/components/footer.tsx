import Link from "next/link";
import { Link2 } from "lucide-react";
import { SiDiscord, SiFacebook, SiX, SiInstagram, SiTelegram, SiYoutube, SiTiktok } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-heading font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Link2 className="w-5 h-5 text-primary-foreground" />
              </div>
              AdShrtPro
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Professional URL shortener with powerful analytics, QR code generation, 
              and link management. Track your links and optimize your marketing.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  URL Shortener
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/socials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Socials
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-sm text-muted-foreground">
          <div className="w-full flex flex-col md:flex-row items-center md:justify-between gap-4">
            <p className="text-left">&copy; {new Date().getFullYear()} AdShrtPro. All rights reserved.</p>

            <div className="flex items-center space-x-3">
              <a
                href="https://discord.gg/UBaW8rD9pV"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground"
              >
                <SiDiscord className="w-4 h-4" />
              </a>

              <a
                href="https://www.facebook.com/share/1AZVPszMhR/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground"
              >
                <SiFacebook className="w-4 h-4" />
              </a>

              <a
                href="https://x.com/adshrtpro?s=21"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground"
              >
                <SiX className="w-4 h-4" />
              </a>

              <a
                href="https://www.instagram.com/adshrtpro/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground"
              >
                <SiInstagram className="w-4 h-4" />
              </a>

              <a
                href="https://t.me/AdShrtPro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground"
              >
                <SiTelegram className="w-4 h-4" />
              </a>

              <a
                href="https://www.youtube.com/@Adshrtpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground"
              >
                <SiYoutube className="w-4 h-4" />
              </a>

              <a
                href="https://www.tiktok.com/@adshrtpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground"
              >
                <SiTiktok className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
