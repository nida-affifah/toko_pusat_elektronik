import pool from "../config/db.js";

export const laporanHarian = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE(tanggal) AS tanggal,
        SUM(total)::INT AS total
      FROM transaksi
      GROUP BY DATE(tanggal)
      ORDER BY tanggal DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan harian" });
  }
};
