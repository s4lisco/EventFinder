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
      `„${event.title}" genehmigen? Die Veranstaltung wird danach öffentlich sichtbar.`,
    );
    if (!confirmed) return;

    const ok = await approveEvent(event.id);
    if (ok) {
      showToast("Veranstaltung genehmigt.");
      refetch();
    }
  };

  const handleReject = (event: Event) => {
    setRejectingEvent(event);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectingEvent) return;

    const ok = await rejectEvent(rejectingEvent.id, reason);
    if (ok) {
      showToast("Veranstaltung abgelehnt.");
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
        <title>Admin Dashboard | EventFinder</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-gradient-subtle">
        <header className="border-b border-slate-200/50 bg-white/80 px-4 py-4 shadow-soft backdrop-blur-xl lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-soft">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Pending Events</h1>
                <p className="text-sm text-slate-600">Review and moderate event submissions</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <a href="/admin/dashboard" className="btn-primary text-sm">Events</a>
              <a href="/admin/organizers" className="btn-ghost text-sm">Benutzer</a>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
            {/* Toasts */}
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
            {(eventsError || approvalError) && (
              <div className="mb-4 animate-slide-up rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 shadow-soft">
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-semibold text-red-900">{eventsError || approvalError}</p>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {loadingEvents ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-500 border-t-transparent"></div>
                    Loading pending events…
                  </div>
                ) : (
                  <div className="rounded-xl bg-gradient-to-r from-accent-50 to-accent-100 px-4 py-2 text-sm font-semibold text-accent-700 shadow-soft">
                    {events.length} Pending Event{events.length === 1 ? "" : "s"}
                  </div>
                )}
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {loadingEvents && !events.length && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent-200 border-t-accent-600"></div>
                    <p className="text-sm font-medium text-slate-600">Loading events…</p>
                  </div>
                </div>
              )}

              {!loadingEvents && events.length === 0 && (
                <div className="animate-slide-up rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center shadow-soft">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
                    <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-slate-900">All caught up!</p>
                  <p className="mt-1 text-sm text-slate-600">
                    No pending events to review at the moment
                  </p>
                </div>
              )}

              {events.map((event, index) => (
                <div 
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AdminEventCard
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
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Reject modal */}
        {rejectingEvent && (
          <ApprovalModal
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
