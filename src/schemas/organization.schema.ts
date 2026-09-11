import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
});

export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;
