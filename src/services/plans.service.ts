import { apiRequest } from "@/lib/api";

export interface PlanEntitlement {
  feature: string;
  value: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  currency: string;
  billingCycle: "MONTHLY" | "YEARLY";
  entitlements: PlanEntitlement[];
}

export const getPlans = () =>
  apiRequest<Plan[]>({
    url: "/plans",
    method: "GET",
  });
