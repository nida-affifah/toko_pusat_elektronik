import express from "express";
import { bayarTransaksi } from "../controllers/pembayaranController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("kasir"), bayarTransaksi);

export default router;
