import pool from "../config/db.js";

export const startShift = async (req, res) => {
  try {
    const check = await pool.query(
      `SELECT * FROM shift_kasir 
       WHERE id_user=$1 AND jam_keluar IS NULL`,
      [req.user.id_user]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({
        message: "Shift masih aktif"
      });
    }

    await pool.query(
      "INSERT INTO shift_kasir (id_user, jam_masuk) VALUES ($1, NOW())",
      [req.user.id_user]
    );

    res.json({ message: "Shift dimulai" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memulai shift" });
  }
};

export const endShift = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE shift_kasir 
       SET jam_keluar = NOW() 
       WHERE id_user=$1 AND jam_keluar IS NULL
       RETURNING *`,
      [req.user.id_user]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Tidak ada shift aktif"
      });
    }

    res.json({ message: "Shift ditutup" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menutup shift" });
  }
};
