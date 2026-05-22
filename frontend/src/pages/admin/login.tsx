// frontend/src/pages/admin/login.tsx
// Redirects to the unified login page
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminLoginRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/login"); }, [router]);
  return null;
}
