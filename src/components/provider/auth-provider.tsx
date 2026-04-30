"use client";

import { createContext, useMemo } from "react";

export interface AuthContextType {
  user: null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const notConfigured = () =>
  Promise.reject(new Error("Auth is not configured yet"));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<AuthContextType>(
    () => ({
      user: null,
      loading: false,
      signIn: notConfigured,
      signUp: notConfigured,
      signInWithGoogle: notConfigured,
      signOut: notConfigured,
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
