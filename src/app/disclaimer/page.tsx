import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last Updated: February 23, 2026</p>
            <p>
              The following disclaimers govern your use of AdShrtPro at{" "}
              <a href="https://adshrtpro.com">https://adshrtpro.com</a>. Please read them carefully.
            </p>

            <h2>General Information</h2>
            <p>
              AdShrtPro is an independent URL shortening and link analytics platform. The information,
              tools, and services provided on this website are for general purposes only. Nothing on
              this site constitutes legal, financial, professional, or investment advice.
            </p>

            <h2>No Earnings Guarantee</h2>
            <p>
              AdShrtPro does not guarantee any earnings, rewards, or financial returns. Access to
              certain features is provided in exchange for viewing advertisements. Any value associated
              with this is dependent on advertiser availability, your geographic location, and your
              level of activity on the platform. Past availability of rewards does not guarantee future
              availability.
            </p>

            <h2>Advertising Disclaimer</h2>
            <p>
              AdShrtPro displays advertisements served by Google AdSense and other third-party
              advertising networks. We are an independent publisher. The presence of an advertisement on
              our site does not constitute an endorsement of the advertised product, service, or
              company. We are not responsible for the content, accuracy, or practices of third-party
              advertisers.
            </p>
            <p>
              AdShrtPro earns revenue when users view or click on advertisements. We are required by
              Google AdSense policies to disclose this relationship. All advertisement clicks must be
              the result of genuine user interest — artificially inflated clicks violate our{" "}
              <a href="/terms">Terms of Service</a> and AdSense program policies.
            </p>

            <h2>External Links</h2>
            <p>
              Our platform generates shortened links to external websites. AdShrtPro does not control,
              endorse, or take responsibility for the content, privacy practices, or security of
              third-party websites that users link to using our service. You follow external links at
              your own risk.
            </p>

            <h2>Service Availability</h2>
            <p>
              AdShrtPro makes no warranty that the service will be available at all times,
              uninterrupted, or error-free. We reserve the right to suspend or discontinue the service
              at any time for maintenance, updates, or any other reason.
            </p>

            <h2>Affiliate Disclaimer</h2>
            <p>
              From time to time, AdShrtPro may feature links to third-party products or services that
              we believe may be of interest. These may be affiliate links through which we earn a
              commission if you make a purchase. This does not affect the price you pay. We only link to
              products we believe are legitimate.
            </p>

            <h2>Contact</h2>
            <p>
              If you have questions about any of the above, please contact us at{" "}
              <a href="mailto:support@adshrtpro.com">support@adshrtpro.com</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
