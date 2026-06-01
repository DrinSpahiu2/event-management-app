/**
 * Central API layer for coupon CRUD.
 */

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
}

export function listCoupons() {
  return request("/api/coupons");
}

export function getCouponsByEvent(eventId) {
  return request(`/api/coupons/event/${encodeURIComponent(eventId)}`);
}

export function createCoupon(body) {
  return request("/api/coupons", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateCoupon(id, body) {
  return request(`/api/coupons/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteCoupon(id) {
  return request(`/api/coupons/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function validateCoupon({ code, event_id, ticket_price }) {
  return request("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, event_id, ticket_price }),
  });
}

export const couponApi = {
  list: listCoupons,
  getByEvent: getCouponsByEvent,
  create: createCoupon,
  update: updateCoupon,
  delete: deleteCoupon,
  validate: validateCoupon,
};

export default couponApi;
