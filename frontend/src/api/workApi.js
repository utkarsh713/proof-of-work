// ======================================================
// WORK API
// ======================================================
// Confirmed backend contract:
//   GET    /api/works
//   GET    /api/works/{id}
//   POST   /api/works
//   PUT    /api/works/{id}
//   DELETE /api/works/{id}
//
// The frontend never assigns work.status itself — the
// backend is the source of truth for verification state.
// ======================================================

import { request } from "./apiClient";

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.works)) return data.works;
  if (data && typeof data === "object") return [data];
  return [];
}

export async function getWorks() {
  const data = await request("/api/works");
  return normalizeListResponse(data);
}

export async function getWork(id) {
  return request(`/api/works/${id}`);
}

/**
 * payload: user-entered fields only. Do NOT include a
 * `status` field — the backend assigns the initial status.
 * {
 *   title, department, description, location,
 *   estimatedCost, beforeImage, afterImage,
 *   gpsLocation: { latitude, longitude }
 * }
 */
export async function createWork(payload) {
  return request("/api/works", { method: "POST", body: payload });
}

export async function updateWork(id, payload) {
  return request(`/api/works/${id}`, { method: "PUT", body: payload });
}

export async function deleteWork(id) {
  return request(`/api/works/${id}`, { method: "DELETE" });
}
