import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl">About AdShrtPro</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              AdShrtPro is an online URL shortening and link management platform built to help
              individuals, creators, and businesses track link performance and grow their audience. We
              were founded with a simple belief: link analytics should be accessible to everyone, not
              just large enterprises.
            </p>
            <p>
              Our platform lets you shorten long URLs, generate QR codes, and access real-time click
              analytics including geographic breakdown, device type, and referrer data. We also provide
              rewarded advertising features that give free users access to premium analytics by watching
              short advertisements.
            </p>

            <h2>Who We Are</h2>
            <p>
              AdShrtPro is operated by Olafimihan Oluwajuwon, based in Nigeria. We are an independent
              publisher and platform provider. We are not affiliated with any government body, financial
              institution, or major corporation.
            </p>

            <h2>Our Mission</h2>
            <p>
              Our mission is to provide a transparent, user-friendly link management experience where
              users are treated fairly, advertisers reach genuine audiences, and data is handled
              responsibly. We are committed to operating with integrity and in full compliance with
              applicable advertising, data protection, and consumer protection standards.
            </p>

            <h2>Our Commitment</h2>
            <p>We are committed to:</p>
            <ul>
              <li>Fair usage policies and proactive fraud prevention</li>
              <li>Transparency with our users and advertising partners</li>
              <li>Compliance with Google AdSense program policies</li>
              <li>
                International data protection standards including GDPR and CCPA
              </li>
            </ul>

            <h2>Advertising Disclosure</h2>
            <p>
              AdShrtPro earns revenue through advertisements served by Google AdSense and other trusted
              advertising networks. We are an independent publisher — our content, opinions, and
              services are not influenced or directed by our advertisers. Advertisements are clearly
              distinguishable from our content and are not editorial endorsements.
            </p>

            <h2>Contact Us</h2>
            <p>
              We welcome questions, feedback, and partnership inquiries. You can reach us at{" "}
              <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a> or through our contact
              form at <a href="/contact">https://adshrtpro.com/contact</a>. We typically respond within
              24–48 business hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
