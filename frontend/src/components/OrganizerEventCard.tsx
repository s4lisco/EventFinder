// frontend/src/components/OrganizerEventCard.tsx
import StatusBadge from "./StatusBadge";
import { Event } from "@/types/event";

interface OrganizerEventCardProps {
  event: Event;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onResubmit: () => void;
}

export default function OrganizerEventCard({
  event,
  disabled,
  onEdit,
  onDelete,
  onResubmit,
}: OrganizerEventCardProps) {
  const start = new Date(event.startDate);
  const dateStr = start.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isRejected = event.status === "rejected";

  return (
    <div className={`card-bordered group flex flex-col gap-3 p-4 ${isRejected ? "border-red-200 bg-red-50/30" : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: info */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-bold text-text group-hover:text-primary transition-colors duration-150">
              {event.title}
            </h2>
            <StatusBadge status={event.status || "pending"} />
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.locationName}</span>
          </div>
          <div className="badge-primary text-xs">{event.category}</div>
        </div>

        {/* Right: actions */}
        <div className="flex gap-2 sm:flex-col sm:items-end sm:flex-shrink-0">
          <button
            type="button"
            onClick={onEdit}
            disabled={disabled}
            className="btn-secondary flex-1 sm:w-28 text-xs"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Bearbeiten
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="inline-flex flex-1 items-center justify-center rounded-button border-2 border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-700 shadow-soft transition-all duration-150 hover:bg-red-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-28"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Löschen
          </button>
        </div>
      </div>

      {/* Rejection reason box */}
      {isRejected && event.rejectionReason && (
        <div className="rounded-xl border-l-4 border-red-400 bg-red-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-red-800">Begründung der Ablehnung</p>
              <p className="mt-0.5 text-sm text-red-700">{event.rejectionReason}</p>
              {event.rejectedAt && (
                <p className="mt-1 text-[11px] text-red-500">
                  Abgelehnt am{" "}
                  {new Date(event.rejectedAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onResubmit}
            disabled={disabled}
            className="mt-3 inline-flex items-center gap-1.5 rounded-button border-2 border-primary/20 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-soft transition-all hover:bg-primary/5 active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Event bearbeiten &amp; erneut einreichen
          </button>
        </div>
      )}
    </div>
  );
}
