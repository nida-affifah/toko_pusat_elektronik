import pool from "../config/db.js";

/* =====================================================
   CREATE TRANSAKSI (PELANGGAN)
===================================================== */
export const createTransaksi = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items } = req.body;
    const id_user = req.user.id_user;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Item transaksi tidak boleh kosong",
      });
    }

    await client.query("BEGIN");

    // HEADER TRANSAKSI
    const trx = await client.query(
      "INSERT INTO transaksi (id_user) VALUES ($1) RETURNING *",
      [id_user]
    );

    const id_transaksi = trx.rows[0].id_transaksi;
    let total = 0;

    for (const item of items) {
      const produk = await client.query(
        "SELECT stok, harga FROM produk WHERE id_produk=$1",
        [item.id_produk]
      );

      if (produk.rows.length === 0) {
        throw new Error("Produk tidak ditemukan");
      }

      if (produk.rows[0].stok < item.qty) {
        throw new Error("Stok produk tidak mencukupi");
      }

      const harga = Number(produk.rows[0].harga);
      const subtotal = item.qty * harga;
      total += subtotal;

      // DETAIL TRANSAKSI
      await client.query(
        `INSERT INTO detail_transaksi
         (id_transaksi, id_produk, qty, harga, subtotal)
         VALUES ($1,$2,$3,$4,$5)`,
        [id_transaksi, item.id_produk, item.qty, harga, subtotal]
      );

      // KURANGI STOK
      await client.query(
        "UPDATE produk SET stok = stok - $1 WHERE id_produk = $2",
        [item.qty, item.id_produk]
      );
    }

    // UPDATE TOTAL
    await client.query(
      "UPDATE transaksi SET total = $1 WHERE id_transaksi = $2",
      [total, id_transaksi]
    );

    await client.query("COMMIT");

    res.json({
      message: "Transaksi berhasil",
      id_transaksi,
      total,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);

    res.status(400).json({
      message: error.message || "Gagal membuat transaksi",
    });
  } finally {
    client.release();
  }
};

/* =====================================================
   GET ALL TRANSAKSI (ADMIN & KASIR)
===================================================== */
export const getAllTransaksi = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id_transaksi,
        t.total_harga,
        t.tanggal,
        u.username,
        u.role
      FROM transaksi t
      JOIN users u ON t.id_user = u.id_user
      ORDER BY t.tanggal DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("ERROR getAllTransaksi:", error.message);
    res.status(500).json({
      message: "Gagal mengambil data transaksi",
      error: error.message,
    });
  }
};