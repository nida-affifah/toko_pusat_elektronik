import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./Dashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [produk, setProduk] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [chartProduk, setChartProduk] = useState(null);
  const [chartTransaksi, setChartTransaksi] = useState(null);

  const [stats, setStats] = useState({
    totalProduk: 0,
    stokHampirHabis: 0,
    transaksiHariIni: 0,
    pendapatanHariIni: 0,
  });

  /* ================= AUTH ================= */
  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    navigate("/");
    return;
  }

  setUser(JSON.parse(storedUser));
}, [navigate]);
  /* ================= PRODUK ================= */
  useEffect(() => {
    if (!user) return;

    api
      .get("/produk")
      .then((res) => {
        const data = res.data || [];
        setProduk(data);

        setStats((prev) => ({
          ...prev,
          totalProduk: data.length,
          stokHampirHabis: data.filter((p) => p.stok <= 5).length,
        }));

        setChartProduk({
          labels: data.map((p) => p.nama_produk),
          datasets: [
            {
              label: "Stok Produk",
              data: data.map((p) => p.stok),
              backgroundColor: "rgba(54,162,235,0.6)",
            },
          ],
        });
      })
      .catch((err) => console.error(err));
  }, [user]);

  /* ================= TRANSAKSI ================= */
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin" || user.role === "kasir") {
      api.get("/transaksi").then((res) => {
        const data = res.data || [];
        setTransaksi(data);

        const today = new Date().toISOString().slice(0, 10);
        const todayData = data.filter(
          (t) => t.tanggal?.slice(0, 10) === today
        );

        setStats((prev) => ({
          ...prev,
          transaksiHariIni: todayData.length,
          pendapatanHariIni: todayData.reduce(
            (sum, t) => sum + Number(t.total_harga || 0),
            0
          ),
        }));

        setChartTransaksi({
          labels: todayData.length
            ? todayData.map((t) => `#${t.id_transaksi}`)
            : ["Tidak ada transaksi"],
          datasets: [
            {
              label: "Total Penjualan Hari Ini",
              data: todayData.length
                ? todayData.map((t) => t.total_harga)
                : [0],
              backgroundColor: "rgba(75,192,192,0.6)",
            },
          ],
        });
      });
    }
  }, [user]);

  if (!user) return <div className="loading">Memuat dashboard...</div>;

  /* ================= NAMA USER ================= */
  const displayName =
    user?.username ||
    user?.nama_user ||
    user?.name ||
    user?.email ||
    "User";

  /* ================= OPTIONS GRAFIK ================= */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  /* ================= DASHBOARD ADMIN ================= */
  const AdminDashboard = () => (
    <>
      <div className="cards">
        <div className="card">
          Total Produk <br />
          <b>{stats.totalProduk}</b>
        </div>
        <div className="card">
          Transaksi Hari Ini <br />
          <b>{stats.transaksiHariIni}</b>
        </div>
        <div className="card">
          Pendapatan Hari Ini <br />
          <b>Rp {stats.pendapatanHariIni.toLocaleString()}</b>
        </div>
        <div className="card">
          Stok Hampir Habis <br />
          <b>{stats.stokHampirHabis}</b>
        </div>
      </div>

      {chartProduk && (
        <div className="chart">
          <h3>Grafik Stok Produk</h3>
          <div style={{ height: "350px" }}>
            <Bar data={chartProduk} options={chartOptions} />
          </div>
        </div>
      )}
    </>
  );

  /* ================= DASHBOARD KASIR ================= */
  const KasirDashboard = () => (
    <>
      <AdminDashboard />

      {chartTransaksi && (
        <div className="chart">
          <h3>Grafik Penjualan Hari Ini</h3>
          <div style={{ height: "350px" }}>
            <Bar data={chartTransaksi} options={chartOptions} />
          </div>
        </div>
      )}
    </>
  );

  /* ================= DASHBOARD USER ================= */
  const PelangganDashboard = () => {
    const produkHampirHabis = produk.filter((p) => p.stok <= 5);

    return (
      <div className="dashboard-container">
        <h2>Halo {displayName} 👋</h2>
        <p>Lihat stok produk terbaru di bawah ini.</p>

        <div className="cards">
          <div className="card">
            Total Produk <br />
            <b>{stats.totalProduk}</b>
          </div>
          <div className="card">
            Produk Hampir Habis <br />
            <b>{stats.stokHampirHabis}</b>
          </div>
        </div>

        <div className="chart">
          <h3>Produk Hampir Habis</h3>
          {produkHampirHabis.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Stok</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {produkHampirHabis.map((p) => (
                  <tr key={p.id_produk}>
                    <td>{p.nama_produk}</td>
                    <td>{p.stok}</td>
                    <td>Rp {Number(p.harga).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Tidak ada produk hampir habis.</p>
          )}
        </div>

        {chartProduk && (
          <div className="chart">
            <h3>Grafik Stok Produk</h3>
            <div style={{ height: "350px" }}>
              <Bar data={chartProduk} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <Sidebar role={user.role} />

      <div className="content">
        <h1>Dashboard</h1>
        <p>
          Login sebagai <b>{displayName}</b>
        </p>

        {user.role === "admin" && <AdminDashboard />}
        {user.role === "kasir" && <KasirDashboard />}
        {user.role === "user" && <PelangganDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;