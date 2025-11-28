// frontend/src/hooks/useEvents.ts
import { useEffect, useState } from "react";
import { Event } from "../types/event";

export interface UseEventsFilters {
  category?: string;
  text?: string;
  distanceKm?: number; // km
  lat?: number;
  lon?: number;
}

interface UseEventsResult {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export function useEvents(filters: UseEventsFilters): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.category) params.set("category", filters.category);
        if (filters.text) params.set("text", filters.text);
        if (filters.distanceKm !== undefined)
          params.set("distanceKm", String(filters.distanceKm));
        if (filters.lat !== undefined) params.set("lat", String(filters.lat));
        if (filters.lon !== undefined) params.set("lon", String(filters.lon));

        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

        const res = await fetch(`${baseUrl}/events?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch events (${res.status})`);
        }

        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };
  }, [filters.category, filters.text, filters.distanceKm, filters.lat, filters.lon]);

  return { events, loading, error };
}
