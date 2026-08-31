// ======================================================
// FEEDBACK API
// ======================================================
// NOT CONFIRMED IN THE PROJECT'S BACKEND CONTRACT.
// No citizen-feedback endpoint was specified. Flip
// FEEDBACK_ENDPOINT_CONFIGURED once your Spring Boot route
// exists and fill in the real path below.
// ======================================================

import { request, EndpointNotConfiguredError } from "./apiClient";

const FEEDBACK_ENDPOINT_CONFIGURED = false;

export async function submitFeedback(payload) {
  if (!FEEDBACK_ENDPOINT_CONFIGURED) {
    throw new EndpointNotConfiguredError("Citizen feedback submission");
  }

  // Example once available:
  // return request("/api/feedback", { method: "POST", body: payload });
}
