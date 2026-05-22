import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-paper/95 px-4 py-3 shadow-soft backdrop-blur-xl lg:px-6">
      <Link href="/" className="group flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-button bg-primary text-white shadow-soft transition-all duration-150 group-hover:bg-primary-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="hidden font-display text-xl font-bold tracking-tight text-text sm:inline">
          Regivo
        </span>
      </Link>

      <div className="flex items-center gap-2 text-sm">
        {isAuthenticated && role === "organizer" && (
          <Link
            href="/organizers/dashboard"
            className="hidden rounded-button px-4 py-2 font-semibold text-text transition-all duration-150 hover:bg-surface md:inline-flex"
          >
            Übersicht
          </Link>
        )}
        {isAuthenticated && role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="hidden rounded-button px-4 py-2 font-semibold text-text transition-all duration-150 hover:bg-surface md:inline-flex"
          >
            Verwaltung
          </Link>
        )}

        {!isAuthenticated && (
          <>
            <Link href="/organizers/login" className="btn-secondary !px-4 !py-2 !text-xs sm:!text-sm">
              Veranstalter
            </Link>
            <Link href="/admin/login" className="btn-primary !px-4 !py-2 !text-xs sm:!text-sm">
              Verwaltung
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button onClick={logout} className="btn-secondary !px-4 !py-2 !text-xs sm:!text-sm">
            Abmelden
          </button>
        )}
      </div>
    </nav>
  );
}
