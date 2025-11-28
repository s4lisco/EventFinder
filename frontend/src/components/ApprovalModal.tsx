// frontend/src/components/ApprovalModal.tsx
import { FormEvent, useState } from "react";

interface ApprovalModalProps {
  mode: "approve" | "reject";
  open: boolean;
  eventTitle: string;
  loading?: boolean;
  onConfirm: (adminComment?: string) => void | Promise<void>;
  onCancel: () => void;
}

export default function ApprovalModal({
  mode,
  open,
  eventTitle,
  loading,
  onConfirm,
  onCancel,
}: ApprovalModalProps) {
  const [comment, setComment] = useState("");

  if (!open) return null;

  const isReject = mode === "reject";
  const title = isReject ? "Reject event" : "Approve event";
  const description = isReject
    ? `Optionally provide a reason for rejecting "${eventTitle}".`
    : `Are you sure you want to approve "${eventTitle}"?`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onConfirm(isReject ? comment : undefined);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
      >
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-xs text-slate-600">{description}</p>

        {isReject && (
          <div className="mt-3 space-y-1">
            <label className="text-[11px] font-medium text-slate-700">
              Admin comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
              placeholder="Short explanation for the organizer…"
            />
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${
              isReject
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading
              ? isReject
                ? "Rejecting…"
                : "Approving…"
              : isReject
              ? "Reject event"
              : "Approve event"}
          </button>
        </div>
      </form>
    </div>
  );
}
