import express from "express";
import { login, register } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
  });
});

export default router;