/**
 * Simple API helper with JWT token support
 * Use this pattern for authenticated API calls
 */

import { tokenUtils } from "../utils/tokenUtils";

async function request(url, options = {}) {
  // Add JWT token to headers
  const headers = {
    "Content-Type": "application/json",
    ...tokenUtils.getAuthHeader(), // Adds "Authorization: Bearer {token}"
    ...options.headers,
  };

  const res = await fetch(url, {
    headers,
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

/** GET — Get current user's profile (requires auth) */
export function getCurrentUserProfile() {
  return request("/api/profile");
}

// Example: You can add more authenticated endpoints here
// export function getSomeProtectedData() {
//   return request("/api/some-protected-route");
// }
