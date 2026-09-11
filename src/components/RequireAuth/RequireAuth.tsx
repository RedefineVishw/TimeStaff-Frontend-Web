"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Loader } from "@/components/Loader/Loader";
import { useAuthStore } from "@/zustand/auth.store";

// Wrap any page that needs a logged-in user. Waits for AuthProvider's
// hydration attempt to finish before deciding to redirect — otherwise a
// hard refresh would bounce a genuinely logged-in user to /login before
// the silent refresh+/auth/me call even had a chance to complete.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace("/login");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader className="h-6 w-6 text-indigo-600" />
      </div>
    );
  }

  return <>{children}</>;
}
