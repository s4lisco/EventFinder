// frontend/src/pages/organizers/dashboard.tsx
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OrganizerEventCard from "@/components/OrganizerEventCard";
import StatusBadge from "@/components/StatusBadge";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useOrganizerEvents } from "@/hooks/useOrganizerEvents";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { decodeJwt } from "@/utils/jwt";
import { Event } from "@/types/event";

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const { token, checked } = useRequireAuth();
  const [organizerId, setOrganizerId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const payload = decodeJwt(token);
      if (payload?.sub && payload.role === "organizer") {
        setOrganizerId(payload.sub);
      } else {
        // not an organizer, redirect to login or home
        router.replace("/organizers/login");
      }
    }
  }, [token, router]);

  const {
    events,
    loading: loadingEvents,
    error: eventsError,
    refetch,
  } = useOrganizerEvents(organizerId, token || undefined);

  const {
    deleteEvent,
    loading: deleting,
    error: deleteError,
  } = useDeleteEvent(token || undefined);

  const [toast, setToast] = useState<string | null>(null);

  const handleDelete = async (event: Event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    const ok = await deleteEvent(event.id);
    if (ok) {
      setToast("Event deleted successfully.");
      refetch();
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking authentication…
      </div>
    );
  }

  if (!token || !organizerId) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Organizer Dashboard | EventFinder</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-gradient-subtle">
        <header className="border-b border-slate-200/50 bg-white/80 px-4 py-4 shadow-soft backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-soft">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                Your Events
              </h1>
              <p className="text-sm text-slate-600">
                Manage and track your event submissions
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
            {/* Toast / messages */}
            {toast && (
              <div className="mb-4 animate-slide-up rounded-xl border-2 border-success-200 bg-success-50 px-4 py-3 shadow-soft">
                <div className="flex items-center gap-2 font-semibold text-success-800">
                  <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {toast}
                </div>
              </div>
            )}
            {eventsError && (
              <div className="mb-4 animate-slide-up rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 shadow-soft">
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-900">Failed to load events</p>
                    <p className="text-sm text-red-700">{eventsError}</p>
                  </div>
                </div>
              </div>
            )}
            {deleteError && (
              <div className="mb-4 animate-slide-up rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 shadow-soft">
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-900">Failed to delete event</p>
                    <p className="text-sm text-red-700">{deleteError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Header actions */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm">
                {loadingEvents ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
                    Loading your events…
                  </div>
                ) : (
                  <div className="rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 px-4 py-2 font-semibold text-primary-700 shadow-soft">
                    {events.length} Event{events.length === 1 ? "" : "s"}
                  </div>
                )}
              </div>
              <Link
                href="/organizers/events/create"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Event
              </Link>
            </div>

            {/* Events list */}
            <div className="space-y-4">
              {loadingEvents && !events.length && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                    <p className="text-sm font-medium text-slate-600">Loading events…</p>
                  </div>
                </div>
              )}

              {!loadingEvents && events.length === 0 && (
                <div className="animate-slide-up rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center shadow-soft">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
                    <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-slate-900">No events yet</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Start by creating your first event
                  </p>
                  <Link
                    href="/organizers/events/create"
                    className="btn-primary mt-4 inline-flex"
                  >
                    Create Your First Event
                  </Link>
                </div>
              )}

              {events.map((event, index) => (
                <div 
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <OrganizerEventCard
                    event={event}
                    disabled={deleting}
                    onEdit={() =>
                      router.push(`/organizers/events/${event.id}/edit`)
                    }
                    onDelete={() => handleDelete(event)}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
