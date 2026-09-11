import { z } from "zod";

export const activateSubscriptionSchema = z.object({
  planId: z.string().min(1, "Choose a plan"),
});

export type ActivateSubscriptionFormValues = z.infer<typeof activateSubscriptionSchema>;
