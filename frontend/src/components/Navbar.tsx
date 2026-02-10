// frontend/src/components/Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, role, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/50 bg-white/80 px-4 py-3 shadow-soft backdrop-blur-xl lg:px-6">
      <Link href="/" className="group flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-soft transition-all duration-200 group-hover:shadow-glow">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="hidden text-lg font-bold text-gradient sm:inline">
          EventFinder
        </span>
      </Link>

      <div className="flex items-center gap-2 text-sm">
        {isAuthenticated && role === "organizer" && (
          <Link
            href="/organizers/dashboard"
            className="hidden rounded-lg px-3 py-1.5 font-medium text-slate-700 transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 md:inline-flex"
          >
            Dashboard
          </Link>
        )}
        {isAuthenticated && role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="hidden rounded-lg px-3 py-1.5 font-medium text-slate-700 transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 md:inline-flex"
          >
            Admin
          </Link>
        )}

        {!isAuthenticated && (
          <>
            <Link
              href="/organizers/login"
              className="rounded-lg border-2 border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 sm:text-sm"
            >
              Organizer
            </Link>
            <Link
              href="/admin/login"
              className="rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition-all duration-200 hover:shadow-glow active:scale-95 sm:text-sm"
            >
              Admin
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="rounded-lg border-2 border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 sm:text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
