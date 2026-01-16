import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { AuthResponse } from "../services/auth";
import { User } from "../types";

interface AuthContextProps {
  user?: User;
  token?: string;
  isAuthenticated: boolean;
  setSession: (payload: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const TOKEN_KEY = "dtrtis_token";
const USER_KEY = "dtrtis_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(() => {
    return localStorage.getItem(TOKEN_KEY) || undefined;
  });
  const [user, setUser] = useState<User | undefined>(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedUser) return undefined;
    try {
      return JSON.parse(storedUser) as User;
    } catch (err) {
      console.error("Erro ao ler usuário do storage", err);
      localStorage.removeItem(USER_KEY);
      return undefined;
    }
  });

  const setSession = (payload: AuthResponse) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  };

  const logout = () => {
    setToken(undefined);
    setUser(undefined);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      setSession,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
