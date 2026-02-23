import pool from "../config/db.js";

export const bayarTransaksi = async (req, res) => {
  try {
    const { id_transaksi, metode, bayar } = req.body;

    const trx = await pool.query(
      "SELECT total, status FROM transaksi WHERE id_transaksi=$1",
      [id_transaksi]
    );

    if (trx.rows.length === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    if (trx.rows[0].status === "LUNAS") {
      return res.status(400).json({ message: "Transaksi sudah dibayar" });
    }

    const total = Number(trx.rows[0].total);

    if (bayar < total) {
      return res.status(400).json({
        message: "Uang bayar kurang",
        total
      });
    }

    const kembalian = bayar - total;

    // INSERT pembayaran
    await pool.query(
      `INSERT INTO pembayaran 
       (id_transaksi, metode, bayar, kembalian)
       VALUES ($1,$2,$3,$4)`,
      [id_transaksi, metode, bayar, kembalian]
    );

    // UPDATE transaksi
    await pool.query(
      `UPDATE transaksi
       SET status = 'LUNAS', tanggal_bayar = NOW()
       WHERE id_transaksi = $1`,
      [id_transaksi]
    );

    res.json({
      message: "Pembayaran berhasil",
      total,
      bayar,
      kembalian
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal melakukan pembayaran" });
  }
};
