import { request } from "@/lib/request";
import { Response } from "@/types";

// register request
export const registerRequest = async (data: any) => {
  const res: Response = await request("/auth/register", {
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

// login request
export const loginRequest = async (data: any) => {
  const res: Response = await request("/auth/login", {
    method: "POST",
    data: {
      email: data.email,
      password: data.password,
    },
  });
  localStorage.setItem("loggedIn", "true");

  return res;
};

// get user details
export const getUser = async () => {
  const res: Response = await request("/user", {
    method: "GET",
  });
  return res;
};

// logout request
export const logoutRequest = async () => {
  const res: Response = await request("/auth/logout", {
    method: "POST"
  })
  return res;
}

// google login request
export const googleLoginRequest = async (credential: string) => {
  const res: Response = await request("/auth/google-login", {
    method: "POST",
    data: {
      credential,
    },
  });
  localStorage.setItem("loggedIn", "true");

  return res;
};