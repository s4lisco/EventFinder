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
      ? "badge-success"
      : normalized === "rejected"
      ? "badge-danger"
      : "badge-warning";

  const icon =
    normalized === "approved" ? (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : normalized === "rejected" ? (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${colorClasses}`}
    >
      {icon}
      {label}
    </span>
  );
}
