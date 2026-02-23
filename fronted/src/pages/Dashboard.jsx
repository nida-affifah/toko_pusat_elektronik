import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.name))
      .catch(err => console.error(err));
  }, [navigate]);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h1>Dashboard</h1>
        <p>Selamat datang, {user || "Admin"}</p>
      </div>
    </div>
  );
}

export default Dashboard;