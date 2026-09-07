import { z } from "zod";

export const timeEntryFormSchema = z
  .object({
    taskId: z.string().min(1, "Pick a task"),
    startedAt: z.string().min(1, "Start time is required"),
    endedAt: z.string().min(1, "End time is required"),
  })
  .refine((data) => new Date(data.endedAt) > new Date(data.startedAt), {
    message: "End time must be after start time",
    path: ["endedAt"],
  });

export type TimeEntryFormValues = z.infer<typeof timeEntryFormSchema>;
