// frontend/src/components/ApprovalModal.tsx
import { FormEvent, useState } from "react";

interface ApprovalModalProps {
  open: boolean;
  eventTitle: string;
  loading?: boolean;
  onConfirm: (reason: string) => void | Promise<void>;
  onCancel: () => void;
}

const MIN_CHARS = 10;

export default function ApprovalModal({
  open,
  eventTitle,
  loading,
  onConfirm,
  onCancel,
}: ApprovalModalProps) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  if (!open) return null;

  const isValid = reason.trim().length >= MIN_CHARS;
  const showError = touched && !isValid;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    await onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-card bg-white p-5 shadow-soft-xl animate-modal"
      >
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-text">Veranstaltung ablehnen</h2>
        </div>
        <p className="mb-3 text-xs text-text-muted">
          Bitte gib eine Begründung für die Ablehnung von{" "}
          <span className="font-semibold text-text">„{eventTitle}"</span> an.
          Diese wird dem Veranstalter angezeigt.
        </p>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text">
              Begründung <span className="text-red-500">*</span>
            </label>
            <span className={`text-[11px] ${reason.trim().length >= MIN_CHARS ? "text-success-600" : "text-slate-400"}`}>
              {reason.trim().length}/{MIN_CHARS} min.
            </span>
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            rows={4}
            className={`w-full rounded-card border-2 bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:ring-4 ${
              showError
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : "border-border focus:border-red-500 focus:ring-red-500/10"
            }`}
            placeholder="z.B. Die Veranstaltung enthält unvollständige Angaben. Bitte ergänze Adresse und Uhrzeit…"
          />
          {showError && (
            <p className="text-[11px] text-red-600">
              Mindestens {MIN_CHARS} Zeichen erforderlich.
            </p>
          )}
        </div>

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
            disabled={loading || !isValid}
            className="rounded-button bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition-all duration-150 hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Wird abgelehnt…
              </span>
            ) : (
              "Veranstaltung ablehnen"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
