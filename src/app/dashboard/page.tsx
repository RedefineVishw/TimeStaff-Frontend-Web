"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/Button/Button";
import { buttonVariants } from "@/components/Button/types";
import { cn } from "@/utils/cn";
import { RequireAuth } from "@/components/RequireAuth/RequireAuth";
import { logoutUser } from "@/services/auth.service";
import { useAuthStore } from "@/zustand/auth.store";

// Minimal placeholder — Phase 1 stops at "org onboarded, subscription
// active". Real dashboard content (projects, tasks, time tracking) is
// Phase 2 scope.
function DashboardContent() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {user?.firstName}
      </h1>
      <p className="text-gray-500">
        {user?.organization?.name} is set up and active.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/team/invite" className={cn(buttonVariants({ variant: "default" }))}>
          Invite Teammate
        </Link>
        <Link href="/team/quote-request" className={cn(buttonVariants({ variant: "outline" }))}>
          Request Custom Plan
        </Link>
      </div>
      <Button variant="ghost" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
