import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./detailTransaksi.css"; // Ganti sesuai halaman

function detailTransaksi() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/detailTransaksi", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Detail Transaksi</h1>
        <ul>
          {data.map(item => <li key={item.id_detailTransaksi}>{item.detailTransaksi}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default detailTransaksi;