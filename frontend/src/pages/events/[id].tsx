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
      <div className="flex min-h-screen flex-col bg-gradient-subtle">
        <header className="border-b border-slate-200/50 bg-white/80 px-4 py-4 shadow-soft backdrop-blur-xl">
          <button
            onClick={() => router.back()}
            className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-primary-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold text-slate-900">
            {event?.title ?? "Event Details"}
          </h1>
        </header>

        <main className="flex-1 pb-24">
          {loading && (
            <div className="flex items-center justify-center px-4 py-12">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-sm font-medium text-slate-600">Loading event details…</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="mx-auto max-w-md px-4 py-12">
              <div className="animate-slide-up rounded-2xl border-2 border-red-200 bg-red-50 px-6 py-8 text-center shadow-soft">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-red-900">Failed to load event</p>
                <p className="mt-1 text-sm text-red-700">
                  The event may not exist or is currently unavailable.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && event && !isApproved && (
            <div className="mx-auto max-w-md px-4 py-12">
              <div className="animate-slide-up rounded-2xl border-2 border-slate-200 bg-slate-50 px-6 py-8 text-center shadow-soft">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <svg className="h-7 w-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="font-semibold text-slate-900">Event Not Available</p>
                <p className="mt-1 text-sm text-slate-600">
                  This event is pending approval or has been removed.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && event && isApproved && (
            <div className="mx-auto max-w-4xl px-4 py-6 animate-fade-in">
              {/* Image gallery */}
              <section className="mb-6">
                <EventImageGallery
                  title={event.title}
                  images={event.images || []}
                />
              </section>

              {/* Main info */}
              <section className="mb-6 space-y-4 card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">
                      {event.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{dateRange}</span>
                    </div>
                  </div>
                  <span className="badge-primary text-sm uppercase tracking-wider">
                    {event.category}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary-900">
                      <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </div>
                    <p className="font-medium text-slate-900">{event.locationName}</p>
                    <p className="text-sm text-slate-600">{event.address}</p>
                  </div>

                  <div className="space-y-2 rounded-xl bg-gradient-to-br from-success-50 to-success-100/50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-success-900">
                      <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Price
                    </div>
                    <p className="font-semibold text-slate-900">{event.priceInfo || "Free entry"}</p>
                  </div>
                </div>

                <div className="space-y-2 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-accent-900">
                    <svg className="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Organizer
                  </div>
                  <p className="font-medium text-slate-900">{event.organizerName}</p>
                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 transition-colors duration-200 hover:text-accent-700"
                    >
                      Visit website
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </section>

              {/* Description */}
              <section className="mb-6 card p-6">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About This Event
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {event.description}
                </p>
              </section>

              {/* Map */}
              <section className="card p-6">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Location on Map
                </h3>
                <MapMiniView
                  latitude={event.latitude}
                  longitude={event.longitude}
                  title={event.title}
                  locationName={event.locationName}
                />
                <p className="mt-3 text-xs text-slate-500">
                  Tap on the map to zoom in and explore the nearby area
                </p>
              </section>
            </div>
          )}
        </main>

        {/* Footer actions */}
        {event && isApproved && (
          <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200/50 bg-white/95 px-4 py-4 shadow-soft-xl backdrop-blur-xl">
            <div className="mx-auto flex max-w-4xl gap-3">
              <button
                onClick={handleOpenInMaps}
                className="btn-primary flex flex-1 items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Open in Maps</span>
              </button>
              <button
                onClick={handleShare}
                className="btn-secondary flex flex-1 items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
