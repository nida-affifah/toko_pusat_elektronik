import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./produk.css";

function Produk() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/produk", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Produk</h1>
        <ul>
          {data.map(item => <li key={item.id_produk}>{item.nama_produk}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default Produk;