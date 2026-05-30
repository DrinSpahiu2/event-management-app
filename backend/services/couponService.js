"use strict";

const { Op } = require("sequelize");
const db = require("../models");

const includeEvent = [
  { model: db.Event, as: "event", attributes: ["id", "titulli", "lokacioni"] },
];

function toCoupon(row) {
  return {
    id: String(row.id),
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    isActive: Boolean(row.is_active),
    eventId: row.event_id != null ? String(row.event_id) : null,
    eventTitle: row.event?.titulli || null,
  };
}

async function listCoupons() {
  const rows = await db.Coupon.findAll({
    include: includeEvent,
    order: [["id", "DESC"]],
  });
  return rows.map(toCoupon);
}

async function listCouponsByEvent(eventId) {
  const id = Number(eventId);
  const event = await db.Event.findByPk(id, { attributes: ["id", "titulli"] });
  if (!event) {
    const err = new Error("Eventi nuk u gjet");
    err.status = 404;
    throw err;
  }

  const rows = await db.Coupon.findAll({
    where: {
      [Op.or]: [{ event_id: id }, { event_id: null }],
      is_active: true,
    },
    include: includeEvent,
    order: [["code", "ASC"]],
  });

  return {
    eventId: String(id),
    eventTitle: event.titulli,
    totalActive: rows.length,
    coupons: rows.map(toCoupon),
  };
}

async function listCouponsByEventForManager(eventId) {
  const id = Number(eventId);
  const where = eventId ? { event_id: id } : {};
  const rows = await db.Coupon.findAll({
    where,
    include: includeEvent,
    order: [["id", "DESC"]],
  });
  return rows.map(toCoupon);
}

async function createCoupon(payload) {
  const code = String(payload.code || "")
    .trim()
    .toUpperCase();
  if (!code) {
    const err = new Error("Kodi i kuponit mungon");
    err.status = 400;
    throw err;
  }

  const discount_type = payload.discount_type;
  if (!["percentage", "fixed"].includes(discount_type)) {
    const err = new Error("discount_type duhet percentage ose fixed");
    err.status = 400;
    throw err;
  }

  const discount_value = Number(payload.discount_value);
  if (!Number.isFinite(discount_value) || discount_value <= 0) {
    const err = new Error("discount_value duhet pozitiv");
    err.status = 400;
    throw err;
  }

  if (discount_type === "percentage" && discount_value > 100) {
    const err = new Error("Përqindja nuk mund të jetë mbi 100");
    err.status = 400;
    throw err;
  }

  const event_id =
    payload.event_id != null && payload.event_id !== ""
      ? Number(payload.event_id)
      : null;

  if (event_id) {
    const event = await db.Event.findByPk(event_id);
    if (!event) {
      const err = new Error("Eventi nuk u gjet");
      err.status = 404;
      throw err;
    }
  }

  const existing = await db.Coupon.findOne({ where: { code } });
  if (existing) {
    const err = new Error("Ky kod ekziston tashmë");
    err.status = 409;
    throw err;
  }

  const row = await db.Coupon.create({
    code,
    discount_type,
    discount_value,
    is_active: payload.is_active !== false,
    event_id,
  });

  const full = await db.Coupon.findByPk(row.id, { include: includeEvent });
  return toCoupon(full);
}

async function updateCoupon(id, payload) {
  const row = await db.Coupon.findByPk(Number(id));
  if (!row) {
    const err = new Error("Kuponi nuk u gjet");
    err.status = 404;
    throw err;
  }

  if (payload.code !== undefined) {
    const code = String(payload.code).trim().toUpperCase();
    if (!code) {
      const err = new Error("Kodi nuk mund të jetë bosh");
      err.status = 400;
      throw err;
    }
    const dup = await db.Coupon.findOne({
      where: { code, id: { [Op.ne]: row.id } },
    });
    if (dup) {
      const err = new Error("Ky kod ekziston tashmë");
      err.status = 409;
      throw err;
    }
    row.code = code;
  }

  if (payload.discount_type !== undefined) {
    if (!["percentage", "fixed"].includes(payload.discount_type)) {
      const err = new Error("discount_type duhet percentage ose fixed");
      err.status = 400;
      throw err;
    }
    row.discount_type = payload.discount_type;
  }

  if (payload.discount_value !== undefined) {
    const discount_value = Number(payload.discount_value);
    if (!Number.isFinite(discount_value) || discount_value <= 0) {
      const err = new Error("discount_value duhet pozitiv");
      err.status = 400;
      throw err;
    }
    if (row.discount_type === "percentage" && discount_value > 100) {
      const err = new Error("Përqindja nuk mund të jetë mbi 100");
      err.status = 400;
      throw err;
    }
    row.discount_value = discount_value;
  }

  if (payload.is_active !== undefined) {
    row.is_active = Boolean(payload.is_active);
  }

  if (payload.event_id !== undefined) {
    const event_id =
      payload.event_id === null || payload.event_id === ""
        ? null
        : Number(payload.event_id);
    if (event_id) {
      const event = await db.Event.findByPk(event_id);
      if (!event) {
        const err = new Error("Eventi nuk u gjet");
        err.status = 404;
        throw err;
      }
    }
    row.event_id = event_id;
  }

  await row.save();
  const full = await db.Coupon.findByPk(row.id, { include: includeEvent });
  return toCoupon(full);
}

async function deleteCoupon(id) {
  const row = await db.Coupon.findByPk(Number(id));
  if (!row) {
    const err = new Error("Kuponi nuk u gjet");
    err.status = 404;
    throw err;
  }
  await row.destroy();
  return { message: "Kuponi u fshi", id: String(id) };
}

function calculateDiscount(coupon, ticketPrice) {
  const price = Number(ticketPrice) || 0;
  let discountAmount = 0;

  if (coupon.discount_type === "percentage") {
    discountAmount = (price * Number(coupon.discount_value)) / 100;
  } else {
    discountAmount = Number(coupon.discount_value);
  }

  discountAmount = Math.min(discountAmount, price);
  const finalPrice = Math.max(0, price - discountAmount);

  return {
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
  };
}

async function validateCoupon({ code, event_id, ticket_price }) {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  if (!normalized) {
    const err = new Error("Kodi i kuponit mungon");
    err.status = 400;
    throw err;
  }

  const coupon = await db.Coupon.findOne({
    where: { code: normalized },
    include: includeEvent,
  });

  if (!coupon) {
    const err = new Error("Kuponi nuk është valide");
    err.status = 404;
    throw err;
  }

  if (!coupon.is_active) {
    const err = new Error("Kuponi nuk është aktiv");
    err.status = 400;
    throw err;
  }

  const eventId = event_id != null && event_id !== "" ? Number(event_id) : null;
  if (coupon.event_id != null && eventId != null && Number(coupon.event_id) !== eventId) {
    const err = new Error("Kuponi nuk vlen për këtë event");
    err.status = 400;
    throw err;
  }

  const price = Number(ticket_price) || 0;
  const { discountAmount, finalPrice } = calculateDiscount(coupon, price);

  return {
    valid: true,
    coupon: toCoupon(coupon),
    originalPrice: price,
    discountAmount,
    finalPrice,
  };
}

module.exports = {
  listCoupons,
  listCouponsByEvent,
  listCouponsByEventForManager,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  toCoupon,
};
