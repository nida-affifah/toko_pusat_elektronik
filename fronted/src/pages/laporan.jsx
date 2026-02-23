import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./laporan.css";

function laporan() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/laporan", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Laporan</h1>
        <ul>
          {data.map(item => <li key={item.id_laporan}>{item.nama_laporan}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default laporan;