import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Copy, CheckCircle, Clock, XCircle, Gift } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Referral {
  id: string;
  referredId: string;
  status: string;
  linksCreated: number;
  createdAt: string;
  validatedAt: string | null;
}

interface ReferralData {
  referralCode: string;
  referrals: Referral[];
  reward: string;
  linksRequired: number;
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery<ReferralData>({
    queryKey: ["/api/referrals"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Referrals</h1>
        <p className="text-muted-foreground mb-6">Please log in to access referrals.</p>
        <Link href="/login">
          <Button data-testid="button-login">Log In</Button>
        </Link>
      </div>
    );
  }

  const referralUrl = `${window.location.origin}/register?ref=${data?.referralCode || ""}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast({ title: "Copied!", description: "Referral link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "valid":
        return <Badge variant="outline" className="border-blue-500 text-blue-500"><CheckCircle className="w-3 h-3 mr-1" />Valid</Badge>;
      case "credited":
        return <Badge variant="default" className="bg-green-600"><Gift className="w-3 h-3 mr-1" />Credited</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const pendingCount = data?.referrals.filter(r => r.status === "pending").length || 0;
  const creditedCount = data?.referrals.filter(r => r.status === "credited").length || 0;
  const totalEarned = creditedCount * parseFloat(data?.reward || "0.10");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/earn" className="text-primary hover:underline text-sm mb-2 inline-block">
          ← Back to Earn
        </Link>
        <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
        <p className="text-muted-foreground">
          Invite friends and earn ${data?.reward || "0.10"} for each valid referral!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-referrals">
              {isLoading ? "..." : data?.referrals.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600" data-testid="text-pending-referrals">
              {isLoading ? "..." : pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Earned</CardTitle>
            <Gift className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-earned-referrals">
              ${totalEarned.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to invite friends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={referralUrl}
              readOnly
              className="font-mono text-sm"
              data-testid="input-referral-url"
            />
            <Button onClick={copyToClipboard} data-testid="button-copy-referral">
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Your referral code: <strong>{data?.referralCode || "Loading..."}</strong>
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Share your unique referral link with friends</li>
            <li>They sign up using your link</li>
            <li>Once they create {data?.linksRequired || 3} shortened links, the referral becomes valid</li>
            <li>Admin approves the referral and you receive ${data?.reward || "0.10"}</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>Track the status of your referrals</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-4">Loading...</p>
          ) : !data?.referrals || data.referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No referrals yet. Start sharing your link!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">User #{referral.referredId.slice(0, 8)}...</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(referral.createdAt).toLocaleDateString()}
                      {" | "}
                      Links: {referral.linksCreated}/{data.linksRequired}
                    </p>
                  </div>
                  {getStatusBadge(referral.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
