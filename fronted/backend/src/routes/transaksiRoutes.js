import express from "express";
import { createTransaksi } from "../controllers/transaksiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PELANGGAN CHECKOUT
router.post(
  "/",
  authMiddleware,
  roleMiddleware("pelanggan"),
  createTransaksi
);

export default router;
