"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Preserve all query params (e.g. ?ref=CODE for referrals)
    const search = window.location.search;
    router.replace(search ? `/sign-up${search}` : "/sign-up");
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to sign up...</p>
    </div>
  );
}
