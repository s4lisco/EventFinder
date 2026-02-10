// frontend/src/pages/organizers/events/create.tsx
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import EventForm, { EventFormValues } from "@/components/EventForm";
import FlyerUpload from "@/components/FlyerUpload";
import { useEventMutation } from "@/hooks/useEventMutation";
import { useEventImages } from "@/hooks/useEventImages";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const defaultFormValues: EventFormValues = {
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
};

export default function OrganizerCreateEventPage() {
  const router = useRouter();
  const { token, checked } = useRequireAuth();
  const { createEvent, loading, error } = useEventMutation(token || undefined);
  const { uploadImages, uploading } = useEventImages(token || undefined);
  const [formValues, setFormValues] = useState<EventFormValues>(defaultFormValues);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const handleSubmit = async (values: EventFormValues) => {
    const created = await createEvent(values);
    if (created) {
      // If there are files to upload, upload them first
      if (selectedFiles.length > 0) {
        setCreatedEventId(created.id);
        const uploaded = await uploadImages(created.id, selectedFiles);
        if (uploaded) {
          // Success - redirect after upload
          router.push("/organizers/dashboard");
        }
      } else {
        // No files to upload, redirect immediately
        router.push("/organizers/dashboard");
      }
    }
  };

  const handleExtractedData = useCallback((data: Partial<EventFormValues>) => {
    setFormValues((prev) => ({
      ...prev,
      ...data,
      // Preserve images array if not provided in extracted data
      images: data.images || prev.images,
    }));
  }, []);

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

  const isSubmitting = loading || uploading;

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
          <div className="mx-auto max-w-2xl px-4 py-4 space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <FlyerUpload onExtractedData={handleExtractedData} />
            </div>
            <EventForm
              mode="create"
              initialValues={formValues}
              submitting={isSubmitting}
              error={error}
              onSubmit={handleSubmit}
              selectedFiles={selectedFiles}
              onFilesChange={setSelectedFiles}
              showImageUpload={true}
            />
          </div>
        </main>
      </div>
    </>
  );
}
