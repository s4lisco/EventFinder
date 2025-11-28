// frontend/src/pages/events/[id].tsx
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useMemo } from "react";
import EventImageGallery from "../../components/EventImageGallery";
import MapMiniView from "../../components/MapMiniView";
import { useEvent } from "../../hooks/useEvent";
import { formatEventDateRange } from "../../utils/date";

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { event, loading, error } = useEvent(
    typeof id === "string" ? id : undefined,
  );

  useEffect(() => {
    if (error) {
      console.error("Failed to load event:", error);
    }
  }, [error]);

  const isApproved = event?.status === "approved";

  const dateRange = useMemo(() => {
    if (!event) return "";
    return formatEventDateRange(event.startDate, event.endDate);
  }, [event]);

  const handleOpenInMaps = () => {
    if (!event?.latitude || !event?.longitude) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    if (!event) return;
    const shareUrl = window.location.href;
    const shareText = `${event.title} - ${event.locationName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // ignore cancel
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Event link copied to clipboard");
      } catch {
        alert("Failed to copy link");
      }
    } else {
      alert("Sharing is not supported on this device");
    }
  };

  const pageTitle = event ? `${event.title} | Regional Events` : "Event";

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
            {event?.title ?? "Event"}
          </h1>
        </header>

        <main className="flex-1 pb-24">
          {loading && (
            <div className="px-4 py-6 text-sm text-slate-500">
              Loading event…
            </div>
          )}

          {error && !loading && (
            <div className="px-4 py-6 text-sm text-red-500">
              Failed to load event. It may not exist or is unavailable.
            </div>
          )}

          {!loading && !error && event && !isApproved && (
            <div className="px-4 py-6 text-sm text-slate-500">
              This event is not available. It may be pending approval or
              rejected.
            </div>
          )}

          {!loading && !error && event && isApproved && (
            <div className="mx-auto max-w-3xl px-4 py-4">
              {/* Image gallery */}
              <section className="mb-4">
                <EventImageGallery
                  title={event.title}
                  images={event.images || []}
                />
              </section>

              {/* Main info */}
              <section className="mb-6 space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {event.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">{dateRange}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                    {event.category}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-slate-700">
                  <p className="font-medium text-slate-800">Location</p>
                  <p>{event.locationName}</p>
                  <p className="text-slate-500">{event.address}</p>
                </div>

                <div className="space-y-1 text-sm text-slate-700">
                  <p className="font-medium text-slate-800">Price</p>
                  <p>{event.priceInfo || "Free / check details"}</p>
                </div>

                <div className="space-y-1 text-sm text-slate-700">
                  <p className="font-medium text-slate-800">Organizer</p>
                  <p>{event.organizerName}</p>
                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      Visit website
                      <span className="ml-1">↗</span>
                    </a>
                  )}
                </div>
              </section>

              {/* Description */}
              <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  About this event
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {event.description}
                </p>
              </section>

              {/* Map */}
              <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Location on map
                </h3>
                <MapMiniView
                  latitude={event.latitude}
                  longitude={event.longitude}
                  title={event.title}
                  locationName={event.locationName}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Tap on the map to zoom in and explore nearby area.
                </p>
              </section>
            </div>
          )}
        </main>

        {/* Footer actions */}
        {event && isApproved && (
          <footer className="fixed bottom-0 left-0 right-0 border-t bg-white/95 px-4 py-3 shadow-[0_-4px_12px_rgba(15,23,42,0.08)]">
            <div className="mx-auto flex max-w-3xl gap-3">
              <button
                onClick={handleOpenInMaps}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                <span>Open in Maps</span>
              </button>
              <button
                onClick={handleShare}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <span>Share event</span>
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
