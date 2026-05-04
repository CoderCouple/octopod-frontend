"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  confirmSignUp as amplifyConfirmSignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

import "@/lib/amplify-config";
import type { AuthUser } from "@/types/auth";

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ needsConfirmation: boolean }>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function setSessionCookie(token: string) {
  document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax`;
}

function clearSessionCookie() {
  document.cookie = "__session=; path=/; max-age=0; SameSite=Lax";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    try {
      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      setUser({
        userId: cognitoUser.userId,
        email: attributes.email ?? "",
        name: attributes.name ?? attributes.email?.split("@")[0],
      });

      if (idToken) {
        setSessionCookie(idToken);
      }
    } catch {
      setUser(null);
      clearSessionCookie();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
        case "tokenRefresh":
          loadUser();
          break;
        case "signedOut":
          setUser(null);
          clearSessionCookie();
          break;
      }
    });
    return unsubscribe;
  }, [loadUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    await amplifySignIn({ username: email, password });
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name?: string
    ): Promise<{ needsConfirmation: boolean }> => {
      const { nextStep } = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            ...(name ? { name } : {}),
          },
        },
      });
      return {
        needsConfirmation: nextStep.signUpStep === "CONFIRM_SIGN_UP",
      };
    },
    []
  );

  const confirmSignUp = useCallback(async (email: string, code: string) => {
    await amplifyConfirmSignUp({ username: email, confirmationCode: code });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    throw new Error(
      "Google sign-in is not yet configured. A Cognito Hosted UI domain is required."
    );
  }, []);

  const signOut = useCallback(async () => {
    await amplifySignOut();
    clearSessionCookie();
    setUser(null);
    router.push("/login");
  }, [router]);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() ?? null;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      confirmSignUp,
      signInWithGoogle,
      signOut,
      getIdToken,
    }),
    [
      user,
      loading,
      signIn,
      signUp,
      confirmSignUp,
      signInWithGoogle,
      signOut,
      getIdToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
