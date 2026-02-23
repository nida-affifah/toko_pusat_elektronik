import pool from "../config/db.js";

/**
 * GET supplier aktif (frontend)
 */
export const getSupplier = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM supplier WHERE is_active = true ORDER BY id_supplier DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data supplier" });
  }
};

/**
 * GET semua supplier (admin)
 */
export const getAllSupplierAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM supplier ORDER BY id_supplier DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data supplier" });
  }
};

/**
 * TAMBAH supplier
 */
export const addSupplier = async (req, res) => {
  try {
    const { nama_supplier, kontak, alamat } = req.body;
    if (!nama_supplier) {
      return res.status(400).json({ message: "Nama supplier wajib diisi" });
    }

    await pool.query(
      "INSERT INTO supplier (nama_supplier, kontak, alamat, is_active) VALUES ($1,$2,$3,true)",
      [nama_supplier, kontak, alamat]
    );

    res.json({ message: "Supplier berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan supplier" });
  }
};

/**
 * DEACTIVE supplier
 */
export const deactiveSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE supplier SET is_active = false WHERE id_supplier = $1",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Supplier tidak ditemukan" });

    res.json({ message: "Supplier berhasil dinonaktifkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menonaktifkan supplier" });
  }
};

/**
 * AKTIFKAN supplier kembali
 */
export const activeSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE supplier SET is_active = true WHERE id_supplier = $1",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Supplier tidak ditemukan" });

    res.json({ message: "Supplier berhasil diaktifkan kembali" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengaktifkan supplier" });
  }
};
