/**
 * Central API layer for certificate CRUD.
 * All pages should use these functions instead of calling fetch directly.
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

/** POST — Manager issues a certificate (ManagersPage only) */
export function issueCertificate({ user_id, event_id, kodi, data_leshimit }) {
  return request("/api/certificates", {
    method: "POST",
    body: JSON.stringify({ user_id, event_id, kodi, data_leshimit }),
  });
}

/** GET — All certificates for an event (EventDetails stats) */
export function getCertificatesByEvent(eventId) {
  return request(`/api/certificates/event/${encodeURIComponent(eventId)}`);
}

/** GET — User's own certificates (UserEventsPage) */
export function getCertificatesByUser(userId) {
  return request(`/api/certificates/user/${encodeURIComponent(userId)}`);
}

/** DELETE — Manager revokes a certificate */
export function revokeCertificate(id) {
  return request(`/api/certificates/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export const certificateApi = {
  issue: issueCertificate,
  getByEvent: getCertificatesByEvent,
  getByUser: getCertificatesByUser,
  revoke: revokeCertificate,
};

export default certificateApi;
