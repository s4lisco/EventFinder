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
    <nav className="flex items-center justify-between border-b bg-white px-4 py-2 shadow-sm">
      <Link href="/" className="text-sm font-semibold text-slate-900">
        Regional Events
      </Link>

      <div className="flex items-center gap-3 text-xs">
        {isAuthenticated && role === "organizer" && (
          <Link
            href="/organizers/dashboard"
            className="text-slate-700 hover:text-slate-900"
          >
            Organizer dashboard
          </Link>
        )}
        {isAuthenticated && role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="text-slate-700 hover:text-slate-900"
          >
            Admin dashboard
          </Link>
        )}

        {!isAuthenticated && (
          <>
            <Link
              href="/organizers/login"
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-50"
            >
              Organizer login
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-50"
            >
              Admin login
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-50"
          >
            Logout{user?.email ? ` (${user.email})` : ""}
          </button>
        )}
      </div>
    </nav>
  );
}
