import express from "express";
import {
  getKategori,
  getAllKategoriAdmin,
  addKategori,
  deactiveKategori,
  activeKategori
} from "../controllers/kategoriController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC / FRONTEND
router.get("/", getKategori);

// ADMIN
router.get("/admin", authMiddleware, roleMiddleware("admin"), getAllKategoriAdmin);
router.post("/", authMiddleware, roleMiddleware("admin"), addKategori);
router.put("/:id/deactive", authMiddleware, roleMiddleware("admin"), deactiveKategori);
router.put("/:id/active", authMiddleware, roleMiddleware("admin"), activeKategori);

export default router;
