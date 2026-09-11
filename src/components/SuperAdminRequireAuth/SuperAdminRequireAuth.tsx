"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSuperAdminStore } from "@/zustand/super-admin.store";

// No session-restore mechanism exists for Super Admin (no refresh endpoint,
// by design — see super-admin.store.ts) — this is a synchronous check,
// unlike the org-user RequireAuth which has to wait for a hydration attempt.
export function SuperAdminRequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useSuperAdminStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) router.replace("/super-admin/login");
  }, [accessToken, router]);

  if (!accessToken) return null;

  return <>{children}</>;
}
