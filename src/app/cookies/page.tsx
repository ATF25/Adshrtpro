import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl">Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last Updated: February 23, 2026</p>
            <p>
              This Cookie Policy explains how AdShrtPro uses cookies and similar tracking technologies
              when you visit{" "}
              <a href="https://adshrtpro.com">https://adshrtpro.com</a>. By continuing to use our site
              after accepting our cookie banner, you consent to the use of cookies as described below.
            </p>

            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device by your web browser. They help websites
              remember your preferences, keep you logged in, and understand how you interact with the
              site. Cookies can be &ldquo;session cookies&rdquo; (deleted when you close your browser)
              or &ldquo;persistent cookies&rdquo; (stored until they expire or you delete them).
            </p>

            <h2>Categories of Cookies We Use</h2>

            <h3>Strictly Necessary Cookies</h3>
            <p>
              These cookies are essential for the website to function. They cannot be disabled. They
              include:
            </p>
            <ul>
              <li>Session cookies that keep you logged into your AdShrtPro account</li>
              <li>Security cookies used to detect fraud and prevent unauthorized access</li>
              <li>CSRF protection tokens</li>
            </ul>

            <h3>Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors use our site so we can improve it:
            </p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> <code>_ga</code> (expires 2 years),{" "}
                <code>_gid</code> (expires 24 hours) — tracks page views, session duration, and traffic
                sources anonymously.
              </li>
            </ul>

            <h3>Advertising Cookies</h3>
            <p>
              We use Google AdSense to display advertisements. Google and its partners may use cookies
              to serve ads based on your interests and browsing history:
            </p>
            <ul>
              <li>
                <strong>DoubleClick/Google Ads cookies:</strong> Used for ad personalization and
                frequency capping.
              </li>
              <li>
                <strong>Conversion tracking cookies:</strong> Used to measure the effectiveness of
                advertisements.
              </li>
            </ul>
            <p>
              You can opt out of personalized advertising at{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://adssettings.google.com
              </a>
              .
            </p>

            <h2>Cookie Consent</h2>
            <p>
              When you first visit AdShrtPro, you will be shown a cookie consent banner. Non-essential
              cookies (analytics and advertising) will only be set after you provide your consent. You
              may withdraw or change your consent preferences at any time by clicking the &ldquo;Cookie
              Settings&rdquo; link in our website footer.
            </p>

            <h2>Managing and Disabling Cookies</h2>
            <p>
              You can control cookies through your browser settings. Most browsers allow you to block or
              delete cookies. Please note that disabling strictly necessary cookies may prevent you from
              logging in or using key features. Here are links to cookie management guides for common
              browsers:
            </p>
            <ul>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>
              Some cookies on our site are placed by third-party services such as Google AdSense.
              AdShrtPro does not control these cookies. Please refer to{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy Policy
              </a>{" "}
              for more information.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at{" "}
              <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
