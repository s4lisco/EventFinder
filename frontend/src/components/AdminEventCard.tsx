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
    <div className="card-bordered group flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-bold text-slate-900 group-hover:text-accent-600 transition-colors duration-200">
            {event.title}
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Review
          </span>
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
        <div className="flex items-center gap-3">
          <div className="badge-primary text-xs">
            {event.category}
          </div>
          <div className="text-xs text-slate-500">
            by <span className="font-semibold text-slate-700">{event.organizerName || "Unknown"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end sm:flex-nowrap">
        <Link
          href={`/events/${event.id}`}
          target="_blank"
          className="btn-ghost flex-1 text-xs sm:w-32"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </Link>
        <button
          type="button"
          onClick={onApprove}
          disabled={isApproving || isRejecting}
          className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-success-200 bg-success-50 px-4 py-2.5 text-xs font-semibold text-success-700 shadow-soft transition-all duration-200 hover:border-success-300 hover:bg-success-100 hover:shadow-soft-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
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
          className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 shadow-soft transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:shadow-soft-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
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
