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
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-sm font-semibold text-slate-900">
            {event.title}
          </h2>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
            Pending
          </span>
        </div>
        <p className="text-xs text-slate-600">
          {dateStr} · {event.locationName}
        </p>
        <p className="text-[11px] text-slate-500">
          Organizer:{" "}
          <span className="font-medium text-slate-700">
            {event.organizerName || "Unknown"}
          </span>
        </p>
        <p className="text-[11px] text-slate-500">
          Category:{" "}
          <span className="font-medium text-slate-700">
            {event.category}
          </span>
        </p>
      </div>

      <div className="flex gap-2 sm:flex-col sm:items-end">
        <Link
          href={`/events/${event.id}`}
          target="_blank"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          View details
        </Link>
        <button
          type="button"
          onClick={onApprove}
          disabled={isApproving || isRejecting}
          className="inline-flex items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isApproving ? "Approving…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={isApproving || isRejecting}
          className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRejecting ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </div>
  );
}
