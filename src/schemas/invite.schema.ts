import { z } from "zod";

export const inviteUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roleId: z.string().min(1, "Choose a role"),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
