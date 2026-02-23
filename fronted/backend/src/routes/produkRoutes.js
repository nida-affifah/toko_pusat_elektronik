import express from "express";
import { getProduk, addProduk } from "../controllers/produkController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProduk);
router.post("/", authMiddleware, roleMiddleware("admin"), addProduk);

export default router;
