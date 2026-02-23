import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./supplier.css";

function supplier() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/supplier", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Supplier</h1>
        <ul>
          {data.map(item => <li key={item.id_supplier}>{item.nama_supplier}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default supplier;