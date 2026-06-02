"use strict";

const db = require("../models");

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toContactMessage(row) {
  return {
    id: String(row.id),
    name: row.emri,
    email: row.email,
    subject: row.subjekti,
    message: row.mesazhi,
    status: row.statusi,
    statusLabel: row.statusi === "replied" ? "Replied" : "Pending",
    reply: row.pergjigja || "",
    sentAt: formatDate(row.data_dergimit),
    repliedAt: row.data_pergjigjes ? formatDate(row.data_pergjigjes) : null,
  };
}

async function createContactMessage({ name, email, subject, message }) {
  const emri = String(name || "").trim();
  const emailNorm = String(email || "").trim().toLowerCase();
  const subjekti = String(subject || "").trim();
  const mesazhi = String(message || "").trim();

  if (!emri) {
    const err = new Error("Emri mungon");
    err.status = 400;
    throw err;
  }
  if (!emailNorm || !emailNorm.includes("@")) {
    const err = new Error("Email i pavlefshëm");
    err.status = 400;
    throw err;
  }
  if (!subjekti) {
    const err = new Error("Subjekti mungon");
    err.status = 400;
    throw err;
  }
  if (!mesazhi) {
    const err = new Error("Mesazhi mungon");
    err.status = 400;
    throw err;
  }

  const row = await db.ContactMessage.create({
    emri,
    email: emailNorm,
    subjekti,
    mesazhi,
    statusi: "pending",
    data_dergimit: new Date(),
  });

  return toContactMessage(row);
}

async function listContactMessages(statusFilter) {
  const where = {};
  if (statusFilter && ["pending", "replied"].includes(statusFilter)) {
    where.statusi = statusFilter;
  }

  const rows = await db.ContactMessage.findAll({
    where,
    order: [["data_dergimit", "DESC"]],
  });

  return rows.map(toContactMessage);
}

async function replyToContactMessage(id, pergjigja) {
  const text = String(pergjigja || "").trim();
  if (!text) {
    const err = new Error("Përgjigja nuk mund të jetë bosh");
    err.status = 400;
    throw err;
  }

  const row = await db.ContactMessage.findByPk(Number(id));
  if (!row) {
    const err = new Error("Mesazhi nuk u gjet");
    err.status = 404;
    throw err;
  }

  row.pergjigja = text;
  row.statusi = "replied";
  row.data_pergjigjes = new Date();
  await row.save();

  return toContactMessage(row);
}

module.exports = {
  createContactMessage,
  listContactMessages,
  replyToContactMessage,
  toContactMessage,
};
