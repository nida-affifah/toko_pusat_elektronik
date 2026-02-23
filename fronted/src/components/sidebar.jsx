import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

function sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/produk")}>Produk</button>
      <button onClick={() => navigate("/transaksi")}>Transaksi</button>
      <button onClick={() => navigate("/detailTransaksi")}>Detail Transaksi</button>
      <button onClick={() => navigate("/kategori")}>Kategori</button>
      <button onClick={() => navigate("/supplier")}>Supplier</button>
      <button onClick={() => navigate("/laporan")}>Laporan</button>
      <button onClick={() => navigate("/pembayaran")}>Pembayaran</button>
      <button onClick={() => navigate("/shift")}>Shift</button>
      <button onClick={() => navigate("/user")}>User</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default sidebar;