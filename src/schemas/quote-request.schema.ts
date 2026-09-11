import { z } from "zod";

export const createQuoteRequestSchema = z.object({
  notes: z.string().optional(),
  contactPhone: z.string().optional(),
});

export type CreateQuoteRequestFormValues = z.infer<typeof createQuoteRequestSchema>;
