import express from "express";
import {
  getDetailByTransaksi,
  addDetailTransaksi
} from "../controllers/detailTransaksiController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET detail transaksi (admin & pelanggan)
router.get("/:id_transaksi", authMiddleware, getDetailByTransaksi);

// ADD detail transaksi (admin / sistem checkout)
router.post("/", authMiddleware, roleMiddleware("pelanggan"), addDetailTransaksi);

export default router;
