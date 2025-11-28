// frontend/src/pages/organizers/events/[id]/edit.tsx
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import EventForm, { EventFormValues } from "@/components/EventForm";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useEventMutation } from "@/hooks/useEventMutation";
import { useEvent } from "@/hooks/useEvent";
import { isoToLocalInput } from "@/utils/datetime";

export default function OrganizerEditEventPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token, checked } = useRequireAuth();
  const { updateEvent, loading, error } = useEventMutation(token || undefined);
  const { event, loading: loadingEvent, error: eventError } = useEvent(
    typeof id === "string" ? id : undefined,
  );
  const [initialValues, setInitialValues] = useState<EventFormValues | null>(
    null,
  );

  useEffect(() => {
    if (event) {
      setInitialValues({
        title: event.title,
        description: event.description,
        startDate: isoToLocalInput(event.startDate),
        endDate: event.endDate ? isoToLocalInput(event.endDate) : "",
        category: event.category,
        priceInfo: event.priceInfo || "",
        locationName: event.locationName,
        address: event.address,
        latitude: String(event.latitude ?? ""),
        longitude: String(event.longitude ?? ""),
        website: event.website || "",
        images: event.images && event.images.length ? event.images : [""],
        organizerName: event.organizerName || "",
      });
    }
  }, [event]);

  const handleSubmit = async (values: EventFormValues) => {
    if (!id || typeof id !== "string") return;
    const updated = await updateEvent(id, values);
    if (updated) {
      router.push("/organizers/dashboard");
    }
  };

  const pageTitle = useMemo(
    () =>
      event ? `Edit ${event.title} | Organizer` : "Edit Event | Organizer",
    [event],
  );

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking authentication…
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() => router.back()}
            className="mb-1 text-xs text-slate-500 hover:text-slate-700"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
            Edit your event
          </h1>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 py-4">
            {loadingEvent && (
              <p className="text-sm text-slate-500">Loading event…</p>
            )}
            {eventError && (
              <p className="text-sm text-red-500">
                Failed to load event: {eventError}
              </p>
            )}
            {initialValues && (
              <EventForm
                mode="edit"
                initialValues={initialValues}
                submitting={loading}
                error={error}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
