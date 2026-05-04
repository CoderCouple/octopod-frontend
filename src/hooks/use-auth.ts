"use client";

import { useContext } from "react";

import {
  AuthContext,
  type AuthContextType,
} from "@/components/provider/auth-provider";

export type { AuthContextType };

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
