import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last Updated: February 23, 2026</p>
            <p>
              At AdShrtPro, accessible at{" "}
              <a href="https://adshrtpro.com">https://adshrtpro.com</a>, the privacy of our users is a
              top priority. This Privacy Policy explains what information we collect, how we use it, and
              your rights regarding that information. By using our service, you agree to the practices
              described in this policy.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We collect the following categories of personal and technical data:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Your email address and hashed password when you
                register for an account.
              </li>
              <li>
                <strong>Link Data:</strong> The URLs you shorten and associated metadata such as creation
                date and custom aliases.
              </li>
              <li>
                <strong>Analytics Data:</strong> Aggregated click data including country of origin, device
                type, browser type, and referrer URL.
              </li>
              <li>
                <strong>IP Addresses:</strong> Collected for rate limiting, fraud prevention, and security
                purposes.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, and interaction patterns within
                our platform.
              </li>
            </ul>
            <p>
              We collect this information when you create an account, shorten a link, or interact with
              our platform.
            </p>

            <h2>2. Legal Basis for Processing (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), we process your personal data under
              the following legal bases:
            </p>
            <ul>
              <li>
                <strong>Contract Performance:</strong> Processing necessary to provide the URL shortening
                and analytics service you signed up for.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Fraud prevention, security, and service
                improvement.
              </li>
              <li>
                <strong>Consent:</strong> For advertising cookies and non-essential tracking. You may
                withdraw consent at any time.
              </li>
              <li>
                <strong>Legal Obligation:</strong> Where required by applicable law.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Operate and maintain the AdShrtPro platform</li>
              <li>Provide link analytics and reporting features</li>
              <li>Detect and prevent fraud, spam, and abuse</li>
              <li>Improve our services and user experience</li>
              <li>Send service-related communications (not marketing, unless you opt in)</li>
              <li>Comply with applicable legal obligations</li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account remains active. If you delete
              your account, we will delete or anonymize your personal data within 30 days, except where
              retention is required by law. Aggregated, anonymized analytics data may be retained
              indefinitely as it cannot be used to identify you.
            </p>

            <h2>5. Google AdSense &amp; Third-Party Advertising</h2>
            <p>
              We use Google AdSense to display advertisements on our platform. Google and its advertising
              partners may use cookies, including the DoubleClick cookie, to serve ads based on your
              prior visits to our site and other websites across the internet.
            </p>
            <ul>
              <li>
                You may opt out of personalized advertising by visiting{" "}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                  Google Ads Settings
                </a>
                .
              </li>
              <li>
                You may also opt out via the{" "}
                <a
                  href="https://optout.networkadvertising.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Network Advertising Initiative
                </a>
                .
              </li>
            </ul>
            <p>
              AdShrtPro does not control the cookies or tracking technologies used by third-party
              advertisers. Please refer to those partners&apos; own privacy policies for more information.
            </p>

            <h2>6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies for session management, analytics, and advertising.
              See our full <a href="/cookies">Cookie Policy</a> for details on what cookies we use and
              how to control them.
            </p>

            <h2>7. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal data. We may share data with:</p>
            <ul>
              <li>Service providers who help us operate our platform (e.g., hosting, analytics)</li>
              <li>Law enforcement or regulators when required by law</li>
              <li>Successor entities in the event of a merger or acquisition</li>
            </ul>
            <p>
              All third-party service providers are required to handle your data in compliance with
              applicable privacy laws.
            </p>

            <h2>8. Data Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS encryption for all data
              transmission and secure password hashing. While we take reasonable precautions, no method
              of transmission or storage is 100% secure. We encourage you to use a strong, unique
              password for your account.
            </p>

            <h2>9. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Request that inaccurate data be corrected.
              </li>
              <li>
                <strong>Deletion:</strong> Request that your personal data be deleted
                (&ldquo;right to be forgotten&rdquo;).
              </li>
              <li>
                <strong>Portability:</strong> Request your data in a machine-readable format.
              </li>
              <li>
                <strong>Objection:</strong> Object to processing based on legitimate interests.
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Withdraw consent for cookie-based tracking at any
                time.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a>. We will respond within
              30 days.
            </p>

            <h2>10. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, you have the right to know what personal information we
              collect, the right to delete it, and the right to opt out of any sale of that information.
              We do not sell personal information. To submit a request, contact{" "}
              <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a>.
            </p>

            <h2>11. Children&apos;s Privacy</h2>
            <p>
              AdShrtPro is not directed at children under the age of 13, and we do not knowingly collect
              personal information from children under 13. If we become aware that we have collected such
              data, we will delete it promptly. If you believe we have inadvertently collected a
              child&apos;s information, please contact us at{" "}
              <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a>.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the
              &ldquo;Last Updated&rdquo; date at the top of this page. Significant changes will be
              communicated via email or a prominent notice on our website.
            </p>

            <h2>13. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
            <ul>
              <li>
                Email: <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a>
              </li>
              <li>
                Website: <a href="/contact">https://adshrtpro.com/contact</a>
              </li>
              <li>Response time: Within 24–48 business hours</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
