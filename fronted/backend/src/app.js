import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import produkRoutes from "./routes/produkRoutes.js";
import transaksiRoutes from "./routes/transaksiRoutes.js";
import pembayaranRoutes from "./routes/pembayaranRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import laporanRoutes from "./routes/laporanRoutes.js";
import kategoriRoutes from "./routes/kategoriRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import detailTransaksiRoutes from "./routes/detailTransaksiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/produk", produkRoutes);
app.use("/transaksi", transaksiRoutes);
app.use("/pembayaran", pembayaranRoutes);
app.use("/shift", shiftRoutes);
app.use("/laporan", laporanRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/detail-transaksi", detailTransaksiRoutes);
app.use("/api/supplier", supplierRoutes);

// root
app.get("/", (req, res) => {
  res.send("🚀 Backend Toko Pusat Elektronik berjalan");
});

export default app;