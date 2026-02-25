import express from "express";
import { login, register } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    id_user: req.user.id_user,
    username: req.user.username,
    role: req.user.role,
    name: req.user.name,
  });
});

export default router;