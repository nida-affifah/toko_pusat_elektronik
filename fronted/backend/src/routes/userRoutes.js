import express from "express";
import {
  getUsers,
  getAllUsersAdmin,
  createUser,
  deactiveUser,
  activeUser
} from "../controllers/userController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);

// ADMIN - semua termasuk nonaktif
router.get("/admin", authMiddleware, roleMiddleware("admin"), getAllUsersAdmin);

// ADMIN - add user
router.post("/", authMiddleware, roleMiddleware("admin"), createUser);

// ADMIN - deactive / aktifkan
router.put("/:id/deactive", authMiddleware, roleMiddleware("admin"), deactiveUser);
router.put("/:id/active", authMiddleware, roleMiddleware("admin"), activeUser);

export default router;
