import express from "express";
import {
  getSupplier,
  getAllSupplierAdmin,
  addSupplier,
  deactiveSupplier,
  activeSupplier
} from "../controllers/supplierController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC / FRONTEND
router.get("/", getSupplier);

// ADMIN
router.get("/admin", authMiddleware, roleMiddleware("admin"), getAllSupplierAdmin);
router.post("/", authMiddleware, roleMiddleware("admin"), addSupplier);
router.put("/:id/deactive", authMiddleware, roleMiddleware("admin"), deactiveSupplier);
router.put("/:id/active", authMiddleware, roleMiddleware("admin"), activeSupplier);

export default router;
