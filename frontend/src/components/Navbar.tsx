// frontend/src/components/Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./AuthProvider";
import { useTranslations } from "@/utils/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, role, user, logout } = useAuth();
  const t = useTranslations();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white/95 px-4 py-3 shadow-soft backdrop-blur-xl lg:px-6">
      <Link href="/" className="group flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-button bg-gradient-primary shadow-soft transition-all duration-150 group-hover:opacity-90">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="hidden text-lg font-bold text-gradient sm:inline">
          Regivo
        </span>
      </Link>

      <div className="flex items-center gap-2 text-sm">
        <LanguageSwitcher />
        {isAuthenticated && role === "organizer" && (
          <Link
            href="/organizers/dashboard"
            className="hidden rounded-button px-4 py-2 font-medium text-text transition-all duration-150 hover:bg-surface md:inline-flex"
          >
            {t('nav.overview')}
          </Link>
        )}
        {isAuthenticated && role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="hidden rounded-button px-4 py-2 font-medium text-text transition-all duration-150 hover:bg-surface md:inline-flex"
          >
            {t('nav.management')}
          </Link>
        )}

        {!isAuthenticated && (
          <>
            <Link
              href="/organizers/login"
              className="rounded-button border-2 border-border px-4 py-2 text-xs font-semibold text-text transition-all duration-150 hover:bg-surface sm:text-sm"
            >
              {t('nav.organizer')}
            </Link>
            <Link
              href="/admin/login"
              className="rounded-button bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-soft transition-all duration-150 hover:opacity-90 sm:text-sm"
            >
              {t('nav.management')}
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="rounded-button border-2 border-border px-4 py-2 text-xs font-semibold text-text transition-all duration-150 hover:border-red-500/30 hover:bg-red-50 hover:text-red-700 sm:text-sm"
          >
            {t('nav.logout')}
          </button>
        )}
      </div>
    </nav>
  );
}
