interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized =
    status === "approved" || status === "rejected" || status === "pending"
      ? status
      : "pending";

  const labelMap = { approved: "Genehmigt", rejected: "Abgelehnt", pending: "Ausstehend" };
  const cls =
    normalized === "approved" ? "badge-success"
    : normalized === "rejected" ? "badge-danger"
    : "badge-warning";

  return <span className={cls}>{labelMap[normalized]}</span>;
}
