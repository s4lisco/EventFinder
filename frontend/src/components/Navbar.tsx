// frontend/src/components/Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white/95 px-4 py-3 shadow-soft backdrop-blur-xl lg:px-8">
      <Link href="/" className="group flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-button bg-primary shadow-purple transition-all duration-200 group-hover:bg-primary-600">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="hidden sm:block">
          <span className="text-lg font-bold text-text tracking-tight">
            The Urban <span className="text-gradient">Pulse</span>
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2 text-sm">
        {isAuthenticated && role === "organizer" && (
          <>
            <Link
              href="/organizers/dashboard"
              className="hidden rounded-button px-4 py-2 font-semibold text-text-muted transition-all duration-200 hover:bg-surface hover:text-primary md:inline-flex"
            >
              Dashboard
            </Link>
            <Link
              href="/organizers/events/create"
              className="btn-primary hidden text-xs md:inline-flex"
            >
              + Create Event
            </Link>
          </>
        )}
        {isAuthenticated && role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="hidden rounded-button px-4 py-2 font-semibold text-text-muted transition-all duration-200 hover:bg-surface hover:text-primary md:inline-flex"
          >
            Admin Panel
          </Link>
        )}

        {!isAuthenticated && (
          <>
            <Link
              href="/organizers/login"
              className="btn-outline hidden text-xs sm:inline-flex"
            >
              Organizer Login
            </Link>
            <Link
              href="/organizers/events/create"
              className="btn-primary text-xs"
            >
              Create Event
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="rounded-button border-2 border-border px-4 py-2 text-xs font-semibold text-text transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 sm:text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
