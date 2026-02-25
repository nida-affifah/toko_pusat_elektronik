import express from "express";
import {
  createTransaksi,
  getAllTransaksi,
} from "../controllers/transaksiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ================== PELANGGAN CHECKOUT ==================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("pelanggan"),
  createTransaksi
);

// ================== ADMIN & KASIR LIHAT TRANSAKSI ==================
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "kasir"),
  getAllTransaksi
);

export default router;