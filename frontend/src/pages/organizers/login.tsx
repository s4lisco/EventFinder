// frontend/src/pages/organizers/login.tsx
// Redirects to the unified login page
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function OrganizerLoginRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/login"); }, [router]);
  return null;
}
