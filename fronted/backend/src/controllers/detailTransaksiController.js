import pool from "../config/db.js";

/**
 * GET detail transaksi berdasarkan id_transaksi
 */
export const getDetailByTransaksi = async (req, res) => {
  try {
    const { id_transaksi } = req.params;

    const result = await pool.query(
      `SELECT dt.*, p.nama_produk 
       FROM detail_transaksi dt
       JOIN produk p ON dt.id_produk = p.id_produk
       WHERE dt.id_transaksi = $1`,
      [id_transaksi]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail transaksi" });
  }
};

/**
 * TAMBAH detail transaksi
 */
export const addDetailTransaksi = async (req, res) => {
  try {
    const { id_transaksi, id_produk, jumlah, harga } = req.body;

    if (!id_transaksi || !id_produk || !jumlah || !harga) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    await pool.query(
      `INSERT INTO detail_transaksi (id_transaksi, id_produk, jumlah, harga)
       VALUES ($1, $2, $3, $4)`,
      [id_transaksi, id_produk, jumlah, harga]
    );

    res.json({ message: "Detail transaksi berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan detail transaksi" });
  }
};
