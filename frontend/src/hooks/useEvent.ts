// frontend/src/hooks/useEvent.ts
import { useCallback, useEffect, useState } from "react";
import { Event } from "../types/event";

interface UseEventResult {
  event: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEvent(id?: string): UseEventResult {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async (signal?: AbortSignal) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
      const res = await fetch(`${baseUrl}/events/${id}`, {
        signal,
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
        eventImages: data.eventImages ?? [],
        status: data.status ?? "approved",
      };

      setEvent(mapped);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    fetchEvent(controller.signal);

    return () => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };
  }, [id, fetchEvent]);

  const refetch = useCallback(async () => {
    await fetchEvent();
  }, [fetchEvent]);

  return { event, loading, error, refetch };
}
