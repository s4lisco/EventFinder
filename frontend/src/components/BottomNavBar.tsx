// frontend/src/components/BottomNavBar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./AuthProvider";

export default function BottomNavBar() {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();

  const isActive = (path: string) => router.pathname === path || router.pathname.startsWith(path + "/");

  const navItems = [
    {
      href: "/",
      label: "Discover",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    ...(isAuthenticated && role === "organizer"
      ? [
          {
            href: "/organizers/dashboard",
            label: "Dashboard",
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            ),
          },
          {
            href: "/organizers/events/create",
            label: "Create",
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            ),
            isPrimary: true,
          },
        ]
      : [
          {
            href: "/organizers/login",
            label: "Organizers",
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ),
          },
        ]),
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 lg:hidden">
      <div className="flex items-center gap-1 rounded-pill bg-dark/95 px-2 py-2 shadow-soft-xl backdrop-blur-xl">
        {navItems.map((item) => {
          const active = isActive(item.href);
          if ("isPrimary" in item && item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-purple transition-all duration-200 hover:bg-primary-600 active:scale-95 mx-1"
                title={item.label}
              >
                {item.icon}
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-pill px-4 py-2 text-[10px] font-semibold transition-all duration-200 ${
                active
                  ? "bg-white text-dark"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span className={active ? "text-dark" : "text-white/70"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
