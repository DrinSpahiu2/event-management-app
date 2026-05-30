const express = require("express");
const couponService = require("../services/couponService");

const router = express.Router();

function handleError(res, err) {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Gabim në server" });
}

router.get("/", async (req, res) => {
  try {
    res.json(await couponService.listCoupons());
  } catch (err) {
    console.error("GET /coupons:", err.message);
    handleError(res, err);
  }
});

router.get("/event/:eventId", async (req, res) => {
  try {
    const data = await couponService.listCouponsByEvent(req.params.eventId);
    res.json(data);
  } catch (err) {
    console.error("GET /coupons/event:", err.message);
    handleError(res, err);
  }
});

router.post("/validate", async (req, res) => {
  try {
    const { code, event_id, ticket_price } = req.body;
    const result = await couponService.validateCoupon({
      code,
      event_id,
      ticket_price,
    });
    res.json(result);
  } catch (err) {
    console.error("POST /coupons/validate:", err.message);
    handleError(res, err);
  }
});

router.post("/", async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    console.error("POST /coupons:", err.message);
    handleError(res, err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.json(coupon);
  } catch (err) {
    console.error("PATCH /coupons:", err.message);
    handleError(res, err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await couponService.deleteCoupon(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("DELETE /coupons:", err.message);
    handleError(res, err);
  }
});

module.exports = router;
