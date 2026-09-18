// ======================================================
// VERIFICATION API
// ======================================================
// Confirmed backend contract: an endpoint exists under
// /api/verification. The exact sub-path/shape wasn't
// specified in the project brief, so the two calls below
// are ISOLATED here as the single integration point —
// adjust the paths to match your actual Spring Boot
// controller if they differ.
//
// The frontend NEVER computes GPS/timestamp/AI/duplicate/
// final verification status itself. It only requests a
// result and displays exactly what the backend returns.
// ======================================================

import { request } from "./apiClient";

/**
 * Ask the backend to run/return verification for a work.
 * Expected response shape (display only what backend sends):
 * {
 *   status: "VERIFIED" | "UNDER_REVIEW" | "REJECTED",
 *   gps: { verified, latitude, longitude },
 *   timestamp: { verified, capturedAt },
 *   ai: { verified, confidence, imageQuality, visualChanges, evidenceConsistency },
 *   duplicate: { isDuplicate, matchedWorkId } | null
 * }
 */
export async function getVerificationResult(workId) {
  // ADJUST PATH if your controller differs, e.g. "/api/verification/{workId}"
  return request(`/api/verification/${workId}`);
}

export async function triggerVerification(workId) {
  // ADJUST PATH/METHOD if your controller differs
  return request(`/api/verification/${workId}`, { method: "POST" });
}
