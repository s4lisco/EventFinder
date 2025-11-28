// frontend/src/pages/admin/dashboard.tsx
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminEventCard from "@/components/AdminEventCard";
import ApprovalModal from "@/components/ApprovalModal";
import { usePendingEvents } from "@/hooks/usePendingEvents";
import { useEventApproval } from "@/hooks/useEventApproval";
import { decodeJwt } from "@/utils/jwt";
import { Event } from "@/types/event";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [rejectingEvent, setRejectingEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem("token");
    if (!storedToken) {
      setToken(null);
      setChecked(true);
      router.replace("/admin/login");
      return;
    }

    const payload = decodeJwt(storedToken);
    if (!payload || payload.role !== "admin") {
      setToken(null);
      setChecked(true);
      router.replace("/admin/login");
      return;
    }

    setToken(storedToken);
    setChecked(true);
  }, [router]);

  const {
    events,
    loading: loadingEvents,
    error: eventsError,
    refetch,
  } = usePendingEvents(token || undefined);

  const {
    approveEvent,
    rejectEvent,
    loadingId,
    loadingAction,
    error: approvalError,
  } = useEventApproval(token || undefined);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (event: Event) => {
    const confirmed = window.confirm(
      `Approve event "${event.title}"? It will become visible to users.`,
    );
    if (!confirmed) return;

    const ok = await approveEvent(event.id);
    if (ok) {
      showToast("Event approved.");
      refetch();
    }
  };

  const handleReject = (event: Event) => {
    setRejectingEvent(event);
  };

  const handleRejectConfirm = async (comment?: string) => {
    if (!rejectingEvent) return;

    const ok = await rejectEvent(rejectingEvent.id, comment);
    if (ok) {
      showToast("Event rejected.");
      setRejectingEvent(null);
      refetch();
    }
  };

  const handleRejectCancel = () => {
    setRejectingEvent(null);
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking admin access…
      </div>
    );
  }

  if (!token) {
    return null; // already redirected
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Regional Events</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Pending events
          </h1>
          <p className="text-xs text-slate-500">
            Review and approve or reject events submitted by organizers.
          </p>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-4">
            {/* Toasts */}
            {toast && (
              <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {toast}
              </div>
            )}
            {(eventsError || approvalError) && (
              <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                {eventsError || approvalError}
              </div>
            )}

            {/* Summary */}
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">
                {loadingEvents
                  ? "Loading pending events…"
                  : `${events.length} pending event${
                      events.length === 1 ? "" : "s"
                    }.`}
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {loadingEvents && !events.length && (
                <p className="text-sm text-slate-500">Loading events…</p>
              )}

              {!loadingEvents && events.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                  No pending events. New submissions will appear here for review.
                </div>
              )}

              {events.map((event) => (
                <AdminEventCard
                  key={event.id}
                  event={event}
                  onApprove={() => handleApprove(event)}
                  onReject={() => handleReject(event)}
                  isApproving={
                    loadingId === event.id && loadingAction === "approve"
                  }
                  isRejecting={
                    loadingId === event.id && loadingAction === "reject"
                  }
                />
              ))}
            </div>
          </div>
        </main>

        {/* Reject modal */}
        {rejectingEvent && (
          <ApprovalModal
            mode="reject"
            open={!!rejectingEvent}
            eventTitle={rejectingEvent.title}
            onCancel={handleRejectCancel}
            onConfirm={handleRejectConfirm}
            loading={loadingId === rejectingEvent.id && loadingAction === "reject"}
          />
        )}
      </div>
    </>
  );
}
