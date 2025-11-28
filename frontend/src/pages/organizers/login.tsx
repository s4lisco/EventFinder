// frontend/src/pages/organizers/login.tsx
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/components/AuthProvider";

export default function OrganizerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/organizers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Login failed (${res.status})`);
      }

      const data = await res.json();
      const accessToken = data.accessToken || data.token;

      if (!accessToken) {
        throw new Error("No access token returned from server.");
      }

      login(accessToken);
      router.push("/organizers/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Organizer Login | Regional Events</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-md">
          <h1 className="text-lg font-semibold text-slate-900">
            Organizer Login
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to manage your events.
          </p>

          {error && (
            <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
