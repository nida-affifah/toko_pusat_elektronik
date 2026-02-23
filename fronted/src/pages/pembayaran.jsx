import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./pembayaran.css";

function pembayaran() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/pembayaran", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Pembayaran</h1>
        <ul>
          {data.map(item => <li key={item.id_pembayaran}>{item.nama_pembayaran}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default pembayaran;