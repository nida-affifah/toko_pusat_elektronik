import express from "express";
import {
  getProduk,
  getAllProdukAdmin,
  addProduk,
  updateProduk,
  deleteProduk,
  deactiveProduk,
  activeProduk
} from "../controllers/produkController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ===============================
 * MIDDLEWARE CEK ROLE + AKTIF
 * ===============================
 */
const allowRoles = (...roles) => (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.is_active === false) {
    return res.status(403).json({ message: "User nonaktif" });
  }

  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Akses ditolak" });
  }

  next();
};

/**
 * ===============================
 * ROUTES
 * ===============================
 */

// semua role bisa lihat produk (selama aktif)
router.get("/", authMiddleware, allowRoles("admin", "kasir", "user"), getProduk);

// hanya admin lihat semua produk
router.get("/admin", authMiddleware, allowRoles("admin"), getAllProdukAdmin);

// hanya admin tambah
router.post("/", authMiddleware, allowRoles("admin"), addProduk);

// hanya admin update
router.put("/:id", authMiddleware, allowRoles("admin"), updateProduk);

// hanya admin hapus
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteProduk);

// nonaktifkan produk
router.patch("/:id/deactive", authMiddleware, allowRoles("admin"), deactiveProduk);

// aktifkan produk
router.patch("/:id/active", authMiddleware, allowRoles("admin"), activeProduk);

export default router;