import { authRequest, request } from "@/lib/request";
import { Response, WithID } from "./types";
import { z } from "zod";

export const register = async (data: any) => {
  const res: Response = await authRequest("/auth/register", {
    method: "POST",
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    },
  });
  localStorage.setItem("loggedIn", "true");

  return res;
};

export const loginRequest = async (data: any) => {
  const res: Response = await authRequest("/auth/login", {
    method: "POST",
    data: {
      email: data.email,
      password: data.password,
    },
  });
  localStorage.setItem("loggedIn", "true");

  return res;
};

export const getUser = async () => {
  const res: Response = await authRequest("/user", {
    method: "GET",
  });
  return res;
};


export const logoutRequest = async () => {
  const res: Response = await authRequest("/auth/logout", {
    method: "POST"
  })
  return res;
}