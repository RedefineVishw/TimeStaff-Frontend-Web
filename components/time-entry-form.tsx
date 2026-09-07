"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useCreateTimeEntry, useProjects, useUpdateTimeEntry } from "@/lib/queries";
import { timeEntryFormSchema, type TimeEntryFormValues } from "@/lib/schemas";

interface TimeEntryFormProps {
  /** Present when editing an existing entry; absent when adding a new one. */
  entryId?: string;
  defaultValues?: Partial<TimeEntryFormValues>;
  onDone?: () => void;
}

export function TimeEntryForm({ entryId, defaultValues, onDone }: TimeEntryFormProps) {
  const { data: projects } = useProjects();
  const createEntry = useCreateTimeEntry();
  const updateEntry = useUpdateTimeEntry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeEntryFormValues>({
    resolver: zodResolver(timeEntryFormSchema),
    defaultValues,
  });

  const taskOptions = projects?.flatMap((project) =>
    project.tasks.map((task) => ({ id: task.id, label: `${project.name} / ${task.name}` })),
  );

  function onSubmit(values: TimeEntryFormValues) {
    const payload = {
      taskId: values.taskId,
      startedAt: new Date(values.startedAt).toISOString(),
      endedAt: new Date(values.endedAt).toISOString(),
    };

    if (entryId) {
      updateEntry.mutate(
        { id: entryId, ...payload },
        {
          onSuccess: () => {
            toast.success("Entry updated");
            onDone?.();
          },
          onError: () => toast.error("Couldn't update entry"),
        },
      );
    } else {
      createEntry.mutate(payload, {
        onSuccess: () => {
          toast.success("Entry added");
          reset();
        },
        onError: () => toast.error("Couldn't add entry"),
      });
    }
  }

  const isPending = createEntry.isPending || updateEntry.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Task</label>
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          {...register("taskId")}
        >
          <option value="">Select a task…</option>
          {taskOptions?.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.taskId && <p className="mt-1 text-xs text-red-600">{errors.taskId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Start</label>
          <input
            type="datetime-local"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            {...register("startedAt")}
          />
          {errors.startedAt && (
            <p className="mt-1 text-xs text-red-600">{errors.startedAt.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">End</label>
          <input
            type="datetime-local"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            {...register("endedAt")}
          />
          {errors.endedAt && <p className="mt-1 text-xs text-red-600">{errors.endedAt.message}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {entryId ? "Save changes" : "Add entry"}
        </Button>
        {entryId && (
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
