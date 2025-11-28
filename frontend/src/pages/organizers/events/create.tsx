// frontend/src/pages/organizers/events/create.tsx
import { useRouter } from "next/router";
import Head from "next/head";
import EventForm, { EventFormValues } from "@/components/EventForm";
import { useEventMutation } from "@/hooks/useEventMutation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function OrganizerCreateEventPage() {
  const router = useRouter();
  const { token, checked } = useRequireAuth();
  const { createEvent, loading, error } = useEventMutation(token || undefined);

  const handleSubmit = async (values: EventFormValues) => {
    const created = await createEvent(values);
    if (created) {
      // Redirect to organizer dashboard or event detail
      router.push("/organizers/dashboard");
    }
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking authentication…
      </div>
    );
  }

  if (!token) {
    // useRequireAuth already triggered redirect
    return null;
  }

  return (
    <>
      <Head>
        <title>Create Event | Organizer</title>
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
            Create a new event
          </h1>
          <p className="text-xs text-slate-500">
            Fill in the details to publish your event.
          </p>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <EventForm
              mode="create"
              initialValues={{
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                category: "",
                priceInfo: "",
                locationName: "",
                address: "",
                latitude: "",
                longitude: "",
                website: "",
                images: [""],
                organizerName: "",
              }}
              submitting={loading}
              error={error}
              onSubmit={handleSubmit}
            />
          </div>
        </main>
      </div>
    </>
  );
}
