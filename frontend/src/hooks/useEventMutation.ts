// frontend/src/hooks/useEventMutation.ts
import { useState } from "react";
import { Event } from "@/types/event";
import { EventFormValues } from "@/components/EventForm";
import { localInputToIso } from "@/utils/datetime";

interface UseEventMutationResult {
  createEvent: (values: EventFormValues) => Promise<Event | null>;
  updateEvent: (id: string, values: EventFormValues) => Promise<Event | null>;
  loading: boolean;
  error: string | null;
}

export function useEventMutation(token?: string): UseEventMutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const buildPayload = (values: EventFormValues) => {
    const images = values.images
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    return {
      title: values.title.trim(),
      description: values.description.trim(),
      startDate: localInputToIso(values.startDate),
      endDate: values.endDate ? localInputToIso(values.endDate) : null,
      category: values.category,
      priceInfo: values.priceInfo || null,
      locationName: values.locationName,
      address: values.address,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      website: values.website || null,
      images,
      organizerName: values.organizerName || "",
    };
  };

  const createEvent = async (
    values: EventFormValues,
  ): Promise<Event | null> => {
    if (!token) {
      setError("Not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = buildPayload(values);

      const res = await fetch(`${baseUrl}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create event (${res.status})`);
      }

      const data = await res.json();
      return data as Event;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (
    id: string,
    values: EventFormValues,
  ): Promise<Event | null> => {
    if (!token) {
      setError("Not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = buildPayload(values);

      const res = await fetch(`${baseUrl}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to update event (${res.status})`);
      }

      const data = await res.json();
      return data as Event;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, updateEvent, loading, error };
}
