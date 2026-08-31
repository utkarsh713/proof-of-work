// ======================================================
// CENTRAL API CLIENT
// ======================================================
//
// Every request to the Spring Boot backend goes through
// this file. Do NOT hardcode http://localhost:8080 in
// individual pages/components — always import from here.
//
// Configure the backend URL in .env (see .env.example):
//   VITE_API_URL=http://localhost:8080
// ======================================================

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Thrown for any non-2xx response or network failure so
 * callers can branch on `status` / `isNetworkError`.
 */
export class ApiError extends Error {
  constructor(message, { status = null, isNetworkError = false, data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isNetworkError = isNetworkError;
    this.data = data;
  }
}

function buildHeaders(hasBody, isFormData) {
  const headers = { Accept: "application/json" };

  if (hasBody && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const token = localStorage.getItem("authToken");

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

function userFacingMessage(status) {
  switch (status) {
    case 400:
      return "The information submitted was invalid.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to do this.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "This conflicts with an existing record.";
    case 500:
    case 502:
    case 503:
      return "The server ran into a problem. Please try again shortly.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/**
 * Low-level request helper. `path` is relative to API_BASE_URL,
 * e.g. request("/api/works").
 */
export async function request(path, { method = "GET", body, isFormData = false, signal } = {}) {
  const url = `${API_BASE_URL}${path}`;

  let response;

  try {
    response = await fetch(url, {
      method,
      headers: buildHeaders(body !== undefined, isFormData),
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal,
    });
  } catch (networkErr) {
    throw new ApiError("Unable to connect to the server.", {
      isNetworkError: true,
    });
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(userFacingMessage(response.status), {
      status: response.status,
      data,
    });
  }

  return data;
}

/**
 * Marker error for endpoints the backend hasn't exposed yet.
 * Pages should catch this and render an honest "unavailable"
 * state instead of pretending the action succeeded.
 */
export class EndpointNotConfiguredError extends Error {
  constructor(featureName) {
    super(`${featureName} is not connected to a backend endpoint yet.`);
    this.name = "EndpointNotConfiguredError";
  }
}
