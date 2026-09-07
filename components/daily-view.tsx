"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTimeEntries } from "@/lib/queries";
import { isOnLocalDate, toLocalDateValue } from "@/lib/datetime";
import { formatDurationClock } from "@/lib/format-duration";
import { DailyTimeline } from "@/components/daily-timeline";
import { TimeEntriesList } from "@/components/time-entries-list";
import { Button } from "@/components/ui/button";

const TODAY = toLocalDateValue(new Date());

export function DailyView() {
  const { data: entries, isLoading, isError } = useTimeEntries();
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const dayEntries = useMemo(
    () => (entries ?? []).filter((entry) => isOnLocalDate(entry.startedAt, selectedDate)),
    [entries, selectedDate],
  );

  const totalSeconds = dayEntries.reduce((sum, entry) => sum + entry.durationSeconds, 0);
  const label = selectedDate === TODAY ? "Today" : selectedDate;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-mono text-2xl font-semibold tabular-nums">
            {formatDurationClock(totalSeconds)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <Button render={<Link href="/time-entries" />}>Add time</Button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading…</p>}
      {isError && <p className="text-sm text-red-600">Couldn&apos;t load time entries.</p>}

      {!isLoading && !isError && (
        <>
          <DailyTimeline entries={dayEntries} />
          <TimeEntriesList entries={dayEntries} />
        </>
      )}
    </div>
  );
}
