import { apiRequest } from "@/lib/api";
import type { ActivateSubscriptionFormValues } from "@/schemas/subscription.schema";

interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: string;
}

export const activateSubscription = (data: ActivateSubscriptionFormValues) =>
  apiRequest<Subscription>({
    url: "/subscriptions",
    method: "POST",
    data,
  });
