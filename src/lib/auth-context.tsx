"use client";

import { createContext, useContext, ReactNode, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import { queryClient, apiRequest, getQueryFn } from "./queryClient";
import type { AuthUser } from "@shared/schema";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  refetchUser: () => void;
  unlockLinkAnalytics: (linkId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded: clerkLoaded } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const referralApplied = useRef(false);

  // Fetch our DB user data when Clerk says user is signed in
  const { data: dbUser, isLoading: dbLoading, refetch } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 60_000,
    enabled: !!isSignedIn, // Only fetch when Clerk says user is authenticated
  });

  const isLoading = !clerkLoaded || (isSignedIn && dbLoading);

  // Build the AuthUser from DB data (enriched with Clerk email if DB user not yet synced)
  const user: AuthUser | null = isSignedIn && dbUser
    ? dbUser
    : null;

  // Auto-apply referral code stored in localStorage after sign-up
  useEffect(() => {
    if (user && !referralApplied.current) {
      referralApplied.current = true;
      try {
        const pendingCode = localStorage.getItem("pendingReferralCode");
        if (pendingCode) {
          localStorage.removeItem("pendingReferralCode");
          fetch("/api/referrals/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code: pendingCode }),
          }).catch(() => {
            // Silently ignore — user may have already been referred or code is invalid
          });
        }
      } catch {
        // localStorage may not be available (SSR guard)
      }
    }
  }, [user]);

  const unlockLinkAnalytics = async (linkId: string): Promise<void> => {
    await apiRequest("POST", "/api/analytics/unlock", { linkId });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggingOut: false, // Clerk handles sign-out UI
        refetchUser: () => refetch(),
        unlockLinkAnalytics,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
