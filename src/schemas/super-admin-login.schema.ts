import { z } from "zod";

export const superAdminLoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SuperAdminLoginFormValues = z.infer<typeof superAdminLoginSchema>;
