import { request } from "./apiClient";

export async function login({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
}

export async function register({
  name,
  email,
  location,
  password,
}) {
  return request("/api/auth/register", {
    method: "POST",
    body: {
      name,
      email,
      location,
      password,
    },
  });
}

export async function changePassword({
  currentPassword,
  newPassword,
}) {
  return request("/api/auth/change-password", {
    method: "POST",
    body: {
      currentPassword,
      newPassword,
    },
  });
} 