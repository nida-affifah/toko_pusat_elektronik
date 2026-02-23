import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./kategori.css";

function kategori() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/kategori", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Kategori</h1>
        <ul>
          {data.map(item => <li key={item.id_kategori}>{item.nama_kategori}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default Produk;