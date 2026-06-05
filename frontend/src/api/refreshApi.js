import { tokenUtils } from "../utils/tokenUtils";

async function refreshAccessToken() {
  const refreshToken = tokenUtils.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }


  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || "Refresh failed");
  }

  // Expect { token, refreshToken }
  if (data.token) tokenUtils.setToken(data.token);
  if (data.refreshToken) tokenUtils.setRefreshToken(data.refreshToken);

  return data;
}

export const refreshApi = { refreshAccessToken };

