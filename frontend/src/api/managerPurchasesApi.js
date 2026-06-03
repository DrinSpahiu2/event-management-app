import { tokenUtils } from "../utils/tokenUtils";

async function request(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...tokenUtils.getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

export const managerPurchasesApi = {
  list: () => request("/api/manager/purchases"),
};

