"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Check } from "lucide-react";

import { Button } from "@/components/Button/Button";
import { Loader } from "@/components/Loader/Loader";
import { RequireAuth } from "@/components/RequireAuth/RequireAuth";
import { getMe } from "@/services/auth.service";
import { getPlans } from "@/services/plans.service";
import { activateSubscription } from "@/services/subscriptions.service";
import { useAuthStore } from "@/zustand/auth.store";
import { cn } from "@/utils/cn";

function humanizeFeature(feature: string) {
  return feature.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ChoosePlan() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // No org yet — this page assumes one exists.
  useEffect(() => {
    if (!user?.organization) router.replace("/onboarding/organization");
    else if (user.organization.status === "ACTIVE") router.replace("/dashboard");
  }, [user, router]);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: activateSubscription,
    onSuccess: async () => {
      toast.success("Subscription activated.");
      setUser(await getMe());
      router.push("/dashboard");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!user?.organization || user.organization.status === "ACTIVE") return null;

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-2xl font-bold text-gray-900">Choose a plan</h1>
        <p className="mt-1 text-center text-sm text-gray-500">You can change this any time.</p>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader className="h-6 w-6 text-indigo-600" />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans?.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "flex flex-col rounded-xl border bg-white p-6 text-left shadow-sm transition-colors",
                    isSelected ? "border-indigo-600 ring-2 ring-indigo-600" : "border-gray-200 hover:border-indigo-300",
                  )}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.currency} {Number(plan.basePrice).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">/{plan.billingCycle === "MONTHLY" ? "month" : "year"}</span>
                  </p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.entitlements
                      .filter((e) => e.value === "true")
                      .map((e) => (
                        <li key={e.feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check size={14} className="shrink-0 text-indigo-600" />
                          {humanizeFeature(e.feature)}
                        </li>
                      ))}
                  </ul>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            disabled={!selectedPlanId}
            loading={isPending}
            loadingText="Activating..."
            onClick={() => selectedPlanId && mutate({ planId: selectedPlanId })}
          >
            Activate Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPlanPage() {
  return (
    <RequireAuth>
      <ChoosePlan />
    </RequireAuth>
  );
}
