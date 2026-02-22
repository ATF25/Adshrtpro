"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2, Copy, Check, ExternalLink, Loader2, AlertTriangle, Clock, XCircle } from "lucide-react";
import type { Link } from "@shared/schema";
import { addDays, addHours } from "date-fns";

const shortenSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  shortCode: z.string().min(3, "At least 3 characters").max(20).optional().or(z.literal("")),
  expiresAt: z.string().optional(),
});

type ShortenInput = z.infer<typeof shortenSchema>;

const expirationOptions = [
  { value: "never", label: "Never expires" },
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

function getExpirationDate(option: string): string | undefined {
  const now = new Date();
  switch (option) {
    case "1h": return addHours(now, 1).toISOString();
    case "24h": return addHours(now, 24).toISOString();
    case "7d": return addDays(now, 7).toISOString();
    case "30d": return addDays(now, 30).toISOString();
    case "90d": return addDays(now, 90).toISOString();
    default: return undefined;
  }
}

interface ShortenedResult {
  link: Link;
  shortUrl: string;
}

export function UrlShortener() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [useCustomAlias, setUseCustomAlias] = useState(false);
  const [useExpiration, setUseExpiration] = useState(false);
  const [expirationOption, setExpirationOption] = useState("never");
  const [result, setResult] = useState<ShortenedResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ShortenInput>({
    resolver: zodResolver(shortenSchema),
    defaultValues: {
      originalUrl: "",
      shortCode: "",
      expiresAt: "",
    },
  });

  // After sign-up, auto-fill any URL the guest was trying to shorten
  useEffect(() => {
    if (user) {
      const pendingUrl = localStorage.getItem("pendingShortUrl");
      if (pendingUrl) {
        localStorage.removeItem("pendingShortUrl");
        form.setValue("originalUrl", pendingUrl);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const shortenMutation = useMutation({
    mutationFn: async (data: ShortenInput) => {
      const expiresAt = useExpiration ? getExpirationDate(expirationOption) : undefined;
      const response = await apiRequest("POST", "/api/links", {
        originalUrl: data.originalUrl,
        shortCode: useCustomAlias && data.shortCode ? data.shortCode : undefined,
        expiresAt,
      });
      return await response.json() as ShortenedResult;
    },
    onSuccess: (data) => {
      setResult(data);
      setErrorMessage(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link shortened!",
        description: "Your short link is ready to use.",
      });
    },
    onError: (error: Error) => {
      // Parse clean message from "422: {\"message\":\"...\"}" format
      let clean = error.message || "Failed to shorten URL";
      const jsonMatch = clean.match(/^\d+:\s*(\{.*\})$/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed?.message) clean = parsed.message;
        } catch {}
      }
      setErrorMessage(clean);
    },
  });

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Short link copied to clipboard.",
      });
    }
  };

  const onSubmit = (data: ShortenInput) => {
    setErrorMessage(null);
    if (!user) {
      // Save the URL so we can restore it after sign-up
      try { localStorage.setItem("pendingShortUrl", data.originalUrl); } catch {}
      router.push("/sign-up");
      return;
    }
    shortenMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="overflow-visible">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <FormField
                  control={form.control}
                  name="originalUrl"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Paste your long URL here..."
                            className="h-14 pl-12 text-base"
                            data-testid="input-url"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 px-8 font-semibold"
                  disabled={shortenMutation.isPending}
                  data-testid="button-shorten"
                >
                  {shortenMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Shorten"
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Switch
                    id="custom-alias"
                    checked={useCustomAlias}
                    onCheckedChange={setUseCustomAlias}
                    data-testid="switch-custom-alias"
                  />
                  <Label htmlFor="custom-alias" className="text-sm text-muted-foreground">
                    Custom alias
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="expiration"
                    checked={useExpiration}
                    onCheckedChange={setUseExpiration}
                    data-testid="switch-expiration"
                  />
                  <Label htmlFor="expiration" className="text-sm text-muted-foreground">
                    Set expiration
                  </Label>
                </div>
              </div>

              {useCustomAlias && (
                <FormField
                  control={form.control}
                  name="shortCode"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm shrink-0">
                            {typeof window !== "undefined" ? window.location.origin : ""}/
                          </span>
                          <Input
                            {...field}
                            placeholder="my-custom-link"
                            className="flex-1"
                            data-testid="input-custom-alias"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {useExpiration && (
                <div className="mt-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Select value={expirationOption} onValueChange={setExpirationOption}>
                    <SelectTrigger className="w-48" data-testid="select-expiration">
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      {expirationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-start gap-2 mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  Adult, illegal, or harmful content is strictly prohibited. Violating links will be removed and accounts may be banned.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {errorMessage && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive dark:border-destructive dark:bg-destructive/20" data-testid="error-blocked-url">
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">URL Not Allowed</p>
            <p className="text-sm mt-0.5 opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {result && (
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Your shortened URL:</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-background rounded-md px-4 py-3 font-mono text-sm border overflow-hidden">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                  data-testid="link-shortened-url"
                >
                  <span className="truncate">/{result.link.shortCode}</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                data-testid="button-copy-url"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Short code: <span className="font-mono font-semibold text-foreground">{result.link.shortCode}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Original: <span className="truncate inline-block max-w-xs align-bottom">{result.link.originalUrl}</span>
            </p>
            <p className="text-xs text-muted-foreground/70 mt-3 italic">
              With a custom short domain (e.g., shrt.ly), your link would be: shrt.ly/{result.link.shortCode}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
