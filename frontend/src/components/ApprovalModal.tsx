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
  const title = isReject ? "Veranstaltung ablehnen" : "Veranstaltung genehmigen";
  const description = isReject
    ? `Optional können Sie einen Grund für die Ablehnung von "${eventTitle}" angeben.`
    : `Sind Sie sicher, dass Sie "${eventTitle}" genehmigen möchten?`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onConfirm(isReject ? comment : undefined);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-card bg-white p-4 shadow-soft-xl animate-modal"
      >
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        <p className="mt-1 text-xs text-text-muted">{description}</p>

        {isReject && (
          <div className="mt-3 space-y-1">
            <label className="text-[11px] font-medium text-text">
              Admin-Kommentar (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] w-full rounded-card border-2 border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted transition-all duration-150 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10"
              placeholder="Kurze Erklärung für den Veranstalter…"
            />
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary text-xs"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-button px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
              isReject
                ? "bg-red-600"
                : "bg-success-600"
            }`}
          >
            {loading
              ? isReject
                ? "Wird abgelehnt…"
                : "Wird genehmigt…"
              : isReject
              ? "Veranstaltung ablehnen"
              : "Veranstaltung genehmigen"}
          </button>
        </div>
      </form>
    </div>
  );
}
