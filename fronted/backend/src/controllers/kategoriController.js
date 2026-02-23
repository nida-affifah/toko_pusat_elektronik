import pool from "../config/db.js";

/**
 * ===============================
 * GET KATEGORI (AKTIF SAJA)
 * ===============================
 */
export const getKategori = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM kategori WHERE is_active = true ORDER BY id_kategori DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("ERROR GET KATEGORI:", error.message);
    res.status(500).json({ message: "Gagal mengambil data kategori" });
  }
};

/**
 * ===============================
 * GET SEMUA KATEGORI (ADMIN)
 * ===============================
 */
export const getAllKategoriAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM kategori ORDER BY id_kategori DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("ERROR GET ALL KATEGORI:", error.message);
    res.status(500).json({ message: "Gagal mengambil data kategori" });
  }
};

/**
 * ===============================
 * TAMBAH KATEGORI
 * ===============================
 */
export const addKategori = async (req, res) => {
  try {
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    await pool.query(
      "INSERT INTO kategori (nama_kategori, is_active) VALUES ($1, true)",
      [nama_kategori]
    );

    res.status(201).json({ message: "Kategori berhasil ditambahkan" });
  } catch (error) {
    console.error("ERROR ADD KATEGORI:", error.message);
    res.status(500).json({ message: "Gagal menambahkan kategori" });
  }
};

/**
 * ===============================
 * DEACTIVE KATEGORI
 * ===============================
 */
export const deactiveKategori = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE kategori SET is_active = false WHERE id_kategori = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.json({ message: "Kategori berhasil dinonaktifkan" });
  } catch (error) {
    console.error("ERROR DEACTIVE KATEGORI:", error.message);
    res.status(500).json({ message: "Gagal menonaktifkan kategori" });
  }
};

/**
 * ===============================
 * AKTIFKAN KEMBALI KATEGORI
 * ===============================
 */
export const activeKategori = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE kategori SET is_active = true WHERE id_kategori = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.json({ message: "Kategori berhasil diaktifkan kembali" });
  } catch (error) {
    console.error("ERROR ACTIVE KATEGORI:", error.message);
    res.status(500).json({ message: "Gagal mengaktifkan kategori" });
  }
};