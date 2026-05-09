import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { client } from "../lib/api/client";
import { getApiError } from "../lib/api/errors";
import { refreshClient } from "../lib/api/refreshClient";
import type { AuthUser, SuccessResponse } from "../lib/types";
import { tokenStore } from "./tokenStore";

type AuthContextValue = {
  user: AuthUser | null;
  bootstrapped: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  async function fetchProfile() {
    const response = await client.get<SuccessResponse<AuthUser>>("/users/me");
    setUser(response.data.data);
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const refresh = await refreshClient.post<SuccessResponse<{ accessToken: string }>>(
          "/auth/refresh",
        );
        if (cancelled) {
          return;
        }

        tokenStore.set(refresh.data.data.accessToken);
        await fetchProfile();
      } catch {
        tokenStore.clear();
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setBootstrapped(true);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      bootstrapped,
      isAuthenticated: Boolean(user && tokenStore.get()),
      async login(email, password) {
        const response = await client.post<
          SuccessResponse<{ user: AuthUser; accessToken: string }>
        >("/auth/login", {
          email,
          password,
        });

        tokenStore.set(response.data.data.accessToken);
        setUser(response.data.data.user);
        return response.data.data.user;
      },
      async logout() {
        try {
          await client.post("/auth/logout");
        } finally {
          tokenStore.clear();
          setUser(null);
        }
      },
      async refreshProfile() {
        try {
          await fetchProfile();
        } catch (error) {
          const apiError = getApiError(error);
          if (apiError.code === "UNAUTHORIZED") {
            tokenStore.clear();
            setUser(null);
          }
          throw error;
        }
      },
    }),
    [bootstrapped, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
