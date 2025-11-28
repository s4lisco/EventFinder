// frontend/src/hooks/useRequireAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface UseRequireAuthResult {
  token: string | null;
  checked: boolean;
}

export function useRequireAuth(): UseRequireAuthResult {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem("token");
    if (!storedToken) {
      setToken(null);
      setChecked(true);
      router.replace("/organizers/login");
      return;
    }

    setToken(storedToken);
    setChecked(true);
  }, [router]);

  return { token, checked };
}
