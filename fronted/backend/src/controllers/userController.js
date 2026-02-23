import pool from "../config/db.js";
import bcrypt from "bcrypt";

/**
 * GET semua user (admin)
 * hanya tampil user aktif
 */
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_user, username, name, email, role, is_active
       FROM users
       ORDER BY id_user DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};

/**
 * GET semua user (admin) termasuk nonaktif
 */
export const getAllUsersAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_user, username, name, email, role, is_active
       FROM users
       ORDER BY id_user DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};

/**
 * CREATE USER
 */
export const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;

    if (!username || !name || !email || !password || !role) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    if (!["admin", "kasir", "pelanggan"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, name, email, password, role, is_active)
       VALUES ($1,$2,$3,$4,$5,true)`,
      [username, name, email, hashedPassword, role]
    );

    res.json({ message: "User berhasil ditambahkan" });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Username atau email sudah digunakan" });
    }

    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan user" });
  }
};

/**
 * DEACTIVE / NONAKTIFKAN USER
 */
export const deactiveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE users SET is_active = false WHERE id_user = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil dinonaktifkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menonaktifkan user" });
  }
};

/**
 * AKTIFKAN USER KEMBALI
 */
export const activeUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE users SET is_active = true WHERE id_user = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil diaktifkan kembali" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengaktifkan user" });
  }
};
