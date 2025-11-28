// frontend/src/hooks/usePendingEvents.ts
import { useEffect, useState } from "react";
import { Event } from "@/types/event";

interface UsePendingEventsResult {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePendingEvents(token?: string): UsePendingEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${baseUrl}/admin/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to fetch events (${res.status})`);
        }

        const data = await res.json();

        const mapped: Event[] = (data || []).map((e: any) => ({
          id: String(e.id),
          title: e.title,
          description: e.description,
          startDate: e.startDate || e.start_date,
          endDate: e.endDate || e.end_date,
          category: e.category,
          priceInfo: e.priceInfo ?? e.price_info ?? null,
          locationName: e.locationName || e.location_name,
          address: e.address,
          latitude: e.latitude,
          longitude: e.longitude,
          organizerName: e.organizerName || e.organizer_name,
          website: e.website ?? null,
          images: e.images ?? [],
          status: e.status ?? "pending",
        }));

        setEvents(mapped);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      controller.abort();
    };
  }, [token, baseUrl, trigger]);

  const refetch = () => setTrigger((t) => t + 1);

  return { events, loading, error, refetch };
}
