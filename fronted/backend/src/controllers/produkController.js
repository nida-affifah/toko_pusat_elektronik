import pool from "../config/db.js";

/**
 * ===============================
 * GET PRODUK (HANYA YANG AKTIF)
 * ===============================
 */
export const getProduk = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_produk,
        p.nama_produk,
        p.harga,
        p.stok,
        p.is_active,
        k.nama_kategori,
        s.nama_supplier
      FROM produk p
      JOIN kategori k ON p.id_kategori = k.id_kategori
      JOIN supplier s ON p.id_supplier = s.id_supplier
      WHERE p.is_active = true
      ORDER BY p.id_produk DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};

/**
 * ===============================
 * GET SEMUA PRODUK (ADMIN)
 * termasuk yang nonaktif
 * ===============================
 */
export const getAllProdukAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_produk,
        p.nama_produk,
        p.harga,
        p.stok,
        p.is_active,
        k.nama_kategori,
        s.nama_supplier
      FROM produk p
      JOIN kategori k ON p.id_kategori = k.id_kategori
      JOIN supplier s ON p.id_supplier = s.id_supplier
      ORDER BY p.id_produk DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};

/**
 * ===============================
 * TAMBAH PRODUK
 * ===============================
 */
export const addProduk = async (req, res) => {
  try {
    const { nama_produk, harga, stok, id_kategori, id_supplier } = req.body;

    if (!nama_produk || !harga || !stok || !id_kategori || !id_supplier) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    await pool.query(
      `
      INSERT INTO produk
      (nama_produk, harga, stok, id_kategori, id_supplier, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      `,
      [nama_produk, harga, stok, id_kategori, id_supplier]
    );

    res.json({ message: "Produk berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan produk" });
  }
};

/**
 * ===============================
 * DEACTIVE PRODUK (SOFT DELETE)
 * ===============================
 */
export const deactiveProduk = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE produk SET is_active = false WHERE id_produk = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil dinonaktifkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menonaktifkan produk" });
  }
};

/**
 * ===============================
 * AKTIFKAN KEMBALI PRODUK
 * ===============================
 */
export const activeProduk = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE produk SET is_active = true WHERE id_produk = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil diaktifkan kembali" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengaktifkan produk" });
  }
};