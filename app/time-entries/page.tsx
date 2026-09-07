"use client";

import { useTimeEntries } from "@/lib/queries";
import { TimeEntryForm } from "@/components/time-entry-form";
import { TimeEntriesList } from "@/components/time-entries-list";

export default function TimeEntriesPage() {
  const { data: entries, isLoading, isError } = useTimeEntries();

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <section>
        <h2 className="mb-3 font-medium">Add time entry</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <TimeEntryForm />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-medium">All entries</h2>
        {isLoading && <p className="text-sm text-gray-500">Loading…</p>}
        {isError && <p className="text-sm text-red-600">Couldn&apos;t load time entries.</p>}
        {entries && <TimeEntriesList entries={entries} />}
      </section>
    </div>
  );
}
