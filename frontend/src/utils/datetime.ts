// frontend/src/utils/datetime.ts
// Convert ISO string to datetime-local input value
export function isoToLocalInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Convert datetime-local value to ISO string
export function localInputToIso(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  return d.toISOString();
}
