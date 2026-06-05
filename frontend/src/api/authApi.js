/**
 * Simple API helper with JWT token support
 * Use this pattern for authenticated API calls
 */

import { requestWithRefresh } from "./requestWithRefresh";

async function request(url, options = {}) {
  return requestWithRefresh(url, options);
}


/** GET — Get current user's profile (requires auth) */
export function getCurrentUserProfile() {
  return request("/api/profile");
}


// Example: You can add more authenticated endpoints here
// export function getSomeProtectedData() {
//   return request("/api/some-protected-route");
// }
