import { apiRequest } from "@/lib/api";
import type { SuperAdminLoginFormValues } from "@/schemas/super-admin-login.schema";
import type { CreatePlanFromQuoteFormValues } from "@/schemas/create-plan-from-quote.schema";

export interface SuperAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface SuperAdminLoginResponse {
  accessToken: string;
  superAdmin: SuperAdmin;
}

export const superAdminLogin = (data: SuperAdminLoginFormValues) =>
  apiRequest<SuperAdminLoginResponse>({
    url: "/super-admin/login",
    method: "POST",
    data,
  });

export interface QuoteRequest {
  id: string;
  notes: string | null;
  contactPhone: string | null;
  source: "FORM" | "CALL";
  status: "PENDING" | "CONTACTED" | "RESOLVED";
  createdAt: string;
  organization: { id: string; name: string; slug: string; status: string };
}

export const getQuoteRequests = (status?: "PENDING" | "CONTACTED" | "RESOLVED") =>
  apiRequest<QuoteRequest[]>({
    url: "/super-admin/quote-requests",
    method: "GET",
    params: status ? { status } : undefined,
  });

const ENTITLEMENT_FIELDS = {
  timeTracking: "time_tracking",
  advancedReports: "advanced_reports",
  hr: "hr",
  customPermissions: "custom_permissions",
  screenshots: "screenshots",
} as const;

export const convertQuoteToPlan = (quoteRequestId: string, data: CreatePlanFromQuoteFormValues) =>
  apiRequest<{ id: string; name: string }>({
    url: `/super-admin/quote-requests/${quoteRequestId}/convert-to-plan`,
    method: "POST",
    data: {
      name: data.name,
      basePrice: data.basePrice,
      billingCycle: data.billingCycle,
      entitlements: Object.entries(ENTITLEMENT_FIELDS).map(([formKey, feature]) => ({
        feature,
        value: String(data[formKey as keyof typeof ENTITLEMENT_FIELDS]),
      })),
    },
  });
