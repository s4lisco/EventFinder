// frontend/src/hooks/useAuthGuard.ts
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/components/AuthProvider";

interface UseAuthGuardOptions {
  requiredRole?: string | string[];
  redirectTo: string;
}

/**
 * Hook for guarding client-side routes based on authentication & role.
 *
 * Example:
 * const { isAllowed, loading } = useAuthGuard({
 *   requiredRole: 'organizer',
 *   redirectTo: '/organizers/login',
 * });
 */
export function useAuthGuard(options: UseAuthGuardOptions) {
  const { requiredRole, redirectTo } = options;
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];
      if (!role || !roles.includes(role)) {
        router.replace(redirectTo);
      }
    }
  }, [loading, isAuthenticated, role, requiredRole, redirectTo, router]);

  const isAllowed =
    !loading &&
    isAuthenticated &&
    (!requiredRole ||
      (Array.isArray(requiredRole)
        ? requiredRole.includes(role || "")
        : role === requiredRole));

  return { isAllowed, loading };
}
