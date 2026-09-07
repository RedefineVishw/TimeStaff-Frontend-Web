import type { TimeEntry } from "@/lib/types";

const SECONDS_IN_DAY = 24 * 60 * 60;

function secondsSinceMidnight(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}

/** A 24h horizontal bar with one colored segment per entry, positioned by time-of-day. */
export function DailyTimeline({ entries }: { entries: TimeEntry[] }) {
  return (
    <div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
        {entries.map((entry) => {
          const startFraction = secondsSinceMidnight(entry.startedAt) / SECONDS_IN_DAY;
          const widthFraction = entry.durationSeconds / SECONDS_IN_DAY;
          return (
            <div
              key={entry.id}
              className="absolute top-0 h-full"
              title={`${entry.task.project.name} / ${entry.task.name}`}
              style={{
                left: `${startFraction * 100}%`,
                width: `${Math.max(widthFraction * 100, 0.3)}%`,
                backgroundColor: entry.task.project.color ?? "#9CA3AF",
              }}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>12am</span>
      </div>
    </div>
  );
}
