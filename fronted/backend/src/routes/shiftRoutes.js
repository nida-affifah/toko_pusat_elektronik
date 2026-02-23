import express from "express";
import { startShift, endShift } from "../controllers/shiftController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/start", authMiddleware, roleMiddleware("kasir"), startShift);
router.post("/end", authMiddleware, roleMiddleware("kasir"), endShift);

export default router;
