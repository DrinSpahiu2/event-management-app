import { tokenUtils } from "../utils/tokenUtils";
import { refreshApi } from "./refreshApi";

let refreshingPromise = null;

async function withAuthHeaders(options = {}) {
  return {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...tokenUtils.getAuthHeader(),
      ...(options.headers || {}),
    },
  };
}



export async function requestWithRefresh(url, options = {}) {
  const tryRequest = async () => {
    const res = await fetch(url, await withAuthHeaders(options));
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data.error || data.message || "Request failed");
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  };

  try {
    return await tryRequest();
  } catch (err) {
    if (err?.status !== 403) throw err;

    // Refresh only once concurrently
    if (!refreshingPromise) {
      refreshingPromise = refreshApi
        .refreshAccessToken()
        .finally(() => {
          refreshingPromise = null;
        });
    }

    await refreshingPromise;

    // Retry original request with updated access token
    return await tryRequest();
  }
}

