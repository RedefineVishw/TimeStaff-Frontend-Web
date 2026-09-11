import { apiRequest } from "@/lib/api";
import type { CreateOrganizationFormValues } from "@/schemas/organization.schema";
import type { InviteUserFormValues } from "@/schemas/invite.schema";
import type { CreateQuoteRequestFormValues } from "@/schemas/quote-request.schema";

interface Organization {
  id: string;
  name: string;
  slug: string;
  status: "ONBOARDING" | "ACTIVE" | "SUSPENDED";
}

export const createOrganization = (data: CreateOrganizationFormValues) =>
  apiRequest<Organization>({
    url: "/organizations",
    method: "POST",
    data,
  });

export const inviteUser = (organizationId: string, data: InviteUserFormValues) =>
  apiRequest<{ id: string; email: string }>({
    url: `/organizations/${organizationId}/invite`,
    method: "POST",
    data,
  });

export const createQuoteRequest = (organizationId: string, data: CreateQuoteRequestFormValues) =>
  apiRequest<{ id: string; status: string }>({
    url: `/organizations/${organizationId}/quote-requests`,
    method: "POST",
    data,
  });
