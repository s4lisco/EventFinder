// frontend/src/pages/organizers/dashboard.tsx
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OrganizerEventCard from "@/components/OrganizerEventCard";
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
      <div className="flex min-h-screen items-center justify-center bg-surface font-body text-sm text-text-muted">
        Checking authentication…
      </div>
    );
  }

  if (!token || !organizerId) {
    return null;
  }

  const approved = events.filter((e) => e.status === "approved").length;
  const pending = events.filter((e) => e.status === "pending").length;
  const rejected = events.filter((e) => e.status === "rejected").length;

  return (
    <>
      <Head>
        <title>Organizer Dashboard | The Urban Pulse</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-surface">
        {/* Dashboard header */}
        <header className="border-b border-border bg-white px-4 py-5 shadow-soft lg:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div>
              <h1 className="font-sans text-xl font-bold text-text">
                Your <span className="text-gradient">Events</span>
              </h1>
              <p className="font-body text-sm text-text-muted">
                Manage and track your event submissions
              </p>
            </div>
            <Link
              href="/organizers/events/create"
              className="btn-primary hidden items-center gap-2 sm:inline-flex"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Event
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-24">
          <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
            {/* Stats grid */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-card border border-border bg-white p-4 shadow-soft">
                <p className="font-body text-xs font-medium text-text-muted">Total</p>
                <p className="font-sans text-2xl font-bold text-text">{events.length}</p>
              </div>
              <div className="rounded-card border border-border bg-white p-4 shadow-soft">
                <p className="font-body text-xs font-medium text-success-700">Approved</p>
                <p className="font-sans text-2xl font-bold text-success-700">{approved}</p>
              </div>
              <div className="rounded-card border border-border bg-white p-4 shadow-soft">
                <p className="font-body text-xs font-medium text-warning-700">Pending</p>
                <p className="font-sans text-2xl font-bold text-warning-700">{pending}</p>
              </div>
            </div>

            {/* Toast / messages */}
            {toast && (
              <div className="mb-4 animate-slide-up rounded-card border-2 border-success-500/30 bg-success-50 px-4 py-3 shadow-soft">
                <div className="flex items-center gap-2 font-body font-semibold text-success-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {toast}
                </div>
              </div>
            )}
            {eventsError && (
              <div className="mb-4 animate-slide-up rounded-card border-2 border-red-300 bg-red-50 px-4 py-3 shadow-soft">
                <p className="font-body font-semibold text-red-700">Failed to load events</p>
                <p className="font-body text-sm text-red-600">{eventsError}</p>
              </div>
            )}
            {deleteError && (
              <div className="mb-4 animate-slide-up rounded-card border-2 border-red-300 bg-red-50 px-4 py-3 shadow-soft">
                <p className="font-body font-semibold text-red-700">Failed to delete event</p>
                <p className="font-body text-sm text-red-600">{deleteError}</p>
              </div>
            )}

            {/* Mobile create button */}
            <div className="mb-4 sm:hidden">
              <Link
                href="/organizers/events/create"
                className="btn-primary flex w-full items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary"></div>
                    <p className="font-body text-sm font-medium text-text-muted">Loading events…</p>
                  </div>
                </div>
              )}

              {!loadingEvents && events.length === 0 && (
                <div className="animate-slide-up rounded-card border-2 border-dashed border-border bg-white px-6 py-12 text-center shadow-soft">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="font-sans text-lg font-bold text-text">No events yet</p>
                  <p className="mt-1 font-body text-sm text-text-muted">
                    Start by creating your first event to connect with your community
                  </p>
                  <Link
                    href="/organizers/events/create"
                    className="btn-primary mt-6 inline-flex"
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
