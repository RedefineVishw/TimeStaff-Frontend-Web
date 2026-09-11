"use client";

import { useEffect } from "react";

import { getMe, refreshSession } from "@/services/auth.service";
import { useAuthStore } from "@/zustand/auth.store";

// Runs once on app load. The access token only ever lives in memory, so a
// hard refresh loses it — this silently re-acquires one via the httpOnly
// refresh-token cookie, then fetches the user profile to rehydrate the
// store. A failure here just means "visitor isn't logged in", not an error.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    (async () => {
      try {
        const { accessToken } = await refreshSession();
        setAccessToken(accessToken);
        setUser(await getMe());
      } catch {
        // No valid refresh cookie — a normal state for a logged-out visitor.
      } finally {
        setHydrated();
      }
    })();
  }, [setAccessToken, setUser, setHydrated]);

  return <>{children}</>;
}
