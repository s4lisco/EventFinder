// frontend/src/hooks/useDeleteEvent.ts
import { useState } from "react";

interface UseDeleteEventResult {
  deleteEvent: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteEvent(token?: string): UseDeleteEventResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const deleteEvent = async (id: string): Promise<boolean> => {
    if (!token) {
      setError("Not authenticated");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete event (${res.status})`);
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteEvent, loading, error };
}
