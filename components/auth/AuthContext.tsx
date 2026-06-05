"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  loginType: string;
  isVerified: number;
  role: string;
  profilePicture: string;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      setUser,
      logout: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
