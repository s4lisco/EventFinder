// frontend/src/pages/organizers/verify.tsx
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Status = "loading" | "success" | "error";

export default function OrganizerVerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    if (!router.isReady) return;

    const token = router.query.token as string | undefined;
    if (!token) {
      setErrorMessage("Kein Verifizierungstoken gefunden.");
      setStatus("error");
      return;
    }

    fetch(`${baseUrl}/organizers/verify?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
        } else {
          const data = await res.json().catch(() => ({}));
          setErrorMessage(
            data?.message || "Der Verifizierungslink ist ungültig oder abgelaufen."
          );
          setStatus("error");
        }
      })
      .catch(() => {
        setErrorMessage("Verbindung zum Server fehlgeschlagen. Bitte versuchen Sie es erneut.");
        setStatus("error");
      });
  }, [router.isReady, router.query.token]);

  return (
    <>
      <Head>
        <title>E-Mail bestätigen | Regivo</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md animate-scale-in rounded-card bg-white p-8 shadow-soft-xl text-center">

          {status === "loading" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
              <h1 className="text-xl font-bold text-text">Verifizierung läuft…</h1>
              <p className="mt-2 text-sm text-text-muted">Bitte warten Sie einen Moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gradient mb-3">
                E-Mail bestätigt!
              </h1>
              <p className="text-text-muted mb-6">
                Ihre E-Mail-Adresse wurde erfolgreich verifiziert. Sie können sich jetzt anmelden.
              </p>
              <a href="/organizers/login" className="btn-primary inline-block">
                Zur Anmeldung
              </a>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text mb-3">
                Verifizierung fehlgeschlagen
              </h1>
              <p className="text-text-muted mb-6">{errorMessage}</p>
              <a href="/organizers/signup" className="text-primary hover:underline text-sm">
                Erneut registrieren
              </a>
            </>
          )}

        </div>
      </div>
    </>
  );
}
