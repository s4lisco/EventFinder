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
    <div className="card-bordered group flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors duration-200">
            {event.title}
          </h2>
          <StatusBadge status={event.status || "pending"} />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.locationName}</span>
        </div>
        <div className="badge-primary text-xs">
          {event.category}
        </div>
      </div>

      <div className="flex gap-2 sm:flex-col sm:items-end">
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          className="btn-secondary flex-1 sm:w-28 text-xs"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 shadow-soft transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:shadow-soft-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-28"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
