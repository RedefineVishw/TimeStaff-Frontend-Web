"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/Button/Button";
import { buttonVariants } from "@/components/Button/types";
import { Loader } from "@/components/Loader/Loader";
import { SuperAdminRequireAuth } from "@/components/SuperAdminRequireAuth/SuperAdminRequireAuth";
import { getQuoteRequests } from "@/services/super-admin.service";
import { useSuperAdminStore } from "@/zustand/super-admin.store";
import { cn } from "@/utils/cn";

function SuperAdminDashboardContent() {
  const router = useRouter();
  const superAdmin = useSuperAdminStore((s) => s.superAdmin);
  const logout = useSuperAdminStore((s) => s.logout);

  const { data: quoteRequests, isLoading } = useQuery({
    queryKey: ["super-admin", "quote-requests", "PENDING"],
    queryFn: () => getQuoteRequests("PENDING"),
  });

  const handleLogout = () => {
    logout();
    router.push("/super-admin/login");
  };

  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Quote Requests</h1>
            <p className="mt-1 text-sm text-gray-500">Logged in as {superAdmin?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader className="h-6 w-6 text-indigo-600" />
          </div>
        ) : !quoteRequests?.length ? (
          <p className="mt-12 text-center text-gray-500">No pending quote requests.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {quoteRequests.map((qr) => (
              <div key={qr.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{qr.organization.name}</h3>
                    {qr.notes && <p className="mt-1 text-sm text-gray-600">{qr.notes}</p>}
                    {qr.contactPhone && <p className="mt-1 text-sm text-gray-500">{qr.contactPhone}</p>}
                    <p className="mt-1 text-xs text-gray-400">
                      Requested {new Date(qr.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/super-admin/quote-requests/${qr.id}/convert`}
                    className={cn(buttonVariants({ variant: "default", size: "sm" }), "shrink-0")}
                  >
                    Convert to Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return (
    <SuperAdminRequireAuth>
      <SuperAdminDashboardContent />
    </SuperAdminRequireAuth>
  );
}
