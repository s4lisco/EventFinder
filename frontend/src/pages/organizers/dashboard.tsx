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
        <title>Organizer Dashboard | Regional Events</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Your events
          </h1>
          <p className="text-xs text-slate-500">
            Manage your submitted events, edit details, or create new ones.
          </p>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-4">
            {/* Toast / messages */}
            {toast && (
              <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {toast}
              </div>
            )}
            {eventsError && (
              <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                Failed to load events: {eventsError}
              </div>
            )}
            {deleteError && (
              <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                Failed to delete event: {deleteError}
              </div>
            )}

            {/* Header actions */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                {loadingEvents
                  ? "Loading your events…"
                  : `You have ${events.length} event${
                      events.length === 1 ? "" : "s"
                    }.`}
              </div>
              <Link
                href="/organizers/events/create"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                + Create new event
              </Link>
            </div>

            {/* Events list */}
            <div className="space-y-3">
              {loadingEvents && !events.length && (
                <p className="text-sm text-slate-500">Loading events…</p>
              )}

              {!loadingEvents && events.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                  You have not created any events yet.{" "}
                  <Link
                    href="/organizers/events/create"
                    className="font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Create your first event.
                  </Link>
                </div>
              )}

              {events.map((event) => (
                <OrganizerEventCard
                  key={event.id}
                  event={event}
                  disabled={deleting}
                  onEdit={() =>
                    router.push(`/organizers/events/${event.id}/edit`)
                  }
                  onDelete={() => handleDelete(event)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
