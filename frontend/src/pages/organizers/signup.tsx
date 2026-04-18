// frontend/src/pages/organizers/signup.tsx
import Head from "next/head";
import { FormEvent, useState } from "react";

export default function OrganizerSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/organizers/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.message || `Registrierung fehlgeschlagen (${res.status})`;
        throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Head>
          <title>Registrierung erfolgreich | Regivo</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <div className="w-full max-w-md animate-scale-in rounded-card bg-white p-8 shadow-soft-xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gradient mb-3">
              Fast geschafft!
            </h1>
            <p className="text-text-muted mb-2">
              Wir haben Ihnen eine E-Mail an <strong className="text-text">{email}</strong> gesendet.
            </p>
            <p className="text-text-muted">
              Klicken Sie auf den Link in der E-Mail, um Ihr Konto zu bestätigen und sich anschließend anzumelden.
            </p>
            <p className="mt-6 text-sm text-text-muted">
              Keine E-Mail erhalten? Prüfen Sie Ihren Spam-Ordner.
            </p>
            <a
              href="/organizers/login"
              className="mt-6 inline-block text-sm text-primary hover:underline"
            >
              Zur Anmeldung
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Veranstalter-Registrierung | Regivo</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md animate-scale-in rounded-card bg-white p-8 shadow-soft-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-button bg-gradient-primary shadow-soft">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gradient">
              Als Veranstalter registrieren
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Erstellen Sie ein Konto, um Ihre Veranstaltungen zu bewerben
            </p>
          </div>

          {error && (
            <div className="mb-4 animate-slide-up rounded-card border-2 border-red-500/20 bg-red-500/10 px-4 py-3 shadow-soft">
              <div className="flex items-start gap-2">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-text">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Name / Organisation
              </label>
              <input
                type="text"
                autoComplete="organization"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Mein Verein e.V."
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-text">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                E-Mail
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="ihre@email.de"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-text">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Passwort
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Mindestens 8 Zeichen"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-6 w-full"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Wird registriert…
                </span>
              ) : (
                "Konto erstellen"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Bereits ein Konto?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Anmelden
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
