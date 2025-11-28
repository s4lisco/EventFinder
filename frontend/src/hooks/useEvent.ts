// frontend/src/hooks/useEvent.ts
import { useEffect, useState } from "react";
import { Event } from "../types/event";

interface UseEventResult {
  event: Event | null;
  loading: boolean;
  error: string | null;
}

export function useEvent(id?: string): UseEventResult {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const res = await fetch(`${baseUrl}/events/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch event (${res.status})`);
        }

        const data = await res.json();

        // map snake_case or mixed API response into our Event type
        const mapped: Event = {
          id: String(data.id),
          title: data.title,
          description: data.description,
          startDate: data.start_date || data.startDate,
          endDate: data.end_date || data.endDate,
          category: data.category,
          priceInfo: data.price_info ?? data.priceInfo ?? null,
          locationName: data.location_name || data.locationName,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          organizerName: data.organizer_name || data.organizerName,
          website: data.website ?? null,
          images: data.images ?? [],
          status: data.status ?? "approved",
        };

        setEvent(mapped);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };
  }, [id]);

  return { event, loading, error };
}
