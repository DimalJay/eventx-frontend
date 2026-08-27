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

// update profile
export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
}) => {
  const res: Response = await request("/user", {
    method: "PUT",
    data,
  });

  if (res && !res.success) {
    throw new Error(res.message || "Could not update your profile.");
  }

  return res.data;
};

// change password
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res: Response = await request("/auth/change-password", {
    method: "POST",
    data,
  });

  if (res && !res.success) {
    throw new Error(res.message || "Could not change your password.");
  }

  return res.data;
};

// delete account
export const deleteAccount = async () => {
  const res: Response = await request("/user", {
    method: "DELETE",
  });

  if (res && !res.success) {
    throw new Error(res.message || "Could not delete your account.");
  }

  return res.data;
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