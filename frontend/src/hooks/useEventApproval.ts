// frontend/src/hooks/useEventApproval.ts
import { useState } from "react";

type ActionType = "approve" | "reject" | null;

interface UseEventApprovalResult {
  approveEvent: (id: string) => Promise<boolean>;
  rejectEvent: (id: string, adminComment?: string) => Promise<boolean>;
  loadingId: string | null;
  loadingAction: ActionType;
  error: string | null;
}

export function useEventApproval(token?: string): UseEventApprovalResult {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<ActionType>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const approveEvent = async (id: string): Promise<boolean> => {
    if (!token) {
      setError("Not authenticated");
      return false;
    }

    setLoadingId(id);
    setLoadingAction("approve");
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/admin/events/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to approve event (${res.status})`);
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return false;
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  };

  const rejectEvent = async (
    id: string,
    adminComment?: string,
  ): Promise<boolean> => {
    if (!token) {
      setError("Not authenticated");
      return false;
    }

    setLoadingId(id);
    setLoadingAction("reject");
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/admin/events/${id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          adminComment ? { admin_comment: adminComment } : {},
        ),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to reject event (${res.status})`);
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return false;
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  };

  return { approveEvent, rejectEvent, loadingId, loadingAction, error };
}
