// ======================================================
// NOTIFICATION API
// ======================================================
// NOT CONFIRMED IN THE PROJECT'S BACKEND CONTRACT.
// No notification endpoint was specified. Flip
// NOTIFICATIONS_ENDPOINT_CONFIGURED once your Spring Boot
// route exists and fill in the real path below.
// ======================================================

import { request, EndpointNotConfiguredError } from "./apiClient";

const NOTIFICATIONS_ENDPOINT_CONFIGURED = false;

export async function getNotifications() {
  if (!NOTIFICATIONS_ENDPOINT_CONFIGURED) {
    throw new EndpointNotConfiguredError("Notifications");
  }

  // Example once available:
  // return request("/api/notifications");
}

export async function markAsRead(id) {
  if (!NOTIFICATIONS_ENDPOINT_CONFIGURED) {
    throw new EndpointNotConfiguredError("Notifications");
  }

  // Example once available:
  // return request(`/api/notifications/${id}/read`, { method: "PUT" });
}
