"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignUpPage() {
  useEffect(() => {
    // Capture referral code from URL and persist it for auto-apply after sign-up
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("pendingReferralCode", ref);
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}
