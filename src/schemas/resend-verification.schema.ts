import { z } from "zod";

export const resendVerificationSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;
