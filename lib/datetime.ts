/** ISO string -> value an <input type="datetime-local"> can display/edit. */
export function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Date -> value an <input type="date"> can display/edit, in local time (not UTC). */
export function toLocalDateValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** True when an ISO timestamp falls on the same local calendar day as "yyyy-mm-dd". */
export function isOnLocalDate(iso: string, dateValue: string): boolean {
  return toLocalDateValue(new Date(iso)) === dateValue;
}
