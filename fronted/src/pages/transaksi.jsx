import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./transaksi.css";

function transaksi() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/transaksi", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Transaksi</h1>
        <ul>
          {data.map(item => <li key={item.id_transaksi}>{item.nama_transaksi}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default transaksi;