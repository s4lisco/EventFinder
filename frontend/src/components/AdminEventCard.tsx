// frontend/src/components/AdminEventCard.tsx
import Link from "next/link";
import { Event } from "@/types/event";

interface AdminEventCardProps {
  event: Event;
  onApprove: () => void;
  onReject: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export default function AdminEventCard({
  event,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: AdminEventCardProps) {
  const start = new Date(event.startDate);
  const dateStr = start.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group flex flex-col gap-4 rounded-card border border-border bg-white p-4 shadow-soft transition-all duration-200 hover:border-secondary hover:shadow-soft-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate font-sans text-base font-bold text-text transition-colors duration-200 group-hover:text-primary">
            {event.title}
          </h2>
          <span className="inline-flex items-center gap-1 rounded-pill bg-warning/10 px-3 py-1 font-body text-xs font-semibold text-warning-800">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending
          </span>
        </div>
        <div className="flex items-center gap-2 font-body text-sm text-text-muted">
          <svg className="h-4 w-4 flex-shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-2 font-body text-sm text-text-muted">
          <svg className="h-4 w-4 flex-shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.locationName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-pill bg-primary/10 px-2.5 py-0.5 font-body text-xs font-semibold text-primary">
            {event.category}
          </span>
          <span className="font-body text-xs text-text-muted">
            by <span className="font-semibold text-text">{event.organizerName || "Unknown"}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col sm:flex-nowrap sm:items-end">
        <Link
          href={`/events/${event.id}`}
          target="_blank"
          className="btn-outline flex-1 text-xs sm:w-32"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </Link>
        <button
          type="button"
          onClick={onApprove}
          disabled={isApproving || isRejecting}
          className="inline-flex flex-1 items-center justify-center rounded-button border-2 border-success-500/30 bg-success-500/10 px-4 py-2.5 font-body text-xs font-semibold text-success-700 shadow-soft transition-all duration-200 hover:bg-success-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
        >
          {isApproving ? (
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-success-700 border-t-transparent"></div>
              Approving…
            </span>
          ) : (
            <>
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Approve
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={isApproving || isRejecting}
          className="inline-flex flex-1 items-center justify-center rounded-button border-2 border-red-300 bg-red-50 px-4 py-2.5 font-body text-xs font-semibold text-red-700 shadow-soft transition-all duration-200 hover:bg-red-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
        >
          {isRejecting ? (
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-700 border-t-transparent"></div>
              Rejecting…
            </span>
          ) : (
            <>
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reject
            </>
          )}
        </button>
      </div>
    </div>
  );
}
