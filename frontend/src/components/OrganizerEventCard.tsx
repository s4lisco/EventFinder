// frontend/src/components/OrganizerEventCard.tsx
import StatusBadge from "./StatusBadge";
import { Event } from "@/types/event";

interface OrganizerEventCardProps {
  event: Event;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function OrganizerEventCard({
  event,
  disabled,
  onEdit,
  onDelete,
}: OrganizerEventCardProps) {
  const start = new Date(event.startDate);
  const dateStr = start.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-sm font-semibold text-slate-900">
            {event.title}
          </h2>
          <StatusBadge status={event.status || "pending"} />
        </div>
        <p className="text-xs text-slate-600">
          {dateStr} · {event.locationName}
        </p>
        <p className="text-[11px] text-slate-500">
          Category:{" "}
          <span className="font-medium text-slate-700">
            {event.category}
          </span>
        </p>
      </div>

      <div className="flex gap-2 sm:flex-col sm:items-end">
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
