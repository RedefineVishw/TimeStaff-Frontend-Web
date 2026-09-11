import { z } from "zod";

// Matches the known entitlement features bootstrap.ts seeds on every plan —
// a fixed checkbox set rather than a free-form key/value editor, since that's
// the actual real-world shape today.
export const createPlanFromQuoteSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  basePrice: z
    .string()
    .min(1, "Base price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount, e.g. 499.00"),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  timeTracking: z.boolean(),
  advancedReports: z.boolean(),
  hr: z.boolean(),
  customPermissions: z.boolean(),
  screenshots: z.boolean(),
});

export type CreatePlanFromQuoteFormValues = z.infer<typeof createPlanFromQuoteSchema>;
