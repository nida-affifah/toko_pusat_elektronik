import pool from "../config/db.js";

export const createTransaksi = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items } = req.body;
    const id_user = req.user.id_user;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Item transaksi tidak boleh kosong"
      });
    }

    await client.query("BEGIN");

    // Insert header transaksi
    const trx = await client.query(
      "INSERT INTO transaksi (id_user) VALUES ($1) RETURNING *",
      [id_user]
    );

    const id_transaksi = trx.rows[0].id_transaksi;

    for (const item of items) {
      // cek stok
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

      const harga = produk.rows[0].harga;
      const subtotal = item.qty * harga;

      await client.query(
        `INSERT INTO detail_transaksi 
         (id_transaksi, id_produk, qty, harga, subtotal)
         VALUES ($1,$2,$3,$4,$5)`,
        [id_transaksi, item.id_produk, item.qty, harga, subtotal]
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Transaksi berhasil",
      id_transaksi
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);

    res.status(400).json({
      message: error.message || "Gagal membuat transaksi"
    });

  } finally {
    client.release();
  }
};
