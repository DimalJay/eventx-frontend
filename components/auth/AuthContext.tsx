"use client";

import { getUser, loginRequest, logoutRequest } from "@/service/userService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  loginType: string;
  isVerified: boolean;
  role: string;
  profilePicture?: string;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user = null, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await getUser();
        return response.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  })

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.setQueryData(['user'], null);
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [router, queryClient])

  const login = async (data: any) => {
    try {
      await loginRequest(data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      throw error;
    }
  }

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.warn("Logout request failed, but proceeding with local cleanup:", error);
    } finally {
      queryClient.setQueryData(['user'], null);
      toast.success("Logged out successfully.", { id: "logout-success" });
    }
  };


  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading]
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
