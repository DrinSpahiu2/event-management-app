"use strict";

const db = require("../models");

const includeRelations = [
  { model: db.User, as: "user", attributes: ["id", "emri", "mbiemri", "email"] },
  { model: db.Event, as: "event", attributes: ["id", "titulli", "lokacioni"] },
];

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function toCertificate(row) {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    eventId: String(row.event_id),
    code: row.kodi,
    issuedAt: formatDate(row.data_leshimit),
    issuedAtRaw: row.data_leshimit,
    userName: row.user ? `${row.user.emri} ${row.user.mbiemri}`.trim() : "",
    userEmail: row.user?.email || "",
    eventTitle: row.event?.titulli || "",
    eventLocation: row.event?.lokacioni || "",
  };
}

function generateCertificateCode(eventId, userId) {
  const suffix = Date.now().toString(36).toUpperCase();
  return `CERT-${eventId}-${userId}-${suffix}`;
}

async function issueCertificate({ user_id, event_id, kodi, data_leshimit }) {
  const userId = Number(user_id);
  const eventId = Number(event_id);

  const user = await db.User.findByPk(userId);
  if (!user) {
    const err = new Error("Përdoruesi nuk u gjet");
    err.status = 404;
    throw err;
  }

  const event = await db.Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Eventi nuk u gjet");
    err.status = 404;
    throw err;
  }

  const existing = await db.Certificate.findOne({
    where: { user_id: userId, event_id: eventId },
  });
  if (existing) {
    const err = new Error("Ky përdorues ka tashmë certifikatë për këtë event");
    err.status = 409;
    throw err;
  }

  const row = await db.Certificate.create({
    user_id: userId,
    event_id: eventId,
    kodi: kodi?.trim() || generateCertificateCode(eventId, userId),
    data_leshimit: data_leshimit ? new Date(data_leshimit) : new Date(),
  });

  const full = await db.Certificate.findByPk(row.id, { include: includeRelations });
  return toCertificate(full);
}

async function getCertificatesByEvent(eventId) {
  const id = Number(eventId);
  const event = await db.Event.findByPk(id, { attributes: ["id", "titulli"] });
  if (!event) {
    const err = new Error("Eventi nuk u gjet");
    err.status = 404;
    throw err;
  }

  const rows = await db.Certificate.findAll({
    where: { event_id: id },
    include: includeRelations,
    order: [["data_leshimit", "DESC"]],
  });

  const certificates = rows.map(toCertificate);
  return {
    eventId: String(id),
    eventTitle: event.titulli,
    totalIssued: certificates.length,
    certificates,
  };
}

async function getCertificatesByUser(userId) {
  const id = Number(userId);
  const user = await db.User.findByPk(id, { attributes: ["id", "emri", "mbiemri"] });
  if (!user) {
    const err = new Error("Përdoruesi nuk u gjet");
    err.status = 404;
    throw err;
  }

  const rows = await db.Certificate.findAll({
    where: { user_id: id },
    include: includeRelations,
    order: [["data_leshimit", "DESC"]],
  });

  return rows.map(toCertificate);
}

async function revokeCertificate(id) {
  const row = await db.Certificate.findByPk(Number(id));
  if (!row) {
    const err = new Error("Certifikata nuk u gjet");
    err.status = 404;
    throw err;
  }
  await row.destroy();
  return { message: "Certifikata u revokua", id: String(id) };
}

module.exports = {
  issueCertificate,
  getCertificatesByEvent,
  getCertificatesByUser,
  revokeCertificate,
  toCertificate,
};
