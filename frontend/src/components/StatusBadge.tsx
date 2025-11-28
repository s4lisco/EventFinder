// frontend/src/components/StatusBadge.tsx
interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized =
    status === "approved" || status === "rejected" || status === "pending"
      ? status
      : "pending";

  const label =
    normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();

  const colorClasses =
    normalized === "approved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : normalized === "rejected"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${colorClasses}`}
    >
      {label}
    </span>
  );
}
