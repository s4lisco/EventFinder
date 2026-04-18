// frontend/src/pages/login.tsx
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/components/AuthProvider";
import { decodeJwt } from "@/utils/jwt";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Bitte gib E-Mail und Passwort ein.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg: string = data?.message || `Anmeldung fehlgeschlagen (${res.status})`;
        if (msg === "EMAIL_NOT_VERIFIED") {
          throw new Error("Bitte bestätige zuerst deine E-Mail-Adresse. Schau in deinem Postfach nach der Bestätigungs-E-Mail.");
        }
        if (msg === "ACCOUNT_DEACTIVATED") {
          throw new Error("Dieses Konto wurde deaktiviert. Bitte kontaktiere den Support.");
        }
        throw new Error(msg);
      }

      const data = await res.json();
      const accessToken = data.accessToken;
      if (!accessToken) throw new Error("Kein Zugriffstoken vom Server erhalten.");

      login(accessToken);

      const payload = decodeJwt(accessToken);
      if (payload?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/organizers/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Anmeldung fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Anmelden | Regivo</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md animate-scale-in rounded-card bg-white p-8 shadow-soft-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-button bg-gradient-primary shadow-soft">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gradient">Anmelden</h1>
            <p className="mt-2 text-sm text-text-muted">
              Als Veranstalter oder Administrator anmelden
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
                placeholder="deine@email.de"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
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
                  Wird angemeldet…
                </span>
              ) : (
                "Anmelden"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Noch kein Konto?{" "}
            <a href="/organizers/signup" className="text-primary hover:underline font-medium">
              Als Veranstalter registrieren
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
