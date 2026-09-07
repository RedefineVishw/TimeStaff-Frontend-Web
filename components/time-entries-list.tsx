"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDeleteTimeEntry } from "@/lib/queries";
import { TimeEntryForm } from "@/components/time-entry-form";
import { formatDurationCompact } from "@/lib/format-duration";
import { toLocalInputValue } from "@/lib/datetime";
import type { TimeEntry } from "@/lib/types";

// Shared by the daily dashboard and the full history page — a list of
// entries with inline edit (swaps the row for the same add/edit form) and
// delete. The caller decides *which* entries to pass in (today's, all, etc).
export function TimeEntriesList({ entries }: { entries: TimeEntry[] }) {
  const deleteEntry = useDeleteTimeEntry();
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Delete this time entry?")) return;
    deleteEntry.mutate(id, {
      onSuccess: () => toast.success("Entry deleted"),
      onError: () => toast.error("Couldn't delete entry"),
    });
  }

  if (entries.length === 0) {
    return <p className="p-3 text-sm text-gray-500">No entries here.</p>;
  }

  return (
    <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {entries.map((entry) =>
        editingId === entry.id ? (
          <div key={entry.id} className="p-4">
            <TimeEntryForm
              entryId={entry.id}
              defaultValues={{
                taskId: entry.taskId,
                startedAt: toLocalInputValue(entry.startedAt),
                endedAt: entry.endedAt ? toLocalInputValue(entry.endedAt) : "",
              }}
              onDone={() => setEditingId(null)}
            />
          </div>
        ) : (
          <div key={entry.id} className="flex items-center justify-between p-3 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.task.project.color ?? "#9CA3AF" }}
              />
              <div>
                <p className="font-medium">
                  {entry.task.project.name} / {entry.task.name}
                </p>
                <p className="text-gray-500">
                  {new Date(entry.startedAt).toLocaleString()} –{" "}
                  {entry.endedAt ? new Date(entry.endedAt).toLocaleString() : "running"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{formatDurationCompact(entry.durationSeconds)}</span>
              <button
                onClick={() => setEditingId(entry.id)}
                aria-label="Edit entry"
                className="text-gray-500 hover:text-gray-800"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                aria-label="Delete entry"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
