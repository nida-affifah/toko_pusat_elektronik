import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./shift.css";

function shift() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/shift", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Shift</h1>
        <ul>
          {data.map(item => <li key={item.id_shift}>{item.nama_shift}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default shift;