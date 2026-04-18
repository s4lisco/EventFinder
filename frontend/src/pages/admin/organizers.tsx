// frontend/src/pages/admin/organizers.tsx
import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { decodeJwt } from "@/utils/jwt";

interface OrganizerEvent {
  id: string;
  title: string;
  status: string;
  startDate: string;
}

interface Organizer {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  eventCount?: number;
  events?: OrganizerEvent[];
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:  { label: "Ausstehend", cls: "badge-warning" },
  approved: { label: "Genehmigt",  cls: "badge-success" },
  rejected: { label: "Abgelehnt",  cls: "bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-xs font-semibold" },
  archived: { label: "Archiviert", cls: "bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2 py-0.5 text-xs font-semibold" },
};

export default function AdminOrganizersPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  // List state
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Detail/edit modal
  const [selected, setSelected] = useState<Organizer | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editRole, setEditRole] = useState("organizer");
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  // Auth check
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = window.localStorage.getItem("token");
    if (!storedToken) { router.replace("/admin/login"); return; }
    const payload = decodeJwt(storedToken);
    if (!payload || payload.role !== "admin") { router.replace("/admin/login"); return; }
    setToken(storedToken);
    setChecked(true);
  }, [router]);

  // Fetch list
  const fetchOrganizers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`${baseUrl}/admin/organizers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Fehler ${res.status}`);
      const data = await res.json();
      setOrganizers(data.data);
      setMeta(data.meta);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, baseUrl]);

  useEffect(() => { if (checked) fetchOrganizers(); }, [checked, fetchOrganizers]);

  // Open detail modal
  const openDetail = async (org: Organizer) => {
    setModalError(null);
    setSelected(org);
    setEditName(org.name);
    setEditEmail(org.email);
    setEditActive(org.isActive);
    setEditRole((org as any).role ?? "organizer");
    setDetailLoading(true);
    try {
      const res = await fetch(`${baseUrl}/admin/organizers/${org.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Fehler ${res.status}`);
      const full: Organizer = await res.json();
      setSelected(full);
      setEditName(full.name);
      setEditEmail(full.email);
      setEditActive(full.isActive);
      setEditRole((full as any).role ?? "organizer");
    } catch (e: any) {
      setModalError(e.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => { setSelected(null); setModalError(null); };

  // Save changes
  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setModalError(null);
    try {
      const res = await fetch(`${baseUrl}/admin/organizers/${selected.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail, isActive: editActive, role: editRole }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.message || `Fehler ${res.status}`);
      }
      showToast("Organizer aktualisiert.");
      closeModal();
      fetchOrganizers();
    } catch (e: any) {
      setModalError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Deactivate (soft delete)
  const handleDeactivate = async () => {
    if (!selected) return;
    const confirmed = window.confirm(
      `"${selected.name}" deaktivieren?\n\nAlle Events dieses Organizers werden ebenfalls archiviert und sind nicht mehr öffentlich sichtbar.`
    );
    if (!confirmed) return;
    setDeactivating(true);
    setModalError(null);
    try {
      const res = await fetch(`${baseUrl}/admin/organizers/${selected.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.message || `Fehler ${res.status}`);
      }
      showToast(`${selected.name} wurde deaktiviert.`);
      closeModal();
      fetchOrganizers();
    } catch (e: any) {
      setModalError(e.message);
    } finally {
      setDeactivating(false);
    }
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking admin access…
      </div>
    );
  }

  if (!token) return null;

  return (
    <>
      <Head><title>Benutzerverwaltung | Admin</title></Head>
      <div className="flex min-h-screen flex-col bg-gradient-subtle">
        {/* Header / Nav */}
        <header className="border-b border-slate-200/50 bg-white/80 px-4 py-4 shadow-soft backdrop-blur-xl lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-soft">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Benutzerverwaltung</h1>
                <p className="text-sm text-slate-600">Organizer verwalten und moderieren</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <a href="/admin/dashboard" className="btn-ghost text-sm">Events</a>
              <a href="/admin/organizers" className="btn-primary text-sm">Benutzer</a>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
            {/* Toast */}
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
            {error && (
              <div className="mb-4 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 shadow-soft">
                <p className="text-sm font-semibold text-red-900">{error}</p>
              </div>
            )}

            {/* Search + count */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Name oder E-Mail suchen…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="input pl-9"
                />
              </div>
              <div className="rounded-xl bg-gradient-to-r from-accent-50 to-accent-100 px-4 py-2 text-sm font-semibold text-accent-700 shadow-soft">
                {meta.total} Organizer
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-200 border-t-accent-600"></div>
                </div>
              ) : organizers.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-slate-500">Keine Organizer gefunden.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">E-Mail</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Verifiziert</th>
                      <th className="px-4 py-3">Events</th>
                      <th className="px-4 py-3">Registriert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {organizers.map((org) => (
                      <tr
                        key={org.id}
                        onClick={() => openDetail(org)}
                        className="cursor-pointer transition-colors hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 font-medium text-text">{org.name}</td>
                        <td className="px-4 py-3 text-slate-600">{org.email}</td>
                        <td className="px-4 py-3">
                          {org.isActive ? (
                            <span className="badge-success">Aktiv</span>
                          ) : (
                            <span className="bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-xs font-semibold">Inaktiv</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {org.emailVerified ? (
                            <span className="text-success-600">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{(org as any).eventCount ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(org.createdAt).toLocaleDateString("de-DE")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-ghost text-xs disabled:opacity-40"
                >
                  ← Zurück
                </button>
                <span className="text-sm text-slate-600">
                  Seite {meta.page} von {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="btn-ghost text-xs disabled:opacity-40"
                >
                  Weiter →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail / Edit Modal */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-card bg-white p-6 shadow-soft-xl animate-modal max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-text">{selected.name}</h2>
                <p className="text-xs text-slate-500">{selected.email}</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {modalError && (
              <div className="mb-3 rounded-xl border-2 border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {modalError}
              </div>
            )}

            {detailLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-200 border-t-accent-600"></div>
              </div>
            ) : (
              <>
                {/* Edit fields */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">E-Mail</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-text">Konto aktiv</p>
                      <p className="text-xs text-slate-500">Inaktive Organizer können sich nicht einloggen</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditActive((v) => !v)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editActive ? "bg-primary" : "bg-slate-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${editActive ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Rolle</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="input text-sm"
                    >
                      <option value="organizer">Veranstalter</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-xs font-semibold text-slate-600">E-Mail verifiziert:</span>
                    {selected.emailVerified ? (
                      <span className="badge-success">Ja</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-xs font-semibold">Nein</span>
                    )}
                    <span className="ml-auto text-xs text-slate-400">
                      Registriert: {new Date(selected.createdAt).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                </div>

                {/* Events list */}
                {selected.events && selected.events.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Events ({selected.events.length})
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {selected.events.map((ev) => {
                        const s = STATUS_LABELS[ev.status] ?? { label: ev.status, cls: "badge-warning" };
                        return (
                          <div key={ev.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                            <span className="text-xs font-medium text-text truncate mr-2">{ev.title}</span>
                            <span className={s.cls}>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selected.events && selected.events.length === 0 && (
                  <p className="mb-4 text-xs text-slate-400">Keine Events vorhanden.</p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {selected.isActive && (
                    <button
                      type="button"
                      onClick={handleDeactivate}
                      disabled={deactivating || saving}
                      className="inline-flex items-center gap-1.5 rounded-button border-2 border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-700 shadow-soft transition-all hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {deactivating ? (
                        <><div className="h-3 w-3 animate-spin rounded-full border-2 border-red-700 border-t-transparent"></div> Wird deaktiviert…</>
                      ) : (
                        <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> Deaktivieren</>
                      )}
                    </button>
                  )}
                  <div className="ml-auto flex gap-2">
                    <button type="button" onClick={closeModal} disabled={saving || deactivating} className="btn-secondary text-xs">
                      Abbrechen
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving || deactivating} className="btn-primary text-xs">
                      {saving ? (
                        <span className="flex items-center gap-1.5">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Speichern…
                        </span>
                      ) : "Speichern"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
