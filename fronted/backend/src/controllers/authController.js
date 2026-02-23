import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { username, password, name, role } = req.body;

    const existing = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, password, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [username, hashedPassword, name, role || "user"]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    await pool.query(
      `INSERT INTO tokens (id_user, token, expired_at)
       VALUES ($1, $2, NOW() + interval '1 day')`,
      [user.id_user, token]
    );

    res.status(201).json({
      message: "Registrasi berhasil",
      token,
      user: {
        id_user: user.id_user,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT id_user, username, password, name, role FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }

    const token = generateToken({
      id_user: user.id_user,
      username: user.username,
      role: user.role,
    });

    await pool.query(
      `INSERT INTO tokens (id_user, token, expired_at)
       VALUES ($1, $2, NOW() + interval '1 day')`,
      [user.id_user, token]
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id_user: user.id_user,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};