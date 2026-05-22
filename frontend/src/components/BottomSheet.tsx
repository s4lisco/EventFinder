import { ReactNode, useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
      <button
        aria-label="Schließen"
        onClick={onClose}
        className="absolute inset-0 bg-text/30 backdrop-blur-[2px] animate-fade-in"
      />
      <div className="sheet relative w-full max-w-xl animate-slide-up lg:rounded-card">
        <div className="sheet-handle" />
        {title && (
          <div className="border-b border-border px-5 pb-3 pt-1">
            <h3 className="font-display text-lg font-bold tracking-tight text-text">{title}</h3>
          </div>
        )}
        <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
