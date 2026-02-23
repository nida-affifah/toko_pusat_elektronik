import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import "./user.css";

function user() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>User</h1>
        <ul>
          {data.map(item => <li key={item.id_user}>{item.nama_user}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default user;