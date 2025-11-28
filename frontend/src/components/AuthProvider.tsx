// frontend/src/components/AuthProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { decodeJwt, JwtPayload } from "@/utils/jwt";

interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  rawPayload: JwtPayload;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = "token";

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      const payload = decodeJwt(storedToken);
      if (payload && payload.sub) {
        setToken(storedToken);
        setUser({
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          rawPayload: payload,
        });
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, newToken);
    }
    const payload = decodeJwt(newToken);
    if (payload && payload.sub) {
      setToken(newToken);
      setUser({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        rawPayload: payload,
      });
    } else {
      // invalid token
      setToken(null);
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }
    setToken(null);
    setUser(null);
    // optional redirect
    router.push("/");
  }, [router]);

  const value: AuthContextValue = {
    token,
    user,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
