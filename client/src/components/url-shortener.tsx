import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import { Link2, Copy, Check, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import type { Link } from "@shared/schema";

const shortenSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  shortCode: z.string().min(3, "At least 3 characters").max(20).optional().or(z.literal("")),
});

type ShortenInput = z.infer<typeof shortenSchema>;

interface ShortenedResult {
  link: Link;
  shortUrl: string;
}

export function UrlShortener() {
  const { toast } = useToast();
  const [useCustomAlias, setUseCustomAlias] = useState(false);
  const [result, setResult] = useState<ShortenedResult | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<ShortenInput>({
    resolver: zodResolver(shortenSchema),
    defaultValues: {
      originalUrl: "",
      shortCode: "",
    },
  });

  const shortenMutation = useMutation({
    mutationFn: async (data: ShortenInput) => {
      const response = await apiRequest("POST", "/api/links", {
        originalUrl: data.originalUrl,
        shortCode: useCustomAlias && data.shortCode ? data.shortCode : undefined,
      });
      return await response.json() as ShortenedResult;
    },
    onSuccess: (data) => {
      setResult(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link shortened!",
        description: "Your short link is ready to use.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to shorten URL",
        variant: "destructive",
      });
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

              <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <Switch
                  id="custom-alias"
                  checked={useCustomAlias}
                  onCheckedChange={setUseCustomAlias}
                  data-testid="switch-custom-alias"
                />
                <Label htmlFor="custom-alias" className="text-sm text-muted-foreground">
                  Use custom alias
                </Label>
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
