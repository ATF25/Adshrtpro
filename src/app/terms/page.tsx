import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last Updated: February 23, 2026</p>
            <p>
              By accessing or using AdShrtPro at{" "}
              <a href="https://adshrtpro.com">https://adshrtpro.com</a>, you agree to be bound by
              these Terms of Service. If you do not agree, please do not use our service.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              These Terms constitute a legally binding agreement between you and AdShrtPro. Your
              continued use of our service constitutes ongoing acceptance of any updates to these Terms.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              AdShrtPro provides URL shortening, link management, click analytics, and QR code
              generation services. We reserve the right to modify, suspend, or discontinue any feature
              of the service at any time with or without notice.
            </p>

            <h2>3. User Accounts</h2>
            <p>To access certain features, you must register for an account. You agree to:</p>
            <ul>
              <li>Provide accurate and current registration information</li>
              <li>Maintain the confidentiality of your login credentials</li>
              <li>Accept full responsibility for all activity that occurs under your account</li>
              <li>
                Notify us immediately at{" "}
                <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a> if you suspect
                unauthorized access to your account
              </li>
            </ul>

            <h2>4. Acceptable Use Policy</h2>
            <p>You agree not to use AdShrtPro to:</p>
            <ul>
              <li>
                Create or distribute links to illegal, harmful, abusive, defamatory, or malicious
                content
              </li>
              <li>Distribute spam, malware, phishing links, or fraudulent content</li>
              <li>Infringe on any intellectual property rights</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Attempt to circumvent rate limits, security measures, or access controls</li>
              <li>Use automated bots or scripts to create links in bulk</li>
              <li>
                Use VPNs, proxies, or IP spoofing tools to manipulate location-based features or
                bypass restrictions
              </li>
            </ul>
            <p>
              Violations may result in immediate account suspension or termination without prior notice.
            </p>

            <h2>5. Advertising &amp; Invalid Click Policy</h2>
            <p>
              AdShrtPro displays advertisements served by Google AdSense and other third-party
              advertising networks. By using our platform, you agree to the following:
            </p>
            <ul>
              <li>
                You will NOT click on advertisements displayed on our site for any reason other than
                genuine interest in the advertised product or service.
              </li>
              <li>You will NOT encourage, instruct, or incentivize others to click on ads.</li>
              <li>
                You will NOT use automated tools, bots, or scripts to generate ad clicks or
                impressions.
              </li>
              <li>You will NOT repeatedly reload pages to inflate ad impressions.</li>
            </ul>
            <p>
              AdShrtPro actively monitors for and reports invalid click activity to our advertising
              partners in compliance with Google AdSense program policies. Accounts found to be
              generating invalid traffic may be suspended and reported.
            </p>

            <h2>6. Rate Limits</h2>
            <p>
              Free users are limited to 250 link creations per IP address per month. Exceeding this
              limit may result in temporary or permanent access restrictions at our sole discretion.
            </p>

            <h2>7. Analytics Unlock (Rewarded Advertising)</h2>
            <p>
              Access to detailed link analytics requires viewing a rewarded advertisement. By using
              this feature, you acknowledge that you are voluntarily viewing an advertisement in
              exchange for access to analytics data, and you agree to do so honestly and without
              manipulation.
            </p>

            <h2>8. Link Management &amp; Removal</h2>
            <p>
              We reserve the right to disable, remove, or redirect any shortened link that violates
              these Terms or poses a security, legal, or reputational risk. Links may be removed
              without prior notice in cases of abuse.
            </p>

            <h2>9. Intellectual Property</h2>
            <p>
              The AdShrtPro platform, including its design, branding, codebase, and original content,
              is protected by intellectual property laws. You retain ownership of the original URLs you
              submit. By using our service, you grant us a limited, non-exclusive license to process
              and display your links as necessary to provide the service.
            </p>

            <h2>10. Disclaimer of Warranties</h2>
            <p>
              AdShrtPro is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
              warranties of any kind, express or implied. We do not guarantee that the service will be
              uninterrupted, error-free, or free from harmful components. Your use of the service is at
              your sole risk.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, AdShrtPro and its operators shall not
              be liable for any indirect, incidental, special, consequential, or punitive damages,
              including but not limited to loss of data, revenue, or business opportunities, arising
              from your use of or inability to use our service.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless AdShrtPro, its operators, affiliates, and
              employees from any claims, damages, losses, or expenses (including reasonable legal fees)
              arising from your use of the service or your violation of these Terms.
            </p>

            <h2>13. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Federal
              Republic of Nigeria. Any disputes arising from these Terms or your use of the service
              shall first be attempted to be resolved through good-faith negotiation between the
              parties. If a resolution cannot be reached, disputes shall be submitted to the
              jurisdiction of the Nigerian courts, specifically the Federal High Court of Nigeria or the
              High Court of the relevant state, as appropriate.
            </p>

            <h2>14. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. We will notify users of material changes via email
              or a notice on our website. Continued use of the service after changes take effect
              constitutes acceptance of the revised Terms.
            </p>

            <h2>15. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a> or via{" "}
              <a href="/contact">https://adshrtpro.com/contact</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
