import express from "express";
import { laporanHarian } from "../controllers/laporanController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/harian",
  authMiddleware,
  roleMiddleware("admin"),
  laporanHarian
);

export default router;
